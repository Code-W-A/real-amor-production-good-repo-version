import React from "react";
import Preloader from "@/components/common/Preloader";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import CompletePhoneForm from "@/components/others/CompletePhoneForm";
import { fetchTranslation } from "@/utils/translationUtils";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedTexts = {
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),

    titleText: await fetchTranslation("Ajoutez votre numéro de téléphone", targetLanguage),
    subtitleText: await fetchTranslation(
      "Avant de continuer, nous avons besoin de votre numéro pour finaliser votre profil.",
      targetLanguage
    ),
    whyText: await fetchTranslation(
      "Cela nous aide à garder vos informations à jour et à mieux vous accompagner (support, rendez-vous, notifications importantes).",
      targetLanguage
    ),
    phoneLabelText: await fetchTranslation("Numéro de téléphone", targetLanguage),
    phonePlaceholderText: await fetchTranslation("Exemple : 06 12 34 56 78", targetLanguage),
    continueText: await fetchTranslation("Continuer", targetLanguage),
    savingText: await fetchTranslation("Enregistrement...", targetLanguage),
    saveSuccessText: await fetchTranslation(
      "Merci ! Votre numéro a été enregistré.",
      targetLanguage
    ),
    saveErrorText: await fetchTranslation(
      "Impossible d'enregistrer le numéro pour le moment.",
      targetLanguage
    ),
    phoneInvalidText: await fetchTranslation(
      "Veuillez saisir un numéro de téléphone valide.",
      targetLanguage
    ),
    notAuthenticatedText: await fetchTranslation(
      "Vous devez être connecté pour continuer.",
      targetLanguage
    ),
  };

  return (
    <div className="main-content">
      <Preloader />
      <HeaderAuth
        tarifsText={translatedTexts.tarifsText}
        methodeText={translatedTexts.methodeText}
        translatedLinks={translatedTexts}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <CompletePhoneForm translatedTexts={translatedTexts} />
        </section>
      </div>
    </div>
  );
}
