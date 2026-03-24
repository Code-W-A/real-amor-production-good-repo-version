import Preloader from "@/components/common/Preloader";
import DashboardOne from "@/components/dashboard/DashboardOne";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import React from "react";
import Settings from "@/components/dashboard/InformatiiUtilizator/Settings";
import SidebarClient from "@/components/dashboard/SidebarClient";
import { getUserCompatibilityMessages } from "@/i18n/admin";

export const metadata = {
  title: "Lista-utilizatori",
  description: "Lista-utilizatori",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  const translatedTexts = getUserCompatibilityMessages(targetLanguage);

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
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
