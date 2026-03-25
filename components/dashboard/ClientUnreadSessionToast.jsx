"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import AlertBox from "@/components/uiElements/AlertBox";
import { useClientChatUnreadValue } from "@/components/dashboard/ClientChatUnreadContext";

const SESSION_KEY = "realamour_unread_chat_toast_shown";

export default function ClientUnreadSessionToast({ translatedTexts }) {
  const { totalUnread } = useClientChatUnreadValue();
  const [showToast, setShowToast] = useState(false);
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (totalUnread <= 0) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowToast(true);
  }, [totalUnread]);

  const handleClose = useCallback(() => {
    setShowToast(false);
  }, []);

  if (!showToast || totalUnread <= 0) return null;

  const message = (translatedTexts.chatUnreadLoginToastText || "").replace(
    "{count}",
    String(totalUnread)
  );

  return (
    <AlertBox
      type="success"
      message={message}
      showAlert={showToast}
      onClose={handleClose}
    />
  );
}
