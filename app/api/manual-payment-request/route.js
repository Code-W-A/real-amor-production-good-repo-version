import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { sendMail } from "../_utils/mailer";
import {
  MANUAL_BANK_BENEFICIARY,
  MANUAL_BANK_CURRENCY,
  MANUAL_BANK_IBAN,
  MANUAL_PAYMENTS_COLLECTION,
  MANUAL_PAYMENT_STATUS_PENDING,
  generateManualReferenceCode,
  getManualPlanConfig,
  getManualPlanKeyForPaymentType,
} from "../_utils/manualPayments";
import { buildManualPaymentRequestEmail } from "../_utils/manualPaymentEmails";

export const dynamic = "force-dynamic";

function normalizePlanFromPayload(body) {
  const paymentType = String(body?.paymentType || "")
    .trim()
    .toLowerCase();
  const requestedPlanKey = String(body?.planKey || "")
    .trim()
    .toUpperCase();

  if (paymentType === "reservation") {
    return getManualPlanConfig(getManualPlanKeyForPaymentType(paymentType));
  }

  if (paymentType === "subscription" || paymentType === "lifetime") {
    const plan = getManualPlanConfig(requestedPlanKey);
    if (!plan || plan.paymentType !== paymentType) return null;
    return plan;
  }

  return null;
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const plan = normalizePlanFromPayload(body);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan or paymentType" }, { status: 400 });
    }

    const userRef = adminDb.collection("Users").doc(auth.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data() || {};
    const username = String(userData?.username || "").trim() || "Client";
    const email = String(userData?.email || auth.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "User email is missing" }, { status: 400 });
    }

    const pendingSnapshot = await adminDb
      .collection(MANUAL_PAYMENTS_COLLECTION)
      .where("uid", "==", auth.uid)
      .where("paymentType", "==", plan.paymentType)
      .where("planKey", "==", String(body?.planKey || "").trim().toUpperCase() || "RESERVATION")
      .where("status", "==", MANUAL_PAYMENT_STATUS_PENDING)
      .limit(1)
      .get();

    if (!pendingSnapshot.empty) {
      const existing = pendingSnapshot.docs[0];
      const existingData = existing.data() || {};
      return NextResponse.json(
        {
          success: true,
          id: existing.id,
          idempotent: true,
          referenceCode: existingData.referenceCode || null,
          amountEur: existingData.amountEur || plan.amountEur,
          iban: MANUAL_BANK_IBAN,
          beneficiary: MANUAL_BANK_BENEFICIARY,
        },
        { status: 200 }
      );
    }

    const referenceCode = await generateManualReferenceCode(adminDb, auth.uid);
    const now = Timestamp.now();
    const paymentRef = adminDb.collection(MANUAL_PAYMENTS_COLLECTION).doc();

    const docData = {
      uid: auth.uid,
      email,
      username,
      paymentType: plan.paymentType,
      planKey: String(body?.planKey || "").trim().toUpperCase() || null,
      planLabel: plan.planLabel,
      amountEur: plan.amountEur,
      currency: MANUAL_BANK_CURRENCY,
      referenceCode,
      status: MANUAL_PAYMENT_STATUS_PENDING,
      createdAt: now,
      reviewedAt: null,
      reviewedBy: null,
      reviewNote: "",
      isManualPayment: true,
    };

    await paymentRef.set(docData, { merge: false });

    const emailPayload = buildManualPaymentRequestEmail({
      user: { username, email },
      amountEur: plan.amountEur,
      referenceCode,
    });

    await sendMail({
      to: email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });

    return NextResponse.json(
      {
        success: true,
        id: paymentRef.id,
        referenceCode,
        amountEur: plan.amountEur,
        iban: MANUAL_BANK_IBAN,
        beneficiary: MANUAL_BANK_BENEFICIARY,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("manual-payment-request error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
