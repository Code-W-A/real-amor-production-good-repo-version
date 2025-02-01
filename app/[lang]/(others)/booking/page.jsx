import Brands from "@/components/common/Brands";
import Calendar from "@/components/common/Calendar";

import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import Pricing from "@/components/common/Pricing";

import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import { fetchTranslation } from "@/utils/translationUtils";

import React from "react";
export const metadata = {
  title: "Booking",
  description: "Booking",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Acasă", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Booking", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    paymentTitle: await fetchTranslation("Plată Finalizată", targetLanguage),
    paymentText: await fetchTranslation(
      "Vă mulțumim pentru plata efectuată! Vă rugăm să continuați cu rezervarea dumneavoastră.",
      targetLanguage
    ),
    paymentConfirmation: await fetchTranslation(
      "Confirmare de plată",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Se încarcă detaliile plății...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Plata dumneavoastră a fost procesată cu succes. Un email cu factura și confirmarea plății a fost trimis la adresa dvs. Vă rugăm să verificați căsuța de email pentru mai multe detalii.",
      targetLanguage
    ),
    continueBookingText: await fetchTranslation(
      "Continuă cu Rezervarea",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Detalii rezervare:",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nume", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Telefon", targetLanguage),
    amountPaidText: await fetchTranslation("Sumă plătită", targetLanguage),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    optiuneText: await fetchTranslation(
      "Selectează opțiunea de rezervare",
      targetLanguage
    ),
    selecteazaText: await fetchTranslation("Selectează", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
    optiuneUnu: await fetchTranslation(
      "Je suis un homme et je parle en Français",
      targetLanguage
    ),
    optiuneDoi: await fetchTranslation("Je suis une femme", targetLanguage),
    optiuneTrei: await fetchTranslation(
      "Ik spreek Nederlands (man/vrouw)",
      targetLanguage
    ),
    reseteazaText: await fetchTranslation(
      "Reselectează opțiunea",
      targetLanguage
    ),
  };
  return (
    <div className="main-content  ">
      <Preloader />

      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} link2={"booking"} />
        <Calendar
          targetLanguage={targetLanguage}
          translatedLinks={translatedLinks}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
