import { NextResponse } from "next/server";
import { adminAuth } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

export const POST = async (req, res) => {
  try {
    const { uid } = await req.json(); // `req.json()` înlocuiește `req.body` pentru API Routes în Next.js 13
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await adminAuth.deleteUser(uid); // Șterge utilizatorul din Authentication
    return NextResponse.json(
      { success: true, message: "User deleted from Authentication successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user from Authentication:", error);
    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 }
    );
  }
};
