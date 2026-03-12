const SUPPORTED_FIREBASE_AUTH_LANGUAGES = new Set(["en", "fr", "nl", "ro"]);

export const normalizeFirebaseAuthLanguage = (locale) => {
  const normalizedLocale = String(locale || "")
    .trim()
    .toLowerCase()
    .split("-")[0];

  if (SUPPORTED_FIREBASE_AUTH_LANGUAGES.has(normalizedLocale)) {
    return normalizedLocale;
  }

  return "fr";
};

export const getLocaleFromPathname = (pathname) => {
  const [locale] = String(pathname || "")
    .split("/")
    .filter(Boolean);

  return normalizeFirebaseAuthLanguage(locale);
};

export const syncFirebaseAuthLanguage = (auth, locale) => {
  const languageCode = normalizeFirebaseAuthLanguage(locale);

  if (auth) {
    auth.languageCode = languageCode;
  }

  return languageCode;
};
