import React from "react";
import Link from "next/link";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import SignUpForm from "@/components/others/SignUpForm";
import { getSignupMessages } from "@/i18n/auth";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getSignupMessages(targetLanguage);

  return (
    <>
      <div className="main-content">
        <Preloader />
        <HeaderAuth
          tarifsText={translatedLinks.tarifsText}
          methodeText={translatedLinks.methodeText}
          translatedLinks={translatedLinks}
        />
        <div className="content-wrapper js-content-wrapper">
          <section className="form-page js-mouse-move-container">
            {/* Afișarea componentei AuthImageMove și a formularului de înregistrare */}

            <section className="form-page js-mouse-move-container">
              {/* Componența AuthImageMove primește răspunsurile ca props */}
              <AuthImageMove />
              {/* Formularul de înregistrare */}
              <SignUpForm
                signUpText={translatedLinks.signUpText}
                alreadyHaveAccountText={translatedLinks.alreadyHaveAccountText}
                conectText={translatedLinks.conectText}
                registerText={translatedLinks.registerText}
                emailPlaceholder={translatedLinks.emailPlaceholder}
                emailAdresaPlaceholder={translatedLinks.emailAdresaPlaceholder}
                usernamePlaceholder={translatedLinks.usernamePlaceholder}
                passwordPlaceholder={translatedLinks.passwordPlaceholder}
                confirmPasswordPlaceholder={
                  translatedLinks.confirmPasswordPlaceholder
                }
                phonePlaceholder={translatedLinks.phonePlaceholder}
                aboutMePlaceholder={translatedLinks.aboutMePlaceholder}
                videoPlaceholder={translatedLinks.videoPlaceholder}
                pozePlaceholder={translatedLinks.pozePlaceholder}
                translatedLinks={translatedLinks}
                targetLanguage={targetLanguage}
              />
            </section>
          </section>
        </div>
      </div>
    </>
  );
}
