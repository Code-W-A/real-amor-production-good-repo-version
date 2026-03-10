import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";
import * as XLSX from "xlsx";

const SUPPORTED_LANGS = new Set(["fr", "nl", "en"]);

const COLUMN_KEYS = [
  "uid",
  "username",
  "email",
  "phone",
  "phoneE164",
  "phoneCountry",
  "phoneDialCode",
  "phoneFlag",
  "gender",
  "accountStatus",
  "purpose",
  "city",
  "postalCode",
  "country",
  "address",
  "quizCompleted",
  "bookingPaid",
  "bookingScheduled",
  "subscription",
];

const COLUMN_LABELS_BY_LANG = {
  fr: {
    uid: "uid",
    username: "nom_utilisateur",
    email: "email",
    phone: "telephone",
    phoneE164: "telephone_e164",
    phoneCountry: "pays_telephone",
    phoneDialCode: "indicatif_telephone",
    phoneFlag: "drapeau_telephone",
    gender: "genre",
    accountStatus: "statut_compte",
    purpose: "objectif",
    city: "ville",
    postalCode: "code_postal",
    country: "pays",
    address: "adresse",
    quizCompleted: "quiz_complete",
    bookingPaid: "reservation_payee",
    bookingScheduled: "reservation_programmee",
    subscription: "abonnement_actif",
  },
  nl: {
    uid: "uid",
    username: "gebruikersnaam",
    email: "email",
    phone: "telefoon",
    phoneE164: "telefoon_e164",
    phoneCountry: "telefoon_land",
    phoneDialCode: "telefoon_landcode",
    phoneFlag: "telefoon_vlag",
    gender: "geslacht",
    accountStatus: "account_status",
    purpose: "doel",
    city: "stad",
    postalCode: "postcode",
    country: "land",
    address: "adres",
    quizCompleted: "quiz_voltooid",
    bookingPaid: "boeking_betaald",
    bookingScheduled: "boeking_gepland",
    subscription: "abonnement_actief",
  },
  en: {
    uid: "uid",
    username: "username",
    email: "email",
    phone: "phone",
    phoneE164: "phone_e164",
    phoneCountry: "phone_country",
    phoneDialCode: "phone_dial_code",
    phoneFlag: "phone_flag",
    gender: "gender",
    accountStatus: "account_status",
    purpose: "purpose",
    city: "city",
    postalCode: "postal_code",
    country: "country",
    address: "address",
    quizCompleted: "quiz_completed",
    bookingPaid: "booking_paid",
    bookingScheduled: "booking_scheduled",
    subscription: "subscription_active",
  },
};

const VALUE_TEXT_BY_LANG = {
  fr: {
    yes: "oui",
    no: "non",
    active: "actif",
    inactive: "inactif",
    male: "homme",
    female: "femme",
    love: "amour",
    casual: "rencontre",
    friendship: "amitie",
  },
  nl: {
    yes: "ja",
    no: "nee",
    active: "actief",
    inactive: "inactief",
    male: "man",
    female: "vrouw",
    love: "liefde",
    casual: "casual",
    friendship: "vriendschap",
  },
  en: {
    yes: "yes",
    no: "no",
    active: "active",
    inactive: "inactive",
    male: "male",
    female: "female",
    love: "love",
    casual: "casual",
    friendship: "friendship",
  },
};

const EXPORT_FILE_BASENAME_BY_LANG = {
  fr: "utilisateurs-export",
  nl: "gebruikers-export",
  en: "users-export",
};

function escapeCsv(value) {
  const str = value === null || typeof value === "undefined" ? "" : String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function resolveLang(rawLang) {
  const normalized = String(rawLang || "fr")
    .trim()
    .toLowerCase()
    .split("-")[0];
  return SUPPORTED_LANGS.has(normalized) ? normalized : "fr";
}

function mapPurpose(value, texts) {
  if (value === "love") return texts.love;
  if (value === "casual") return texts.casual;
  if (value === "friendship") return texts.friendship;
  return value || "";
}

function mapGender(value, texts) {
  if (value === "male") return texts.male;
  if (value === "female") return texts.female;
  return value || "";
}

function parseLocationFromResponses(responses) {
  if (!responses || typeof responses !== "object") {
    return { city: "", postalCode: "" };
  }

  const sets = Object.values(responses).filter(Array.isArray);
  for (const arr of sets) {
    const q9 = arr.find((q) => Number(q?.id) === 9);
    const answer = String(q9?.answer || "").trim();
    if (!answer) continue;

    // Usually saved as "City, postalCode", but keep it resilient.
    const parts = answer.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const left = parts[0];
      const right = parts[1];
      const leftHasDigits = /\d/.test(left);
      const rightHasDigits = /\d/.test(right);
      if (leftHasDigits && !rightHasDigits) {
        return { city: right, postalCode: left };
      }
      return { city: left, postalCode: right };
    }

    const match = answer.match(/^(.*?)(\d{3,10})$/);
    if (match) {
      return { city: match[1].trim(), postalCode: match[2] };
    }
  }

  return { city: "", postalCode: "" };
}

