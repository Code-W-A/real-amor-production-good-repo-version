import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

export async function POST(request) {
  try {
    const { uid, enabled } = await request.json();
    if (!uid || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Missing uid or enabled" },
        { status: 400 }
      );
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userRef = adminDb.collection("Users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await userRef.set({ lifetimeOfferEnabled: enabled }, { merge: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("admin-set-lifetime-offer error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

