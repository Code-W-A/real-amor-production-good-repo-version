import { getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";

const COUNTRY_PHONE_META = [
  { country: "BE", dialCode: "+32", name: "Belgique", flag: "🇧🇪" },
  { country: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { country: "NL", dialCode: "+31", name: "Nederland", flag: "🇳🇱" },
  { country: "RO", dialCode: "+40", name: "Romania", flag: "🇷🇴" },
  { country: "DE", dialCode: "+49", name: "Deutschland", flag: "🇩🇪" },
  { country: "ES", dialCode: "+34", name: "Espana", flag: "🇪🇸" },
  { country: "IT", dialCode: "+39", name: "Italia", flag: "🇮🇹" },
  { country: "PT", dialCode: "+351", name: "Portugal", flag: "🇵🇹" },
  { country: "LU", dialCode: "+352", name: "Luxembourg", flag: "🇱🇺" },
  { country: "CH", dialCode: "+41", name: "Suisse", flag: "🇨🇭" },
  { country: "AT", dialCode: "+43", name: "Osterreich", flag: "🇦🇹" },
  { country: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { country: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { country: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
];

const META_BY_COUNTRY = COUNTRY_PHONE_META.reduce((acc, item) => {
  acc[item.country] = item;
  return acc;
}, {});

const META_BY_DIAL_SORTED = [...COUNTRY_PHONE_META].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
);

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
    // Keep legacy field semantics for existing UI.
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

export function getCountryPhoneOptions() {
  return COUNTRY_PHONE_META.map((item) => ({
    country: item.country,
    dialCode: item.dialCode,
    label: `${item.flag} ${item.name} (${item.dialCode})`,
  }));
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

