"use client";

import React, { createContext, useContext } from "react";
import { useClientChatUnread } from "@/hooks/useClientChatUnread";

const ClientChatUnreadContext = createContext(null);

export function ClientChatUnreadProvider({ uid, children }) {
  const value = useClientChatUnread(uid);
  return (
    <ClientChatUnreadContext.Provider value={value}>
      {children}
    </ClientChatUnreadContext.Provider>
  );
}

export function useClientChatUnreadValue() {
  const ctx = useContext(ClientChatUnreadContext);
  if (ctx == null) {
    throw new Error(
      "useClientChatUnreadValue must be used within ClientChatUnreadProvider"
    );
  }
  return ctx;
}
