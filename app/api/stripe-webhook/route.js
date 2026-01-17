import { NextResponse } from "next/server";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { getStripe, getStripeMode } from "../_utils/stripeUtils";

function getWebhookSecret() {
  const mode = getStripeMode();
  const v =
    mode === "live"
      ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
      : process.env.STRIPE_WEBHOOK_SECRET_TEST;
  return v || process.env.STRIPE_WEBHOOK_SECRET || "";
}

function isLifetimeSession(session) {
  const planType = String(session?.metadata?.planType || "").toLowerCase();
  if (planType === "lifetime") return true;
  const subName = String(session?.metadata?.subName || "").toLowerCase();
  return subName.includes("vie") || subName.includes("lifetime");
}

async function markLifetimeInFirestore(session) {
  const uid = session?.metadata?.uid || null;
  if (!uid) return;

  const userRef = adminDb.collection("Users").doc(uid);
  const snap = await userRef.get();
  const processed =
    snap.exists && Array.isArray((snap.data() || {})?.payments?.processedSessionIds)
      ? (snap.data() || {}).payments.processedSessionIds
      : [];
  if (processed.includes(session.id)) return;

  const now = Timestamp.now();
  const amount =
    typeof session?.amount_total === "number" ? session.amount_total / 100 : null;

  const update = {
    lifetimeAccess: true,
    lifetimePurchasedAt: now,
    lifetimeSessionId: session.id,
    lifetimeAmount: amount,
    subName: session?.metadata?.subName || "Abonnement à vie",
    // Keep existing gating compatible with the app
    subscriptionActive: true,
    subscriptionStatus: "lifetime",
    cancelAtPeriodEnd: false,
    // Clear subscription fields (lifetime is not a Stripe subscription)
    subscriptionId: null,
    subscriptionStartDate: null,
    subscriptionEndDate: null,
    subscriptionAmount: null,
    priceId: null,
    payments: {
      processedSessionIds: FieldValue.arrayUnion(session.id),
      lastProcessedSessionId: session.id,
      lastProcessedAt: now,
    },
  };

  await userRef.set(update, { merge: true });
}

export async function POST(request) {
  const stripe = getStripe();
  const secret = getWebhookSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 500 }
    );
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = Buffer.from(await request.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Only act on paid sessions
      if (session?.payment_status === "paid" && isLifetimeSession(session)) {
        await markLifetimeInFirestore(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("stripe-webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

