import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";

// Definirea rutei GET pentru obținerea detaliilor sesiunii
export async function GET(request) {
  // Preia parametrii din query (echivalentul `req.query` din `Page Router`)
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const stripe = getStripe();
    // Obține detaliile sesiunii pe baza session_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Ownership check: session must belong to the authenticated user.
    const sessionUid = session?.metadata?.uid || null;
    if (!sessionUid || sessionUid !== auth.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Returnează sesiunea ca răspuns
    return NextResponse.json(session, { status: 200 });
  } catch (err) {
    // Returnează eroarea în caz de eșec
    return NextResponse.json({ error: "Failed to retrieve session details" }, { status: 500 });
  }
}
