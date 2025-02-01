import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import Pricing from "@/components/common/Pricing";
import { fetchTranslation } from "@/utils/translationUtils";

// Componenta pentru pagina de pricing
export default async function Page({ params }) {
  // Extragem limba din URL folosind params
  const targetLanguage = params.lang || "en";

  console.log("targe lagn..", targetLanguage);

  const translatedLinks = {
    home: await fetchTranslation("Acasa", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Pricing", targetLanguage),
    lang: targetLanguage,
    bookingText: await fetchTranslation(
      "Pricing for booking system",
      targetLanguage
    ),
    paymentOneTimeText: await fetchTranslation(
      "One-time payment for reservations",
      targetLanguage
    ),
    oneTimeFeature1: await fetchTranslation(
      "Access to all reservation features",
      targetLanguage
    ),
    oneTimeFeature2: await fetchTranslation(
      "No subscription required",
      targetLanguage
    ),
    oneTimeFeature3: await fetchTranslation(
      "Active for 30 days",
      targetLanguage
    ),
    oneTimeFeature4: await fetchTranslation(
      "Unlimited access to customer support",
      targetLanguage
    ),
    getStarted: await fetchTranslation("Get Started Now", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),

    bookingText: await fetchTranslation(
      "Ouverture de dossier et premier Rendez-vous en présentiel",
      targetLanguage
    ),
    // Traducerea textului pentru bifa termenilor și condițiilor
    acceptTermsText: await fetchTranslation(
      "Accept Terms and Conditions, Privacy Policy, and Cookies",
      targetLanguage
    ),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
  };

  return (
    <div className="main-content">
      <Preloader />
      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        {/* Transmitem datele traduse și limba către componenta PageLinks */}
        <PageLinks translatedLinks={translatedLinks} />
        <Pricing
          bookingText={translatedLinks.bookingText}
          paymentOneTimeText={translatedLinks.paymentOneTimeText}
          oneTimeFeature1={translatedLinks.oneTimeFeature1}
          oneTimeFeature2={translatedLinks.oneTimeFeature2}
          oneTimeFeature3={translatedLinks.oneTimeFeature3}
          oneTimeFeature4={translatedLinks.oneTimeFeature4}
          getStarted={translatedLinks.getStarted}
          acceptTermsText={translatedLinks.acceptTermsText}
          translatedLinks={translatedLinks}
        />

        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
