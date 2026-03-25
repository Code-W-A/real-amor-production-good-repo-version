import Preloader from "@/components/common/Preloader";
import DashboardOne from "@/components/dashboard/DashboardOne";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import React from "react";
import Settings from "@/components/dashboard/InformatiiUtilizator/Settings";
import ClientDashboardShell from "@/components/dashboard/ClientDashboardShell";
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
          <ClientDashboardShell translatedTexts={translatedTexts}>
            <Settings translatedTexts={translatedTexts} />
          </ClientDashboardShell>
        </div>
      </main>
    </div>
  );
}
