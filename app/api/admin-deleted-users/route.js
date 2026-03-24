import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

// This route depends on request headers (Authorization), so it must be dynamic at runtime.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clampLimit(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 200;
  return Math.max(1, Math.min(1000, Math.floor(n)));
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
    const limit = clampLimit(searchParams.get("limit"));

    const snap = await adminDb
      .collection("DeletedUsers")
      .orderBy("deletedAt", "desc")
      .limit(limit)
      .get();

    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("admin-deleted-users error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

