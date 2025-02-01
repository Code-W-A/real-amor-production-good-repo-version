import Brands from "@/components/common/Brands";
import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Acasă", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Plata finalizata", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    paymentTitle: await fetchTranslation("Plată Finalizată", targetLanguage),
    paymentText: await fetchTranslation(
      "Vă mulțumim pentru plata efectuată! Vă rugăm să continuați cu rezervarea dumneavoastră.",
      targetLanguage
    ),
    paymentConfirmation: await fetchTranslation(
      "Confirmare de plată",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Se încarcă detaliile plății...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Plata dumneavoastră a fost procesată cu succes. Un email cu factura și confirmarea plății a fost trimis la adresa dvs. Vă rugăm să verificați căsuța de email pentru mai multe detalii.",
      targetLanguage
    ),
    continueBookingText: await fetchTranslation(
      "Continuă cu Rezervarea",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Detalii rezervare:",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nume", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Telefon", targetLanguage),
    amountPaidText: await fetchTranslation("Sumă plătită", targetLanguage),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
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
        <PageLinks
          translatedLinks={translatedLinks}
          link2={"plata-finalizata"}
        />
        <PaymentSuccessPage
          paymentTitle={translatedLinks.paymentTitle}
          paymentText={translatedLinks.paymentText}
          paymentConfirmation={translatedLinks.paymentConfirmation}
          loadingText={translatedLinks.loadingText}
          successText={translatedLinks.successText}
          continueBookingText={translatedLinks.continueBookingText}
          detaliiRezervareText={translatedLinks.detaliiRezervareText}
          nameText={translatedLinks.nameText}
          emailText={translatedLinks.emailText}
          phoneText={translatedLinks.phoneText}
          amountPaidText={translatedLinks.amountPaidText}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
