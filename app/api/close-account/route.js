import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { reason } = await request.json();
    const uid = auth.uid;

    const userRef = adminDb.collection("Users").doc(uid);

    const reasonText =
      typeof reason === "string" && reason.trim()
        ? reason.trim().slice(0, 500)
        : "self_close";
    const deletedAccount = {
      isDeleted: true,
      deletedAt: Timestamp.now(),
      deletedByUid: uid,
      deletedByEmail: auth.email || null,
      deletedByRole: "user",
      deletionSource: "self_close",
      deletionReason: reasonText,
      deletionSourceLabelFr: "Supprimé par utilisateur",
      deletionReasonLabelFr:
        reasonText === "self_close"
          ? "Compte fermé par utilisateur"
          : reasonText,
    };

    await userRef.set({ deletedAccount }, { merge: true });

    try {
      await adminAuth.deleteUser(uid);
    } catch (err) {
      if (err?.code !== "auth/user-not-found") {
        throw err;
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("close-account error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

