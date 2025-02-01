import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { authentication } from "@/firebase"; // Asigură-te că ai importat corect Firebase Auth
import AlertBox from "@/components/uiElements/AlertBox";

export default function Password({ activeTab, translatedTexts }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });

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
      setAlertMessage({
        type: "danger",
        content: translatedTexts.noUserSignedInError,
        showAlert: true,
      });
      return;
    }

    const credentials = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credentials);
      await updatePassword(user, newPassword);

      setAlertMessage({
        type: "success",
        content: translatedTexts.passwordUpdateSuccess,
        showAlert: true,
      });
    } catch (error) {
      setAlertMessage({
        type: "danger",
        content: error.message || translatedTexts.passwordUpdateError,
        showAlert: true,
      });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(authentication, emailForReset);
      setAlertMessage({
        type: "success",
        content: translatedTexts.resetEmailSuccess,
        showAlert: true,
      });
    } catch (error) {
      setAlertMessage({
        type: "danger",
        content: error.message || translatedTexts.resetEmailError,
        showAlert: true,
      });
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
          <input
            required
            type="password"
            placeholder={translatedTexts.currentPasswordText}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.newPasswordText}
          </label>
          <input
            required
            type="password"
            placeholder={translatedTexts.newPasswordText}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.confirmNewPasswordText}
          </label>
          <input
            required
            type="password"
            placeholder={translatedTexts.confirmNewPasswordText}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="col-12">
          <button className="button -md -purple-1 text-white">
            {translatedTexts.savePasswordText}
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
          <button className="button -md -purple-1 text-white">
            {translatedTexts.sendResetEmailText}
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
