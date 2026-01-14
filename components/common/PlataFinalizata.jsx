"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { DotLoader } from "react-spinners";

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
  const [reservationData, setReservationData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const searchParams = useSearchParams();
  const session_id = searchParams?.get("session_id");
  const {
    currentUser,
    loading: loadingContext,
    setUserData,
  } = useAuth();

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

      // If Stripe hasn't marked it paid yet, poll a few times
      if (!sessionData || sessionData.payment_status !== "paid") {
        attemptsRef.current += 1;
        if (attemptsRef.current <= MAX_POLL_ATTEMPTS) {
          const delayMs = Math.min(15000, 1000 * 2 ** (attemptsRef.current - 1));
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

      await updateReservationStatus(sessionData, currentUid);
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      inFlightRef.current = false;
    }
  };

  const updateReservationStatus = async (sessionData, currentUid) => {
    try {
      if (!sessionData?.id) return;
      if (!currentUid) return;

      const userRef = doc(db, "Users", currentUid);

      // Idempotency: if this session was already processed, skip
      const snap = await getDoc(userRef);
      const processed =
        snap.exists() && Array.isArray(snap.data()?.payments?.processedSessionIds)
          ? snap.data().payments.processedSessionIds
          : [];
      if (processed.includes(sessionData.id)) {
        setIsUpdated(true);
        return;
      }

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
        reservation: rez,
      }));
      setIsUpdated(true);
    } catch (error) {
      console.error("Eroare la actualizarea rezervării în Firestore:", error);
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
      // Stop spinner once we have either processed or have a session object to show
      setLoading(false);
    });

    return () => {
      clearPoll();
    };
    // Only re-run when the session or authenticated user changes
  }, [session_id, currentUser?.uid, isUpdated]);

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
