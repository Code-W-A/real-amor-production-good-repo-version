"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { pricingData } from "../../data/pricing";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import { DotLoader } from "react-spinners";

// Verifică dacă variabila de mediu este definită
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
);

export default function Pricing({
  bookingText,
  paymentOneTimeText,
  oneTimeFeature1,
  oneTimeFeature2,
  oneTimeFeature3,
  oneTimeFeature4,
  getStarted,
  acceptTermsText,
  translatedLinks,
}) {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false); // Starea pentru a controla butonul de încărcare
  const [isAccepted, setIsAccepted] = useState(false); // Stare pentru checkbox-ul de termeni și condiții
  const [isRedirecting, setIsRedirecting] = useState(true); // Stare pentru checkbox-ul de termeni și condiții
  const router = useRouter();
  const { currentUser, loading: loadingContext, userData } = useAuth();

  const handleCheckboxChange = (event) => {
    setIsAccepted(event.target.checked); // Actualizează starea când checkbox-ul este bifat
  };

  // Funcția de inițiere a checkout-ului
  const initiateCheckout = async (price) => {
    if (!isAccepted) return; // Dacă checkbox-ul nu este bifat, nu permite inițierea checkout-ului

    try {
      if (!stripePromise) {
        throw new Error(
          "Stripe is not initialized. Please check your API key."
        );
      }
      console.log(".....", {
        costRezervare: price * 100, // Convertim în bani (de exemplu, 10000 pentru 100 RON)
        nume: userData.username,
        email: userData.email, // Aici poți adăuga un email dintr-o stare sau context al utilizatorului
        phone: userData.phone,
        uid: userData.uid, // UID-ul utilizatorului, dacă este disponibil
      });
      const stripe = await stripePromise;
      setLoading(true); // Setează loading la true înainte de a face cererea

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          costRezervare: price * 100, // Convertim în bani (de exemplu, 10000 pentru 100 RON)
          nume: userData.username,
          email: userData.email, // Aici poți adăuga un email dintr-o stare sau context al utilizatorului
          phone: userData.phone,
          uid: userData.uid, // UID-ul utilizatorului, dacă este disponibil
        }),
      });

      if (!response.ok) {
        throw new Error(`Eroare: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (data.id) {
        // Redirectează utilizatorul la sesiunea de checkout Stripe
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Eroare la inițierea checkout-ului");
      }
    } catch (error) {
      console.error("Eroare la inițierea checkout-ului", error);
      alert(`Eroare: ${error.message}`);
    } finally {
      setLoading(false); // Resetează starea loading
    }
  };

  useEffect(() => {
    if (loadingContext) {
      setIsRedirecting(true); // Afișăm spinnerul cât timp loadingContext este true
    } else if (!userData?.username) {
      router.push("/signup");
    } else if (
      userData?.reservation?.status === "paid" &&
      !userData?.reservation?.hasReserved
    ) {
      router.push("/booking");
    } else if (userData?.reservation?.hasReserved) {
      router.push("/profil-client");
    } else if (!userData?.responses) {
      router.push("/quiz");
    } else {
      setIsRedirecting(false); // Ascundem spinnerul după ce verificările s-au finalizat
    }
  }, [loadingContext, userData, router]);

  // Afișează spinnerul pe centrul ecranului dacă este în stare de redirect
  if (isRedirecting) {
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
    <section className="layout-pt-lg pt-40 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title ">{bookingText}</h2>
            </div>
            {/* Toggle pentru anual/lunar */}
            {/* <div className="d-flex justify-center items-center pt-60 lg:pt-40">
              <div className="text-14 text-dark-1">Monthly</div>
              <div className="form-switch px-20">
                <div className="switch" data-switch=".js-switch-content">
                  <input
                    checked={isYearly}
                    onChange={handleCheckboxChange}
                    type="checkbox"
                  />
                  <span className="switch__slider"></span>
                </div>
              </div>
              <div className="text-14 text-dark-1">
                Annually <span className="text-purple-1">Save 30%</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Carduri de prețuri */}
        <div className="row y-gap-30 justify-center pt-60 lg:pt-40">
          <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {paymentOneTimeText}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  {isYearly ? (5 * 12 * 0.7).toFixed(2) : 159} Euro
                </div>

                <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/3.svg"
                  alt="icon"
                />
                <div className="priceCard__text text-left pr-15 mt-40">
                  {translatedLinks.bookingText}
                </div>

                {/* <div className="text-left y-gap-15 mt-35">
                  <div>
                    <i
                      className="text-purple-1 fa fa-check pr-8"
                      style={{ strokeWidth: 2 }}
                      data-feather="check"
                    ></i>
                    {oneTimeFeature1}
                  </div>
                  <div>
                    <i
                      className="text-purple-1 fa fa-check pr-8"
                      style={{ strokeWidth: 2 }}
                      data-feather="check"
                    ></i>
                    {oneTimeFeature2}
                  </div>
                  <div>
                    <i
                      className="text-purple-1 fa fa-check pr-8"
                      style={{ strokeWidth: 2 }}
                      data-feather="check"
                    ></i>
                    {oneTimeFeature3}
                  </div>
                  <div>
                    <i
                      className="text-purple-1 fa fa-check pr-8"
                      style={{ strokeWidth: 2 }}
                      data-feather="check"
                    ></i>
                    {oneTimeFeature4}
                  </div>
                </div> */}

                {/* Casetă pentru acceptarea termenilor și condițiilor */}
                <div className="terms-acceptance mt-20">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAccepted}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                {/* Butonul Get Started, activ doar când checkbox-ul este bifat */}
                <div className="d-inline-block mt-30">
                  {/* Butonul dezactivat */}
                  {!isAccepted && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}

                  {/* Butonul activ */}
                  {isAccepted && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() => initiateCheckout(159)}
                    >
                      {getStarted}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
