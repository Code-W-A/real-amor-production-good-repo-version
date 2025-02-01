import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/ClientCompatibil/Settings";
import SidebarClient from "@/components/dashboard/SidebarClient";
import Sidebar from "@/components/dashboard/SidebarClient";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export const metadata = {
  title: "Client-Compatibil",
  description: "Client-Compatibil",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  // Obținem traducerile pentru textele statice
  const translatedTexts = {
    quizText: await fetchTranslation("Raspunsuri chestionar", targetLanguage),
    downloadQuizText: await fetchTranslation(
      "Download quiz answers",
      targetLanguage
    ),
    contText: await fetchTranslation("Cont", targetLanguage),
    listaCompatibilitatiText: await fetchTranslation(
      "Lista Compatibilitati",
      targetLanguage
    ),
    deconectareText: await fetchTranslation("Se Déconnecter", targetLanguage),
    chatText: await fetchTranslation("Chat", targetLanguage),
    profileText: await fetchTranslation("Profile", targetLanguage),
    getNecesarText: await fetchTranslation(
      "Genul este necesar",
      targetLanguage
    ),
    genText: await fetchTranslation("Gender", targetLanguage),
    hommeText: await fetchTranslation("Homme", targetLanguage),
    femmeText: await fetchTranslation("Femme", targetLanguage),
    selecteazaText: await fetchTranslation("Selecteaza", targetLanguage),
    scopNecesarText: await fetchTranslation(
      "Scopul este necesar",
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
    title: await fetchTranslation("Lista utilizatori", targetLanguage),
    description: await fetchTranslation("Lista utilizatori", targetLanguage),
    sidebarText: await fetchTranslation("Sidebar", targetLanguage),
    myCoursesText: await fetchTranslation("My Courses", targetLanguage),
    headerDashboardText: await fetchTranslation("Dashboard", targetLanguage),
    realAmorText: await fetchTranslation("Real Amor", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panou administrare", targetLanguage),
    usersText: await fetchTranslation("Utilizatori", targetLanguage),
    disconnectText: await fetchTranslation("Deconectare", targetLanguage),
    listaUtilizatoriText: await fetchTranslation(
      "Lista utilizatori",
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
      "Dezactiveaza Cont",
      targetLanguage
    ),
    contActivText: await fetchTranslation("Cont activat", targetLanguage),
    contDezactivatText: await fetchTranslation(
      "Cont dezactivat",
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
    planText: await fetchTranslation("Tip abonament", targetLanguage),
    expiryDateText: await fetchTranslation(
      "Data expirării abonamentului",
      targetLanguage
    ),
    cancelSubscriptionText: await fetchTranslation(
      "Anulează abonamentul utilizatorului",
      targetLanguage
    ),
    cancelingText: await fetchTranslation("Anulare în curs...", targetLanguage),
    noSubscriptionText: await fetchTranslation(
      "Utilizatorul nu are un abonament activ",
      targetLanguage
    ),
    buySubscriptionText: await fetchTranslation(
      "Achiziționează un abonament pentru utilizator",
      targetLanguage
    ),
    accountNotActivatedText: await fetchTranslation(
      "Contul utilizatorului nu este activat",
      targetLanguage
    ),
    subscriptionCanceledImmediatelyText: await fetchTranslation(
      "Abonament anulat imediat",
      targetLanguage
    ),
    subscriptionExpiredText: await fetchTranslation(
      "Abonament expirat",
      targetLanguage
    ),
    subscriptionStatusText: await fetchTranslation(
      "Stare abonament utilizator",
      targetLanguage
    ),
    chatText: await fetchTranslation("Chat", targetLanguage),
    eliminaCompLoading: await fetchTranslation("Se elimină...", targetLanguage),
    eliminaComp: await fetchTranslation(
      "Elimină compatibilitatea",
      targetLanguage
    ),
    eliminaCompSuccess: await fetchTranslation(
      "Compatibilitatea a fost eliminată cu succes",
      targetLanguage
    ),
    eliminaCompError: await fetchTranslation(
      "A apărut o eroare la eliminarea compatibilității.",
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
              <SidebarClient
                contText={translatedTexts.contText}
                listaCompatibilitatiText={
                  translatedTexts.listaCompatibilitatiText
                }
                chatText={translatedTexts.chatText}
                profileText={translatedTexts.profileText}
                deconectareText={translatedTexts.deconectareText}
              />
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
