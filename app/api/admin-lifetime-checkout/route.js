import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { getPriceIdForPlan, getSafeOrigin, getStripe } from "../_utils/stripeUtils";

export async function POST(request) {
  try {
    const { uid, subName, cancelExisting = true } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userRef = adminDb.collection("Users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userSnap.data() || {};

    const stripe = getStripe();
    const origin = getSafeOrigin(request);

    // Optionally stop existing subscription renewal to avoid double billing.
    if (
      cancelExisting &&
      userData?.subscriptionId &&
      userData?.subscriptionStatus !== "lifetime" &&
      !userData?.lifetimeAccess
    ) {
      try {
        const updated = await stripe.subscriptions.update(userData.subscriptionId, {
          cancel_at_period_end: true,
        });
        const endMs =
          typeof updated?.current_period_end === "number"
            ? updated.current_period_end * 1000
            : null;
        await userRef.set(
          {
            cancelAtPeriodEnd: true,
            subscriptionStatus: "canceledUntilEnd",
            subscriptionEndDate: endMs ? Timestamp.fromMillis(endMs) : null,
            subscriptionCancelRequestedAt: Timestamp.now(),
          },
          { merge: true }
        );
      } catch (err) {
        // Don't block lifetime checkout creation if cancel fails
        console.error("admin-lifetime-checkout cancel existing failed:", err);
      }
    }

    const priceId = getPriceIdForPlan("LIFETIME");

    // Guard: lifetime uses `mode=payment` => Stripe price MUST be one-time (not recurring).
    const priceObj = await stripe.prices.retrieve(priceId);
    if (priceObj?.recurring) {
      return NextResponse.json(
        {
          error:
            "Invalid lifetime price: it is a recurring price. Create/select a one-time Stripe Price for lifetime (type=one_time) and set STRIPE_PRICE_LIFETIME_* accordingly.",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userData?.email || undefined,
      metadata: {
        uid,
        subName: subName || "Abonnement à vie",
        planType: "lifetime",
        createdByAdminUid: auth.uid,
      },
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${origin}/admin-lifetime-success?session_id={CHECKOUT_SESSION_ID}&uid=${encodeURIComponent(
        uid
      )}`,
      cancel_url: `${origin}/informatii-utilizator?uid=${encodeURIComponent(uid)}`,
    });

    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });
  } catch (err) {
    console.error("admin-lifetime-checkout error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

