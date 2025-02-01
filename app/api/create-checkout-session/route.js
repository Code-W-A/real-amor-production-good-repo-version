// app/api/create-checkout-session/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function POST(request) {
  const body = await request.json();
  const {
    costRezervare, // Convertim în bani (de exemplu, 10000 pentru 100 RON)
    nume,
    email, // Aici poți adăuga un email dintr-o stare sau context al utilizatorului
    phone,
    uid,
  } = body;

  try {
    console.log("Body:", body);
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY_TEST);

    // Creează sesiunea de checkout cu opțiunea de creare factură
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Rezervare pentru ${nume}`,
            },
            unit_amount: costRezervare, // Prețul în bani (de exemplu: 10000 bani pentru 100 RON)
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        nume,
        email,
        phone,
        uid,
      },
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true,
      },
      success_url: `${request.headers.get(
        "origin"
      )}/plata-finalizata?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/pricing`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
