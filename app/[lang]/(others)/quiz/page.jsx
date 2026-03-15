import Brands from "@/components/common/Brands";
import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import QuizClient from "@/components/dashboard/QuizClient";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Accueil", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Paiement finalisé", targetLanguage),
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
    contText: await fetchTranslation("Compte", targetLanguage),
    chestionarText: await fetchTranslation("Questionnaire", targetLanguage),
    întrebareaText: await fetchTranslation("Question", targetLanguage),
    urmatorulText: await fetchTranslation("Suivant", targetLanguage),
    inapoiText: await fetchTranslation("Retour", targetLanguage),
    progresText: await fetchTranslation("Progression du questionnaire", targetLanguage),
    chestionarFinalizatText: await fetchTranslation(
      "Questionnaire terminé",
      targetLanguage
    ),
    chestionarFinalizatMultiText: await fetchTranslation(
      "Merci d'avoir rempli le questionnaire. Vos réponses ont été enregistrées.",
      targetLanguage
    ),
    chestionarFinalizatSuccesText: await fetchTranslation(
      "Le questionnaire a été terminé avec succès !",
      targetLanguage
    ),
    chestionarFinalizatPaginaPrincipalaText: await fetchTranslation(
      "Aller à la page d'accueil",
      targetLanguage
    ),
    selectOneOptionText: await fetchTranslation(
      "Veuillez sélectionner au moins une option.",
      targetLanguage
    ),
    selectedAnswerText: await fetchTranslation(
      "Veuillez sélectionner une option.",
      targetLanguage
    ),
    codPostalInvalidText: await fetchTranslation(
      "Code postal invalide !",
      targetLanguage
    ),
    introductionQuiz1: await fetchTranslation(
      " Bienvenue dans votre Espace Client RealAmor!",
      targetLanguage
    ),
    introductionQuiz2: await fetchTranslation(
      "Vous allez commencer le questionnaire pour mieux vous connaître! À la fin du questionnaire, vous aurez la possibilité de télécharger vos réponses en PDF. Il ne sera pas rendu public!",
      targetLanguage
    ),
    introductionQuiz3: await fetchTranslation(
      "Nous vous invitons à bien répondre à toutes les questions! Il est essentiel de répondre le plus honnêtement possible pour permettre un matching qui vous correspond!",
      targetLanguage
    ),
    introductionQuiz4: await fetchTranslation(
      "Une fois complet, avec votre accord, vos réponses pourront être partagées uniquement avec les profils compatibles. Les questions relatives à votre personnalité ne seront pas partagées à aucun profil, même si compatible.",
      targetLanguage
    ),
    introductionQuiz5: await fetchTranslation(
      "Si vous ne souhaitez pas partager une ou plusieurs de vos réponses aux autres profils compatibles, vous pouvez le communiquer à l’équipe RealAmor via le formulaire de contact.",
      targetLanguage
    ),
    introductionQuiz6: await fetchTranslation(
      " Commencer le questionnaire",
      targetLanguage
    ),
    raspunsPersonalizatText: await fetchTranslation(
      "Saisissez la réponse personnalisée",
      targetLanguage
    ),
    metierCustomLabelText: await fetchTranslation("Mon Métier", targetLanguage),
    autreText: await fetchTranslation("Autre", targetLanguage),
    prefereNePasRepondreText: await fetchTranslation(
      "Je préfère ne pas répondre à la question",
      targetLanguage
    ),
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
        {/* <PageLinks
          translatedLinks={translatedLinks}
          link2={"plata-finalizata"}
        /> */}
        <QuizClient
          targetLanguage={targetLanguage}
          translatedLinks={translatedLinks}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
