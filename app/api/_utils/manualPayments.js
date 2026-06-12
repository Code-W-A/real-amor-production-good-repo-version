export const MANUAL_PAYMENTS_COLLECTION = "ManualPayments";
export const MANUAL_PAYMENT_STATUS_PENDING = "en_attente";
export const MANUAL_PAYMENT_STATUS_CONFIRMED = "confirme";
export const MANUAL_PAYMENT_STATUS_REJECTED = "refuse";

export const MANUAL_BANK_BENEFICIARY = "RealAmor SRL";
export const MANUAL_BANK_IBAN = "BE32 0019 9397 1002";
export const MANUAL_BANK_CURRENCY = "EUR";
export const MANUAL_PROMO_CONFIG_COLLECTION = "Config";
export const MANUAL_PROMO_CONFIG_DOC = "subscriptionPromo";
export const MANUAL_PROMO_PERCENT_OPTIONS = Object.freeze([
  0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100,
]);
export const MANUAL_PROMO_PLAN_KEYS = Object.freeze([
  "RESERVATION",
  "SUB_3M",
  "SUB_6M",
  "SUB_12M",
  "LIFETIME",
]);

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
    amountEur: 1068,
    durationMonths: 0,
  },
});

export function getManualPlanConfig(planKey) {
  const cleanKey = String(planKey || "").trim().toUpperCase();
  return PLAN_RULES[cleanKey] || null;
}

export function getDefaultPerPlanDiscountPercent() {
  return {
    RESERVATION: 0,
    SUB_3M: 0,
    SUB_6M: 0,
    SUB_12M: 0,
    LIFETIME: 0,
  };
}

function clampPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export function normalizePerPlanDiscountPercent(raw) {
  const defaults = getDefaultPerPlanDiscountPercent();
  const input = raw && typeof raw === "object" ? raw : {};
  for (const planKey of MANUAL_PROMO_PLAN_KEYS) {
    defaults[planKey] = clampPercent(input[planKey]);
  }
  return defaults;
}

export function applyDiscountToAmount(amountEur, discountPercent) {
  const base = Number(amountEur || 0);
  const percent = clampPercent(discountPercent);
  const discounted = base * (1 - percent / 100);
  return Math.max(0, Math.round((discounted + Number.EPSILON) * 100) / 100);
}

export function computePlanPricing(planKey, perPlanDiscountPercent) {
  const plan = getManualPlanConfig(planKey);
  if (!plan) return null;

  const discounts = normalizePerPlanDiscountPercent(perPlanDiscountPercent);
  const discountPercent = discounts[planKey] || 0;
  const baseAmountEur = Number(plan.amountEur || 0);
  const finalAmountEur = applyDiscountToAmount(baseAmountEur, discountPercent);

  return {
    planKey,
    paymentType: plan.paymentType,
    planLabel: plan.planLabel,
    baseAmountEur,
    discountPercent,
    finalAmountEur,
  };
}

export async function getPerPlanDiscountPercentFromConfig(adminDb) {
  try {
    const snap = await adminDb
      .collection(MANUAL_PROMO_CONFIG_COLLECTION)
      .doc(MANUAL_PROMO_CONFIG_DOC)
      .get();
    const data = snap.exists ? snap.data() || {} : {};
    return normalizePerPlanDiscountPercent(data?.perPlanDiscountPercent);
  } catch {
    return getDefaultPerPlanDiscountPercent();
  }
}

export async function resolvePlanPricingFromConfig(adminDb, planKey) {
  const discounts = await getPerPlanDiscountPercentFromConfig(adminDb);
  return computePlanPricing(planKey, discounts);
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
