import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getStripe } from "../_utils/stripeUtils";

function getAdminUidSet() {
  // Optional override via env (comma-separated UIDs)
  const raw = process.env.ADMIN_UIDS;
  if (raw) {
    return new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  // Fallback: keep in sync with the admin UI allowlist.
  return new Set([
    "SJTAqVztndgxISJAtnGzaSKieV02",
    "feSm5lY3F7aFrWNWneYw8qbPkiT2",
  ]);
}

export async function POST(request) {
  try {
    const { uid, subscriptionId } = await request.json();
    if (!uid || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing uid or subscriptionId" },
        { status: 400 }
      );
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent admin cancel against lifetime users in Firestore
    const userRef = adminDb.collection("Users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userSnap.data() || {};
    if (userData?.subscriptionStatus === "lifetime" || userData?.lifetimeAccess) {
      return NextResponse.json(
        { error: "Cannot cancel a lifetime subscription" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Retrieve + optional sanity check
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const subUid = sub?.metadata?.uid || null;
    if (subUid && subUid !== uid) {
      return NextResponse.json(
        { error: "Subscription does not belong to this user" },
        { status: 400 }
      );
    }

    // Schedule cancellation at period end
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const endMs =
      typeof updated?.current_period_end === "number"
        ? updated.current_period_end * 1000
        : null;

    const firestoreUpdate = {
      subscriptionActive: false,
      subscriptionStatus: "canceledUntilEnd",
      cancelAtPeriodEnd: true,
      subscriptionEndDate: endMs ? Timestamp.fromMillis(endMs) : null,
      subscriptionCancelRequestedAt: Timestamp.now(),
      subscriptionId: subscriptionId,
    };

    await userRef.set(firestoreUpdate, { merge: true });

    return NextResponse.json({
      success: true,
      subscription: updated,
      userUpdate: firestoreUpdate,
    });
  } catch (err) {
    console.error("admin-cancel-subscription error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

