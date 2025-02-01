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
    home: await fetchTranslation("Acasă", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Plata finalizata", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    paymentTitle: await fetchTranslation("Plată Finalizată", targetLanguage),
    paymentText: await fetchTranslation(
      "Vă mulțumim pentru plata efectuată! Vă rugăm să continuați cu rezervarea dumneavoastră.",
      targetLanguage
    ),
    paymentConfirmation: await fetchTranslation(
      "Confirmare de plată",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Se încarcă detaliile plății...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Plata dumneavoastră a fost procesată cu succes. Un email cu factura și confirmarea plății a fost trimis la adresa dvs. Vă rugăm să verificați căsuța de email pentru mai multe detalii.",
      targetLanguage
    ),
    continueBookingText: await fetchTranslation(
      "Continuă cu Rezervarea",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Detalii rezervare:",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nume", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Telefon", targetLanguage),
    amountPaidText: await fetchTranslation("Sumă plătită", targetLanguage),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
    chestionarText: await fetchTranslation("Chestionar", targetLanguage),
    întrebareaText: await fetchTranslation("Întrebarea", targetLanguage),
    urmatorulText: await fetchTranslation("Urmatorul", targetLanguage),
    inapoiText: await fetchTranslation("Înapoi", targetLanguage),
    progresText: await fetchTranslation("Progres chestionar", targetLanguage),
    chestionarFinalizatText: await fetchTranslation(
      "Chestionar Finalizat",
      targetLanguage
    ),
    chestionarFinalizatMultiText: await fetchTranslation(
      "Mulțumim pentru completarea chestionarului. Răspunsurile tale au fost înregistrate.",
      targetLanguage
    ),
    chestionarFinalizatSuccesText: await fetchTranslation(
      "Chestionarul a fost finalizat cu succes!",
      targetLanguage
    ),
    chestionarFinalizatPaginaPrincipalaText: await fetchTranslation(
      "Mergi la pagina principală",
      targetLanguage
    ),
    selectOneOptionText: await fetchTranslation(
      "Vă rugăm să selectați cel puțin o opțiune.",
      targetLanguage
    ),
    selectedAnswerText: await fetchTranslation(
      "Vă rugăm să selectați o opțiune.",
      targetLanguage
    ),
    codPostalInvalidText: await fetchTranslation(
      "Cod postal invalid!",
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
      "Introduceți răspunsul personalizat",
      targetLanguage
    ),
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
