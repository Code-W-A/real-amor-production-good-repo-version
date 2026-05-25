import test from "node:test";
import assert from "node:assert/strict";
import {
  buildManualPaymentRequestEmail,
  buildManualPaymentConfirmedEmail,
  buildManualPaymentRejectedEmail,
} from "../app/api/_utils/manualPaymentEmails.js";

test("request email includes FR/NL/EN sections, amount and reference", () => {
  const payload = buildManualPaymentRequestEmail({
    user: { username: "Alex", email: "alex@example.com" },
    amountEur: 417,
    referenceCode: "RA-ALEX12-20260523",
  });

  assert.match(payload.subject, /Instructions de paiement/);
  assert.match(payload.text, /Nous vous remercions de votre confiance/);
  assert.match(payload.text, /Hartelijk dank voor uw vertrouwen/);
  assert.match(payload.text, /Thank you for your trust/);
  assert.match(payload.text, /417\.00/);
  assert.match(payload.text, /RA-ALEX12-20260523/);
});

test("confirmed email mentions activation and reference", () => {
  const payload = buildManualPaymentConfirmedEmail({
    user: { username: "Alex" },
    amountEur: 1290,
    referenceCode: "RA-ALEX12-20260523",
  });

  assert.match(payload.subject, /Paiement confirmé/);
  assert.match(payload.text, /réception de votre paiement/i);
  assert.match(payload.text, /access has been successfully activated/i);
  assert.match(payload.text, /RA-ALEX12-20260523/);
});

test("rejected email asks client to contact support", () => {
  const payload = buildManualPaymentRejectedEmail({
    user: { username: "Alex" },
    referenceCode: "RA-ALEX12-20260523",
  });

  assert.match(payload.subject, /Paiement non confirmé/);
  assert.match(payload.text, /info@real-amor\.com/);
  assert.match(payload.text, /could not confirm your payment/i);
});

