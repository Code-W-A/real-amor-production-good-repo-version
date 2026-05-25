import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MANUAL_PAYMENT_STATUS_CONFIRMED,
  MANUAL_PAYMENT_STATUS_PENDING,
  getManualPlanConfig,
} from "../app/api/_utils/manualPayments.js";
import {
  buildManualPaymentRequestEmail,
  buildManualPaymentConfirmedEmail,
} from "../app/api/_utils/manualPaymentEmails.js";

test("smoke: signup/quiz -> reservation 159 manual -> admin confirm -> manual subscription request -> admin activate", () => {
  const user = {
    uid: "uid_smoke_1",
    email: "smoke@example.com",
    username: "Smoke Client",
    isActivated: true,
    quizCompleted: true,
    reservation: { status: "unpaid", hasReserved: false },
    subscriptionActive: false,
    subscriptionStatus: "canceledImmediately",
  };

  // Step 1: one-time reservation request (159 EUR)
  const reservationPlan = getManualPlanConfig("RESERVATION");
  assert.equal(reservationPlan?.amountEur, 159);
  const reservationRef = "RA-SMOKE1-20260525";
  const reservationRequestEmail = buildManualPaymentRequestEmail({
    user,
    amountEur: reservationPlan.amountEur,
    referenceCode: reservationRef,
  });
  assert.match(reservationRequestEmail.text, /159\.00/);
  assert.match(reservationRequestEmail.text, /BE32 0019 9397 1002/);

  const reservationPayment = {
    id: "pay_res_smoke",
    paymentType: "reservation",
    planKey: "RESERVATION",
    planLabel: reservationPlan.planLabel,
    amountEur: reservationPlan.amountEur,
    referenceCode: reservationRef,
    status: MANUAL_PAYMENT_STATUS_PENDING,
  };
  assert.equal(reservationPayment.status, MANUAL_PAYMENT_STATUS_PENDING);

  // Validate wiring: admin review confirm path uses shared entitlement util for activation.
  const reviewRouteSource = readFileSync(
    resolve(process.cwd(), "app/api/admin-manual-payment-review/route.js"),
    "utf8"
  );
  assert.match(reviewRouteSource, /buildManualPaymentConfirmUserUpdate/);
  assert.match(reviewRouteSource, /decision === MANUAL_PAYMENT_STATUS_CONFIRMED/);
  assert.equal(reservationPayment.status, MANUAL_PAYMENT_STATUS_PENDING);

  // Step 2: user asks for a subscription from /subscriptions (manual request email path)
  const subPlan = getManualPlanConfig("SUB_12M");
  const subRef = "RA-SMOKE1-20260525-2";
  const subRequestEmail = buildManualPaymentRequestEmail({
    user,
    amountEur: subPlan.amountEur,
    referenceCode: subRef,
  });
  assert.match(subRequestEmail.text, /1068\.00/);
  assert.match(subRequestEmail.text, /reference code/i);

  // Step 3: admin manual activation of that subscription
  const subscriptionPayment = {
    id: "pay_sub_smoke",
    paymentType: "subscription",
    planKey: "SUB_12M",
    planLabel: subPlan.planLabel,
    amountEur: subPlan.amountEur,
    referenceCode: subRef,
    status: MANUAL_PAYMENT_STATUS_CONFIRMED,
  };
  assert.equal(subscriptionPayment.status, MANUAL_PAYMENT_STATUS_CONFIRMED);

  // Validate wiring: direct admin activation endpoint writes confirmed audit + user summary.
  const adminActivateSource = readFileSync(
    resolve(process.cwd(), "app/api/admin-activate-plan/route.js"),
    "utf8"
  );
  assert.match(adminActivateSource, /source:\s*"admin_direct_activation"/);
  assert.match(adminActivateSource, /MANUAL_PAYMENT_STATUS_CONFIRMED/);
  assert.match(adminActivateSource, /buildManualPaymentUserUpdateSummary/);
  assert.match(adminActivateSource, /const planKey = normalizePlanKey/);

  const confirmedEmail = buildManualPaymentConfirmedEmail({
    user,
    amountEur: subPlan.amountEur,
    referenceCode: subRef,
  });
  assert.match(confirmedEmail.text, /successfully activated/i);
});

test("smoke guard: manual UI/API paths use manual payment endpoints, not Stripe checkout endpoints", () => {
  const subscriptionsUi = readFileSync(
    resolve(process.cwd(), "components/common/Subscriptions.jsx"),
    "utf8"
  );
  const pricingUi = readFileSync(
    resolve(process.cwd(), "components/common/Pricing.jsx"),
    "utf8"
  );
  const manualReqApi = readFileSync(
    resolve(process.cwd(), "app/api/manual-payment-request/route.js"),
    "utf8"
  );
  const manualReviewApi = readFileSync(
    resolve(process.cwd(), "app/api/admin-manual-payment-review/route.js"),
    "utf8"
  );

  assert.match(subscriptionsUi, /\/api\/manual-payment-request/);
  assert.match(pricingUi, /\/api\/manual-payment-request/);

  assert.doesNotMatch(subscriptionsUi, /\/api\/create-checkout-subscription/);
  assert.doesNotMatch(subscriptionsUi, /\/api\/create-checkout-lifetime/);
  assert.doesNotMatch(pricingUi, /\/api\/create-checkout-session/);

  assert.doesNotMatch(manualReqApi, /getStripe\s*\(/);
  assert.doesNotMatch(manualReviewApi, /getStripe\s*\(/);
});

test("smoke guard: manual payment routes use per-plan discount pricing and persist audit fields", () => {
  const manualReqApi = readFileSync(
    resolve(process.cwd(), "app/api/manual-payment-request/route.js"),
    "utf8"
  );
  const adminActivateApi = readFileSync(
    resolve(process.cwd(), "app/api/admin-activate-plan/route.js"),
    "utf8"
  );
  const adminPromotionsUi = readFileSync(
    resolve(process.cwd(), "components/dashboard/AdminPromotions.jsx"),
    "utf8"
  );

  assert.match(manualReqApi, /resolvePlanPricingFromConfig/);
  assert.match(manualReqApi, /baseAmountEur/);
  assert.match(manualReqApi, /appliedDiscountPercent/);

  assert.match(adminActivateApi, /resolvePlanPricingFromConfig/);
  assert.match(adminActivateApi, /baseAmountEur/);
  assert.match(adminActivateApi, /appliedDiscountPercent/);

  assert.match(adminPromotionsUi, /perPlanDiscountPercent/);
  assert.match(adminPromotionsUi, /MANUAL_PROMO_PLAN_KEYS/);
});
