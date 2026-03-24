import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import ThankYouReservation from "@/components/common/ThankYouComp";
import { getThankYouMessages } from "@/i18n/commerce";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getThankYouMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />
      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} link2={"thank-you"} />
        <ThankYouReservation
          reservationTitle={translatedLinks.reservationTitle}
          reservationText={translatedLinks.reservationText}
          reservationConfirmation={translatedLinks.reservationConfirmation}
          approvalPendingText={translatedLinks.approvalPendingText}
          loadingText={translatedLinks.loadingText}
          successText={translatedLinks.successText}
          homePageText={translatedLinks.homePageText}
          detailsText={translatedLinks.detailsText}
          nameText={translatedLinks.nameText}
          emailText={translatedLinks.emailText}
          phoneText={translatedLinks.phoneText}
          dateText={translatedLinks.dateText}
          timeText={translatedLinks.timeText}
          translatedLinks={translatedLinks}
        />
      </div>
    </div>
  );
}
