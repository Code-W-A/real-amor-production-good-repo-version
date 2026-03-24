const CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let certCache = {
  fetchedAt: 0,
  expiresAt: 0,
  certsByKid: null,
};

function base64UrlToBuffer(input) {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64");
}

function decodeJsonPart(part) {
  const buf = base64UrlToBuffer(part);
  return JSON.parse(buf.toString("utf8"));
}

function parseMaxAge(cacheControl) {
  if (!cacheControl) return null;
  const match = cacheControl.match(/max-age=(\d+)/i);
  if (!match) return null;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) ? seconds : null;
}

async function getCerts() {
  const now = Date.now();
  if (certCache.certsByKid && certCache.expiresAt > now) {
    return certCache.certsByKid;
  }

  const res = await fetch(CERTS_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch Firebase public certs");
  }
  const certsByKid = await res.json();
  const maxAge = parseMaxAge(res.headers.get("cache-control")) ?? 60 * 60;
  certCache = {
    fetchedAt: now,
    expiresAt: now + maxAge * 1000,
    certsByKid,
  };
  return certsByKid;
}

function getProjectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    null
  );
}

/**
 * Verify Firebase Auth ID token without firebase-admin.
 * Uses Google public certs and Node crypto.
 */
export async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Missing token");
  }

  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const header = decodeJsonPart(headerB64);
  const payload = decodeJsonPart(payloadB64);

  if (header.alg !== "RS256") throw new Error("Invalid alg");
  if (!header.kid) throw new Error("Missing kid");

  const projectId = getProjectId();
  if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");

  // Standard Firebase Auth ID token claims validation
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.sub || typeof payload.sub !== "string") throw new Error("Missing sub");
  if (payload.aud !== projectId) throw new Error("Invalid aud");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error("Invalid iss");
  }
  if (typeof payload.exp !== "number" || payload.exp <= nowSec) throw new Error("Expired");
  if (typeof payload.iat !== "number" || payload.iat > nowSec + 60) {
    throw new Error("Invalid iat");
  }

  const certsByKid = await getCerts();
  const pem = certsByKid[header.kid];
  if (!pem) throw new Error("Unknown kid");

  const crypto = await import("crypto");
  const data = Buffer.from(`${headerB64}.${payloadB64}`, "utf8");
  const signature = base64UrlToBuffer(sigB64);
  const ok = crypto.verify("RSA-SHA256", data, pem, signature);
  if (!ok) throw new Error("Invalid signature");

  return payload;
}


