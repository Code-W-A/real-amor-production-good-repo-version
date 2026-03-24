import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/SettingsClient/Settings";
import SidebarClient from "@/components/dashboard/SidebarClient";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getProfileMessages } from "@/i18n/dashboard";
import React from "react";

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
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            <div className="dashboard__sidebar scroll-bar-1">
              <SidebarClient translatedTexts={translatedTexts} />
            </div>
            <Settings translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}
