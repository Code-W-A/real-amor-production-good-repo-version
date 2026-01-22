import { NextResponse } from "next/server";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const adminUids = getAdminUidSet();
  return NextResponse.json(
    {
      uid: auth.uid,
      email: auth.email,
      isAdmin: adminUids.has(auth.uid),
    },
    { status: 200 }
  );
}

