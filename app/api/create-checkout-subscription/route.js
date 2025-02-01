import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function POST(request) {
  const body = await request.json();
  const {
    priceId, // Predefinit în Stripe pentru un plan de abonament
    nume,
    email, // Email-ul utilizatorului
    phone,
    uid,
    subName,
  } = body;

  try {
    // Creează sesiunea de checkout pentru abonament
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "subscription", // Mod de plată pentru abonament
      line_items: [
        {
          price: priceId, // Prețul recurent de la Stripe (predefinit pentru planul de abonament)
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        nume,
        email,
        phone,
        uid,
        subName,
      },
      automatic_tax: {
        enabled: true,
      },
      success_url: `${request.headers.get(
        "origin"
      )}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/subscriptions`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Eroare Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
