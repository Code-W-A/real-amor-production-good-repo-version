"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DotLoader } from "react-spinners";
import { withLocalePath } from "@/utils/routeLocale";
import { getPhoneDisplayForUi } from "@/utils/phoneUtils";
import AlertBox from "@/components/uiElements/AlertBox";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  computePlanPricing,
  getDefaultPerPlanDiscountPercent,
  normalizePerPlanDiscountPercent,
} from "@/app/api/_utils/manualPayments";

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
  const [loading, setLoading] = useState(false); // Starea pentru a controla butonul de încărcare
  const [isAccepted, setIsAccepted] = useState(false); // Stare pentru checkbox-ul de termeni și condiții
  const [isRedirecting, setIsRedirecting] = useState(true); // Stare pentru checkbox-ul de termeni și condiții
  const [perPlanDiscountPercent, setPerPlanDiscountPercent] = useState(
    getDefaultPerPlanDiscountPercent()
  );
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading: loadingContext, userData } = useAuth();

  const handleCheckboxChange = (event) => {
    setIsAccepted(event.target.checked); // Actualizează starea când checkbox-ul este bifat
  };
  const reservationPricing = computePlanPricing(
    "RESERVATION",
    perPlanDiscountPercent
  );

  const initiateManualPayment = async () => {
    if (!isAccepted) return; // Dacă checkbox-ul nu este bifat, nu permite inițierea checkout-ului

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
          paymentType: "reservation",
          planKey: "RESERVATION",
          planLabel: translatedLinks.bookingText,
          nume: userData.username,
          email: userData.email,
          phone: getPhoneDisplayForUi(userData),
          uid: userData.uid,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error || `${response.status} - ${response.statusText}`
        );
      }

      setAlertMessage({
        type: "success",
        content: `Email transmis avec code IBAN pour virement bancaire. (${data?.referenceCode || "-"}) - ${Number(
          data?.amountEur ?? reservationPricing?.finalAmountEur ?? 0
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
      setIsRedirecting(true); // Afișăm spinnerul cât timp loadingContext este true
    } else if (!userData?.username) {
      router.push(withLocalePath(pathname, "/signup"));
    } else if (
      userData?.reservation?.status === "paid" &&
      !userData?.reservation?.hasReserved
    ) {
      router.push(withLocalePath(pathname, "/booking"));
    } else if (userData?.reservation?.hasReserved) {
      router.push(withLocalePath(pathname, "/profil-client"));
    } else if (!userData?.responses) {
      router.push(withLocalePath(pathname, "/quiz"));
    } else {
      setIsRedirecting(false); // Ascundem spinnerul după ce verificările s-au finalizat
    }
  }, [loadingContext, pathname, userData, router]);

  useEffect(() => {
    const loadPromo = async () => {
      try {
        const snap = await getDoc(doc(db, "Config", "subscriptionPromo"));
        if (!snap.exists()) {
          setPerPlanDiscountPercent(getDefaultPerPlanDiscountPercent());
          return;
        }
        const data = snap.data() || {};
        setPerPlanDiscountPercent(
          normalizePerPlanDiscountPercent(data?.perPlanDiscountPercent)
        );
      } catch {
        setPerPlanDiscountPercent(getDefaultPerPlanDiscountPercent());
      }
    };
    loadPromo();
  }, []);

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
                  {Number(reservationPricing?.finalAmountEur || 0).toFixed(2)} Euro
                </div>
                {(reservationPricing?.discountPercent || 0) > 0 ? (
                  <div className="mt-8 text-14 text-light-1">
                    <span style={{ textDecoration: "line-through" }}>
                      {Number(reservationPricing?.baseAmountEur || 0).toFixed(2)} EUR
                    </span>{" "}
                    <span className="text-purple-1">
                      -{reservationPricing.discountPercent}%
                    </span>
                  </div>
                ) : null}

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
                      onClick={initiateManualPayment}
                      disabled={loading}
                    >
                      {loading
                        ? translatedLinks.manualPaymentRequestLoadingText || "Processing..."
                        : getStarted}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
