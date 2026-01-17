/**
 * Centralized admin UID allowlist.
 *
 * Prefer setting `ADMIN_UIDS` (comma-separated) in your environment.
 * Fallback list must stay in sync with the admin UI redirect allowlist.
 */
export function getAdminUidSet() {
  const raw = process.env.ADMIN_UIDS;
  if (raw) {
    return new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  return new Set([
    "SJTAqVztndgxISJAtnGzaSKieV02",
    "feSm5lY3F7aFrWNWneYw8qbPkiT2",
    "AcjykpO4W4M5JWCFPg0ZuxZVmiz1",
  ]);
}

