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
  const { planKey, priceId, subName } = body;

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const finalPriceId = planKey ? getPriceIdForPlan(planKey) : priceId;
    if (!finalPriceId) {
      return NextResponse.json({ error: "Missing planKey" }, { status: 400 });
    }
    if (!planKey) assertAllowedPriceId(finalPriceId);
    const stripe = getStripe();

    // Guard: lifetime uses `mode=payment` => Stripe price MUST be one-time (not recurring).
    // This makes misconfigured env / Stripe prices fail fast with a clear message.
    const priceObj = await stripe.prices.retrieve(finalPriceId);
    if (priceObj?.recurring) {
      return NextResponse.json(
        {
          error:
            "Invalid lifetime price: it is a recurring price. Create/select a one-time Stripe Price for lifetime (type=one_time) and set STRIPE_PRICE_LIFETIME_* accordingly.",
        },
        { status: 400 }
      );
    }

    const promo = await getPromoConfigPublic();
    const percent = Math.max(0, Math.min(100, Number(promo.discountPercent) || 0));
    let couponId = null;
    if (percent) {
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "payment",
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      customer_email: auth.email || undefined,
      metadata: {
        uid: auth.uid,
        subName: subName || "",
        planType: "lifetime",
      },
      automatic_tax: {
        enabled: true,
      },
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscriptions`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Eroare Stripe (lifetime):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




