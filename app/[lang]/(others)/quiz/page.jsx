import Brands from "@/components/common/Brands";
import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import QuizClient from "@/components/dashboard/QuizClient";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import { getQuizMessages } from "@/i18n/quiz";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getQuizMessages(targetLanguage);

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
