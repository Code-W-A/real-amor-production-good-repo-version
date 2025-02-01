import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import ThankYouReservation from "@/components/common/ThankYouComp";
import { fetchTranslation } from "@/utils/translationUtils";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    reservationTitle: await fetchTranslation(
      "Rezervare Confirmată",
      targetLanguage
    ),
    reservationText: await fetchTranslation(
      "Vă mulțumim pentru rezervarea efectuată! Detaliile rezervării sunt afișate mai jos.",
      targetLanguage
    ),
    reservationConfirmation: await fetchTranslation(
      "Confirmare Rezervare",
      targetLanguage
    ),
    approvalPendingText: await fetchTranslation(
      "Veți fi anunțat atunci când contul va fi aprobat.",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Se încarcă detaliile rezervării...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Nous vous remercions pour votre demande de rendez-vous. Suite à votre entretien avec nos experts, votre compte sera activé.",
      targetLanguage
    ),
    homePageText: await fetchTranslation("Către Cont", targetLanguage),
    detailsText: await fetchTranslation("Detalii rezervare:", targetLanguage),
    nameText: await fetchTranslation("Nume", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Telefon", targetLanguage),
    dateText: await fetchTranslation("Data", targetLanguage),
    timeText: await fetchTranslation("Ora", targetLanguage),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
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
        <PageLinks
          translatedLinks={translatedLinks}
          link2={"rezervare-confirmata"}
        />
        <ThankYouReservation
          reservationTitle={translatedLinks.reservationTitle}
          reservationText={translatedLinks.reservationText}
          reservationConfirmation={translatedLinks.reservationConfirmation}
          approvalPendingText={translatedLinks.approvalPendingText}
          loadingText={translatedLinks.loadingText}
          successText={translatedLinks.successText}
          homePageText={translatedLinks.homePageText}
          detailsText={translatedLinks.detailsText}
          nameText={translatedLinks.nameText}
          emailText={translatedLinks.emailText}
          phoneText={translatedLinks.phoneText}
          dateText={translatedLinks.dateText}
          timeText={translatedLinks.timeText}
        />
      </div>
    </div>
  );
}
