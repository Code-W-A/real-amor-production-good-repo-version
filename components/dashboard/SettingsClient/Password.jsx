"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { authentication } from "@/firebase"; // Asigură-te că ai importat corect Firebase Auth
import AlertBox from "@/components/uiElements/AlertBox";
import PasswordInput from "@/components/uiElements/PasswordInput";
import { getLocaleFromPathname } from "@/utils/routeLocale";
import { requestPasswordReset } from "@/utils/requestPasswordReset";

function getPasswordChangeUserMessage(error, translatedTexts) {
  const fallback = translatedTexts.passwordUpdateError;
  const code = error?.code || "";
  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return translatedTexts.passwordWrongCurrentError || fallback;
  }
  if (code === "auth/weak-password") {
    return translatedTexts.passwordWeakError || fallback;
  }
  if (code === "auth/requires-recent-login") {
    return translatedTexts.passwordRequiresRecentLoginError || fallback;
  }
  if (code === "auth/too-many-requests") {
    return translatedTexts.passwordTooManyRequestsError || fallback;
  }
  if (code === "auth/network-request-failed") {
    return fallback;
  }
  return fallback;
}

export default function Password({ activeTab, translatedTexts }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [isResetSending, setIsResetSending] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (user) => {
      if (user?.email) {
        setEmailForReset((prev) => (prev ? prev : user.email));
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setAlertMessage({
        type: "danger",
        content: translatedTexts.newPasswordMismatchError,
        showAlert: true,
      });
      return;
    }

    const user = authentication.currentUser;

    if (!user) {
      console.warn("[profil-client Password] save password: no currentUser");
      setAlertMessage({
        type: "danger",
        content: translatedTexts.noUserSignedInError,
        showAlert: true,
      });
      return;
    }

    const providers = (user.providerData || []).map((p) => p.providerId);
    const hasPasswordProvider = (user.providerData || []).some(
      (p) => p.providerId === "password"
    );

    console.info("[profil-client Password] save password click", {
      uid: user.uid,
      emailHint: user.email
        ? `${user.email.slice(0, 2)}***@${user.email.split("@")[1] || "?"}`
        : "(no email on user)",
      providers,
      hasPasswordProvider,
      newPasswordLength: newPassword.length,
    });

    if (!hasPasswordProvider) {
      console.warn(
        "[profil-client Password] account has no email/password provider — user must use reset email flow"
      );
      setAlertMessage({
        type: "danger",
        content: translatedTexts.passwordOAuthOnlyError,
        showAlert: true,
      });
      return;
    }

    if (!user.email) {
      console.error("[profil-client Password] user.email is missing");
      setAlertMessage({
        type: "danger",
        content: translatedTexts.passwordUpdateError,
        showAlert: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      console.warn("[profil-client Password] new password too short");
      setAlertMessage({
        type: "danger",
        content: translatedTexts.passwordMinLengthError,
        showAlert: true,
      });
      return;
    }

    const credentials = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    setIsSavingPassword(true);
    try {
      console.info("[profil-client Password] reauthenticate…");
      await reauthenticateWithCredential(user, credentials);
      console.info("[profil-client Password] reauthenticate OK, updatePassword…");
      await updatePassword(user, newPassword);
      console.info("[profil-client Password] updatePassword OK");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setAlertMessage({
        type: "success",
        content: translatedTexts.passwordUpdateSuccess,
        showAlert: true,
      });
    } catch (error) {
      console.error("[profil-client Password] change password failed", {
        code: error?.code,
        message: error?.message,
        name: error?.name,
      });
      const content = getPasswordChangeUserMessage(error, translatedTexts);
      setAlertMessage({
        type: "danger",
        content,
        showAlert: true,
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsResetSending(true);
    try {
      await requestPasswordReset({
        email: emailForReset,
        locale,
      });
      setAlertMessage({
        type: "success",
        content: translatedTexts.resetEmailSuccess,
        showAlert: true,
      });
    } catch (error) {
      console.error("[profil-client Password] reset email failed", {
        message: error?.message,
        apiCode: error?.apiCode,
        apiDetail: error?.apiDetail,
        status: error?.status,
      });
      setAlertMessage({
        type: "danger",
        content:
          process.env.NODE_ENV === "development" && error?.apiDetail
            ? `${error.message || translatedTexts.resetEmailError} (${error.apiDetail})`
            : error.message || translatedTexts.resetEmailError,
        showAlert: true,
      });
    } finally {
      setIsResetSending(false);
    }
  };

  return (
    <div
      className={`tabs__pane -tab-item-2 ${activeTab == 2 ? "is-active" : ""}`}
    >
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.currentPasswordText}
          </label>
          <PasswordInput
            required
            placeholder={translatedTexts.currentPasswordText}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            showPasswordLabel={translatedTexts.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts.passwordHideAriaLabel}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.newPasswordText}
          </label>
          <PasswordInput
            required
            placeholder={translatedTexts.newPasswordText}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            showPasswordLabel={translatedTexts.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts.passwordHideAriaLabel}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.confirmNewPasswordText}
          </label>
          <PasswordInput
            required
            placeholder={translatedTexts.confirmNewPasswordText}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            showPasswordLabel={translatedTexts.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts.passwordHideAriaLabel}
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="button -md -purple-1 text-white"
            disabled={isSavingPassword}
          >
            {isSavingPassword
              ? translatedTexts.loadingText || "…"
              : translatedTexts.savePasswordText}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordReset}
        className="contact-form row y-gap-30 mt-40"
      >
        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.enterEmailText}
          </label>
          <input
            required
            type="email"
            placeholder={translatedTexts.emailForResetText}
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="button -md -purple-1 text-white d-inline-flex align-items-center justify-content-center gap-10"
            disabled={isResetSending}
            aria-busy={isResetSending}
          >
            {isResetSending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm text-white"
                  role="status"
                  aria-hidden
                  style={{
                    width: "1rem",
                    height: "1rem",
                    borderWidth: "0.12em",
                  }}
                />
                <span>{translatedTexts.loadingText || "…"}</span>
              </>
            ) : (
              translatedTexts.sendResetEmailText
            )}
          </button>
        </div>
      </form>

      {/* Afișare componentă AlertBox */}
      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
    </div>
  );
}
