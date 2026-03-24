import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import { normalizePhone } from "@/utils/phoneUtils";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function pickAllowedUpdates(input) {
  const out = {};
  const src = input && typeof input === "object" ? input : {};

  // Allowlist of fields the admin can edit from UI.
  // Keep this conservative.
  const fields = [
    "username",
    "gender",
    "purpose",
    "age",
    "phone",
    "phoneCountry",
    "email",
    "aboutMe",
    "address",
  ];

  for (const key of fields) {
    if (!(key in src)) continue;
    const v = src[key];
    if (v === null) {
      out[key] = null;
      continue;
    }
    if (typeof v === "number" && key === "age") {
      out[key] = v;
      continue;
    }
    out[key] = String(v);
  }

  // Normalize / clamp
  if (typeof out.username === "string") out.username = out.username.trim().slice(0, 120);
  if (typeof out.gender === "string") out.gender = out.gender.trim().slice(0, 40);
  if (typeof out.purpose === "string") out.purpose = out.purpose.trim().slice(0, 40);
  if (typeof out.phone === "string") out.phone = out.phone.trim().slice(0, 40);
  if (typeof out.phoneCountry === "string") {
    out.phoneCountry = out.phoneCountry.trim().toUpperCase().slice(0, 2);
  }
  if (typeof out.email === "string") out.email = out.email.trim().slice(0, 200);
  if (typeof out.aboutMe === "string") out.aboutMe = out.aboutMe.slice(0, 8000);
  if (typeof out.address === "string") out.address = out.address.slice(0, 1000);

  if (typeof out.age === "string") {
    const n = Number(out.age);
    out.age = Number.isFinite(n) ? n : null;
  }
  if (typeof out.age === "number") {
    const n = Math.max(0, Math.min(130, Math.floor(out.age)));
    out.age = n;
  }

  // Enforce enums (match signup form values) to avoid database corruption
  if ("gender" in out) {
    if (out.gender !== "male" && out.gender !== "female" && out.gender !== null) {
      delete out.gender;
    }
  }
  if ("purpose" in out) {
    if (
      out.purpose !== "love" &&
      out.purpose !== "casual" &&
      out.purpose !== "friendship" &&
      out.purpose !== null
    ) {
      delete out.purpose;
    }
  }

  if ("phoneCountry" in out) {
    if (!/^[A-Z]{2}$/.test(out.phoneCountry || "")) {
      delete out.phoneCountry;
    }
  }

  // Keep legacy `phone`, but also persist normalized additive fields.
  if ("phone" in out || "phoneCountry" in out) {
    const normalized = normalizePhone({
      phone: out.phone || "",
      selectedCountry: out.phoneCountry || null,
      strict: true,
    });
    if (!normalized.isValid) {
      throw new ValidationError("Invalid phone number format");
    }
    out.phone = normalized.phone;
    out.phoneRaw = normalized.phoneRaw;
    out.phoneDisplay = normalized.phoneDisplay;
    out.phoneE164 = normalized.phoneE164;
    out.phoneCountry = normalized.phoneCountry;
    out.phoneDialCode = normalized.phoneDialCode;
    out.phoneFlag = normalized.phoneFlag;
  }

  return out;
}

export async function POST(request) {
  try {
    const { uid, updates } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patch = pickAllowedUpdates(updates);
    if (!Object.keys(patch).length) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const userRef = adminDb.collection("Users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await userRef.set(
      {
        ...patch,
        adminUpdatedAt: Timestamp.now(),
        adminUpdatedBy: auth.uid,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, updated: patch }, { status: 200 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("admin-update-user error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

