"use client";

import React, { useState } from "react";
import EditProfile from "./EditProfile";
import FooterNine from "@/components/layout/footers/FooterNine";

export default function Settings({ translatedTexts, targetLanguage }) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <div className="dashboard__content bg-light-4">
        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <EditProfile
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                    targetLanguage={targetLanguage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterNine />
    </>
  );
}
