import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subscription_id = searchParams.get("subscription_id");

  try {
    const subscription = await stripe.subscriptions.retrieve(subscription_id);

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
