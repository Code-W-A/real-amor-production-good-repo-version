import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { subscriptionId } = body || {};
    if (!subscriptionId || typeof subscriptionId !== "string") {
      return NextResponse.json(
        { error: "Missing subscriptionId" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Ownership check: prefer metadata.uid; fallback to email match.
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

    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (err) {
    console.error("Error setting cancel_at_period_end:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

