"use client";

import React, { useState } from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import FooterNine from "@/components/layout/footers/FooterNine";
import Notification from "./Notifications";
import Subscriptions from "@/components/common/Subscriptions";
import SubscriptionsProfile from "./SubscriptionsProfile";
import { useAuth } from "@/context/AuthContext";

// Am eliminat array-ul static `buttons` și îl vom primi ca props
export default function Settings({
  usernameLabel,
  phoneLabel,
  aboutMeLabel,
  updateProfileText,
  successMessage,
  imageAddedMessage,
  videoAddedMessage,
  errorMessage,
  usernameRequired,
  phoneRequired,
  aboutMeRequired,
  completeFieldsError,
  editProfileText, // traducere pentru "Edit Profile"
  passwordText, // traducere pentru "Password"
  closeAccountText, // traducere pentru "Close Account"
  addressRequired,
  addressLabel,
  translatedTexts,
}) {
  const [activeTab, setActiveTab] = useState(1);
  const { loading } = useAuth();

  const buttons = [
    editProfileText,
    passwordText,
    closeAccountText,
    translatedTexts.activeSubText,
  ]; // folosește traducerile primite ca props

  if (loading) {
    return null;
  }

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              {translatedTexts.profileSettingsText}
            </h1>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                <div className="tabs__controls d-flex  x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  {buttons.map((elm, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i + 1)}
                      className={`tabs__button text-light-1 js-tabs-button ${
                        activeTab == i + 1 ? "is-active" : ""
                      } `}
                      type="button"
                    >
                      {elm}
                    </button>
                  ))}
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <EditProfile
                    activeTab={activeTab}
                    usernameLabel={usernameLabel}
                    phoneLabel={phoneLabel}
                    aboutMeLabel={aboutMeLabel}
                    updateProfileText={updateProfileText}
                    successMessage={successMessage}
                    imageAddedMessage={imageAddedMessage}
                    videoAddedMessage={videoAddedMessage}
                    errorMessage={errorMessage}
                    usernameRequired={usernameRequired}
                    phoneRequired={phoneRequired}
                    aboutMeRequired={aboutMeRequired}
                    completeFieldsError={completeFieldsError}
                    addressRequired={addressRequired}
                    addressLabel={addressLabel}
                    translatedTexts={translatedTexts}
                  />
                  <Password
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                  />
                  <CloseAccount
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                  />
                  <SubscriptionsProfile
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                  />
                  {/* <Notification activeTab={activeTab} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterNine />
    </div>
  );
}
