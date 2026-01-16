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
  title: "Réservation",
  description: "Réservation",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Accueil", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Réservation", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    paymentTitle: await fetchTranslation("Paiement finalisé", targetLanguage),
    paymentText: await fetchTranslation(
      "Merci pour votre paiement ! Veuillez continuer avec votre réservation.",
      targetLanguage
    ),
    paymentConfirmation: await fetchTranslation(
      "Confirmation de paiement",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Chargement des détails du paiement...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Votre paiement a été traité avec succès. Un e-mail contenant la facture et la confirmation de paiement a été envoyé à votre adresse. Veuillez vérifier votre boîte mail pour plus de détails.",
      targetLanguage
    ),
    continueBookingText: await fetchTranslation(
      "Continuer la réservation",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Détails de la réservation :",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nom", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Téléphone", targetLanguage),
    amountPaidText: await fetchTranslation("Montant payé", targetLanguage),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    optiuneText: await fetchTranslation(
      "Sélectionnez l'option de réservation",
      targetLanguage
    ),
    selecteazaText: await fetchTranslation("Sélectionner", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
    optiuneUnu: await fetchTranslation(
      "Je suis un homme et je parle français",
      targetLanguage
    ),
    optiuneDoi: await fetchTranslation("Je suis une femme", targetLanguage),
    optiuneTrei: await fetchTranslation(
      "Ik spreek Nederlands (man/vrouw)",
      targetLanguage
    ),
    reseteazaText: await fetchTranslation(
      "Resélectionner l'option",
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
