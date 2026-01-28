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
  const isFr = targetLanguage === "fr";
  const t = async (frText, fallback) =>
    isFr ? frText : await fetchTranslation(fallback || frText, targetLanguage);

  const translatedTexts = {
    lang: targetLanguage,
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panneau d'administration", targetLanguage),
    usersText: await fetchTranslation("Utilisateurs", targetLanguage),
    deletedUsersText: await fetchTranslation("Utilisateurs supprimés", targetLanguage),
    disconnectText: await fetchTranslation("Déconnexion", targetLanguage),
    promotionsText: await fetchTranslation("Promotions", targetLanguage),

    deletedUsersTitle: await t("Utilisateurs supprimés"),
    searchText: await t(
      "Rechercher par nom d'utilisateur",
      "Search by username"
    ),
    userText: await t("Nom d'utilisateur", "User name"),
    emailText: await t("E-mail", "E-mail"),
    deletedAtText: await t("Supprimé le", "Deleted at"),
    deletedByText: await t("Supprimé par", "Deleted by"),
    registrationDateText: await t("Date d'inscription"),
    genText: await t("Genre", "Gender"),
    deletionSourceText: await t("Source de suppression", "Deletion source"),
    deletionReasonText: await t("Motif de suppression", "Deletion reason"),
    usersPerPageLabelText: await t("Utilisateurs par page"),
    loadingText: await t("Chargement...", "Loading..."),
    naText: await t("N/A", "N/A"),
    genderMaleText: await t("Homme", "Male"),
    genderFemaleText: await t("Femme", "Female"),
    genderOtherText: await t("Autre", "Other"),
    deletionSourceSelfCloseText: await t(
      "Compte fermé par utilisateur",
      "Self closed account"
    ),
    deletionSourceAdminDeleteText: await t(
      "Supprimé par admin",
      "Deleted by admin"
    ),
    deletionReasonSelfCloseText: await t(
      "Compte fermé par utilisateur",
      "Account closed by user"
    ),
    deletionReasonAdminDeleteText: await t(
      "Compte supprimé par admin",
      "Deleted by admin"
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

