import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function POST(request) {
  const body = await request.json();
  const { subscriptionId } = body;

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    return NextResponse.json({ success: true, subscription });
  } catch (err) {
    console.error("Eroare la reactivarea abonamentului:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
