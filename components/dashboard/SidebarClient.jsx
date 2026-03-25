"use client";

import { sidebarItemsClient } from "@/data/dashBoardSidebar";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { useClientChatUnreadValue } from "@/components/dashboard/ClientChatUnreadContext";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "@/firebase";
import { withLocalePath } from "@/utils/routeLocale";

export default function SidebarClient({ translatedTexts }) {
  const pathname = usePathname();
  const { setLoading, userData } = useAuth();
  const { totalUnread } = useClientChatUnreadValue();
  const router = useRouter();
  const loginPath = withLocalePath(pathname, "/login");

  const translatedSidebarItems = [
    { ...sidebarItemsClient[1], text: translatedTexts.listaCompatibilitatiText },
    { ...sidebarItemsClient[2], text: translatedTexts.chatText },
    { ...sidebarItemsClient[3], text: translatedTexts.profileText },
    { ...sidebarItemsClient[4], text: translatedTexts.deconectareText },
  ];

  useEffect(() => {
    setLoading(true);
    const authenticated = authentication;
    const unsubscribe = onAuthStateChanged(authenticated, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.push(loginPath);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, setLoading, loginPath]);

  return (
    <div className="sidebar -dashboard">
      {translatedSidebarItems.map((elm, i) => {
        const itemHref =
          elm.id === 8 ? loginPath : withLocalePath(pathname, elm.href || "/");
        const isActive =
          pathname === itemHref || pathname.startsWith(`${itemHref}/`);
        return (
        <div
          key={i}
          className={`sidebar__item   ${isActive ? "-is-active" : ""} `}
        >
          {elm.id === 8 ? (
            <a
              href={loginPath}
              className="d-flex items-center text-17 lh-1 fw-500 "
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await handleLogout();
                } finally {
                  router.push(loginPath);
                }
              }}
            >
              <i className={`${elm.iconClass} mr-15`}></i>
              {elm.text}
            </a>
          ) : (
            <Link
              href={itemHref}
              className="d-flex items-center text-17 lh-1 fw-500 position-relative"
            >
              <i className={`${elm.iconClass} mr-15`}></i>
              {elm.text}
              {elm.id === 4 && totalUnread > 0 && (
                <span
                  className="d-flex items-center justify-center ml-10 text-11 fw-700 text-white rounded-full shrink-0"
                  style={{
                    minWidth: "22px",
                    height: "22px",
                    padding: "0 6px",
                    backgroundColor: "#1a1a1a",
                  }}
                  aria-label={`${translatedTexts.sidebarChatUnreadAriaLabel}: ${totalUnread}`}
                >
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>
          )}
        </div>
        );
      })}
    </div>
  );
}
