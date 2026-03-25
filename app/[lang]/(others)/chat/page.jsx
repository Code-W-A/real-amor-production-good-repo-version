import Preloader from "@/components/common/Preloader";
import Message from "@/components/dashboard/Message";
import ClientDashboardShell from "@/components/dashboard/ClientDashboardShell";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getChatMessages } from "@/i18n/dashboard";
import React from "react";

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getChatMessages(targetLanguage);

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          realAmorText={translatedTexts.realAmorText}
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
          translatedTexts={translatedTexts}
        />
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <ClientDashboardShell translatedTexts={translatedTexts}>
            <Message translatedTexts={translatedTexts} />
          </ClientDashboardShell>
        </div>
      </main>
    </div>
  );
}
