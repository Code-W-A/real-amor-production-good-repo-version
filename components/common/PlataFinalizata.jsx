"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, authentication } from "@/firebase"; // Asigură-te că ai importat `authentication`
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Importă metodele pentru reautentificare
import { DotLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage({
  paymentTitle,
  paymentText,
  paymentConfirmation,
  loadingText,
  successText,
  continueBookingText,
  detaliiRezervareText,
  nameText,
  emailText,
  phoneText,
  amountPaidText,
}) {
  const [loading, setLoading] = useState(true);
  const [takingInfo, setTakingInfo] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const searchParams = useSearchParams();
  const session_id = searchParams?.get("session_id");
  const router = useRouter();
  const {
    currentUser,
    loading: loadingContext,
    userData,
    setUserData,
    setCurrentUser,
  } = useAuth();

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/get-session?session_id=${session_id}`);
      const sessionData = await response.json();

      // if (sessionData && sessionData.payment_status === "paid") {
      //ADAUGAT VERIFICARE USERDATA PENTRU A VEDEA DACA REZOLVA PROBLEMA CU PERSISTENTA INFO UTILIZATORI
      if (sessionData && sessionData.payment_status === "paid" && userData) {
        setReservationData(sessionData);
        await updateReservationStatus(sessionData);
      } else {
        console.error("Plata nu a fost finalizată.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      setLoading(false);
      // router.push("/login");
    }
  };

  const updateReservationStatus = async (sessionData) => {
    try {
      // adaugat pentru a verifica daca rezolva eroarea cu informatiile utilizatorului
      if (!userData || !userData.uid) {
        console.log("User data or UID missing.");
        return;
      }
      const userRef = doc(db, "Users", sessionData.metadata.uid);
      const rez = {
        hasReserved: false,
        status: "paid",
        sessionId: sessionData.id,
        createdAt: new Date().toISOString(),
        cost: sessionData.amount_total / 100,
      };
      await setDoc(
        userRef,
        {
          reservation: rez,
        },
        { merge: true }
      ).then(() => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          reservation: rez,
        }));
        setIsUpdated(true);
      });
    } catch (error) {
      console.error("Eroare la actualizarea rezervării în Firestore:", error);

      // Solicită reautentificare în caz de eroare de permisiune
      if (error.code === "auth/requires-recent-login") {
        alert("Pentru a continua, este necesară reautentificarea.");
        await reauthenticateUser();
      }
    }
  };

  useEffect(() => {
    if (!isUpdated) {
      fetchSessionData();
    }
  }, [session_id, userData, isUpdated]);
  //ADAUGAT PENTRU A VERIFICARE EROARE UTILIZATOR DATE PERSISTENTA
  // }, [session_id, userData]);

  if (loadingContext || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <DotLoader color="#c13365" size={60} />
      </div>
    );
  }

  return (
    <section className="layout-pt-lg pt-10 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">{paymentTitle}</h2>
              <p className="sectionTitle__text">{paymentText}</p>
            </div>

            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {paymentConfirmation}
                </div>
                <Image
                  width={150}
                  height={150}
                  className="mt-30"
                  src="/assets/img/confirmare-plata.png"
                  alt="success-icon"
                />
                <div className="priceCard__text text-center pr-15 mt-40">
                  {loading ? (
                    loadingText
                  ) : reservationData ? (
                    <>
                      {successText}
                      <p>
                        {detaliiRezervareText}
                        <br />
                        <strong>{amountPaidText}:</strong>{" "}
                        {reservationData.amount_total / 100} EURO
                      </p>
                    </>
                  ) : (
                    <p>Plata nu a fost finalizată.</p>
                  )}
                </div>

                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    <div className="col-auto">
                      <Link href="/booking">
                        <button className="button px-40 py-20 fw-500 -purple-1 text-white">
                          {continueBookingText}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
