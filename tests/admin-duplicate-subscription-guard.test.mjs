import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("admin-activate-plan route enforces active-subscription override contract", () => {
  const source = readFileSync(
    resolve(process.cwd(), "app/api/admin-activate-plan/route.js"),
    "utf8"
  );

  assert.match(source, /overrideActiveSubscription\s*===\s*true/);
  assert.match(source, /hasActiveSubscription\s*\(/);
  assert.match(source, /needsOverride:\s*true/);
  assert.match(source, /\{\s*status:\s*409\s*\}/);
});

test("admin-manual-payment-review route enforces override on confirm for subscription\/lifetime", () => {
  const source = readFileSync(
    resolve(process.cwd(), "app/api/admin-manual-payment-review/route.js"),
    "utf8"
  );

  assert.match(source, /overrideActiveSubscription\s*===\s*true/);
  assert.match(
    source,
    /decision === MANUAL_PAYMENT_STATUS_CONFIRMED[\s\S]*paymentType === "subscription"/
  );
  assert.match(source, /needsOverride:\s*true/);
  assert.match(source, /\{\s*status:\s*409\s*\}/);
});

test("admin UI wires Oui\/Non duplicate-subscription prompt with override retry", () => {
  const source = readFileSync(
    resolve(
      process.cwd(),
      "components/dashboard/InformatiiUtilizator/EditProfile.jsx"
    ),
    "utf8"
  );

  assert.match(
    source,
    /Le Client a déjà souscrit un abonnement en cours, êtes vous sûrs de/
  );
  assert.match(source, /needsOverride/);
  assert.match(source, /mode:\s*"activate_plan"/);
  assert.match(source, /mode:\s*"review_manual_payment"/);
  assert.match(source, /overrideActiveSubscription:\s*true/);
  assert.match(source, />\s*Oui\s*</);
  assert.match(source, />\s*Non\s*</);
});
