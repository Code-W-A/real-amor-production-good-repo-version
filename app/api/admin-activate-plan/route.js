import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { sendMail } from "../_utils/mailer";
import { getStripe } from "../_utils/stripeUtils";
import {
  MANUAL_BANK_CURRENCY,
  MANUAL_PAYMENTS_COLLECTION,
  MANUAL_PAYMENT_STATUS_CONFIRMED,
  MANUAL_PAYMENT_STATUS_PENDING,
  generateManualReferenceCode,
  getManualPlanConfig,
} from "../_utils/manualPayments";
import {
  buildManualPaymentConfirmUserUpdate,
  buildManualPaymentUserUpdateSummary,
} from "../_utils/manualPaymentEntitlements";
import { buildManualPaymentConfirmedEmail } from "../_utils/manualPaymentEmails";

export const dynamic = "force-dynamic";

function normalizePlanKey(raw) {
  return String(raw || "").trim().toUpperCase();
}

function hasActiveSubscription(userData) {
  return (
    userData?.lifetimeAccess === true ||
    userData?.subscriptionStatus === "lifetime" ||
    userData?.subscriptionStatus === "active" ||
    userData?.subscriptionStatus === "canceledUntilEnd" ||
    userData?.subscriptionActive === true
  );
}

function toIsoDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const uid = String(body?.uid || "").trim();
    const planKey = normalizePlanKey(body?.planKey);
    const reviewNote = String(body?.reviewNote || "").slice(0, 1200);
    const overrideActiveSubscription = body?.overrideActiveSubscription === true;

    if (!uid || !planKey) {
      return NextResponse.json({ error: "Missing uid or planKey" }, { status: 400 });
    }

    const plan = getManualPlanConfig(planKey);
    if (!plan || (plan.paymentType !== "subscription" && plan.paymentType !== "lifetime")) {
      return NextResponse.json({ error: "Invalid planKey for direct activation" }, { status: 400 });
    }

    const userRef = adminDb.collection("Users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userSnap.data() || {};
    if (!overrideActiveSubscription && hasActiveSubscription(userData)) {
      return NextResponse.json(
        {
          error: "Active subscription exists. Override confirmation required.",
          needsOverride: true,
          currentPlan: String(userData?.subName || "").trim() || null,
          currentStatus: String(userData?.subscriptionStatus || "").trim() || null,
          subscriptionEndDate: toIsoDate(userData?.subscriptionEndDate),
        },
        { status: 409 }
      );
    }

    // Best effort: prevent further Stripe rebilling if the user still has a Stripe sub id.
    if (userData?.subscriptionId) {
      try {
        const stripe = getStripe();
        await stripe.subscriptions.update(userData.subscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (stripeErr) {
        console.error("admin-activate-plan Stripe cancel_at_period_end failed:", stripeErr);
      }
    }

    const nowDate = new Date();
    const nowTs = Timestamp.fromDate(nowDate);
    const referenceCode = await generateManualReferenceCode(adminDb, uid);
    const paymentRef = adminDb.collection(MANUAL_PAYMENTS_COLLECTION).doc();

    const email = String(userData?.email || "").trim();
    const username = String(userData?.username || email || "Client").trim();

    const payment = {
      id: paymentRef.id,
      uid,
      email,
      username,
      paymentType: plan.paymentType,
      planKey,
      planLabel: plan.planLabel,
      amountEur: plan.amountEur,
      currency: MANUAL_BANK_CURRENCY,
      referenceCode,
      status: MANUAL_PAYMENT_STATUS_CONFIRMED,
    };

    const userUpdate = buildManualPaymentConfirmUserUpdate(payment, nowDate);

    await adminDb.runTransaction(async (tx) => {
      const txUserSnap = await tx.get(userRef);
      if (!txUserSnap.exists) {
        throw new Error("User not found");
      }

      tx.set(
        paymentRef,
        {
          ...payment,
          createdAt: nowTs,
          reviewedAt: nowTs,
          reviewedBy: auth.uid,
          reviewNote,
          source: "admin_direct_activation",
          isManualPayment: true,
          reviewHistory: [
            {
              fromStatus: MANUAL_PAYMENT_STATUS_PENDING,
              toStatus: MANUAL_PAYMENT_STATUS_CONFIRMED,
              at: nowTs,
              by: auth.uid,
              note: reviewNote || null,
            },
          ],
        },
        { merge: false }
      );

      tx.set(userRef, userUpdate, { merge: true });
    });

    if (email) {
      const emailPayload = buildManualPaymentConfirmedEmail({
        user: { username, email },
        amountEur: plan.amountEur,
        referenceCode,
      });
      await sendMail({
        to: email,
        subject: emailPayload.subject,
        text: emailPayload.text,
      });
    }

    return NextResponse.json(
      {
        success: true,
        paymentId: paymentRef.id,
        referenceCode,
        userUpdateSummary: buildManualPaymentUserUpdateSummary(payment, userUpdate),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("admin-activate-plan error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