function inferCountry(data) {
  if (data?.phoneCountry) return String(data.phoneCountry);
  if (data?.targetLanguage === "nl") return "NL";
  return "BE";
}

function computeFunnel(data) {
  const quizCompleted = !!data?.responses;
  const bookingPaid = data?.reservation?.status === "paid";
  const bookingScheduled = data?.reservation?.hasReserved === true;
  const hasSubscription =
    data?.lifetimeAccess === true ||
    data?.subscriptionStatus === "lifetime" ||
    data?.subscriptionStatus === "active" ||
    data?.subscriptionStatus === "canceledUntilEnd" ||
    data?.subscriptionActive === true;

  return {
    quizCompleted,
    bookingPaid,
    bookingScheduled,
    hasSubscription,
  };
}

function toExportRow(uid, data, texts) {
  const location = parseLocationFromResponses(data.responses);
  const funnel = computeFunnel(data);
  return {
    uid,
    username: data.username || "",
    email: data.email || "",
    phone: data.phoneDisplay || data.phone || "",
    phoneE164: data.phoneE164 || "",
    phoneCountry: data.phoneCountry || "",
    phoneDialCode: data.phoneDialCode || "",
    phoneFlag: data.phoneFlag || "",
    gender: mapGender(data.gender, texts),
    accountStatus: data.isActivated ? texts.active : texts.inactive,
    purpose: mapPurpose(data.purpose, texts),
    city: location.city,
    postalCode: location.postalCode,
    country: inferCountry(data),
    address: data.address || "",
    quizCompleted: funnel.quizCompleted ? texts.yes : texts.no,
    bookingPaid: funnel.bookingPaid ? texts.yes : texts.no,
    bookingScheduled: funnel.bookingScheduled ? texts.yes : texts.no,
    subscription: funnel.hasSubscription ? texts.yes : texts.no,
  };
}

function getLocalizedHeaders(lang) {
  const labels = COLUMN_LABELS_BY_LANG[lang] || COLUMN_LABELS_BY_LANG.fr;
  return COLUMN_KEYS.map((key) => labels[key] || key);
}

function getExportFileBaseName(lang) {
  return EXPORT_FILE_BASENAME_BY_LANG[lang] || EXPORT_FILE_BASENAME_BY_LANG.fr;
}

function buildCsv(rows, lang) {
  const headers = getLocalizedHeaders(lang);
  return [
    headers.join(","),
    ...rows.map((row) => COLUMN_KEYS.map((key) => escapeCsv(row[key])).join(",")),
  ].join("\n");
}

function buildXlsxBuffer(rows, lang) {
  const headers = getLocalizedHeaders(lang);
  const aoa = [
    headers,
    ...rows.map((row) => COLUMN_KEYS.map((key) => row[key] || "")),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";
    const format = (searchParams.get("format") || "csv").toLowerCase();
    const lang = resolveLang(searchParams.get("lang"));
    const localizedTexts = VALUE_TEXT_BY_LANG[lang] || VALUE_TEXT_BY_LANG.fr;
    if (format !== "csv" && format !== "xlsx") {
      return NextResponse.json(
        { error: "Unsupported format. Use format=csv or format=xlsx." },
        { status: 400 }
      );
    }

    const snap = await adminDb.collection("Users").get();
    const rows = [];

    for (const doc of snap.docs) {
      const data = doc.data() || {};
      if (!includeDeleted && data?.deletedAccount?.isDeleted) continue;

      rows.push(toExportRow(doc.id, data, localizedTexts));
    }

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const fileBaseName = getExportFileBaseName(lang);
    if (format === "xlsx") {
      const xlsxBuffer = buildXlsxBuffer(rows, lang);
      return new NextResponse(xlsxBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileBaseName}-${ts}.xlsx"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const csv = buildCsv(rows, lang);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileBaseName}-${ts}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("admin-export-users error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

