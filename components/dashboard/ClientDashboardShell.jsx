"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import SidebarClient from "@/components/dashboard/SidebarClient";
import ClientUnreadGlobalBanner from "@/components/dashboard/ClientUnreadGlobalBanner";
import ClientUnreadSessionToast from "@/components/dashboard/ClientUnreadSessionToast";
import { ClientChatUnreadProvider } from "@/components/dashboard/ClientChatUnreadContext";

export default function ClientDashboardShell({ translatedTexts, children }) {
  const { userData } = useAuth();

  return (
    <ClientChatUnreadProvider uid={userData?.uid}>
      <ClientUnreadSessionToast translatedTexts={translatedTexts} />
      <div
        id="dashboardOpenClose"
        className="dashboard -home-9 js-dashboard-home-9"
      >
        <div className="dashboard__sidebar scroll-bar-1">
          <SidebarClient translatedTexts={translatedTexts} />
        </div>
        <div className="dashboard__main">
          <ClientUnreadGlobalBanner translatedTexts={translatedTexts} />
          {children}
        </div>
      </div>
    </ClientChatUnreadProvider>
  );
}
