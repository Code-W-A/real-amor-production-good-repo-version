import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

const COLLECTION = "AdminUserNotes"; // Not accessible from client SDK (blocked by firestore.rules default deny)
const MAX_LEN = 10000;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ref = adminDb.collection(COLLECTION).doc(uid);
    const snap = await ref.get();
    const data = snap.exists ? snap.data() || {} : {};

    return NextResponse.json(
      {
        uid,
        notes: typeof data.notes === "string" ? data.notes : "",
        updatedAt: data.updatedAt || null,
        updatedBy: data.updatedBy || null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("admin-user-notes GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { uid, notes } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const safeNotes = String(notes || "").slice(0, MAX_LEN);
    const ref = adminDb.collection(COLLECTION).doc(uid);
    await ref.set(
      {
        notes: safeNotes,
        updatedAt: Timestamp.now(),
        updatedBy: auth.uid,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("admin-user-notes POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

