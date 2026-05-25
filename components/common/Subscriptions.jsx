// Exemplu completat pentru integrarea cu priceId
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DotLoader from "react-spinners/DotLoader";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { withLocalePath } from "@/utils/routeLocale";
import { getPhoneDisplayForUi } from "@/utils/phoneUtils";
import AlertBox from "@/components/uiElements/AlertBox";
import {
  computePlanPricing,
  getDefaultPerPlanDiscountPercent,
  normalizePerPlanDiscountPercent,
} from "@/app/api/_utils/manualPayments";

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
  const [isAccepted, setIsAccepted] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [loading, setLoading] = useState(false); // Stare pentru a controla butonul de încărcare
  const [promoLoading, setPromoLoading] = useState(true);
  const [perPlanDiscountPercent, setPerPlanDiscountPercent] = useState(
    getDefaultPerPlanDiscountPercent()
  );
  const [globalLifetimePromoEnabled, setGlobalLifetimePromoEnabled] =
    useState(false);
  const [showLifetimeFloater, setShowLifetimeFloater] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const { currentUser, loading: loadingContext, userData } = useAuth();

  useEffect(() => {
    const loadPromo = async () => {
      setPromoLoading(true);
      try {
        const snap = await getDoc(doc(db, "Config", "subscriptionPromo"));
        if (snap.exists()) {
          const data = snap.data();
          setPerPlanDiscountPercent(
            normalizePerPlanDiscountPercent(data?.perPlanDiscountPercent)
          );
          setGlobalLifetimePromoEnabled(!!data?.lifetimePromoEnabled);
        } else {
          setPerPlanDiscountPercent(getDefaultPerPlanDiscountPercent());
          setGlobalLifetimePromoEnabled(false);
        }
      } catch {
        setPerPlanDiscountPercent(getDefaultPerPlanDiscountPercent());
        setGlobalLifetimePromoEnabled(false);
      } finally {
        setPromoLoading(false);
      }
    };
    loadPromo();
  }, []);

  // Per-user override:
  // - true => force show lifetime
  // - false => force hide lifetime
  // - undefined => follow global config
  const userLifetimeOfferEnabled =
    typeof userData?.lifetimeOfferEnabled === "boolean"
      ? userData.lifetimeOfferEnabled
      : null;
  const lifetimePromoEnabled =
    userLifetimeOfferEnabled === true
      ? true
      : userLifetimeOfferEnabled === false
      ? false
      : globalLifetimePromoEnabled;

  // Show/hide the lifetime "floater" button based on whether the lifetime section is in view.
  useEffect(() => {
    if (!lifetimePromoEnabled) {
      setShowLifetimeFloater(false);
      return;
    }

    const el = document.getElementById("lifetime-plan");
    if (!el) {
      setShowLifetimeFloater(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        setShowLifetimeFloater(!isVisible);
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(el);
    setShowLifetimeFloater(true);
    return () => observer.disconnect();
  }, [lifetimePromoEnabled]);

  const scrollToLifetime = () => {
    const el = document.getElementById("lifetime-plan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Funcția de schimbare a stării unui checkbox
  const handleCheckboxChange = (index) => {
    const newIsAccepted = [...isAccepted];
    newIsAccepted[index] = !newIsAccepted[index]; // Inversăm starea pentru checkbox-ul corespunzător
    setIsAccepted(newIsAccepted);
  };

  const subscription3mPricing = computePlanPricing(
    "SUB_3M",
    perPlanDiscountPercent
  );
  const subscription6mPricing = computePlanPricing(
    "SUB_6M",
    perPlanDiscountPercent
  );
  const subscription12mPricing = computePlanPricing(
    "SUB_12M",
    perPlanDiscountPercent
  );
  const lifetimePricing = computePlanPricing("LIFETIME", perPlanDiscountPercent);

  const formatMonthlyPrice = (pricing, months) => {
    if (!pricing || !months) return "0.00";
    return (Number(pricing.finalAmountEur || 0) / Number(months)).toFixed(2);
  };

  const initiateManualPayment = async (
    planKey,
    index,
    subName,
    opts = { type: "subscription" }
  ) => {
    if (!isAccepted[index]) return; // Dacă checkbox-ul pentru cardul respectiv nu este bifat, nu permite inițierea checkout-ului

    try {
      setLoading(true); // Setează loading la true înainte de a face cererea

      const token = await currentUser?.getIdToken?.();
      if (!token) {
        throw new Error(translatedLinks.notAuthenticatedText);
      }

      const response = await fetch("/api/manual-payment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentType: opts?.type === "lifetime" ? "lifetime" : "subscription",
          planKey,
          planLabel: subName,
          nume: userData.username,
          email: userData.email,
          phone: getPhoneDisplayForUi(userData),
          uid: userData.uid,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error || `Eroare: ${response.status} - ${response.statusText}`
        );
      }

      setAlertMessage({
        type: "success",
        content: `Email transmis avec code IBAN pour virement bancaire. (${data?.referenceCode || "-"}) - ${Number(
          data?.amountEur ?? 0
        ).toFixed(2)} EUR`,
        showAlert: true,
      });
    } catch (error) {
      console.error("manual payment request failed", error);
      setAlertMessage({
        type: "danger",
        content: `${translatedLinks.errorPrefixText}${error.message}`,
        showAlert: true,
      });
    } finally {
      setLoading(false); // Resetează starea loading
    }
  };

  useEffect(() => {
    if (loadingContext) {
      setIsRedirecting(true);
    } else if (!userData?.username) {
      router.push(withLocalePath(pathname, "/signup"));
    } else if (!userData?.isActivated) {
      router.push(withLocalePath(pathname, "/profil-client"));
    } else {
      setIsRedirecting(false);
    }
  }, [loadingContext, pathname, userData, router]);

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
      <div className="container-fluid px-30">
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
        <div className="pt-60 lg:pt-40">
          {/* Row 1: Regular subscriptions in a single horizontal row */}
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "minmax(320px, 1fr)",
              gap: 30,
              overflowX: "auto",
              paddingBottom: 10,
              WebkitOverflowScrolling: "touch",
            }}
          >
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
                        initiateManualPayment(
                          "TEST",
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
          <div>
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament3}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  {formatMonthlyPrice(subscription3mPricing, 3)} Euro /{" "}
                  {translatedLinks.monthText}
                </div>
                {(subscription3mPricing?.discountPercent || 0) > 0 ? (
                  <div className="mt-8 text-14 text-light-1">
                    <span style={{ textDecoration: "line-through" }}>
                      {(Number(subscription3mPricing?.baseAmountEur || 0) / 3).toFixed(
                        2
                      )}{" "}
                      EUR/{translatedLinks.monthText}
                    </span>{" "}
                    <span className="text-purple-1">
                      -{subscription3mPricing?.discountPercent}%
                    </span>
                  </div>
                ) : null}

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
                        initiateManualPayment(
                          "SUB_3M",
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
          <div>
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament6}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  {formatMonthlyPrice(subscription6mPricing, 6)} Euro /{" "}
                  {translatedLinks.monthText}
                </div>
                {(subscription6mPricing?.discountPercent || 0) > 0 ? (
                  <div className="mt-8 text-14 text-light-1">
                    <span style={{ textDecoration: "line-through" }}>
                      {(Number(subscription6mPricing?.baseAmountEur || 0) / 6).toFixed(
                        2
                      )}{" "}
                      EUR/{translatedLinks.monthText}
                    </span>{" "}
                    <span className="text-purple-1">
                      -{subscription6mPricing?.discountPercent}%
                    </span>
                  </div>
                ) : null}

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
                        initiateManualPayment(
                          "SUB_6M",
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
          <div>
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonament12}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  {formatMonthlyPrice(subscription12mPricing, 12)} Euro /{" "}
                  {translatedLinks.monthText}
                </div>
                {(subscription12mPricing?.discountPercent || 0) > 0 ? (
                  <div className="mt-8 text-14 text-light-1">
                    <span style={{ textDecoration: "line-through" }}>
                      {(Number(subscription12mPricing?.baseAmountEur || 0) / 12).toFixed(
                        2
                      )}{" "}
                      EUR/{translatedLinks.monthText}
                    </span>{" "}
                    <span className="text-purple-1">
                      -{subscription12mPricing?.discountPercent}%
                    </span>
                  </div>
                ) : null}

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
                        initiateManualPayment(
                          "SUB_12M",
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

          {/* Card 4 - Lifetime (only shown when enabled) */}
          {lifetimePromoEnabled && (
          <div>
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {translatedLinks.abonamentLifetime}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  {Number(lifetimePricing?.finalAmountEur || 0).toFixed(2)} EUR
                </div>
                <div className="mt-8 text-14 text-light-1">
                  {translatedLinks.lifetimeDurationText}
                </div>
                {(lifetimePricing?.discountPercent || 0) > 0 ? (
                  <div className="mt-8 text-14 text-light-1">
                    <span style={{ textDecoration: "line-through" }}>
                      {Number(lifetimePricing?.baseAmountEur || 0).toFixed(2)} EUR
                    </span>{" "}
                    <span className="text-purple-1">
                      -{lifetimePricing?.discountPercent}%
                    </span>
                  </div>
                ) : null}

                  {/* Client request: no promo badge on this card */}

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
                    {/* Client request: copy the 89€ features list */}
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
                      checked={isAccepted[3]}
                      onChange={() => handleCheckboxChange(3)}
                    />{" "}
                    {acceptTermsText}
                  </label>
                </div>

                <div className="d-inline-block mt-30">
                  {!isAccepted[3] && (
                    <button
                      className="button px-40 py-20 fw-500 disabled-button"
                      disabled
                    >
                      {getStarted}
                    </button>
                  )}
                  {isAccepted[3] && (
                    <button
                      className="button px-40 py-20 fw-500 -purple-1"
                      onClick={() =>
                        initiateManualPayment(
                          "LIFETIME",
                          3,
                          translatedLinks.abonamentLifetime,
                          { type: "lifetime" }
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
          )}
        </div>

          {/* Row 2: Lifetime (separate row) - hidden (lifetime is shown as the 4th card) */}
          {false && lifetimePromoEnabled && (
            <div id="lifetime-plan" className="mt-40">
              <div className="row justify-center">
                <div className="col-12">
                  <div className="text-center mb-20">
                    <h3 className="text-22 fw-700 text-dark-1">
                      {translatedLinks.abonamentLifetime}
                    </h3>
                    <div className="text-14 text-light-1 mt-5">
                      {translatedLinks.lifetimeSectionHint}
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div style={{ maxWidth: 420 }}>
                    <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
                      <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                        <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                          {translatedLinks.abonamentLifetime}
                        </div>
                        <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                          Lifetime
                        </div>
                        {(lifetimePricing?.discountPercent || 0) > 0 && (
                          <div className="mt-10 text-14 text-purple-1">
                            Promo: -{lifetimePricing?.discountPercent}%
                          </div>
                        )}

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
                        </div>

                        <div className="terms-acceptance mt-20">
                          <label>
                            <input
                              type="checkbox"
                              checked={isAccepted[4]}
                              onChange={() => handleCheckboxChange(4)}
                            />{" "}
                            {acceptTermsText}
                          </label>
                        </div>

                        <div className="d-inline-block mt-30">
                          {!isAccepted[4] && (
                            <button
                              className="button px-40 py-20 fw-500 disabled-button"
                              disabled
                            >
                              {getStarted}
                            </button>
                          )}
                          {isAccepted[4] && (
                            <button
                              className="button px-40 py-20 fw-500 -purple-1"
                              onClick={() =>
                                initiateManualPayment(
                                  "LIFETIME",
                                  4,
                                  translatedLinks.abonamentLifetime,
                                  { type: "lifetime" }
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
            </div>
          )}
        </div>

        {/* Floating CTA to scroll to lifetime (disabled because lifetime row is hidden) */}
        {false && lifetimePromoEnabled && showLifetimeFloater && (
          <button
            type="button"
            onClick={scrollToLifetime}
            className="button -md -purple-1 text-white lifetime-floater-btn"
            style={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 9999,
              borderRadius: 999,
              padding: "12px 18px",
              boxShadow: "0px 10px 30px rgba(100, 64, 251, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0px 15px 40px rgba(100, 64, 251, 0.7)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0px 10px 30px rgba(100, 64, 251, 0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {translatedLinks.lifetimeFloaterCta}
          </button>
        )}
      </div>
      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
    </section>
  );
}
