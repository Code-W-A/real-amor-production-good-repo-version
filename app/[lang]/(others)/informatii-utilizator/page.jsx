import Preloader from "@/components/common/Preloader";
import DashboardOne from "@/components/dashboard/DashboardOne";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import React from "react";
import Settings from "@/components/dashboard/InformatiiUtilizator/Settings";
import { fetchTranslation } from "@/utils/translationUtils";

export const metadata = {
  title: "Lista-utilizatori",
  description: "Lista-utilizatori",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  // Obținem traducerile pentru textele statice
  const translatedTexts = {
    getNecesarText: await fetchTranslation(
      "Le genre est obligatoire",
      targetLanguage
    ),
    genText: await fetchTranslation("Gender", targetLanguage),
    hommeText: await fetchTranslation("Homme", targetLanguage),
    femmeText: await fetchTranslation("Femme", targetLanguage),
    selecteazaText: await fetchTranslation("Sélectionner", targetLanguage),
    scopNecesarText: await fetchTranslation(
      "L'objectif est obligatoire",
      targetLanguage
    ),
    scopText: await fetchTranslation("Je cherche", targetLanguage),
    amourText: await fetchTranslation(
      "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.",
      targetLanguage
    ),
    sexText: await fetchTranslation(
      "Je cherche des rencontres coquines en toute discrétion.",
      targetLanguage
    ),
    amitieText: await fetchTranslation(
      "Je cherche à élargir mon cercle d’amis.",
      targetLanguage
    ),
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
    userNameText: await fetchTranslation("User Name", targetLanguage),
    phoneNumberText: await fetchTranslation("Phone number", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    aboutMeText: await fetchTranslation("About me", targetLanguage),
    AddressText: await fetchTranslation("Address", targetLanguage),
    paidForReservationText: await fetchTranslation(
      "User has paid for a reservation",
      targetLanguage
    ),
    hasNotPaidForReservationText: await fetchTranslation(
      "User has not paid for a reservation",
      targetLanguage
    ),
    activateContText: await fetchTranslation(
      "Activate Account",
      targetLanguage
    ),
    deactivateContText: await fetchTranslation(
      "Désactiver le compte",
      targetLanguage
    ),
    contActivText: await fetchTranslation("Compte activé", targetLanguage),
    contDezactivatText: await fetchTranslation(
      "Compte désactivé",
      targetLanguage
    ),
    successDeleteUserText: await fetchTranslation(
      "User deleted successfully.",
      targetLanguage
    ),
    errorDeleteUserText: await fetchTranslation(
      "Error deleting user",
      targetLanguage
    ),
    deletingUserText: await fetchTranslation(
      "Deleting user...",
      targetLanguage
    ),
    deleteUserText: await fetchTranslation("Delete User", targetLanguage),
    confirmDeleteTitle: await fetchTranslation(
      "Confirm Delete",
      targetLanguage
    ),
    confirmDeleteMessage: await fetchTranslation(
      "Are you sure you want to delete this user?",
      targetLanguage
    ),
    confirmText: await fetchTranslation("Confirm", targetLanguage),
    cancelText: await fetchTranslation("Cancel", targetLanguage),
    confirmDeleteMessage: await fetchTranslation(
      "Are you sure you want to delete this user?",
      targetLanguage
    ),
    confirmText: await fetchTranslation("Confirm", targetLanguage),
    cancelText: await fetchTranslation("Cancel", targetLanguage),
    subscriptionDetailsText: await fetchTranslation(
      "Subscription Details",
      targetLanguage
    ),
    subscriptionIdText: await fetchTranslation(
      "Subscription ID",
      targetLanguage
    ),
    planText: await fetchTranslation("Type d'abonnement", targetLanguage),
    expiryDateText: await fetchTranslation(
      "Date d'expiration de l'abonnement",
      targetLanguage
    ),
    cancelSubscriptionText: await fetchTranslation(
      "Annuler l'abonnement de l'utilisateur",
      targetLanguage
    ),
    grantLifetimeText: await fetchTranslation(
      "Activer l'abonnement à vie",
      targetLanguage
    ),
    grantLifetimeConfirmText: await fetchTranslation(
      "Confirmer l'activation de l'abonnement à vie pour cet utilisateur ?",
      targetLanguage
    ),
    grantLifetimeHintText: await fetchTranslation(
      "Cela activera l'accès à vie pour ce compte.",
      targetLanguage
    ),
    grantLifetimeConfirmButtonText: await fetchTranslation(
      "Activer",
      targetLanguage
    ),
    grantLifetimeInProgressText: await fetchTranslation(
      "Activation en cours...",
      targetLanguage
    ),
    grantLifetimeSuccessText: await fetchTranslation(
      "Abonnement à vie activé pour cet utilisateur.",
      targetLanguage
    ),
    grantLifetimeAlreadyText: await fetchTranslation(
      "Cet utilisateur a déjà un accès à vie.",
      targetLanguage
    ),
    lifetimeOfferLabelText: await fetchTranslation(
      "Autoriser l'offre « abonnement à vie » (ce compte uniquement)",
      targetLanguage
    ),
    cancelingText: await fetchTranslation("Annulation en cours...", targetLanguage),
    noSubscriptionText: await fetchTranslation(
      "L'utilisateur n'a pas d'abonnement actif",
      targetLanguage
    ),
    buySubscriptionText: await fetchTranslation(
      "Acheter un abonnement pour l'utilisateur",
      targetLanguage
    ),
    accountNotActivatedText: await fetchTranslation(
      "Le compte de l'utilisateur n'est pas activé",
      targetLanguage
    ),
    subscriptionCanceledImmediatelyText: await fetchTranslation(
      "Abonnement annulé immédiatement",
      targetLanguage
    ),
    subscriptionExpiredText: await fetchTranslation(
      "Abonnement expiré",
      targetLanguage
    ),
    subscriptionStatusText: await fetchTranslation(
      "Statut de l'abonnement de l'utilisateur",
      targetLanguage
    ),
    currentlyInCoupleText: await fetchTranslation(
      "Actuellement en couple",
      targetLanguage
    ),
    adminNotesLabelText: await fetchTranslation(
      "Notes (admin uniquement)",
      targetLanguage
    ),
    adminNotesPlaceholderText: await fetchTranslation(
      "Notes internes (non visibles par le client)…",
      targetLanguage
    ),
    adminNotesSaveText: await fetchTranslation("Enregistrer", targetLanguage),
    adminNotesSavingText: await fetchTranslation("Enregistrement...", targetLanguage),
    adminNotesLoadingText: await fetchTranslation("Chargement...", targetLanguage),
    adminNotesSavedText: await fetchTranslation("Notes sauvegardées.", targetLanguage),
    adminNotesStatusSavingText: await fetchTranslation("Enregistrement...", targetLanguage),
    adminNotesStatusSavedText: await fetchTranslation("Sauvegardé", targetLanguage),
    adminNotesStatusErrorText: await fetchTranslation("Erreur d'enregistrement", targetLanguage),
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
            <Settings translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}
