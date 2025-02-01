"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Importăm pentru a prelua parametrii din URL
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Asigură-te că importul către Firebase este corect

export default function SubscriptionSuc({
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
  const [reservationData, setReservationData] = useState(null);
  const searchParams = useSearchParams(); // Utilizăm useSearchParams pentru a obține parametrii URL
  const session_id = searchParams?.get("session_id"); // Obținem session_id din URL
  const {
    currentUser,
    loading: loadingContext,
    userData,
    setUserData,
  } = useAuth();
  const router = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  const fetchSessionData = async () => {
    console.log("Fetching session data...");
    setLoading(true);
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        setLoading(false);
        return;
      }

      console.log(`Fetching session data for session_id: ${session_id}`);
      const response = await fetch(`/api/get-session?session_id=${session_id}`);
      const sessionData = await response.json();
      console.log("Session data received:", sessionData);

      if (sessionData && sessionData.id) {
        setReservationData(sessionData);
        console.log("Session data set to state.");

        // Dacă sessionData conține un ID de abonament, îl preluăm separat
        if (sessionData.subscription) {
          const subscriptionDetails = await fetchSubscriptionDetails(
            sessionData.subscription
          );
          console.log("Subscription details received:", subscriptionDetails);

          // Adăugăm detaliile abonamentului în starea componentului
          setReservationData((prevState) => ({
            ...prevState,
            subscriptionDetails,
          }));
        }
      } else {
        console.error("Sesiunea nu a fost găsită în Stripe.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funcție pentru a obține detaliile abonamentului din Stripe
  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`
      );
      const subscriptionData = await response.json();
      return subscriptionData;
    } catch (error) {
      console.error("Eroare la preluarea detaliilor abonamentului:", error);
    }
  };

  // Function to update subscription data in Firestore
  // Function to update subscription data in Firestore
  const updateSubscriptionInFirestore = async (sessionData) => {
    if (!userData || !userData.uid) {
      console.log("User data or UID missing.");
      return;
    }

    const userDocRef = doc(db, "Users", userData.uid);
    try {
      const subscriptionId = sessionData.subscription;
      const priceId = sessionData.subscriptionDetails?.plan?.id;
      const subscriptionEndDate = new Date(
        sessionData.subscriptionDetails?.current_period_end * 1000
      );

      // Setăm subscriptionStartDate doar la prima actualizare
      const subscriptionStartDate = new Date();

      console.log("Updating Firestore with subscription details...");

      await updateDoc(userDocRef, {
        subscriptionActive:
          sessionData.subscriptionDetails?.status === "active",
        subscriptionId: subscriptionId,
        priceId: priceId,
        subscriptionAmount: sessionData.amount_total / 100,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        subscriptionStatus: sessionData.subscriptionDetails?.status,
        cancelAtPeriodEnd:
          sessionData.subscriptionDetails?.cancel_at_period_end,
        subName: sessionData.metadata.subName,
      });

      console.log("Subscription details updated in Firestore:", {
        subscriptionActive:
          sessionData.subscriptionDetails?.status === "active",
        subscriptionId,
        priceId,
        subscriptionAmount: sessionData.amount_total / 100,
        subscriptionStartDate,
        subscriptionEndDate,
        subscriptionStatus: sessionData.subscriptionDetails?.status,
        cancelAtPeriodEnd:
          sessionData.subscriptionDetails?.cancel_at_period_end,
      });

      setUserData((prevUserData) => ({
        ...prevUserData,
        subscriptionActive:
          sessionData.subscriptionDetails?.status === "active",
        subscriptionId: subscriptionId,
        priceId: priceId,
        subscriptionAmount: sessionData.amount_total / 100,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        subscriptionStatus: sessionData.subscriptionDetails?.status,
        cancelAtPeriodEnd:
          sessionData.subscriptionDetails?.cancel_at_period_end,
      }));
      setIsUpdated(true);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  useEffect(() => {
    if (reservationData && userData && !isUpdated) {
      console.log("Ready to update Firestore with reservation data...");
      updateSubscriptionInFirestore(reservationData);
    } else {
      console.log("Waiting for data or already updated...");
    }
  }, [reservationData, userData, isUpdated]);

  useEffect(() => {
    if (session_id) {
      console.log("Session ID found:", session_id); // Log dacă este găsit session_id
      fetchSessionData(); // Fetch and save session data when session_id is available
    } else {
      console.log("No session ID found in URL.");
    }
  }, [session_id]);

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("User data missing or still loading:", userData); // Log dacă nu există datele utilizatorului
    }
  }, [loadingContext]);

  return (
    <section className="layout-pt-lg pt-10 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10 mt-20">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">{paymentTitle}</h2>
              <p className="sectionTitle__text">{paymentText}</p>
            </div>

            {/* Payment confirmation card */}
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
                    <p>{loadingText}</p>
                  ) : (
                    <>
                      <p>{successText}</p>
                      {reservationData && (
                        <>
                          <p>
                            {detaliiRezervareText}
                            <br />
                            <strong>{nameText}:</strong> {userData?.username}
                            <br />
                            <strong>{emailText}:</strong> {userData?.email}
                            <br />
                            <strong>{phoneText}:</strong> {userData?.phone}
                            <br />
                            <strong>{amountPaidText}:</strong>{" "}
                            {reservationData.amount_total / 100} EURO
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Buttons for navigation */}
                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    <div className="col-auto">
                      <button
                        onClick={() => router.push("/profil-client")}
                        className="button px-40 py-20 fw-500 -purple-1 text-white"
                      >
                        {continueBookingText}
                      </button>
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
