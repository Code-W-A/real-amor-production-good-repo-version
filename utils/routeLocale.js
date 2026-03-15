const APP_ROUTE_LOCALES = new Set(["en", "fr", "nl", "ro"]);

export const normalizeRouteLocale = (locale, fallback = "fr") => {
  const normalizedLocale = String(locale || "")
    .trim()
    .toLowerCase()
    .split("-")[0];

  if (APP_ROUTE_LOCALES.has(normalizedLocale)) {
    return normalizedLocale;
  }

  return fallback;
};

export const getLocaleFromPathname = (pathname, fallback = "fr") => {
  const [locale] = String(pathname || "")
    .split("/")
    .filter(Boolean);

  return normalizeRouteLocale(locale, fallback);
};

export const withLocalePath = (pathname, targetPath, fallback = "fr") => {
  const locale = getLocaleFromPathname(pathname, fallback);
  const normalizedTargetPath = `/${String(targetPath || "")
    .trim()
    .replace(/^\/+/, "")}`;

  return `/${locale}${normalizedTargetPath}`.replace(/\/\//g, "/");
};
