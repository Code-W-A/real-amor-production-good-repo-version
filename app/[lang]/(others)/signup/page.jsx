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
      "Vous avez déjà un compte ?",
      targetLanguage
    ),
    conectText: await fetchTranslation("Se connecter", targetLanguage),
    registerText: await fetchTranslation("S'inscrire", targetLanguage),
    emailPlaceholder: await fetchTranslation("Email", targetLanguage),
    emailAdresaPlaceholder: await fetchTranslation(
      "Adresse e-mail",
      targetLanguage
    ),
    usernamePlaceholder: await fetchTranslation(
      "Nom d'utilisateur",
      targetLanguage
    ),
    passwordPlaceholder: await fetchTranslation("Mot de passe", targetLanguage),
    confirmPasswordPlaceholder: await fetchTranslation(
      "Confirmez le mot de passe",
      targetLanguage
    ),
    phonePlaceholder: await fetchTranslation("Téléphone", targetLanguage),
    aboutMePlaceholder: await fetchTranslation("Adresse", targetLanguage),
    videoPlaceholder: await fetchTranslation(
      "Ajouter une vidéo de présentation",
      targetLanguage
    ),
    pozePlaceholder: await fetchTranslation(
      "Ajouter des photos (la première photo sera la photo principale ; cliquez sur une autre photo pour changer la photo principale)",
      targetLanguage
    ),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
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
      "Veuillez remplir correctement tous les champs.",
      targetLanguage
    ),
    utilizatorInregistrat: await fetchTranslation(
      "Utilisateur enregistré avec succès !",
      targetLanguage
    ),
    signUpText: await fetchTranslation("S'inscrire", targetLanguage),
    logInText: await fetchTranslation("Se connecter", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
    getNecesarText: await fetchTranslation(
      "Le genre est obligatoire",
      targetLanguage
    ),
    genText: await fetchTranslation("Sexe", targetLanguage),
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
