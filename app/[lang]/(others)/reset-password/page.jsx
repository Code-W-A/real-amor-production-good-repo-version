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
    methodeText: await fetchTranslation("Methode", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    resetPasswordHeader: await fetchTranslation(
      "Resetare Parolă",
      targetLanguage
    ),
    sendResetText: await fetchTranslation(
      "Trimite email de resetare",
      targetLanguage
    ),
    successMessage: await fetchTranslation(
      "Un email de resetare a parolei a fost trimis!",
      targetLanguage
    ),
    errorMessage: await fetchTranslation(
      "Eroare la resetarea parolei: ",
      targetLanguage
    ),
    loginRedirectText: await fetchTranslation(
      "Înapoi la autentificare",
      targetLanguage
    ),
    contText: await fetchTranslation("Cont", targetLanguage),
    getNecesarText: await fetchTranslation(
      "Genul este necesar",
      targetLanguage
    ),
    genText: await fetchTranslation("Gender", targetLanguage),
    hommeText: await fetchTranslation("Homme", targetLanguage),
    femmeText: await fetchTranslation("Femme", targetLanguage),
    selecteazaText: await fetchTranslation("Selecteaza", targetLanguage),
    scopNecesarText: await fetchTranslation(
      "Scopul este necesar",
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
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
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
