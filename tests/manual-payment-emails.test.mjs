import test from "node:test";
import assert from "node:assert/strict";
import {
  buildManualPaymentRequestEmail,
  buildManualPaymentConfirmedEmail,
  buildManualPaymentRejectedEmail,
  buildValidationPaymentConfirmedEmail,
} from "../app/api/_utils/manualPaymentEmails.js";

test("reservation request email includes 159 EUR bank details and footer", () => {
  const payload = buildManualPaymentRequestEmail({
    user: { username: "Alex", email: "alex@example.com" },
    amountEur: 159,
    referenceCode: "RA-ALEX12-20260523",
    paymentType: "reservation",
  });

  assert.match(payload.subject, /Instructions de paiement/);
  assert.match(payload.text, /Nous vous remercions de votre confiance/);
  assert.match(payload.text, /159,00€/);
  assert.match(payload.text, /BE32 0019 9397 1002/);
  assert.match(payload.text, /Hartelijk dank voor uw vertrouwen/);
  assert.match(payload.text, /Thank you for your trust/);
  assert.match(payload.text, /RA-ALEX12-20260523/);
  assert.doesNotMatch(payload.text, /417\.00/);
});

test("subscription request email includes FR/NL/EN sections, amount and reference", () => {
  const payload = buildManualPaymentRequestEmail({
    user: { username: "Alex", email: "alex@example.com" },
    amountEur: 417,
    referenceCode: "RA-ALEX12-20260523",
    paymentType: "subscription",
  });

  assert.match(payload.subject, /Instructions de paiement/);
  assert.match(payload.text, /Nous vous remercions de votre confiance/);
  assert.match(payload.text, /Hartelijk dank voor uw vertrouwen/);
  assert.match(payload.text, /Thank you for your trust/);
  assert.match(payload.text, /417\.00/);
  assert.match(payload.text, /RA-ALEX12-20260523/);
});

test("validation payment confirmed email thanks client for validation appointment", () => {
  const payload = buildValidationPaymentConfirmedEmail();

  assert.match(payload.subject, /Confirmation et remerciement/);
  assert.match(payload.text, /rendez-vous de validation/i);
  assert.match(payload.text, /validatieafspraak/i);
  assert.match(payload.text, /validation appointment/i);
  assert.match(payload.text, /www\.real-amor\.com/);
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
