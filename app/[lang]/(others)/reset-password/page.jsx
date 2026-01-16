import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import ResetPasswordForm from "@/components/others/ResetPasswordForm";
import Terms from "@/components/terms/Terms";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";

  // Obține traducerile necesare
  const translatedLinks = {
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    resetPasswordHeader: await fetchTranslation(
      "Réinitialisation du mot de passe",
      targetLanguage
    ),
    sendResetText: await fetchTranslation(
      "Envoyer l'e-mail de réinitialisation",
      targetLanguage
    ),
    successMessage: await fetchTranslation(
      "Un e-mail de réinitialisation du mot de passe a été envoyé !",
      targetLanguage
    ),
    errorMessage: await fetchTranslation(
      "Erreur lors de la réinitialisation du mot de passe : ",
      targetLanguage
    ),
    loginRedirectText: await fetchTranslation(
      "Retour à la connexion",
      targetLanguage
    ),
    contText: await fetchTranslation("Compte", targetLanguage),
    getNecesarText: await fetchTranslation(
      "Le genre est obligatoire",
      targetLanguage
    ),
    genText: await fetchTranslation("Gender", targetLanguage),
    hommeText: await fetchTranslation("Homme", targetLanguage),
    femmeText: await fetchTranslation("Femme", targetLanguage),
    selecteazaText: await fetchTranslation("Sélectionner", targetLanguage),
    scopNecesarText: await fetchTranslation(
      "L'objectif est obligatoire",
      targetLanguage
    ),
    scopText: await fetchTranslation("Je cherche", targetLanguage),
    amourText: await fetchTranslation(
      "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.",
      targetLanguage
    ),
    sexText: await fetchTranslation(
      "Je cherche des rencontres coquines en toute discrétion.",
      targetLanguage
    ),
    amitieText: await fetchTranslation(
      "Je cherche à élargir mon cercle d’amis.",
      targetLanguage
    ),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
  };

  return (
    <div className="main-content">
      <Preloader />

      <HeaderAuth
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <ResetPasswordForm
            emailText={translatedLinks.emailText}
            resetPasswordHeader={translatedLinks.resetPasswordHeader}
            sendResetText={translatedLinks.sendResetText}
            successMessage={translatedLinks.successMessage}
            errorMessage={translatedLinks.errorMessage}
            loginRedirectText={translatedLinks.loginRedirectText}
            translatedLinks={translatedLinks} // Transmitere link login
          />
        </section>
      </div>

      <FooterOne />
    </div>
  );
}
