import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("entitlement util defines reservation manual activation fields", () => {
  const source = readFileSync(
    resolve(process.cwd(), "app/api/_utils/manualPaymentEntitlements.js"),
    "utf8"
  );
  assert.match(source, /reservation:\s*\{/);
  assert.match(source, /status:\s*"paid"/);
  assert.match(source, /paymentSource:\s*"manual_transfer"/);
  assert.match(source, /manualPaymentLastConfirmedId/);
});

test("entitlement util defines subscription activation fields", () => {
  const source = readFileSync(
    resolve(process.cwd(), "app/api/_utils/manualPaymentEntitlements.js"),
    "utf8"
  );
  assert.match(source, /subscriptionActive:\s*true/);
  assert.match(source, /subscriptionStatus:\s*"active"/);
  assert.match(source, /priceId:\s*`manual_\$\{payment\.planKey/);
  assert.match(source, /subscriptionAmount:\s*Number\(payment\.amountEur/);
});

test("entitlement util defines lifetime activation fields", () => {
  const source = readFileSync(
    resolve(process.cwd(), "app/api/_utils/manualPaymentEntitlements.js"),
    "utf8"
  );
  assert.match(source, /lifetimeAccess:\s*true/);
  assert.match(source, /subscriptionStatus:\s*"lifetime"/);
  assert.match(source, /lifetimeAmount:\s*Number\(payment\.amountEur/);
  assert.match(source, /subscriptionId:\s*null/);
});
