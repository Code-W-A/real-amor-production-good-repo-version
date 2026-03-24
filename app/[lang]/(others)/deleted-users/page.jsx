import Preloader from "@/components/common/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getDeletedUsersMessages } from "@/i18n/admin";
import React from "react";
import DeletedUsers from "@/components/dashboard/DeletedUsers";

export const metadata = {
  title: "Deleted-users",
  description: "Deleted-users",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getDeletedUsersMessages(targetLanguage);

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
          <div id="dashboardOpenClose" className="dashboard -home-9 js-dashboard-home-9">
            <div className="dashboard__sidebar scroll-bar-1">
              <Sidebar
                adminText={translatedTexts.adminText}
                usersText={translatedTexts.usersText}
                deletedUsersText={translatedTexts.deletedUsersText}
                disconnectText={translatedTexts.disconnectText}
                promotionsText={translatedTexts.promotionsText}
              />
            </div>
            <DeletedUsers translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}
