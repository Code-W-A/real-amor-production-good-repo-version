import React from "react";
import Link from "next/link";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import SignUpForm from "@/components/others/SignUpForm";
import { fetchTranslation } from "@/utils/translationUtils";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";

  console.log("targe lagn..", targetLanguage);

  const translatedLinks = {
    termsAndConditionsText: await fetchTranslation(
      "En cliquant sur S’inscrire, vous acceptez nos Mentions légales. Découvrez comment nous recueillons, utilisons et partageons vos données en lisant notre Politique de confidentialité et comment nous utilisons les cookies et autres technologies similaires en consultant notre Politique de cookies. Vous recevrez peut-être des notifications par texto de notre part et vous pouvez à tout moment vous désabonner.",
      targetLanguage
    ),
    mentionsLegalesText: await fetchTranslation(
      "Mentions légales",
      targetLanguage
    ),
    politiqueConfidentialiteText: await fetchTranslation(
      "Politique de confidentialité",
      targetLanguage
    ),
    politiqueCookiesText: await fetchTranslation(
      "Politique de cookies",
      targetLanguage
    ),
    signUpText: await fetchTranslation("Sign Up", targetLanguage),
    alreadyHaveAccountText: await fetchTranslation(
      "Ai deja un cont?",
      targetLanguage
    ),
    conectText: await fetchTranslation("Conectează-te", targetLanguage),
    registerText: await fetchTranslation("Înregistrează-te", targetLanguage),
    emailPlaceholder: await fetchTranslation("Email", targetLanguage),
    emailAdresaPlaceholder: await fetchTranslation(
      "Adresă email",
      targetLanguage
    ),
    usernamePlaceholder: await fetchTranslation(
      "Nume utilizator",
      targetLanguage
    ),
    passwordPlaceholder: await fetchTranslation("Parolă", targetLanguage),
    confirmPasswordPlaceholder: await fetchTranslation(
      "Confirmă Parola",
      targetLanguage
    ),
    phonePlaceholder: await fetchTranslation("Telefon", targetLanguage),
    aboutMePlaceholder: await fetchTranslation("Adresa", targetLanguage),
    videoPlaceholder: await fetchTranslation(
      "Adaugă video de prezentare",
      targetLanguage
    ),
    pozePlaceholder: await fetchTranslation(
      "Adaugă poze(prima poza va servi ca poza principala, apasa pe alte poze pentru a schimba poza principala)",
      targetLanguage
    ),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    lang: targetLanguage,
    userNameRequired: await fetchTranslation(
      "Username is required",
      targetLanguage
    ),
    passLength: await fetchTranslation(
      "Password must be at least 6 characters long",
      targetLanguage
    ),
    phoneRequired: await fetchTranslation(
      "Phone number is required",
      targetLanguage
    ),
    addressRequired: await fetchTranslation(
      "Address is required",
      targetLanguage
    ),
    completeazaCampuri: await fetchTranslation(
      "Te rugăm să completezi toate câmpurile corect.",
      targetLanguage
    ),
    utilizatorInregistrat: await fetchTranslation(
      "Utilizator înregistrat cu succes!",
      targetLanguage
    ),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
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
    termsAndConditions: {
      prefix: await fetchTranslation(
        "En cliquant sur S’inscrire, vous acceptez nos ",
        targetLanguage
      ),
      mentionsLegalesLinkText: await fetchTranslation(
        "Mentions légales",
        targetLanguage
      ),
      mentionsLegalesSuffix: await fetchTranslation(
        ". Découvrez comment nous recueillons, utilisons et partageons vos données en lisant notre ",
        targetLanguage
      ),
      politiqueConfidentialiteLinkText: await fetchTranslation(
        "Politique de confidentialité",
        targetLanguage
      ),
      politiqueConfidentialiteSuffix: await fetchTranslation(
        " et comment nous utilisons les cookies et autres technologies similaires en consultant notre ",
        targetLanguage
      ),
      politiqueCookiesLinkText: await fetchTranslation(
        "Politique de cookies",
        targetLanguage
      ),
      suffix: await fetchTranslation(
        ". Vous recevrez peut-être des notifications par texto de notre part et vous pouvez à tout moment vous désabonner.",
        targetLanguage
      ),
    },
  };

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
