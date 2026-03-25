import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/SettingsClient/Settings";
import ClientDashboardShell from "@/components/dashboard/ClientDashboardShell";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getProfileMessages } from "@/i18n/dashboard";
import React from "react";

export const metadata = {
  title:
    "Cashboard || Educrat - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getProfileMessages(targetLanguage);

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
            <Settings translatedTexts={translatedTexts} />
          </ClientDashboardShell>
        </div>
      </main>
    </div>
  );
}
