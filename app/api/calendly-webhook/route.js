import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    const event = await request.json();

    if (event?.event !== "invitee.created") {
      return NextResponse.json({ success: true });
    }

    const email = String(event?.payload?.invitee?.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Missing invitee email" }, { status: 400 });
    }

    const usersSnap = await adminDb
      .collection("Users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (usersSnap.empty) {
      console.warn("Calendly webhook: user not found for email", email);
      return NextResponse.json({ success: true, updated: false });
    }

    const userRef = usersSnap.docs[0].ref;
    await userRef.set(
      {
        reservation: {
          hasReserved: true,
          scheduledAt: FieldValue.serverTimestamp(),
          calendlyEventUri: event?.payload?.event || null,
          inviteeUri: event?.payload?.invitee?.uri || null,
        },
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, updated: true });
  } catch (error) {
    console.error("Eroare la procesarea webhook-ului Calendly:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
