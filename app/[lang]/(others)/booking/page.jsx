import Brands from "@/components/common/Brands";
import Calendar from "@/components/common/Calendar";
import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import { getBookingMessages } from "@/i18n/commerce";

import React from "react";

export function generateMetadata({ params }) {
  const translatedLinks = getBookingMessages(params?.lang || "fr");

  return {
    title: translatedLinks.pricing,
    description: translatedLinks.pricing,
  };
}

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getBookingMessages(targetLanguage);

  return (
    <div className="main-content  ">
      <Preloader />

      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} link2={"booking"} />
        <Calendar translatedLinks={translatedLinks} />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
