import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/ClientCompatibil/Settings";
import ClientDashboardShell from "@/components/dashboard/ClientDashboardShell";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { getClientCompatibilityMessages } from "@/i18n/dashboard";
import { getMessages } from "@/i18n";
import { normalizeRouteLocale } from "@/utils/routeLocale";
import React from "react";

export async function generateMetadata({ params }) {
  const locale = normalizeRouteLocale(params?.lang, "fr");
  const d = getMessages(locale, "dashboard");
  return {
    title: d.clientCompatibilityMetaTitleText || "Client compatible",
    description: d.clientCompatibilityMetaDescriptionText || "",
  };
}

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedTexts = getClientCompatibilityMessages(targetLanguage);

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          realAmorText={translatedTexts.realAmorText}
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
          translatedTexts={translatedTexts}
        />
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <ClientDashboardShell translatedTexts={translatedTexts}>
            <Settings
              translatedTexts={translatedTexts}
              targetLanguage={targetLanguage}
            />
          </ClientDashboardShell>
        </div>
      </main>
    </div>
  );
}
