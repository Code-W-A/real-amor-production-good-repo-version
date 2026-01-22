/**
 * Single source of truth for "who is admin" across client and server.
 *
 * - Server (API routes): set `ADMIN_UIDS` (comma-separated)
 * - Client (browser): set `NEXT_PUBLIC_ADMIN_UIDS` (comma-separated)
 *
 * If neither is set, a small fallback list is used.
 */

const FALLBACK_ADMIN_UIDS = [
  "SJTAqVztndgxISJAtnGzaSKieV02",
  "feSm5lY3F7aFrWNWneYw8qbPkiT2",
  "AcjykpO4W4M5JWCFPg0ZuxZVmiz1",
  "5WrGR81tQua0GZpCMW4IyUoZV7K2",
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
  const envList = isBrowser
    ? parseCsv(process.env.NEXT_PUBLIC_ADMIN_UIDS)
    : parseCsv(process.env.ADMIN_UIDS) || parseCsv(process.env.NEXT_PUBLIC_ADMIN_UIDS);

  const ids = envList?.length ? envList : FALLBACK_ADMIN_UIDS;
  return new Set(ids);
}

export function isAdminUid(uid) {
  if (!uid) return false;
  return getAdminUidSet().has(uid);
}

