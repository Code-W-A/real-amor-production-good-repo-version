import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";

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

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { reason } = await request.json();
    const uid = auth.uid;

    const userRef = adminDb.collection("Users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : null;

    const deletedRecord = {
      uid,
      username: userData?.username || null,
      email: userData?.email || null,
      gender: userData?.gender || null,
      registrationDate: userData?.registrationDate || null,
      subscriptionStatus: userData?.subscriptionStatus || null,
      deletedAt: Timestamp.now(),
      deletedByUid: uid,
      deletedByEmail: auth.email || null,
      deletedByRole: "user",
      deletionSource: "self_close",
      deletionReason: reason ? String(reason).slice(0, 500) : null,
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
    console.error("close-account error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

