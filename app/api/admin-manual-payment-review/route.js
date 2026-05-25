import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { sendMail } from "../_utils/mailer";
import {
  MANUAL_PAYMENTS_COLLECTION,
  MANUAL_PAYMENT_STATUS_CONFIRMED,
  MANUAL_PAYMENT_STATUS_PENDING,
  MANUAL_PAYMENT_STATUS_REJECTED,
} from "../_utils/manualPayments";
import {
  buildManualPaymentConfirmedEmail,
  buildManualPaymentRejectedEmail,
} from "../_utils/manualPaymentEmails";
import { buildManualPaymentConfirmUserUpdate } from "../_utils/manualPaymentEntitlements";

export const dynamic = "force-dynamic";

function parseDecision(raw) {
  const decision = String(raw || "").trim().toLowerCase();
  if (decision === MANUAL_PAYMENT_STATUS_CONFIRMED) return decision;
  if (decision === MANUAL_PAYMENT_STATUS_REJECTED) return decision;
  return null;
}

function normalizeStatus(raw) {
  const status = String(raw || "").trim().toLowerCase();
  if (status === MANUAL_PAYMENT_STATUS_CONFIRMED) return status;
  if (status === MANUAL_PAYMENT_STATUS_REJECTED) return status;
  if (status === MANUAL_PAYMENT_STATUS_PENDING) return status;
  return MANUAL_PAYMENT_STATUS_PENDING;
}

function buildReservationRevokeUpdate(payment, userData) {
  const currentReservation =
    userData?.reservation && typeof userData.reservation === "object"
      ? userData.reservation
      : {};

  return {
    reservation: {
      ...currentReservation,
      status: "unpaid",
      paymentSource: "manual_transfer",
      paymentId: payment.id,
      updatedAt: new Date().toISOString(),
    },
    manualPaymentLastConfirmedId: null,
    manualPaymentLastConfirmedRef: null,
  };
}

function buildSubscriptionRevokeUpdate(now) {
  return {
    subscriptionActive: false,
    subscriptionStatus: "canceledImmediately",
    subscriptionId: null,
    priceId: null,
    subscriptionAmount: null,
    subscriptionStartDate: null,
    subscriptionEndDate: Timestamp.fromDate(now),
    cancelAtPeriodEnd: false,
    subName: null,
    subscriptionActivationSource: "manual_transfer",
    manualPaymentLastConfirmedId: null,
    manualPaymentLastConfirmedRef: null,
  };
}

function buildLifetimeRevokeUpdate(now) {
  return {
    lifetimeAccess: false,
    lifetimePurchasedAt: null,
    lifetimeSessionId: null,
    lifetimeAmount: null,
    subscriptionActive: false,
    subscriptionStatus: "canceledImmediately",
    cancelAtPeriodEnd: false,
    subscriptionId: null,
    subscriptionStartDate: null,
    subscriptionEndDate: Timestamp.fromDate(now),
    subscriptionAmount: null,
    priceId: null,
    subName: null,
    subscriptionActivationSource: "manual_transfer",
    manualPaymentLastConfirmedId: null,
    manualPaymentLastConfirmedRef: null,
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
    let paymentData = null;
    let userDataForEmail = null;
    let noOp = false;
    let finalStatus = null;
    let entitlementRevoked = false;
    let entitlementRevokeSkipped = false;

    await adminDb.runTransaction(async (tx) => {
      const paymentSnap = await tx.get(paymentRef);
      if (!paymentSnap.exists) {
        throw new Error("Payment request not found");
      }

      const existingPaymentData = paymentSnap.data() || {};
      const currentStatus = normalizeStatus(existingPaymentData.status);
      finalStatus = decision;
      paymentData = {
        id: paymentSnap.id,
        ...existingPaymentData,
        status: currentStatus,
      };

      if (currentStatus === decision) {
        noOp = true;
        return;
      }

      const needsUserRead =
        decision === MANUAL_PAYMENT_STATUS_CONFIRMED ||
        (currentStatus === MANUAL_PAYMENT_STATUS_CONFIRMED &&
          decision === MANUAL_PAYMENT_STATUS_REJECTED);

      let userRef = null;
      let userData = null;
      if (needsUserRead) {
        userRef = adminDb.collection("Users").doc(String(existingPaymentData.uid || ""));
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists) {
          throw new Error("User not found for this payment request");
        }
        userData = userSnap.data() || {};
        userDataForEmail = userData;
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
          reviewHistory: FieldValue.arrayUnion({
            fromStatus: currentStatus,
            toStatus: decision,
            at: reviewedAt,
            by: auth.uid,
            note: reviewNote || null,
          }),
        },
        { merge: true }
      );

      const payment = { id: paymentId, ...existingPaymentData };

      if (decision === MANUAL_PAYMENT_STATUS_CONFIRMED) {
        if (!userRef) {
          throw new Error("User context is missing for confirmation");
        }
        tx.set(userRef, buildManualPaymentConfirmUserUpdate(payment, now), {
          merge: true,
        });
        return;
      }

      if (
        currentStatus === MANUAL_PAYMENT_STATUS_CONFIRMED &&
        decision === MANUAL_PAYMENT_STATUS_REJECTED
      ) {
        if (!userRef || !userData) {
          throw new Error("User context is missing for revocation");
        }

        const lastConfirmedId = String(userData?.manualPaymentLastConfirmedId || "");
        if (lastConfirmedId && lastConfirmedId !== paymentId) {
          entitlementRevokeSkipped = true;
          return;
        }

        if (payment.paymentType === "reservation") {
          tx.set(userRef, buildReservationRevokeUpdate(payment, userData), {
            merge: true,
          });
        } else if (payment.paymentType === "subscription") {
          tx.set(userRef, buildSubscriptionRevokeUpdate(now), { merge: true });
        } else if (payment.paymentType === "lifetime") {
          tx.set(userRef, buildLifetimeRevokeUpdate(now), { merge: true });
        } else {
          throw new Error("Unsupported paymentType");
        }
        entitlementRevoked = true;
      }
    });

    if (!paymentData) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
    }

    if (noOp) {
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

      if (finalStatus === MANUAL_PAYMENT_STATUS_CONFIRMED) {
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
      } else if (finalStatus === MANUAL_PAYMENT_STATUS_REJECTED) {
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

    return NextResponse.json(
      {
        success: true,
        status: finalStatus,
        entitlementRevoked,
        entitlementRevokeSkipped,
      },
      { status: 200 }
    );
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
