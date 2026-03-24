import Preloader from "@/components/common/Preloader";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getUserListMessages } from "@/i18n/admin";
import React from "react";

export const metadata = {
  title: "Lista-utilizatori",
  description: "Lista-utilizatori",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  const translatedTexts = getUserListMessages(targetLanguage);

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
              <Sidebar
                adminText={translatedTexts.adminText}
                usersText={translatedTexts.usersText}
                deletedUsersText={translatedTexts.deletedUsersText}
                disconnectText={translatedTexts.disconnectText}
                promotionsText={translatedTexts.promotionsText}
              />
            </div>
            <MyCourses translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}
