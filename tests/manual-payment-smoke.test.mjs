import test from "node:test";
import assert from "node:assert/strict";
import {
  getManualPlanConfig,
  MANUAL_PAYMENT_STATUS_PENDING,
  MANUAL_PAYMENT_STATUS_CONFIRMED,
  MANUAL_PAYMENT_STATUS_REJECTED,
} from "../app/api/_utils/manualPayments.js";
import {
  buildManualPaymentRequestEmail,
  buildManualPaymentConfirmedEmail,
  buildManualPaymentRejectedEmail,
} from "../app/api/_utils/manualPaymentEmails.js";

test("smoke: request -> confirm -> reject payloads are internally consistent", () => {
  const plan = getManualPlanConfig("SUB_12M");
  assert.ok(plan);
  assert.equal(plan.paymentType, "subscription");
  assert.equal(plan.amountEur, 1068);

  const referenceCode = "RA-ABC123-20260523";
  const requestRecord = {
    uid: "abc123uid",
    paymentType: plan.paymentType,
    planKey: "SUB_12M",
    planLabel: plan.planLabel,
    amountEur: plan.amountEur,
    status: MANUAL_PAYMENT_STATUS_PENDING,
    referenceCode,
  };
  assert.equal(requestRecord.status, "en_attente");

  const reqEmail = buildManualPaymentRequestEmail({
    user: { username: "Client Smoke" },
    amountEur: requestRecord.amountEur,
    referenceCode: requestRecord.referenceCode,
    paymentType: requestRecord.paymentType,
  });
  assert.match(reqEmail.text, new RegExp(requestRecord.referenceCode));

  const confirmed = { ...requestRecord, status: MANUAL_PAYMENT_STATUS_CONFIRMED };
  const confirmedEmail = buildManualPaymentConfirmedEmail({
    user: { username: "Client Smoke" },
    amountEur: confirmed.amountEur,
    referenceCode: confirmed.referenceCode,
  });
  assert.equal(confirmed.status, "confirme");
  assert.match(confirmedEmail.text, /activated/i);

  const rejected = { ...requestRecord, status: MANUAL_PAYMENT_STATUS_REJECTED };
  const rejectedEmail = buildManualPaymentRejectedEmail({
    user: { username: "Client Smoke" },
    referenceCode: rejected.referenceCode,
  });
  assert.equal(rejected.status, "refuse");
  assert.match(rejectedEmail.text, /info@real-amor\.com/);
});

