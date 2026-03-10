import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { normalizePhone } from "@/utils/phoneUtils";
import { getAdminUidSet } from "../_utils/adminUids";

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // This endpoint is for normal users only.
    const adminUids = getAdminUidSet();
    if (adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const phone = String(body?.phone || "");
    const selectedCountry = String(body?.selectedCountry || "");
    const targetLanguage = String(body?.targetLanguage || "");

    const normalized = normalizePhone({
      phone,
      selectedCountry,
      targetLanguage,
      strict: true,
    });

    if (!normalized.isValid) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const userRef = adminDb.collection("Users").doc(auth.uid);
    await userRef.set(
      {
        phone: normalized.phone,
        phoneRaw: normalized.phoneRaw,
        phoneDisplay: normalized.phoneDisplay,
        phoneE164: normalized.phoneE164,
        phoneCountry: normalized.phoneCountry,
        phoneDialCode: normalized.phoneDialCode,
        phoneFlag: normalized.phoneFlag,
        phoneUpdatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return NextResponse.json(
      {
        success: true,
        phone: {
          phone: normalized.phone,
          phoneRaw: normalized.phoneRaw,
          phoneDisplay: normalized.phoneDisplay,
          phoneE164: normalized.phoneE164,
          phoneCountry: normalized.phoneCountry,
          phoneDialCode: normalized.phoneDialCode,
          phoneFlag: normalized.phoneFlag,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("complete-phone error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
