import { Timestamp } from "firebase-admin/firestore";
import {
  computeSubscriptionEndDateFromMonths,
  getManualPlanConfig,
} from "./manualPayments.js";

function toIso(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }
  return null;
}

function buildReservationConfirmUpdate(payment, now) {
  return {
    reservation: {
      hasReserved: false,
      status: "paid",
      sessionId: payment.referenceCode || null,
      createdAt: now.toISOString(),
      cost: Number(payment.amountEur || 0),
      paymentSource: "manual_transfer",
      paymentId: payment.id,
    },
    manualPaymentLastConfirmedId: payment.id,
    manualPaymentLastConfirmedRef: payment.referenceCode || null,
    subscriptionActivationSource: "manual_transfer",
  };
}

function buildSubscriptionConfirmUpdate(payment, now) {
  const plan = getManualPlanConfig(payment.planKey);
  const endDate = computeSubscriptionEndDateFromMonths(
    plan?.durationMonths || 0,
    now
  );

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

function buildLifetimeConfirmUpdate(payment, now) {
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

export function buildManualPaymentConfirmUserUpdate(payment, now = new Date()) {
  if (payment?.paymentType === "reservation") {
    return buildReservationConfirmUpdate(payment, now);
  }
  if (payment?.paymentType === "subscription") {
    return buildSubscriptionConfirmUpdate(payment, now);
  }
  if (payment?.paymentType === "lifetime") {
    return buildLifetimeConfirmUpdate(payment, now);
  }
  throw new Error("Unsupported paymentType");
}

export function buildManualPaymentUserUpdateSummary(payment, userUpdate) {
  return {
    paymentType: payment?.paymentType || null,
    planKey: payment?.planKey || null,
    planLabel: userUpdate?.subName || payment?.planLabel || null,
    amountEur: Number(payment?.amountEur || 0),
    referenceCode: payment?.referenceCode || null,
    subscriptionStatus: userUpdate?.subscriptionStatus || null,
    subscriptionActive: !!userUpdate?.subscriptionActive,
    lifetimeAccess: !!userUpdate?.lifetimeAccess,
    subscriptionStartDate: toIso(userUpdate?.subscriptionStartDate),
    subscriptionEndDate: toIso(userUpdate?.subscriptionEndDate),
    lifetimePurchasedAt: toIso(userUpdate?.lifetimePurchasedAt),
  };
}
