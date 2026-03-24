export function getSafeOrigin(request) {
  const isProd = process.env.NODE_ENV === "production";

  const xfProto = request.headers.get("x-forwarded-proto");
  const xfHost = request.headers.get("x-forwarded-host");
  const host = xfHost || request.headers.get("host");
  if (xfProto && host) {
    return `${xfProto}://${host}`.replace(/\/$/, "");
  }

  try {
    const urlOrigin = new URL(request.url).origin;
    if (urlOrigin) return urlOrigin.replace(/\/$/, "");
  } catch {
    // ignore
  }

  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  const envOrigin =
    process.env.APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";
  if (envOrigin && isProd) return envOrigin.replace(/\/$/, "");
  return envOrigin ? envOrigin.replace(/\/$/, "") : "";
}
