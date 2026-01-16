import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import LoginForm from "@/components/others/LoginForm";
import LoginFormAdmin from "@/components/others/LoginForm-admin";
import Terms from "@/components/terms/Terms";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    emailText: await fetchTranslation("Email", targetLanguage),
    parolaText: await fetchTranslation("Password", targetLanguage),
    autentificareText: await fetchTranslation(
      "Connexion ADMIN",
      targetLanguage
    ),
    aiContText: await fetchTranslation("Vous n'avez pas encore de compte ?", targetLanguage),
    inscrieText: await fetchTranslation("Inscrivez-vous gratuitement", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    lang: targetLanguage,
    autentificareReusita: await fetchTranslation(
      "Connexion réussie !",
      targetLanguage
    ),
    autentificareEsuata: await fetchTranslation(
      "Connexion échouée : ",
      targetLanguage
    ),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
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
          <LoginFormAdmin
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
