import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import ResetPasswordForm from "@/components/others/ResetPasswordForm";
import Terms from "@/components/terms/Terms";
import { getResetPasswordMessages } from "@/i18n/auth";
import React from "react";

export default async function Page({ params }) {
  const targetLanguage = params.lang || "fr";
  const translatedLinks = getResetPasswordMessages(targetLanguage);

  return (
    <div className="main-content">
      <Preloader />

      <HeaderAuth
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <ResetPasswordForm
            emailText={translatedLinks.emailText}
            resetPasswordHeader={translatedLinks.resetPasswordHeader}
            sendResetText={translatedLinks.sendResetText}
            successMessage={translatedLinks.successMessage}
            errorMessage={translatedLinks.errorMessage}
            loginRedirectText={translatedLinks.loginRedirectText}
            translatedLinks={translatedLinks} // Transmitere link login
          />
        </section>
      </div>

      <FooterOne />
    </div>
  );
}
