import test from "node:test";
import assert from "node:assert/strict";
import {
  MANUAL_PAYMENT_STATUS_PENDING,
  applyDiscountToAmount,
  computePlanPricing,
  getManualPlanConfig,
  getManualPlanKeyForPaymentType,
  getDefaultPerPlanDiscountPercent,
  generateManualReferenceCode,
  normalizePerPlanDiscountPercent,
  computeSubscriptionEndDateFromMonths,
} from "../app/api/_utils/manualPayments.js";

test("manual plan config returns expected hardcoded values", () => {
  assert.deepEqual(getManualPlanConfig("SUB_3M"), {
    paymentType: "subscription",
    planLabel: "Abonnement 3 mois",
    amountEur: 417,
    durationMonths: 3,
  });
  assert.equal(getManualPlanConfig("SUB_6M")?.amountEur, 654);
  assert.equal(getManualPlanConfig("SUB_12M")?.amountEur, 1068);
  assert.equal(getManualPlanConfig("LIFETIME")?.amountEur, 1290);
  assert.equal(getManualPlanConfig("RESERVATION")?.amountEur, 159);
  assert.equal(getManualPlanConfig("nope"), null);
});

test("paymentType reservation maps to reservation plan key", () => {
  assert.equal(getManualPlanKeyForPaymentType("reservation"), "RESERVATION");
  assert.equal(getManualPlanKeyForPaymentType("subscription"), null);
});

test("subscription end date adds months correctly", () => {
  const start = new Date("2026-01-15T10:00:00.000Z");
  const end3 = computeSubscriptionEndDateFromMonths(3, start);
  const end6 = computeSubscriptionEndDateFromMonths(6, start);
  const end12 = computeSubscriptionEndDateFromMonths(12, start);

  assert.equal(end3.getUTCMonth(), 3);
  assert.equal(end6.getUTCMonth(), 6);
  assert.equal(end12.getUTCFullYear(), 2027);
});

test("reference code generation increments suffix when collisions exist", async () => {
  const existing = [
    { referenceCode: "RA-ABC123-20260523" },
    { referenceCode: "RA-ABC123-20260523-2" },
    { referenceCode: "RA-ABC123-20260523-3" },
  ];

  const fakeDb = {
    collection() {
      return {
        where() {
          return this;
        },
        async get() {
          return {
            forEach(cb) {
              existing.forEach((row, i) =>
                cb({ id: String(i + 1), data: () => row })
              );
            },
          };
        },
      };
    },
  };

  const RealDate = Date;
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super("2026-05-23T09:00:00.000Z");
        return;
      }
      super(...args);
    }
    static now() {
      return new RealDate("2026-05-23T09:00:00.000Z").getTime();
    }
  };

  try {
    const ref = await generateManualReferenceCode(fakeDb, "abc123zzz");
    assert.equal(ref, "RA-ABC123-20260523-4");
  } finally {
    globalThis.Date = RealDate;
  }
});

test("status constant remains FR pending", () => {
  assert.equal(MANUAL_PAYMENT_STATUS_PENDING, "en_attente");
});

test("normalize per-plan discount keeps strict keys and clamps values", () => {
  const normalized = normalizePerPlanDiscountPercent({
    SUB_3M: 20,
    SUB_6M: 150,
    SUB_12M: -5,
    LIFETIME: "10",
    UNKNOWN: 45,
  });

  assert.deepEqual(Object.keys(normalized).sort(), [
    "LIFETIME",
    "RESERVATION",
    "SUB_12M",
    "SUB_3M",
    "SUB_6M",
  ]);
  assert.equal(normalized.SUB_3M, 20);
  assert.equal(normalized.SUB_6M, 100);
  assert.equal(normalized.SUB_12M, 0);
  assert.equal(normalized.LIFETIME, 10);
  assert.equal(normalized.RESERVATION, 0);
});

test("plan pricing applies per-plan discount and rounds to 2 decimals", () => {
  const perPlan = {
    ...getDefaultPerPlanDiscountPercent(),
    SUB_3M: 10,
    SUB_6M: 25,
  };
  const sub3 = computePlanPricing("SUB_3M", perPlan);
  const sub6 = computePlanPricing("SUB_6M", perPlan);

  assert.equal(sub3.baseAmountEur, 417);
  assert.equal(sub3.discountPercent, 10);
  assert.equal(sub3.finalAmountEur, 375.3);

  assert.equal(sub6.baseAmountEur, 654);
  assert.equal(sub6.discountPercent, 25);
  assert.equal(sub6.finalAmountEur, 490.5);
});

test("applyDiscountToAmount enforces bounds and money-safe rounding", () => {
  assert.equal(applyDiscountToAmount(159, 0), 159);
  assert.equal(applyDiscountToAmount(159, 100), 0);
  assert.equal(applyDiscountToAmount(159, 50), 79.5);
  assert.equal(applyDiscountToAmount(417, 10), 375.3);
  assert.equal(applyDiscountToAmount(417, 999), 0);
});
