import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";
import { getAdminUidSet } from "../_utils/adminUids";

export async function POST(request) {
  try {
    const { uid } = await request.json();
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
    if (userData?.subscriptionStatus === "lifetime" || userData?.lifetimeAccess) {
      return NextResponse.json(
        { error: "User already has lifetime access" },
        { status: 400 }
      );
    }

    // If there is an active Stripe subscription, disable renewal to avoid billing.
    if (userData?.subscriptionId) {
      try {
        const stripe = getStripe();
        await stripe.subscriptions.update(userData.subscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (err) {
        console.error("admin-set-lifetime Stripe update error:", err);
      }
    }

    const now = Timestamp.now();
    const firestoreUpdate = {
      lifetimeAccess: true,
      lifetimePurchasedAt: now,
      lifetimeSessionId: "admin_grant",
      lifetimeAmount: 0,
      subName: "Abonnement à vie",
      subscriptionActive: true,
      subscriptionStatus: "lifetime",
      cancelAtPeriodEnd: false,
      subscriptionId: null,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      subscriptionAmount: null,
      priceId: null,
    };

    await userRef.set(firestoreUpdate, { merge: true });

    return NextResponse.json({
      success: true,
      userUpdate: firestoreUpdate,
    });
  } catch (err) {
    console.error("admin-set-lifetime error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
