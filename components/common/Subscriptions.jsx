// Exemplu completat pentru integrarea cu priceId
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import DotLoader from "react-spinners/DotLoader";

// Cheia publică Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
);

export default function Subscriptions({
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
  // Un array care va reține starea pentru fiecare checkbox de pe card
  const [isAccepted, setIsAccepted] = useState([false, false, false]);
  const [loading, setLoading] = useState(false); // Stare pentru a controla butonul de încărcare
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const {
    currentUser,
    loading: loadingContext,
    userData,
    setUserData,
  } = useAuth();

  // Funcția de schimbare a stării unui checkbox
  const handleCheckboxChange = (index) => {
    const newIsAccepted = [...isAccepted];
    newIsAccepted[index] = !newIsAccepted[index]; // Inversăm starea pentru checkbox-ul corespunzător
    setIsAccepted(newIsAccepted);
  };

  // Funcția de inițiere a checkout-ului
  const initiateCheckout = async (priceId, index, subName) => {
    if (!isAccepted[index]) return; // Dacă checkbox-ul pentru cardul respectiv nu este bifat, nu permite inițierea checkout-ului

    try {
      if (!stripePromise) {
        throw new Error(
          "Stripe is not initialized. Please check your API key."
        );
      }

      const stripe = await stripePromise;
      setLoading(true); // Setează loading la true înainte de a face cererea

      const response = await fetch("/api/create-checkout-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId, // Trimitem priceId-ul corect pentru planul selectat
          nume: userData.username,
          email: userData.email,
          phone: userData.phone,
          uid: userData.uid,
          subName,
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
      setIsRedirecting(true);
    } else if (!userData?.username) {
      router.push("/signup");
    } else if (!userData?.isActivated) {
      router.push("/profil-client");
    } else {
      setIsRedirecting(false);
    }
  }, [loadingContext, userData, router]);

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
              <h2 className="sectionTitle__title mb-10">
                {translatedLinks.bookingTextPrim}
              </h2>
              <h3>{bookingText}</h3>
              <h3>{translatedLinks.bookingText2}</h3>
            </div>
          </div>
        </div>

        {/* Carduri de prețuri */}
        <div className="row y-gap-30 justify-center pt-60 lg:pt-40">
          {/* Card 1 - Basic Plan */}
          {/* <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  ABONAMENT TEST
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  1 Euro / MONTH
                </div>

                <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/1.svg"
                  alt="icon"
                />
                <div className="text-left y-gap-15 mt-35">
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature1}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature2}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature3}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature4}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature5}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature6}
                  </div>
                </div>

                <div className="terms-acceptance mt-20">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAccepted[0]}
                      onChange={() => handleCheckboxChange(0)}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                <div className="d-inline-block mt-30">
                  {!isAccepted[0] && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}

                  {isAccepted[0] && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() =>
                        initiateCheckout(
                          "price_1QHP25KKcy7exYrbKfuDuuH1",
                          0,
                          "ABONAMENT TEST"
                        )
                      }
                    >
                      {getStarted}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div> */}
          {/* Card 1 - Basic Plan */}
          <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament3}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  139 Euro / {translatedLinks.monthText}
                </div>

                {/* <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/1.svg"
                  alt="icon"
                /> */}
                <div className="text-left y-gap-15 mt-35">
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature1}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature2}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature3}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature4}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature5}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature6}
                  </div>
                </div>

                <div className="terms-acceptance mt-20">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAccepted[0]}
                      onChange={() => handleCheckboxChange(0)}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                <div className="d-inline-block mt-30">
                  {!isAccepted[0] && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}

                  {isAccepted[0] && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() =>
                        initiateCheckout(
                          "price_1QJK6PKKcy7exYrbPL8F9ONA",
                          0,
                          translatedLinks.abonament3
                        )
                      }
                    >
                      {getStarted}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Pro Plan */}
          <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament6}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  109 Euro / {translatedLinks.monthText}
                </div>

                {/* <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/2.svg"
                  alt="icon"
                /> */}
                <div className="text-left y-gap-15 mt-35">
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature1}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature2}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature3}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature4}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature5}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature6}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature7}
                  </div>
                </div>

                <div className="terms-acceptance mt-20">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAccepted[1]}
                      onChange={() => handleCheckboxChange(1)}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                <div className="d-inline-block mt-30">
                  {!isAccepted[1] && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}
                  {isAccepted[1] && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() =>
                        initiateCheckout(
                          "price_1QJK7KKKcy7exYrbBWNkHnS4",
                          1,
                          translatedLinks.abonament6
                        )
                      }
                    >
                      {getStarted}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Card 3 - Pro Plan */}
          <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament12}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  89 Euro / {translatedLinks.monthText}
                </div>

                {/* <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/2.svg"
                  alt="icon"
                /> */}
                <div className="text-left y-gap-15 mt-35">
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature1}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature2}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature3}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature4}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature5}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature6}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature7}
                  </div>
                  <div>
                    <i className="text-purple-1 fa fa-check pr-8"></i>
                    {translatedLinks.oneTimeFeature8}
                  </div>
                </div>

                <div className="terms-acceptance mt-20">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAccepted[2]}
                      onChange={() => handleCheckboxChange(2)}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                <div className="d-inline-block mt-30">
                  {!isAccepted[2] && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}
                  {isAccepted[2] && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() =>
                        initiateCheckout(
                          "price_1QJK8tKKcy7exYrbPfh2vZUl",
                          2,
                          translatedLinks.abonament12
                        )
                      }
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
