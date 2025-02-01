import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import LoginForm from "@/components/others/LoginForm";
import Terms from "@/components/terms/Terms";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    emailText: await fetchTranslation("Email", targetLanguage),
    parolaText: await fetchTranslation("Password", targetLanguage),
    autentificareText: await fetchTranslation("Autentificare", targetLanguage),
    aiContText: await fetchTranslation("Nu ai un cont încă?", targetLanguage),
    inscrieText: await fetchTranslation("Înscrie-te gratuit", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    lang: targetLanguage,
    autentificareReusita: await fetchTranslation(
      "Autentificare reușită!",
      targetLanguage
    ),
    autentificareEsuata: await fetchTranslation(
      "Autentificare eșuată: ",
      targetLanguage
    ),
    aiUitatParolText: await fetchTranslation(
      "Ai uitat parola? ",
      targetLanguage
    ),
    resetPassText: await fetchTranslation("Reseteaza parola ", targetLanguage),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
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
          <LoginForm
            emailText={translatedLinks.emailText}
            parolaText={translatedLinks.parolaText}
            autentificareText={translatedLinks.autentificareText}
            aiContText={translatedLinks.aiContText}
            inscrieText={translatedLinks.inscrieText}
            translatedLinks={translatedLinks}
          />
        </section>
      </div>
    </div>
  );
}
