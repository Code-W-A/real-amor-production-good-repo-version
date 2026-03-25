import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

function iso2ToFlagEmoji(iso2) {
  const cc = String(iso2 || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(
    ...[...cc].map((c) => 127397 + c.charCodeAt(0))
  );
}

function buildAllCountryRows() {
  const rows = [];
  for (const country of getCountries()) {
    try {
      rows.push({
        country,
        dialCode: `+${getCountryCallingCode(country)}`,
        flag: iso2ToFlagEmoji(country),
      });
    } catch {
      // Regiune fără prefix în metadata (rar)
    }
  }
  return rows;
}

const ALL_COUNTRY_ROWS = buildAllCountryRows();

const META_BY_COUNTRY = ALL_COUNTRY_ROWS.reduce((acc, item) => {
  acc[item.country] = item;
  return acc;
}, {});

const META_BY_DIAL_SORTED = [...ALL_COUNTRY_ROWS].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
);

/** Limba UI pentru nume de țări (BCP 47, fragmentul de limbă). */
function resolveDisplayLocale(locale) {
  const raw = String(locale || "en").trim();
  const base = raw.split(/[-_]/)[0].toLowerCase();
  return base || "en";
}

const PHONE_OPTIONS_BY_LOCALE = new Map();

function buildCountryPhoneOptionsForLocale(locale) {
  const loc = resolveDisplayLocale(locale);
  let displayNames;
  try {
    displayNames = new Intl.DisplayNames([loc], { type: "region" });
  } catch {
    displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  }

  const sorted = [...ALL_COUNTRY_ROWS].sort((a, b) => {
    const na = displayNames.of(a.country) || a.country;
    const nb = displayNames.of(b.country) || b.country;
    const primary = na.localeCompare(nb, loc, { sensitivity: "base" });
    if (primary !== 0) return primary;
    return a.country.localeCompare(b.country);
  });

  return sorted.map((item) => ({
    country: item.country,
    dialCode: item.dialCode,
    label: `${item.flag} ${displayNames.of(item.country) || item.country} (${item.dialCode})`,
  }));
}

function sanitizePhoneInput(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return "";

  const withPlus = raw.replace(/^00/, "+");
  const noJunk = withPlus.replace(/[^\d+]/g, "");
  return noJunk.startsWith("+")
    ? `+${noJunk.slice(1).replace(/\+/g, "")}`
    : noJunk.replace(/\+/g, "");
}

function toIsoCountryCode(value) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

function inferCountryByDialCode(e164) {
  if (typeof e164 !== "string" || !e164.startsWith("+")) return null;
  return (
    META_BY_DIAL_SORTED.find((item) => e164.startsWith(item.dialCode)) || null
  );
}

function inferMetaFromPhoneNumber(phoneNumber, fallbackCountry) {
  const byParsedCountry = META_BY_COUNTRY[toIsoCountryCode(phoneNumber?.country)];
  if (byParsedCountry) return byParsedCountry;

  const byDial = inferCountryByDialCode(phoneNumber?.number || null);
  if (byDial) return byDial;

  const fallback = META_BY_COUNTRY[toIsoCountryCode(fallbackCountry)];
  return fallback || null;
}

function parsePhone(rawInput, preferredCountry) {
  if (!rawInput) return null;
  if (rawInput.startsWith("+")) {
    return parsePhoneNumberFromString(rawInput);
  }

  const isoCountry = toIsoCountryCode(preferredCountry);
  if (!isoCountry) return null;
  return parsePhoneNumberFromString(rawInput, isoCountry);
}

export function getPreferredCountry(targetLanguage, explicitCountry) {
  const normalized = String(explicitCountry || "").toUpperCase();
  if (META_BY_COUNTRY[normalized]) return normalized;

  const language = String(targetLanguage || "").toLowerCase();
  if (language === "nl") return "NL";
  if (language === "fr") return "BE";
  return "BE";
}

export function normalizePhone({
  phone,
  targetLanguage,
  selectedCountry,
  allowLocalFallback = true,
  strict = false,
}) {
  const phoneRaw = String(phone || "").trim();
  const preferredCountry = getPreferredCountry(targetLanguage, selectedCountry);
  const preferredMeta = META_BY_COUNTRY[preferredCountry] || META_BY_COUNTRY.BE;

  const sanitized = sanitizePhoneInput(phoneRaw);
  let parsedPhone = parsePhone(sanitized, preferredCountry);

  if ((!parsedPhone || !parsedPhone.isValid()) && allowLocalFallback && !sanitized.startsWith("+")) {
    const digits = sanitized.replace(/\D/g, "");
    const local = digits.replace(/^0+/, "");
    if (local) {
      const callingCode = getCountryCallingCode(preferredCountry);
      parsedPhone = parsePhone(`+${callingCode}${local}`, preferredCountry);
    }
  }

  const isValid = !!parsedPhone?.isValid?.();
  const phoneE164 = isValid ? parsedPhone.number : null;
  const chosenMeta = inferMetaFromPhoneNumber(parsedPhone, preferredCountry) || preferredMeta || null;
  const formattedDisplay = isValid ? parsedPhone.formatInternational() : "";
  const validationError = isValid ? "" : "invalid_phone";

  return {
    phone: phoneRaw,
    phoneRaw,
    phoneDisplay: formattedDisplay || phoneRaw || "",
    phoneE164,
    phoneCountry: chosenMeta?.country || preferredCountry || null,
    phoneDialCode: chosenMeta?.dialCode || preferredMeta?.dialCode || null,
    phoneFlag: chosenMeta?.flag || preferredMeta?.flag || null,
    isValid: strict ? isValid : true,
    validationError: strict ? validationError : "",
  };
}

/**
 * Opțiuni pentru selectorul de prefix telefonic (toate țările suportate de libphonenumber).
 * @param {string} [locale] — limbă UI pentru numele țării (ex. fr, nl, en).
 */
export function getCountryPhoneOptions(locale = "en") {
  const key = resolveDisplayLocale(locale);
  if (PHONE_OPTIONS_BY_LOCALE.has(key)) {
    return PHONE_OPTIONS_BY_LOCALE.get(key);
  }
  const built = buildCountryPhoneOptionsForLocale(key);
  PHONE_OPTIONS_BY_LOCALE.set(key, built);
  return built;
}

export function hasStoredPhone(userData) {
  if (!userData || typeof userData !== "object") return false;
  const e164 = String(userData.phoneE164 || "").trim();
  const raw = String(userData.phone || "").trim();
  const rawLegacy = String(userData.phoneRaw || "").trim();
  const display = String(userData.phoneDisplay || "").trim();
  return !!(e164 || raw || rawLegacy || display);
}

export function hasValidatedPhoneBundle(userData) {
  if (!userData || typeof userData !== "object") return false;
  const phoneE164 = String(userData.phoneE164 || "").trim();
  const phoneCountry = String(userData.phoneCountry || "").trim().toUpperCase();
  const phoneDialCode = String(userData.phoneDialCode || "").trim();
  const phoneFlag = String(userData.phoneFlag || "").trim();

  if (!phoneE164.startsWith("+")) return false;
  if (!/^\+\d{6,15}$/.test(phoneE164)) return false;
  if (!/^[A-Z]{2}$/.test(phoneCountry)) return false;
  if (!/^\+\d{1,4}$/.test(phoneDialCode)) return false;
  if (!phoneFlag) return false;

  const meta = META_BY_COUNTRY[phoneCountry];
  if (!meta) return false;
  if (meta.dialCode !== phoneDialCode) return false;

  return true;
}
