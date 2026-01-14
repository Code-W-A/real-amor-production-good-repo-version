import Stripe from "stripe";

export function getStripeMode() {
  const mode = String(process.env.STRIPE_MODE || "test").toLowerCase();
  return mode === "live" ? "live" : "test";
}

export function getStripe() {
  const mode = getStripeMode();
  const key =
    mode === "live"
      ? process.env.STRIPE_SECRET_KEY_LIVE
      : process.env.STRIPE_SECRET_KEY_TEST;

  if (!key) {
    throw new Error(
      mode === "live"
        ? "Missing STRIPE_SECRET_KEY_LIVE (set STRIPE_MODE=live)"
        : "Missing STRIPE_SECRET_KEY_TEST (set STRIPE_MODE=test)"
    );
  }

  return new Stripe(key);
}

// Plan keys used by the frontend. We keep price IDs ONLY server-side, selected by STRIPE_MODE.
// Required env vars (examples):
// - STRIPE_PRICE_SUB_3M_TEST / STRIPE_PRICE_SUB_3M_LIVE
// - STRIPE_PRICE_SUB_6M_TEST / STRIPE_PRICE_SUB_6M_LIVE
// - STRIPE_PRICE_SUB_12M_TEST / STRIPE_PRICE_SUB_12M_LIVE
// - STRIPE_PRICE_SUB_12M_NO_RENEW_TEST / STRIPE_PRICE_SUB_12M_NO_RENEW_LIVE
// - STRIPE_PRICE_LIFETIME_TEST / STRIPE_PRICE_LIFETIME_LIVE
const PLAN_ENV = {
  SUB_3M: { test: "STRIPE_PRICE_SUB_3M_TEST", live: "STRIPE_PRICE_SUB_3M_LIVE" },
  SUB_6M: { test: "STRIPE_PRICE_SUB_6M_TEST", live: "STRIPE_PRICE_SUB_6M_LIVE" },
  SUB_12M: {
    test: "STRIPE_PRICE_SUB_12M_TEST",
    live: "STRIPE_PRICE_SUB_12M_LIVE",
  },
  SUB_12M_NO_RENEW: {
    test: "STRIPE_PRICE_SUB_12M_NO_RENEW_TEST",
    live: "STRIPE_PRICE_SUB_12M_NO_RENEW_LIVE",
  },
  LIFETIME: { test: "STRIPE_PRICE_LIFETIME_TEST", live: "STRIPE_PRICE_LIFETIME_LIVE" },
};

export function getPriceIdForPlan(planKey) {
  if (!planKey || typeof planKey !== "string") {
    throw new Error("Invalid planKey");
  }

  const mode = getStripeMode();
  const plan = PLAN_ENV[planKey];
  if (!plan) {
    throw new Error("Unknown planKey");
  }

  const envName = plan[mode];
  const priceId = process.env[envName];
  if (!priceId) {
    throw new Error(`Missing ${envName}`);
  }
  if (typeof priceId !== "string" || !priceId.startsWith("price_")) {
    throw new Error(`Invalid ${envName}`);
  }

  return priceId;
}

// Backwards-compat: allow passing priceId directly, but only if it matches configured IDs for current mode.
export function getAllowedPriceIdsForCurrentMode() {
  const mode = getStripeMode();
  const ids = new Set();
  for (const planKey of Object.keys(PLAN_ENV)) {
    const envName = PLAN_ENV[planKey][mode];
    const v = process.env[envName];
    if (typeof v === "string" && v.startsWith("price_")) ids.add(v);
  }
  return ids;
}

export function assertAllowedPriceId(priceId) {
  if (!priceId || typeof priceId !== "string") {
    throw new Error("Invalid priceId");
  }
  const allowed = getAllowedPriceIdsForCurrentMode();
  if (!allowed.has(priceId)) {
    throw new Error("Price not allowed");
  }
}

export function getSafeOrigin(request) {
  // In development, prefer the request's actual host (localhost) to avoid
  // accidentally redirecting to a production APP_ORIGIN.
  const isProd = process.env.NODE_ENV === "production";

  // Vercel / proxies usually set these:
  const xfProto = request.headers.get("x-forwarded-proto");
  const xfHost = request.headers.get("x-forwarded-host");
  const host = xfHost || request.headers.get("host");
  if (xfProto && host) {
    return `${xfProto}://${host}`.replace(/\/$/, "");
  }

  // Fallback to the origin derived from the request URL (works in local dev).
  try {
    const urlOrigin = new URL(request.url).origin;
    if (urlOrigin) return urlOrigin.replace(/\/$/, "");
  } catch {
    // ignore
  }

  // Browser-origin header (may be missing on some requests)
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  // Final fallback: configured origin (prefer in production).
  const envOrigin =
    process.env.APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";
  if (envOrigin && isProd) return envOrigin.replace(/\/$/, "");
  return envOrigin ? envOrigin.replace(/\/$/, "") : "";
}
