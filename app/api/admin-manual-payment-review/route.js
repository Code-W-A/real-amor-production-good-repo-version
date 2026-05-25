import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { sendMail } from "../_utils/mailer";
import {
  MANUAL_PAYMENTS_COLLECTION,
  MANUAL_PAYMENT_STATUS_CONFIRMED,
  MANUAL_PAYMENT_STATUS_PENDING,
  MANUAL_PAYMENT_STATUS_REJECTED,
  computeSubscriptionEndDateFromMonths,
  getManualPlanConfig,
} from "../_utils/manualPayments";
import {
  buildManualPaymentConfirmedEmail,
  buildManualPaymentRejectedEmail,
} from "../_utils/manualPaymentEmails";

export const dynamic = "force-dynamic";

function parseDecision(raw) {
  const decision = String(raw || "").trim().toLowerCase();
  if (decision === MANUAL_PAYMENT_STATUS_CONFIRMED) return decision;
  if (decision === MANUAL_PAYMENT_STATUS_REJECTED) return decision;
  return null;
}

function buildReservationUpdate(payment) {
  return {
    reservation: {
      hasReserved: false,
      status: "paid",
      sessionId: payment.referenceCode || null,
      createdAt: new Date().toISOString(),
      cost: Number(payment.amountEur || 0),
      paymentSource: "manual_transfer",
      paymentId: payment.id,
    },
  };
}

function buildSubscriptionUpdate(payment, now) {
  const plan = getManualPlanConfig(payment.planKey);
  const endDate = computeSubscriptionEndDateFromMonths(plan?.durationMonths || 0, now);
  return {
    subscriptionActive: true,
    subscriptionStatus: "active",
    subscriptionId: null,
    priceId: `manual_${payment.planKey || "SUB"}`,
    subscriptionAmount: Number(payment.amountEur || 0),
    subscriptionStartDate: Timestamp.fromDate(now),
    subscriptionEndDate: Timestamp.fromDate(endDate),
    cancelAtPeriodEnd: false,
    subName: payment.planLabel || plan?.planLabel || "Abonnement",
    lifetimeAccess: false,
    subscriptionActivationSource: "manual_transfer",
    manualPaymentLastConfirmedId: payment.id,
    manualPaymentLastConfirmedRef: payment.referenceCode || null,
  };
}

function buildLifetimeUpdate(payment, now) {
  return {
    lifetimeAccess: true,
    lifetimePurchasedAt: Timestamp.fromDate(now),
    lifetimeSessionId: payment.referenceCode || payment.id,
    lifetimeAmount: Number(payment.amountEur || 0),
    subName: payment.planLabel || "Abonnement à vie",
    subscriptionActive: true,
    subscriptionStatus: "lifetime",
    cancelAtPeriodEnd: false,
    subscriptionId: null,
    subscriptionStartDate: null,
    subscriptionEndDate: null,
    subscriptionAmount: null,
    priceId: null,
    subscriptionActivationSource: "manual_transfer",
    manualPaymentLastConfirmedId: payment.id,
    manualPaymentLastConfirmedRef: payment.referenceCode || null,
  };
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
    const paymentId = String(body?.paymentId || "").trim();
    const decision = parseDecision(body?.decision);
    const reviewNote = String(body?.reviewNote || "").slice(0, 1200);

    if (!paymentId || !decision) {
      return NextResponse.json(
        { error: "Missing paymentId or invalid decision" },
        { status: 400 }
      );
    }

    const paymentRef = adminDb.collection(MANUAL_PAYMENTS_COLLECTION).doc(paymentId);
    let transitionApplied = false;
    let paymentData = null;
    let userDataForEmail = null;

    await adminDb.runTransaction(async (tx) => {
      const paymentSnap = await tx.get(paymentRef);
      if (!paymentSnap.exists) {
        throw new Error("Payment request not found");
      }

      const data = paymentSnap.data() || {};
      paymentData = {
        id: paymentSnap.id,
        ...data,
      };

      if (data.status !== MANUAL_PAYMENT_STATUS_PENDING) {
        transitionApplied = false;
        return;
      }

      const now = new Date();
      const reviewedAt = Timestamp.fromDate(now);
      tx.set(
        paymentRef,
        {
          status: decision,
          reviewedAt,
          reviewedBy: auth.uid,
          reviewNote,
        },
        { merge: true }
      );

      if (decision !== MANUAL_PAYMENT_STATUS_CONFIRMED) {
        transitionApplied = true;
        return;
      }

      const userRef = adminDb.collection("Users").doc(String(data.uid || ""));
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) {
        throw new Error("User not found for this payment request");
      }
      userDataForEmail = userSnap.data() || {};

      if (data.paymentType === "reservation") {
        tx.set(userRef, buildReservationUpdate({ id: paymentId, ...data }), { merge: true });
      } else if (data.paymentType === "subscription") {
        tx.set(
          userRef,
          buildSubscriptionUpdate({ id: paymentId, ...data }, now),
          { merge: true }
        );
      } else if (data.paymentType === "lifetime") {
        tx.set(userRef, buildLifetimeUpdate({ id: paymentId, ...data }, now), {
          merge: true,
        });
      } else {
        throw new Error("Unsupported paymentType");
      }

      transitionApplied = true;
    });

    if (!paymentData) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
    }

    if (!transitionApplied) {
      return NextResponse.json(
        {
          success: true,
          idempotent: true,
          payment: paymentData,
        },
        { status: 200 }
      );
    }

    const email = String(paymentData.email || "").trim();
    if (email) {
      const user =
        userDataForEmail || { username: paymentData.username, email: paymentData.email };

      if (decision === MANUAL_PAYMENT_STATUS_CONFIRMED) {
        const emailPayload = buildManualPaymentConfirmedEmail({
          user,
          amountEur: paymentData.amountEur,
          referenceCode: paymentData.referenceCode,
        });
        await sendMail({
          to: email,
          subject: emailPayload.subject,
          text: emailPayload.text,
        });
      } else if (decision === MANUAL_PAYMENT_STATUS_REJECTED) {
        const emailPayload = buildManualPaymentRejectedEmail({
          user,
          referenceCode: paymentData.referenceCode,
        });
        await sendMail({
          to: email,
          subject: emailPayload.subject,
          text: emailPayload.text,
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message = String(err?.message || "");
    if (message === "Payment request not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error("admin-manual-payment-review error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
