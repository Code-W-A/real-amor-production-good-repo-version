// app/api/calendly-webhook/route.js
import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(request) {
  try {
    const event = await request.json();

    // Verificăm dacă evenimentul este `invitee.created`
    if (event.event === "invitee.created") {
      const { email } = event.payload.invitee;

      // Găsim documentul utilizatorului în Firestore pe baza emailului (sau UID-ului, dacă este transmis de Calendly)
      const userRef = doc(db, "Users", email); // Înlocuiește cu UID, dacă ai UID-ul în event.payload

      // Actualizăm câmpul reservation.hasReserved la true
      await updateDoc(userRef, {
        "reservation.hasReserved": true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Eroare la procesarea webhook-ului Calendly:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
