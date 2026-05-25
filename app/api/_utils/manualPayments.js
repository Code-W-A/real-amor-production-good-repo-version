export const MANUAL_PAYMENTS_COLLECTION = "ManualPayments";
export const MANUAL_PAYMENT_STATUS_PENDING = "en_attente";
export const MANUAL_PAYMENT_STATUS_CONFIRMED = "confirme";
export const MANUAL_PAYMENT_STATUS_REJECTED = "refuse";

export const MANUAL_BANK_BENEFICIARY = "RealAmor SRL";
export const MANUAL_BANK_IBAN = "BE32 0019 9397 1002";
export const MANUAL_BANK_CURRENCY = "EUR";

const PLAN_RULES = Object.freeze({
  RESERVATION: {
    paymentType: "reservation",
    planLabel: "Ouverture de dossier et premier Rendez-vous",
    amountEur: 159,
    durationMonths: 0,
  },
  SUB_3M: {
    paymentType: "subscription",
    planLabel: "Abonnement 3 mois",
    amountEur: 417,
    durationMonths: 3,
  },
  SUB_6M: {
    paymentType: "subscription",
    planLabel: "Abonnement 6 mois",
    amountEur: 654,
    durationMonths: 6,
  },
  SUB_12M: {
    paymentType: "subscription",
    planLabel: "Abonnement 12 mois",
    amountEur: 1068,
    durationMonths: 12,
  },
  LIFETIME: {
    paymentType: "lifetime",
    planLabel: "Abonnement à vie",
    amountEur: 1290,
    durationMonths: 0,
  },
});

export function getManualPlanConfig(planKey) {
  const cleanKey = String(planKey || "").trim().toUpperCase();
  return PLAN_RULES[cleanKey] || null;
}

export function getManualPlanKeyForPaymentType(paymentType) {
  const cleanType = String(paymentType || "").trim().toLowerCase();
  if (cleanType === "reservation") return "RESERVATION";
  return null;
}

function formatYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function sanitizeUid6(uid) {
  const cleaned = String(uid || "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase();
  return cleaned.padEnd(6, "X");
}

function parseReferenceSuffix(referenceCode, baseCode) {
  if (referenceCode === baseCode) return 1;
  if (!referenceCode.startsWith(`${baseCode}-`)) return 0;
  const suffix = Number(referenceCode.slice(baseCode.length + 1));
  if (!Number.isInteger(suffix) || suffix <= 1) return 0;
  return suffix;
}

export async function generateManualReferenceCode(adminDb, uid) {
  const now = new Date();
  const baseCode = `RA-${sanitizeUid6(uid)}-${formatYmd(now)}`;
  const start = baseCode;
  const end = `${baseCode}\uf8ff`;

  const snapshot = await adminDb
    .collection(MANUAL_PAYMENTS_COLLECTION)
    .where("referenceCode", ">=", start)
    .where("referenceCode", "<=", end)
    .get();

  let maxSuffix = 0;
  snapshot.forEach((docSnap) => {
    const code = String(docSnap.data()?.referenceCode || "");
    const suffix = parseReferenceSuffix(code, baseCode);
    if (suffix > maxSuffix) maxSuffix = suffix;
  });

  if (maxSuffix <= 0) return baseCode;
  return `${baseCode}-${maxSuffix + 1}`;
}

export function getManualStatusLabel(status) {
  if (status === MANUAL_PAYMENT_STATUS_CONFIRMED) return "Confirmé";
  if (status === MANUAL_PAYMENT_STATUS_REJECTED) return "Refusé";
  return "En attente";
}

export function computeSubscriptionEndDateFromMonths(months, fromDate = new Date()) {
  const next = new Date(fromDate);
  next.setMonth(next.getMonth() + Number(months || 0));
  return next;
}
