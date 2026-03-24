import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import AdminLifetimeSuccess from "@/components/common/AdminLifetimeSuccess";
import { getAdminLifetimeSuccessMessages } from "@/i18n/commerce";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getAdminLifetimeSuccessMessages(targetLanguage);

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
          link2={"admin-lifetime-success"}
        />
        <AdminLifetimeSuccess
          title={translatedLinks.title}
          text={translatedLinks.text}
          backText={translatedLinks.backText}
          translatedLinks={translatedLinks}
        />
      </div>
    </div>
  );
}
