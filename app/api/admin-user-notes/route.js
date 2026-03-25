import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";

const COLLECTION = "AdminUserNotes"; // Not accessible from client SDK (blocked by firestore.rules default deny)
const MAX_LEN = 10000;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      console.warn("[admin-user-notes GET] missing uid");
      return NextResponse.json(
        { error: "Missing uid", code: "MISSING_UID" },
        { status: 400 }
      );
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
    console.error("[admin-user-notes GET] error:", err?.message || err, {
      stack: err?.stack,
    });
    return NextResponse.json(
      {
        error: err?.message || "Internal Server Error",
        code: "GET_FAILED",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.warn("[admin-user-notes POST] invalid JSON body", parseErr?.message);
    return NextResponse.json(
      { error: "Invalid JSON body", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  try {
    const { uid, notes } = body || {};
    if (!uid) {
      console.warn("[admin-user-notes POST] missing uid");
      return NextResponse.json(
        { error: "Missing uid", code: "MISSING_UID" },
        { status: 400 }
      );
    }

    const safeNotes = String(notes || "").slice(0, MAX_LEN);
    const ref = adminDb.collection(COLLECTION).doc(uid);
    await ref.set(
      {
        notes: safeNotes,
        updatedAt: Timestamp.now(),
        updatedBy: null,
      },
      { merge: true }
    );

    console.log("[admin-user-notes POST] saved", {
      uid,
      notesLength: safeNotes.length,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[admin-user-notes POST] error:", err?.message || err, {
      stack: err?.stack,
    });
    return NextResponse.json(
      {
        error: err?.message || "Internal Server Error",
        code: "SAVE_FAILED",
      },
      { status: 500 }
    );
  }
}
