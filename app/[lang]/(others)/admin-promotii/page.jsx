import Preloader from "@/components/common/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";
import AdminPromotions from "@/components/dashboard/AdminPromotions";

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedTexts = {
    methodeText: await fetchTranslation("Methode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panou administrare", targetLanguage),
    usersText: await fetchTranslation("Utilizatori", targetLanguage),
    disconnectText: await fetchTranslation("Deconectare", targetLanguage),
    promotionsText: await fetchTranslation("Promoții", targetLanguage),
    promoTitle: await fetchTranslation("Promoții abonamente", targetLanguage),
    promoDesc: await fetchTranslation(
      "Setează reducerea (%) aplicată în Stripe și activează/dezactivează promoția pe viață.",
      targetLanguage
    ),
    discountPercentLabel: await fetchTranslation("Reducere abonamente", targetLanguage),
    discountPercentHint: await fetchTranslation("Procent aplicat în Stripe", targetLanguage),
    discountPercentValueLabel: await fetchTranslation("Procent reducere:", targetLanguage),
    discountNoneOption: await fetchTranslation("Fără reducere", targetLanguage),
    discountSuffix: await fetchTranslation("reducere", targetLanguage),
    discountAppliedHint: await fetchTranslation(
      "Reducerea va fi aplicată automat la checkout",
      targetLanguage
    ),
    lifetimePromoLabel: await fetchTranslation('Promoție "Pe viață"', targetLanguage),
    lifetimePromoHint: await fetchTranslation('Afișare card "1 an = pe viață"', targetLanguage),
    statusLabel: await fetchTranslation("Status:", targetLanguage),
    statusActive: await fetchTranslation("ACTIV", targetLanguage),
    statusInactive: await fetchTranslation("INACTIV", targetLanguage),
    activatePromo: await fetchTranslation("Activează", targetLanguage),
    deactivatePromo: await fetchTranslation("Dezactivează", targetLanguage),
    promoWord: await fetchTranslation("promoția", targetLanguage),
    lifetimeClickShow: await fetchTranslation("Click pentru a afișa cardul", targetLanguage),
    lifetimeClickHide: await fetchTranslation("Click pentru a ascunde cardul", targetLanguage),
    lifetimeVisibleHint: await fetchTranslation(
      'Cardul "Abonnement à vie" este vizibil pentru clienți',
      targetLanguage
    ),
    saveChangesTitle: await fetchTranslation("Salvează modificările", targetLanguage),
    saveChangesDesc: await fetchTranslation(
      "Configurațiile vor fi aplicate imediat",
      targetLanguage
    ),
    enabledText: await fetchTranslation("Activ", targetLanguage),
    saveText: await fetchTranslation("Salvează", targetLanguage),
    savingText: await fetchTranslation("Salvez...", targetLanguage),
    saveSuccessToast: await fetchTranslation(
      "Modificările au fost salvate.",
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


