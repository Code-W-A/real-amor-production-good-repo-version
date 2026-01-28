import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

function buildSnapshot(userData) {
  if (!userData || typeof userData !== "object") return {};
  const fields = [
    "username",
    "email",
    "phone",
    "gender",
    "purpose",
    "age",
    "registrationDate",
    "subscriptionStatus",
    "subscriptionId",
    "lifetimeAccess",
    "lifetimeSessionId",
    "currentlyInCouple",
    "isActivated",
  ];
  const out = {};
  for (const key of fields) {
    if (typeof userData[key] !== "undefined") out[key] = userData[key];
  }
  return out;
}

function genderToFr(value) {
  if (value === "male") return "Homme";
  if (value === "female") return "Femme";
  if (value === "other") return "Autre";
  return null;
}

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
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : null;

    const reasonText =
      typeof reason === "string" && reason.trim()
        ? reason.trim().slice(0, 500)
        : "admin_delete";
    const deletedRecord = {
      uid,
      username: userData?.username || null,
      email: userData?.email || null,
      gender: userData?.gender || null,
      genderLabelFr: genderToFr(userData?.gender),
      registrationDate: userData?.registrationDate || null,
      subscriptionStatus: userData?.subscriptionStatus || null,
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
      snapshot: buildSnapshot(userData),
    };

    await adminDb.collection("DeletedUsers").add(deletedRecord);

    if (userSnap.exists) {
      await userRef.delete();
    }

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

