"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Importăm pentru a prelua parametrii din URL
import { useAuth } from "@/context/AuthContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
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

  const pollTimeoutRef = useRef(null);
  const inFlightRef = useRef(false);
  const attemptsRef = useRef(0);

  const MAX_POLL_ATTEMPTS = 6;

  const clearPoll = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const fetchSessionDataAndUpdate = async () => {
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        return;
      }

      const currentUid = currentUser?.uid || null;
      if (!currentUid) {
        console.error("Not authenticated");
        return;
      }

      const token = await currentUser?.getIdToken?.();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      // Avoid overlapping calls (React strict-mode / re-renders)
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      const response = await fetch(`/api/get-session?session_id=${session_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionData = await response.json();
      setReservationData(sessionData || null);

      if (sessionData && sessionData.id) {
        // Do not update Firestore unless Stripe confirms payment
        if (sessionData.payment_status !== "paid") {
          attemptsRef.current += 1;
          if (attemptsRef.current <= MAX_POLL_ATTEMPTS) {
            const delayMs = Math.min(
              15000,
              1000 * 2 ** (attemptsRef.current - 1)
            );
            clearPoll();
            pollTimeoutRef.current = setTimeout(() => {
              fetchSessionDataAndUpdate();
            }, delayMs);
          }
          return;
        }

        // Safety: ensure the session belongs to the logged-in user
        const sessionUid = sessionData?.metadata?.uid || null;
        if (!sessionUid || sessionUid !== currentUid) {
          console.error("Forbidden: session does not belong to current user.");
          return;
        }

        // If subscription mode, fetch subscription details (may lag behind)
        let subscriptionDetails = null;
        if (sessionData.subscription) {
          subscriptionDetails = await fetchSubscriptionDetails(
            sessionData.subscription
          );
        }
        const enriched = subscriptionDetails
          ? { ...sessionData, subscriptionDetails }
          : sessionData;

        // If we need subscriptionDetails but don't have it yet, retry a few times.
        if (
          enriched?.mode === "subscription" &&
          enriched?.subscription &&
          !enriched?.subscriptionDetails
        ) {
          attemptsRef.current += 1;
          if (attemptsRef.current <= MAX_POLL_ATTEMPTS) {
            const delayMs = Math.min(
              15000,
              1000 * 2 ** (attemptsRef.current - 1)
            );
            clearPoll();
            pollTimeoutRef.current = setTimeout(() => {
              fetchSessionDataAndUpdate();
            }, delayMs);
          }
          return;
        }

        await updateSubscriptionInFirestore(enriched, currentUid);
      } else {
        console.error("Sesiunea nu a fost găsită în Stripe.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      inFlightRef.current = false;
    }
  };

  // Funcție pentru a obține detaliile abonamentului din Stripe
  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const subscriptionData = await response.json();
      return subscriptionData;
    } catch (error) {
      console.error("Eroare la preluarea detaliilor abonamentului:", error);
    }
  };

  const setCancelAtPeriodEnd = async (subscriptionId) => {
    try {
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("/api/set-cancel-at-period-end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to set cancel_at_period_end");
      }
      return data?.subscription || null;
    } catch (e) {
      console.error("Failed to set cancel_at_period_end:", e);
      return null;
    }
  };

  // Function to update subscription data in Firestore
  const updateSubscriptionInFirestore = async (sessionData, currentUid) => {
    if (!sessionData?.id) return;
    if (!currentUid) return;

    const userDocRef = doc(db, "Users", currentUid);
    try {
      // Idempotency: if this session was already processed, skip
      const snap = await getDoc(userDocRef);
      const processed =
        snap.exists() && Array.isArray(snap.data()?.payments?.processedSessionIds)
          ? snap.data().payments.processedSessionIds
          : [];
      if (processed.includes(sessionData.id)) {
        setIsUpdated(true);
        return;
      }

      // Lifetime purchase (mode=payment) - no Stripe subscription id
      if (
        sessionData?.mode === "payment" &&
        (sessionData?.metadata?.planType === "lifetime" ||
          (sessionData?.metadata?.subName || "")
            .toLowerCase()
            .includes("vie"))
      ) {
        const now = new Date();
        await setDoc(
          userDocRef,
          {
          lifetimeAccess: true,
          lifetimePurchasedAt: now,
          lifetimeSessionId: sessionData.id,
          lifetimeAmount: sessionData.amount_total
            ? sessionData.amount_total / 100
            : null,
          subName: sessionData.metadata?.subName || "Abonnement à vie",
          // Keep existing gating compatible with the app
          subscriptionActive: true,
          subscriptionStatus: "lifetime",
          cancelAtPeriodEnd: false,
          payments: {
            processedSessionIds: arrayUnion(sessionData.id),
            lastProcessedSessionId: sessionData.id,
            lastProcessedAt: serverTimestamp(),
          },
        },
          { merge: true }
        );

        setUserData((prevUserData) => ({
          ...(prevUserData || {}),
          lifetimeAccess: true,
          lifetimePurchasedAt: now,
          lifetimeSessionId: sessionData.id,
          lifetimeAmount: sessionData.amount_total
            ? sessionData.amount_total / 100
            : null,
          subName: sessionData.metadata?.subName || "Abonnement à vie",
          subscriptionActive: true,
          subscriptionStatus: "lifetime",
          cancelAtPeriodEnd: false,
        }));

        setIsUpdated(true);
        return;
      }

      // Subscription purchases need details
      if (!sessionData?.subscription || !sessionData?.subscriptionDetails) {
        return;
      }

      const subscriptionId = sessionData.subscription;
      const wantsNoRenew =
        String(sessionData?.metadata?.cancelAtPeriodEndOnCreate || "").toLowerCase() ===
        "true";

      // If this plan should not renew, enforce cancel_at_period_end after checkout
      // (Stripe Checkout does not support setting it at session create time).
      if (wantsNoRenew && !sessionData.subscriptionDetails?.cancel_at_period_end) {
        const updated = await setCancelAtPeriodEnd(subscriptionId);
        if (updated) {
          sessionData = { ...sessionData, subscriptionDetails: updated };
        }
      }

      const priceId = sessionData.subscriptionDetails?.plan?.id;
      const subscriptionEndDate = new Date(
        sessionData.subscriptionDetails?.current_period_end * 1000
      );

      // Setăm subscriptionStartDate doar la prima actualizare
      const subscriptionStartDate = new Date();

      await setDoc(
        userDocRef,
        {
        subscriptionActive:
          sessionData.subscriptionDetails?.status === "active",
        subscriptionId: subscriptionId,
        priceId: priceId,
        subscriptionAmount: sessionData.amount_total
          ? sessionData.amount_total / 100
          : null,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        subscriptionStatus: sessionData.subscriptionDetails?.status,
        cancelAtPeriodEnd:
          sessionData.subscriptionDetails?.cancel_at_period_end,
        subName: sessionData.metadata.subName,
        payments: {
          processedSessionIds: arrayUnion(sessionData.id),
          lastProcessedSessionId: sessionData.id,
          lastProcessedAt: serverTimestamp(),
        },
      },
        { merge: true }
      );

      setUserData((prevUserData) => ({
        ...(prevUserData || {}),
        subscriptionActive:
          sessionData.subscriptionDetails?.status === "active",
        subscriptionId: subscriptionId,
        priceId: priceId,
        subscriptionAmount: sessionData.amount_total
          ? sessionData.amount_total / 100
          : null,
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
    setLoading(true);
    clearPoll();
    attemptsRef.current = 0;

    if (!session_id || !currentUser?.uid || isUpdated) {
      setLoading(false);
      return;
    }

    fetchSessionDataAndUpdate().finally(() => {
      setLoading(false);
    });

    return () => {
      clearPoll();
    };
  }, [session_id, currentUser?.uid, isUpdated]);

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
