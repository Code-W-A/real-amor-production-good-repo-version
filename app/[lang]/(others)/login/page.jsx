import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import LoginForm from "@/components/others/LoginForm";
import Terms from "@/components/terms/Terms";
import { getLoginMessages } from "@/i18n/auth";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getLoginMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />

      <HeaderAuth
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper">
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
