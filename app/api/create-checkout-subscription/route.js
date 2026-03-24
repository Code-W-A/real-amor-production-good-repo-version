import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import {
  assertAllowedPriceId,
  getPriceIdForPlan,
  getSafeOrigin,
  getStripe,
} from "../_utils/stripeUtils";
import { getPromoConfigPublic } from "../_utils/promoConfig";

export async function POST(request) {
  const body = await request.json();
  const {
    planKey, // Preferred: server selects correct priceId based on mode (test/live)
    priceId, // Backwards-compat (validated server-side)
    subName,
    cancelAtPeriodEndOnCreate, // Optional: pentru abonament 1 an fara reinnoire
  } = body;

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const finalPriceId = planKey ? getPriceIdForPlan(planKey) : priceId;
    if (!finalPriceId) {
      return NextResponse.json({ error: "Missing planKey" }, { status: 400 });
    }
    if (!planKey) assertAllowedPriceId(finalPriceId);
    const stripe = getStripe();

    // Guard: subscriptions must use a recurring Stripe price.
    const priceObj = await stripe.prices.retrieve(finalPriceId);
    if (!priceObj?.recurring) {
      return NextResponse.json(
        {
          error:
            "Invalid subscription price: it is a one-time price. Create/select a recurring Stripe Price for subscriptions and set STRIPE_PRICE_SUB_* accordingly.",
        },
        { status: 400 }
      );
    }

    // Promo config via Firestore *public* read (same as frontend), no Admin SDK.
    const promo = await getPromoConfigPublic();
    const percent = Math.max(0, Math.min(100, Number(promo.discountPercent) || 0));
    let couponId = null;
    if (percent) {
      // Avoid Firestore writes: look for existing coupon by name; create if missing.
      const couponName = `Admin promo -${percent}%`;
      const list = await stripe.coupons.list({ limit: 100 });
      const existing = (list?.data || []).find((c) => c?.name === couponName);
      if (existing?.id) {
        couponId = existing.id;
      } else {
        const created = await stripe.coupons.create({
          percent_off: percent,
          duration: "once",
          name: couponName,
        });
        couponId = created.id;
      }
    }

    const origin = getSafeOrigin(request);

    // Creează sesiunea de checkout pentru abonament
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "subscription", // Mod de plată pentru abonament
      line_items: [
        {
          price: finalPriceId, // Prețul recurent de la Stripe
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          uid: auth.uid,
          subName: subName || "",
          // Stripe Checkout does NOT support cancel_at_period_end at creation time.
          // We'll apply it after checkout completes (client calls an API to update the subscription).
          cancelAtPeriodEndOnCreate: cancelAtPeriodEndOnCreate ? "true" : "false",
          planKey: planKey || "",
        },
      },
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      customer_email: auth.email || undefined,
      metadata: {
        uid: auth.uid,
        subName: subName || "",
        cancelAtPeriodEndOnCreate: cancelAtPeriodEndOnCreate ? "true" : "false",
        planKey: planKey || "",
      },
      automatic_tax: {
        enabled: true,
      },
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscriptions`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Eroare Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
