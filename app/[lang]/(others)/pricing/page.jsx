import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import Pricing from "@/components/common/Pricing";
import { getPricingMessages } from "@/i18n/commerce";

// Componenta pentru pagina de pricing
export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getPricingMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />
      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} link2={"pricing"} />
        <Pricing
          bookingText={translatedLinks.bookingText}
          paymentOneTimeText={translatedLinks.paymentOneTimeText}
          oneTimeFeature1={translatedLinks.oneTimeFeature1}
          oneTimeFeature2={translatedLinks.oneTimeFeature2}
          oneTimeFeature3={translatedLinks.oneTimeFeature3}
          oneTimeFeature4={translatedLinks.oneTimeFeature4}
          getStarted={translatedLinks.getStarted}
          acceptTermsText={translatedLinks.acceptTermsText}
          translatedLinks={translatedLinks}
        />

        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
