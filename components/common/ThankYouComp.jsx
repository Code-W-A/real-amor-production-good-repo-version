"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function ThankYouReservation({
  reservationTitle,
  reservationText,
  reservationConfirmation,
  approvalPendingText,
  loadingText,
  successText,
  homePageText,
  detailsText,
  nameText,
  emailText,
  phoneText,
  dateText,
  timeText,
}) {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reservationDetails, setReservationDetails] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Simulează preluarea datelor pentru rezervare (dacă este necesar)
    const fetchReservationDetails = async () => {
      setLoading(false);
      setReservationDetails({
        name: userData?.username,
        email: userData?.email,
        phone: userData?.phone,
        date: "Data programată", // Exemplu, trebuie înlocuit cu date reale din rezervare
        time: "Ora programată", // Exemplu, trebuie înlocuit cu date reale din rezervare
      });
    };

    fetchReservationDetails();
  }, [userData]);

  return (
    <section className="layout-pt-lg pt-10 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">{reservationTitle}</h2>
              <p className="sectionTitle__text">{reservationText}</p>
            </div>

            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {reservationConfirmation}
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
                  ) : reservationDetails ? (
                    <>{successText}</>
                  ) : (
                    <p>Rezervarea nu a fost finalizată.</p>
                  )}
                </div>

                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    <div className="col-auto">
                      {currentUser?.uid && userData?.username && (
                        <button
                          className="button px-40 py-20 fw-500 -purple-1 text-white"
                          onClick={() => router.push("/profil-client")} // Redirecționează la pagina principală
                        >
                          {homePageText}
                        </button>
                      )}
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
