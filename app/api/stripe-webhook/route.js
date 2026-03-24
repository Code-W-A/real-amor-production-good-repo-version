import { NextResponse } from "next/server";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { sendMail } from "../_utils/mailer";
import { buildPaymentNotificationEmail } from "../_utils/paymentNotificationEmail";
import { getStripe, getStripeMode } from "../_utils/stripeUtils";

const INTERNAL_PAYMENT_NOTIFICATION_TO = "office@real-amor.com";
const SYSTEM_COLLECTION = "_System";
const PAYMENT_NOTIFICATIONS_DOC = "PaymentNotifications";
const PAYMENT_NOTIFICATIONS_SUBCOLLECTION = "Entries";

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

function getPaymentNotificationRef(sessionId) {
  return adminDb
    .collection(SYSTEM_COLLECTION)
    .doc(PAYMENT_NOTIFICATIONS_DOC)
    .collection(PAYMENT_NOTIFICATIONS_SUBCOLLECTION)
    .doc(String(sessionId || ""));
}

function getNotificationKind(session) {
  if (session?.payment_status !== "paid") return null;
  if (isLifetimeSession(session)) return "lifetime";
  if (session?.mode === "subscription") return "subscription";
  if (session?.mode === "payment") return "reservation";
  return null;
}

function getSessionSubscriptionId(session) {
  if (typeof session?.subscription === "string") {
    return session.subscription;
  }
  const expandedId = String(session?.subscription?.id || "").trim();
  return expandedId || null;
}

function getSessionCustomerEmail(session, userData) {
  return (
    String(
      userData?.email ||
        session?.customer_details?.email ||
        session?.customer_email ||
        ""
    ).trim() || null
  );
}

function getSessionAmountTotal(session) {
  const amount = Number(session?.amount_total);
  return Number.isFinite(amount) ? amount : null;
}

function isAlreadyExistsError(error) {
  return (
    error?.code === 6 ||
    error?.code === "already-exists" ||
    /already exists/i.test(String(error?.message || ""))
  );
}

async function loadSessionUserData(session) {
  const uid = String(session?.metadata?.uid || "").trim();
  if (!uid) {
    console.warn(
      "stripe-webhook payment notification: missing session.metadata.uid",
      session?.id || null
    );
    return null;
  }

  try {
    const snap = await adminDb.collection("Users").doc(uid).get();
    if (!snap.exists) {
      console.warn(
        "stripe-webhook payment notification: user not found",
        uid,
        session?.id || null
      );
      return null;
    }
    return snap.data() || null;
  } catch (error) {
    console.error(
      "stripe-webhook payment notification: failed loading user",
      uid,
      error
    );
    return null;
  }
}

async function reservePaymentNotification(event, session, kind, userData) {
  const sessionId = String(session?.id || "").trim();
  if (!sessionId) return { reserved: false, ref: null };

  const ref = getPaymentNotificationRef(sessionId);
  const payload = {
    kind,
    stripeEventId: String(event?.id || "").trim() || null,
    sessionId,
    subscriptionId: getSessionSubscriptionId(session),
    uid: String(session?.metadata?.uid || "").trim() || null,
    customerEmail: getSessionCustomerEmail(session, userData),
    amountTotal: getSessionAmountTotal(session),
    currency: String(session?.currency || "").trim() || null,
    sentTo: INTERNAL_PAYMENT_NOTIFICATION_TO,
    sentAt: null,
  };

  try {
    await ref.create(payload);
    return { reserved: true, ref };
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      return { reserved: false, ref };
    }
    throw error;
  }
}

async function sendInternalPaymentNotification(event, session) {
  const kind = getNotificationKind(session);
  if (!kind) return;

  const userData = await loadSessionUserData(session);
  const { reserved, ref } = await reservePaymentNotification(
    event,
    session,
    kind,
    userData
  );

  if (!reserved) {
    console.log(
      "stripe-webhook payment notification: already processed",
      session?.id || null
    );
    return;
  }

  const emailContent = buildPaymentNotificationEmail({
    kind,
    session,
    event,
    userData,
  });

  try {
    await sendMail({
      to: INTERNAL_PAYMENT_NOTIFICATION_TO,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
  } catch (error) {
    if (ref) {
      await ref.delete().catch((deleteError) => {
        console.error(
          "stripe-webhook payment notification: failed cleaning reservation",
          session?.id || null,
          deleteError
        );
      });
    }
    throw error;
  }

  if (!ref) return;

  try {
    await ref.set(
      {
        sentAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(
      "stripe-webhook payment notification: failed updating sentAt",
      session?.id || null,
      error
    );
  }
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
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;

      if (session?.payment_status === "paid" && isLifetimeSession(session)) {
        await markLifetimeInFirestore(session);
      }

      await sendInternalPaymentNotification(event, session);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("stripe-webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
