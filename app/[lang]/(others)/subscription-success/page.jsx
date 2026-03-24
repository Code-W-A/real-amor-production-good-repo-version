import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import SubscriptionSuc from "@/components/common/SubscriptionSuc";
import Header from "@/components/layout/headers/Header";
import { getSubscriptionSuccessMessages } from "@/i18n/commerce";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getSubscriptionSuccessMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />

      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks
          translatedLinks={translatedLinks}
          link2={"subscription-success"}
        />
        <SubscriptionSuc
          paymentTitle={translatedLinks.paymentTitle}
          paymentText={translatedLinks.paymentText}
          paymentConfirmation={translatedLinks.paymentConfirmation}
          loadingText={translatedLinks.loadingText}
          successText={translatedLinks.successText}
          continueBookingText={translatedLinks.continueBookingText}
          detaliiRezervareText={translatedLinks.detaliiRezervareText}
          nameText={translatedLinks.nameText}
          emailText={translatedLinks.emailText}
          phoneText={translatedLinks.phoneText}
          amountPaidText={translatedLinks.amountPaidText}
          translatedLinks={translatedLinks}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
