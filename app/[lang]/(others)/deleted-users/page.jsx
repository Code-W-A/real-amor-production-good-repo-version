import Preloader from "@/components/common/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";
import DeletedUsers from "@/components/dashboard/DeletedUsers";

export const metadata = {
  title: "Deleted-users",
  description: "Deleted-users",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedTexts = {
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panneau d'administration", targetLanguage),
    usersText: await fetchTranslation("Utilisateurs", targetLanguage),
    deletedUsersText: await fetchTranslation("Utilisateurs supprimés", targetLanguage),
    disconnectText: await fetchTranslation("Déconnexion", targetLanguage),
    promotionsText: await fetchTranslation("Promotions", targetLanguage),

    deletedUsersTitle: await fetchTranslation("Utilisateurs supprimés", targetLanguage),
    searchText: await fetchTranslation("Search by username", targetLanguage),
    userText: await fetchTranslation("User name", targetLanguage),
    emailText: await fetchTranslation("E-mail", targetLanguage),
    deletedAtText: await fetchTranslation("Deleted at", targetLanguage),
    deletedByText: await fetchTranslation("Deleted by", targetLanguage),
    registrationDateText: await fetchTranslation("Date d'inscription", targetLanguage),
    genText: await fetchTranslation("Genre", targetLanguage),
    deletionSourceText: await fetchTranslation("Deletion source", targetLanguage),
    deletionReasonText: await fetchTranslation("Deletion reason", targetLanguage),
    usersPerPageLabelText: await fetchTranslation("Utilisateurs par page", targetLanguage),
    loadingText: await fetchTranslation("Chargement...", targetLanguage),
    naText: await fetchTranslation("N/A", targetLanguage),
  };

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
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

import Preloader from "@/components/common/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";
import DeletedUsers from "@/components/dashboard/DeletedUsers";

export const metadata = {
  title: "Cei-stersi",
  description: "Cei-stersi",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedTexts = {
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panneau d'administration", targetLanguage),
    usersText: await fetchTranslation("Utilisateurs", targetLanguage),
    deletedUsersText: await fetchTranslation("Utilisateurs supprimés", targetLanguage),
    disconnectText: await fetchTranslation("Déconnexion", targetLanguage),
    promotionsText: await fetchTranslation("Promotions", targetLanguage),
    deletedUsersTitle: await fetchTranslation(
      "Utilisateurs supprimés",
      targetLanguage
    ),
    searchText: await fetchTranslation("Search by username", targetLanguage),
    userText: await fetchTranslation("User name", targetLanguage),
    emailText: await fetchTranslation("E-mail", targetLanguage),
    deletedAtText: await fetchTranslation("Supprimé le", targetLanguage),
    deletedByText: await fetchTranslation("Supprimé par", targetLanguage),
    registrationDateText: await fetchTranslation(
      "Date d'inscription",
      targetLanguage
    ),
    genText: await fetchTranslation("Genre", targetLanguage),
    deletionSourceText: await fetchTranslation("Source", targetLanguage),
    deletionReasonText: await fetchTranslation("Motif", targetLanguage),
    usersPerPageLabelText: await fetchTranslation(
      "Utilisateurs par page",
      targetLanguage
    ),
    loadingText: await fetchTranslation("Chargement...", targetLanguage),
  };

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
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

