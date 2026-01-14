import { NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "./firebaseTokenVerify";

function getBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

/**
 * Verifies Firebase ID token from `Authorization: Bearer <token>`.
 * Returns `{ uid, email, token }` on success or a `NextResponse` on failure.
 */
export async function requireAuth(request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyFirebaseIdToken(token);
    return {
      uid: decoded.sub,
      email: decoded.email || null,
      token,
      decoded,
    };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}


