import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    const { uid, reason } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const userRef = adminDb.collection("Users").doc(uid);

    const reasonText =
      typeof reason === "string" && reason.trim()
        ? reason.trim().slice(0, 500)
        : "admin_delete";
    const deletedAccount = {
      isDeleted: true,
      deletedAt: Timestamp.now(),
      deletedByUid: null,
      deletedByEmail: null,
      deletedByRole: "admin",
      deletionSource: "admin_delete",
      deletionReason: reasonText,
      deletionSourceLabelFr: "Supprimé par admin",
      deletionReasonLabelFr:
        reasonText === "admin_delete"
          ? "Compte supprimé par admin"
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
    console.error("admin-delete-user error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
