import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

export async function POST(request) {
  try {
    const { uid, reason } = await request.json();
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

    const reasonText =
      typeof reason === "string" && reason.trim()
        ? reason.trim().slice(0, 500)
        : "admin_delete";
    const deletedAccount = {
      isDeleted: true,
      deletedAt: Timestamp.now(),
      deletedByUid: auth.uid,
      deletedByEmail: auth.email || null,
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

