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
      "Réservation confirmée",
      targetLanguage
    ),
    reservationText: await fetchTranslation(
      "Merci pour votre réservation ! Les détails de la réservation sont affichés ci-dessous.",
      targetLanguage
    ),
    reservationConfirmation: await fetchTranslation(
      "Confirmation de réservation",
      targetLanguage
    ),
    approvalPendingText: await fetchTranslation(
      "Vous serez informé lorsque votre compte sera approuvé.",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Chargement des détails de la réservation...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Nous vous remercions pour votre demande de rendez-vous. Suite à votre entretien avec nos experts, votre compte sera activé.",
      targetLanguage
    ),
    homePageText: await fetchTranslation("Aller au compte", targetLanguage),
    detailsText: await fetchTranslation("Détails de la réservation :", targetLanguage),
    nameText: await fetchTranslation("Nom", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Téléphone", targetLanguage),
    dateText: await fetchTranslation("Date", targetLanguage),
    timeText: await fetchTranslation("Heure", targetLanguage),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
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
