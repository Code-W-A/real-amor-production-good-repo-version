import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebaseAdmin";
import {
  buildPasswordResetEmail,
  normalizePasswordResetLocale,
} from "../_utils/passwordResetEmail";
import { sendMail } from "../_utils/mailer";

export const runtime = "nodejs";

const APP_NAME = "Real Amor";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getBaseUrl(request) {
  const configuredUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  try {
    return new URL(request.url).origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

async function getUserPreferredLocale(uid) {
  try {
    const snapshot = await adminDb.collection("Users").doc(uid).get();
    const targetLanguage = snapshot.exists
      ? snapshot.data()?.targetLanguage
      : null;

    return normalizePasswordResetLocale(targetLanguage, "fr");
  } catch (error) {
    console.error("password-reset-request locale lookup error:", error);
    return "fr";
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const requestedLocale = normalizePasswordResetLocale(body?.locale, null);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      throw error;
    }

    const locale =
      requestedLocale || (await getUserPreferredLocale(userRecord.uid)) || "fr";
    const baseUrl = getBaseUrl(request);
    if (!baseUrl) {
      throw new Error("Missing base URL for password reset flow");
    }
    const continueUrl = new URL(`/${locale}/login`, `${baseUrl}/`).toString();
    let resetLink;
    try {
      resetLink = await adminAuth.generatePasswordResetLink(email, {
        url: continueUrl,
      });
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      throw error;
    }

    const emailContent = buildPasswordResetEmail({
      locale,
      appName: APP_NAME,
      email,
      link: resetLink,
    });

    await sendMail({
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("password-reset-request error:", error);
    return NextResponse.json(
      { error: "Unable to send password reset email" },
      { status: 500 }
    );
  }
}
