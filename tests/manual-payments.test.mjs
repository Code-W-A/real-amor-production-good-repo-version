import test from "node:test";
import assert from "node:assert/strict";
import {
  MANUAL_PAYMENT_STATUS_PENDING,
  getManualPlanConfig,
  getManualPlanKeyForPaymentType,
  generateManualReferenceCode,
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
