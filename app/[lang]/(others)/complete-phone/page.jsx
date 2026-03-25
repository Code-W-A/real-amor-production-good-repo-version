import React from "react";
import Preloader from "@/components/common/Preloader";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import CompletePhoneForm from "@/components/others/CompletePhoneForm";
import { getCompletePhoneMessages } from "@/i18n/auth";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getCompletePhoneMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />
      <HeaderAuth
        tarifsText={translatedTexts.tarifsText}
        methodeText={translatedTexts.methodeText}
        translatedLinks={translatedTexts}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <CompletePhoneForm
            translatedTexts={translatedTexts}
            locale={targetLanguage}
          />
        </section>
      </div>
    </div>
  );
}
