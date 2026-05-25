import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { MANUAL_PAYMENTS_COLLECTION } from "../_utils/manualPayments";

export const dynamic = "force-dynamic";

function toMillis(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  return 0;
}

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const uid = String(searchParams.get("uid") || "").trim();
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection(MANUAL_PAYMENTS_COLLECTION)
      .where("uid", "==", uid)
      .limit(100)
      .get();

    const payments = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data() || {};
        const historyRaw = Array.isArray(data?.reviewHistory)
          ? data.reviewHistory
          : [];
        const reviewHistory = historyRaw.map((entry) => ({
          fromStatus: String(entry?.fromStatus || ""),
          toStatus: String(entry?.toStatus || ""),
          by: entry?.by || null,
          note: entry?.note || null,
          at: toMillis(entry?.at),
        }));
        return {
          id: docSnap.id,
          ...data,
          createdAt: toMillis(data?.createdAt),
          reviewedAt: toMillis(data?.reviewedAt),
          reviewHistory,
        };
      })
      .sort((a, b) => toMillis(b?.createdAt) - toMillis(a?.createdAt));

    return NextResponse.json({ success: true, payments }, { status: 200 });
  } catch (err) {
    console.error("admin-manual-payments error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
