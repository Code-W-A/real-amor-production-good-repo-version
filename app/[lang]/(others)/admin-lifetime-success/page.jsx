import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import AdminLifetimeSuccess from "@/components/common/AdminLifetimeSuccess";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";

  const translatedLinks = {
    home: await fetchTranslation("Accueil", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Paiement finalisé", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Méthode", targetLanguage),
    contText: await fetchTranslation("Compte", targetLanguage),
    title: await fetchTranslation("Paiement finalisé", targetLanguage),
    text: await fetchTranslation(
      "Paiement effectué. L'accès à vie sera activé automatiquement.",
      targetLanguage
    ),
    backText: await fetchTranslation("Retour à l'utilisateur", targetLanguage),
  };

  return (
    <div className="main-content">
      <Preloader />
      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} />
        <AdminLifetimeSuccess
          title={translatedLinks.title}
          text={translatedLinks.text}
          backText={translatedLinks.backText}
        />
      </div>
    </div>
  );
}

