import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/ClientCompatibil/Settings";
import SidebarClient from "@/components/dashboard/SidebarClient";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getClientCompatibilityMessages } from "@/i18n/dashboard";
import React from "react";

export const metadata = {
  title: "Client-Compatibil",
  description: "Client-Compatibil",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getClientCompatibilityMessages(targetLanguage);

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
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            <div className="dashboard__sidebar scroll-bar-1">
              <SidebarClient translatedTexts={translatedTexts} />
            </div>
            <Settings
              translatedTexts={translatedTexts}
              targetLanguage={targetLanguage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
