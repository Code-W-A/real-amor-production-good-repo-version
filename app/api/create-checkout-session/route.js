// app/api/create-checkout-session/route.js
import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getSafeOrigin, getStripe } from "../_utils/stripeUtils";

// Reservation (one-time) amount is fixed server-side for safety.
// Keep this in cents to match Stripe `unit_amount`.
const RESERVATION_AMOUNT_CENTS = 15900;

export async function POST(request) {
  const body = await request.json();
  const {
    costRezervare, // Convertim în bani (de exemplu, 10000 pentru 100 RON)
    nume,
    phone,
  } = body;

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const amount = Number(costRezervare);
    // Server-side strict validation: only allow the fixed reservation amount.
    if (!Number.isFinite(amount) || amount !== RESERVATION_AMOUNT_CENTS) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin = getSafeOrigin(request);

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
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: auth.email || undefined,
      metadata: {
        nume,
        phone,
        uid: auth.uid,
      },
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true,
      },
      success_url: `${origin}/plata-finalizata?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
