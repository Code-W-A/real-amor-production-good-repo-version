import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import {
  buildPasswordResetEmail,
  normalizePasswordResetLocale,
} from "../_utils/passwordResetEmail";
import { sendMail } from "../_utils/mailer";
import { getSafeOrigin } from "../_utils/requestOrigin";

export const runtime = "nodejs";

const APP_NAME = "Real Amor";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Limba pentru conținutul e-mailului (fr|nl) din profilul Firestore.
 * Returnează null dacă nu există preferință clară — atunci folosim locale din URL sau "fr".
 */
async function getUserMailLocaleFromFirestore(uid) {
  try {
    const snapshot = await adminDb.collection("Users").doc(uid).get();
    const targetLanguage = snapshot.exists
      ? snapshot.data()?.targetLanguage
      : null;
    return normalizePasswordResetLocale(targetLanguage, null);
  } catch (error) {
    console.error("password-reset-request locale lookup error:", error);
    return null;
  }
}

function classifyResetError(error) {
  const msg = String(error?.message || error || "");
  const firebaseCode = error?.errorInfo?.code || error?.code || "";

  if (msg.includes("Missing base URL") || msg.includes("Missing base url")) {
    return {
      code: "MISSING_BASE_URL",
      clientMessage:
        "Server configuration error: could not determine site URL. Set APP_ORIGIN or NEXT_PUBLIC_APP_URL (e.g. http://localhost:3000).",
    };
  }
  if (
    msg.includes("Missing SMTP_HOST") ||
    msg.includes("Missing SMTP_USER") ||
    msg.includes("Missing SMTP_PASS") ||
    msg.includes("Missing MAIL_FROM") ||
    msg.includes("Invalid SMTP_PORT") ||
    msg.includes("Missing SMTP_PORT")
  ) {
    return {
      code: "SMTP_CONFIG",
      clientMessage:
        "Email not configured: add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM to .env.local.",
    };
  }
  if (
    msg.includes("EAUTH") ||
    msg.includes("535") ||
    msg.includes("534") ||
    msg.includes("Invalid login") ||
    msg.includes("Authentication failed") ||
    msg.includes("nodemailer") ||
    msg.includes("Greeting never received") ||
    msg.includes("Connection closed unexpectedly") ||
    msg.includes("ECONNECTION") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ESOCKET") ||
    msg.includes("certificate") ||
    msg.includes("TLS")
  ) {
    return {
      code: "SMTP_SEND_FAILED",
      clientMessage:
        "The reset link was created but the email could not be sent (SMTP error). Check credentials, port, and firewall.",
    };
  }
  if (
    firebaseCode === "auth/unauthorized-continue-uri" ||
    msg.includes("unauthorized-continue-uri") ||
    msg.includes("Unauthorized continue uri")
  ) {
    return {
      code: "FIREBASE_CONTINUE_URI",
      clientMessage:
        "Firebase rejected the return URL. Add http://localhost:3000 (and your domain) under Authentication → Settings → Authorized domains.",
    };
  }
  if (
    String(firebaseCode).startsWith("auth/") ||
    msg.includes("Firebase ID token") ||
    msg.includes("Firebase Auth")
  ) {
    return {
      code: "FIREBASE_AUTH",
      clientMessage:
        "Could not create the password reset link. Check Firebase Admin credentials and project ID.",
    };
  }
  return { code: "UNKNOWN", clientMessage: "Unable to send password reset email" };
}

function errorDetailForLog(error) {
  const parts = [
    error?.message,
    error?.code,
    error?.errorInfo?.code,
    error?.responseCode != null ? `responseCode=${error.responseCode}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" | ") : String(error);
}

export async function POST(request) {
  const logPrefix = "[password-reset-request]";
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const requestedLocale = normalizePasswordResetLocale(body?.locale, null);

    console.info(`${logPrefix} start`, {
      emailHint: email ? `${email.slice(0, 2)}***@${email.split("@")[1] || "?"}` : "(empty)",
      localeFromBody: body?.locale ?? null,
    });

    if (!isValidEmail(email)) {
      console.warn(`${logPrefix} invalid email format`);
      return NextResponse.json({ error: "Invalid email", code: "INVALID_EMAIL" }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        console.info(`${logPrefix} user not found (opaque success)`);
        return NextResponse.json({ success: true }, { status: 200 });
      }
      console.error(`${logPrefix} getUserByEmail failed`, error?.code, error?.message);
      throw error;
    }

    const mailLocale =
      (await getUserMailLocaleFromFirestore(userRecord.uid)) ||
      requestedLocale ||
      "fr";
    const baseUrl = getSafeOrigin(request);
    console.info(`${logPrefix} resolved`, {
      mailLocale,
      localeFromRequestBody: body?.locale ?? null,
      baseUrl: baseUrl || "(missing)",
      host: request.headers.get("host"),
      xForwardedHost: request.headers.get("x-forwarded-host"),
      xForwardedProto: request.headers.get("x-forwarded-proto"),
    });

    if (!baseUrl) {
      throw new Error("Missing base URL for password reset flow");
    }
    const continueUrl = new URL(`/${mailLocale}/login`, `${baseUrl}/`).toString();
    let resetLink;
    try {
      resetLink = await adminAuth.generatePasswordResetLink(email, {
        url: continueUrl,
      });
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      console.error(`${logPrefix} generatePasswordResetLink failed`, error?.code, error?.message);
      throw error;
    }

    console.info(`${logPrefix} link generated, continueUrl length`, continueUrl.length);

    const emailContent = buildPasswordResetEmail({
      locale: mailLocale,
      appName: APP_NAME,
      email,
      link: resetLink,
    });

    console.info(`${logPrefix} email template`, {
      mailLocale,
      subject: emailContent.subject,
    });

    try {
      await sendMail({
        to: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });
    } catch (mailErr) {
      console.error(`${logPrefix} sendMail failed`, mailErr?.message, mailErr?.code || mailErr?.responseCode);
      throw mailErr;
    }

    console.info(`${logPrefix} mail sent OK (locale=${mailLocale})`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`${logPrefix} error:`, errorDetailForLog(error), error?.stack || "");
    const { code, clientMessage } = classifyResetError(error);
    const includeDetail =
      process.env.NODE_ENV !== "production" ||
      process.env.PASSWORD_RESET_DEBUG === "1";
    return NextResponse.json(
      {
        success: false,
        error: clientMessage,
        code,
        detail: includeDetail ? errorDetailForLog(error) : undefined,
      },
      { status: 500 }
    );
  }
}
