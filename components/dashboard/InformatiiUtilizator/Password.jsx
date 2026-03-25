"use client";

import React, { useState } from "react";
import PasswordInput from "@/components/uiElements/PasswordInput";

export default function Password({ activeTab, translatedTexts }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div
      className={`tabs__pane -tab-item-2 ${activeTab == 2 ? "is-active" : ""} `}
    >
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Current password
          </label>

          <PasswordInput
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            showPasswordLabel={translatedTexts?.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts?.passwordHideAriaLabel}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            New password
          </label>

          <PasswordInput
            required
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            showPasswordLabel={translatedTexts?.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts?.passwordHideAriaLabel}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Confirm New Password
          </label>

          <PasswordInput
            required
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            showPasswordLabel={translatedTexts?.passwordShowAriaLabel}
            hidePasswordLabel={translatedTexts?.passwordHideAriaLabel}
          />
        </div>

        <div className="col-12">
          <button className="button -md -purple-1 text-white">
            Save Password
          </button>
        </div>
      </form>
    </div>
  );
}
