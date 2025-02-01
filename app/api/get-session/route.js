// app/api/get-session/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

// Inițializează Stripe cu cheia secretă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

// Definirea rutei GET pentru obținerea detaliilor sesiunii
export async function GET(request) {
  // Preia parametrii din query (echivalentul `req.query` din `Page Router`)
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  try {
    // Obține detaliile sesiunii pe baza session_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Returnează sesiunea ca răspuns
    return NextResponse.json(session, { status: 200 });
  } catch (err) {
    // Returnează eroarea în caz de eșec
    return NextResponse.json({ error: "Failed to retrieve session details" }, { status: 500 });
  }
}
