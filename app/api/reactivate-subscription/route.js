import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";

export async function POST(request) {
  const body = await request.json();
  const { subscriptionId } = body;

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const stripe = getStripe();

    // Ownership check:
    // - Preferred: Stripe subscription metadata.uid
    // - Legacy fallback: Stripe customer email === Firebase token email
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const subUid = sub?.metadata?.uid || null;
    if (subUid) {
      if (subUid !== auth.uid) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      const customerId = sub?.customer;
      if (!customerId || !auth.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const customer = await stripe.customers.retrieve(customerId);
      const customerEmail =
        typeof customer === "object" && customer && "email" in customer
          ? customer.email
          : null;
      if (!customerEmail || customerEmail !== auth.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    return NextResponse.json({ success: true, subscription });
  } catch (err) {
    console.error("Eroare la reactivarea abonamentului:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
