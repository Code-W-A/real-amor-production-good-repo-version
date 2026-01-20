import Preloader from "@/components/common/Preloader";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export const metadata = {
  title: "Lista-utilizatori",
  description: "Lista-utilizatori",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  // Obținem traducerile pentru textele statice
  const translatedTexts = {
    title: await fetchTranslation("Liste des utilisateurs", targetLanguage),
    description: await fetchTranslation("Liste des utilisateurs", targetLanguage),
    sidebarText: await fetchTranslation("Sidebar", targetLanguage),
    myCoursesText: await fetchTranslation("My Courses", targetLanguage),
    headerDashboardText: await fetchTranslation("Dashboard", targetLanguage),
    realAmorText: await fetchTranslation("Real Amor", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panneau d'administration", targetLanguage),
    usersText: await fetchTranslation("Utilisateurs", targetLanguage),
    disconnectText: await fetchTranslation("Déconnexion", targetLanguage),
    listaUtilizatoriText: await fetchTranslation(
      "Liste des utilisateurs",
      targetLanguage
    ),
    searchText: await fetchTranslation("Search by username", targetLanguage),
    userText: await fetchTranslation("User name", targetLanguage),
    emailText: await fetchTranslation("E-mail", targetLanguage),
    actiuniText: await fetchTranslation("Actions", targetLanguage),
    registrationDateText: await fetchTranslation(
      "Date d'inscription",
      targetLanguage
    ),
    contActivText: await fetchTranslation("Statut du compte", targetLanguage),
    contActivText1: await fetchTranslation("Compte activé", targetLanguage),
    contActivText2: await fetchTranslation("Compte non activé", targetLanguage),
    veziDetaliiText: await fetchTranslation("Voir détails", targetLanguage),
    genText: await fetchTranslation("Genre", targetLanguage),
    scopText: await fetchTranslation("Objectif", targetLanguage),
    usersPerPageLabelText: await fetchTranslation(
      "Utilisateurs par page",
      targetLanguage
    ),
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
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            <div className="dashboard__sidebar scroll-bar-1">
              <Sidebar
                adminText={translatedTexts.adminText}
                usersText={translatedTexts.usersText}
                disconnectText={translatedTexts.disconnectText}
              />
            </div>
            <MyCourses translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}
