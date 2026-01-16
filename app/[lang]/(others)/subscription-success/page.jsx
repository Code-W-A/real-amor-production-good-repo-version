import Brands from "@/components/common/Brands";
import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import SubscriptionSuc from "@/components/common/SubscriptionSuc";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Accueil", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Pricing", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    paymentTitle: await fetchTranslation("Paiement finalisé", targetLanguage),
    paymentText: await fetchTranslation(
      "Merci pour votre paiement ! Veuillez continuer vers votre compte.",
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
      "Continuer vers le compte",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Détails de l'abonnement :",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nom", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Téléphone", targetLanguage),
    amountPaidText: await fetchTranslation("Montant payé", targetLanguage),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
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
        <PageLinks translatedLinks={translatedLinks} />
        <SubscriptionSuc
          paymentTitle={translatedLinks.paymentTitle}
          paymentText={translatedLinks.paymentText}
          paymentConfirmation={translatedLinks.paymentConfirmation}
          loadingText={translatedLinks.loadingText}
          successText={translatedLinks.successText}
          continueBookingText={translatedLinks.continueBookingText}
          detaliiRezervareText={translatedLinks.detaliiRezervareText}
          nameText={translatedLinks.nameText}
          emailText={translatedLinks.emailText}
          phoneText={translatedLinks.phoneText}
          amountPaidText={translatedLinks.amountPaidText}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
