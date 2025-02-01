import Stripe from "stripe";
import { NextResponse } from "next/server";

// Inițializează Stripe cu cheia secretă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function POST(request) {
  const body = await request.json();
  const { subscriptionId } = body;

  try {
    // Anulează abonamentul la sfârșitul perioadei curente
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true, subscription });
  } catch (err) {
    console.error("Eroare la anularea abonamentului:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
