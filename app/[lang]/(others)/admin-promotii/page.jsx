import Preloader from "@/components/common/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";
import AdminPromotions from "@/components/dashboard/AdminPromotions";

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedTexts = {
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panneau d'administration", targetLanguage),
    usersText: await fetchTranslation("Utilisateurs", targetLanguage),
    disconnectText: await fetchTranslation("Déconnexion", targetLanguage),
    promotionsText: await fetchTranslation("Promotions", targetLanguage),
    promoTitle: await fetchTranslation("Promotions abonnements", targetLanguage),
    promoDesc: await fetchTranslation(
      "Définissez la réduction (%) appliquée dans Stripe (elle s'applique à tous les abonnements) et activez/désactivez l'affichage de l'offre « à vie ».",
      targetLanguage
    ),
    discountPercentLabel: await fetchTranslation("Réduction abonnements", targetLanguage),
    discountPercentHint: await fetchTranslation(
      "Pourcentage appliqué dans Stripe (tous les abonnements, y compris « à vie » si l'offre est visible)",
      targetLanguage
    ),
    discountPercentValueLabel: await fetchTranslation("Pourcentage de réduction :", targetLanguage),
    discountNoneOption: await fetchTranslation("Aucune réduction", targetLanguage),
    discountSuffix: await fetchTranslation("réduction", targetLanguage),
    discountFreeHint: await fetchTranslation("(gratuit)", targetLanguage),
    discountAppliedHint: await fetchTranslation(
      "La réduction sera appliquée automatiquement au paiement (tous les abonnements)",
      targetLanguage
    ),
    lifetimePromoLabel: await fetchTranslation('Promotion « À vie »', targetLanguage),
    lifetimePromoHint: await fetchTranslation(
      "Afficher/masquer l'offre « abonnement à vie » (n'active pas de réduction)",
      targetLanguage
    ),
    statusLabel: await fetchTranslation("Statut :", targetLanguage),
    statusActive: await fetchTranslation("ACTIF", targetLanguage),
    statusInactive: await fetchTranslation("INACTIF", targetLanguage),
    activatePromo: await fetchTranslation("Activer", targetLanguage),
    deactivatePromo: await fetchTranslation("Désactiver", targetLanguage),
    promoWord: await fetchTranslation("la promotion", targetLanguage),
    lifetimeClickShow: await fetchTranslation("Cliquer pour afficher la carte", targetLanguage),
    lifetimeClickHide: await fetchTranslation("Cliquer pour masquer la carte", targetLanguage),
    lifetimeVisibleHint: await fetchTranslation(
      'La carte « Abonnement à vie » est visible pour les clients',
      targetLanguage
    ),
    saveChangesTitle: await fetchTranslation("Enregistrer les modifications", targetLanguage),
    saveChangesDesc: await fetchTranslation(
      "Les configurations seront appliquées immédiatement",
      targetLanguage
    ),
    enabledText: await fetchTranslation("Actif", targetLanguage),
    saveText: await fetchTranslation("Enregistrer", targetLanguage),
    savingText: await fetchTranslation("Enregistrement...", targetLanguage),
    saveSuccessToast: await fetchTranslation(
      "Les modifications ont été enregistrées.",
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
          <div id="dashboardOpenClose" className="dashboard -home-9 js-dashboard-home-9">
            <div className="dashboard__sidebar scroll-bar-1">
              <Sidebar
                adminText={translatedTexts.adminText}
                usersText={translatedTexts.usersText}
                disconnectText={translatedTexts.disconnectText}
                promotionsText={translatedTexts.promotionsText}
              />
            </div>
            <AdminPromotions translatedTexts={translatedTexts} />
          </div>
        </div>
      </main>
    </div>
  );
}


