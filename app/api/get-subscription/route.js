import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subscription_id = searchParams.get("subscription_id");

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    // Ownership check:
    // - Preferred: Stripe subscription metadata.uid (we set this at creation time)
    // - Legacy fallback: compare Stripe customer email with Firebase token email
    const subUid = subscription?.metadata?.uid || null;
    if (subUid) {
      if (subUid !== auth.uid) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      const customerId = subscription?.customer;
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

    // Obține `price_id` din abonament
    const price_id = subscription.items.data[0].price.id;

    // Obține detaliile prețului (inclusiv produsul asociat)
    const price = await stripe.prices.retrieve(price_id);
    const product = await stripe.products.retrieve(price.product);

    // Adaugă numele produsului la răspunsul abonamentului
    const subscriptionWithProduct = {
      ...subscription,
      productName: product.name,
    };

    return NextResponse.json(subscriptionWithProduct, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to retrieve subscription details" },
      { status: 500 }
    );
  }
}
