/**
 * Single source of truth for "who is admin" across client and server.
 *
 * - Server (API routes): `ADMIN_UIDS` (comma-separated), or if empty use
 *   `NEXT_PUBLIC_ADMIN_UIDS` (same list as client is OK).
 * - Client (browser): `NEXT_PUBLIC_ADMIN_UIDS` (comma-separated)
 *
 * If neither yields IDs, a small fallback list is used.
 */

const FALLBACK_ADMIN_UIDS = [
  "SJTAqVztndgxISJAtnGzaSKieV02",
  "feSm5lY3F7aFrWNWneYw8qbPkiT2",
  "AcjykpO4W4M5JWCFPg0ZuxZVmiz1",
  "5WrGR81tQua0GZpCMW4IyUoZV7K2",
  "haLpd1x2lLZ3cSp68ldGXDPvZKQ2"
];

function parseCsv(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getAdminUidSet() {
  // In the browser bundle, only NEXT_PUBLIC_* is available.
  const isBrowser = typeof window !== "undefined";
  const fromPublic = parseCsv(process.env.NEXT_PUBLIC_ADMIN_UIDS);

  let envList;
  if (isBrowser) {
    envList = fromPublic;
  } else {
    // Server: prefer ADMIN_UIDS; if unset/empty, use NEXT_PUBLIC_ADMIN_UIDS.
    // Do not use `a || b` when `a` is [] — [] is truthy and would skip NEXT_PUBLIC_*.
    const fromAdmin = parseCsv(process.env.ADMIN_UIDS);
    envList = fromAdmin.length > 0 ? fromAdmin : fromPublic;
  }

  const ids = envList?.length ? envList : FALLBACK_ADMIN_UIDS;
  return new Set(ids);
}

export function isAdminUid(uid) {
  if (!uid) return false;
  return getAdminUidSet().has(uid);
}

