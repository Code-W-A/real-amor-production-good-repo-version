"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocalePath } from "@/utils/routeLocale";
import { useClientChatUnreadValue } from "./ClientChatUnreadContext";

function stripTitleCountPrefix(title) {
  return title.replace(/^\(\d+\)\s+/, "");
}

export default function ClientUnreadGlobalBanner({ translatedTexts }) {
  const pathname = usePathname();
  const { totalUnread } = useClientChatUnreadValue();
  const chatHref = withLocalePath(pathname, "/chat");
  const lastAppliedUnread = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const base = stripTitleCountPrefix(document.title);
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) ${base}`;
      lastAppliedUnread.current = totalUnread;
    } else if (lastAppliedUnread.current > 0) {
      document.title = base;
      lastAppliedUnread.current = 0;
    }

    return () => {
      if (lastAppliedUnread.current > 0) {
        document.title = stripTitleCountPrefix(document.title);
        lastAppliedUnread.current = 0;
      }
    };
  }, [totalUnread, pathname]);

  if (totalUnread <= 0) return null;

  const bannerText = (translatedTexts.chatUnreadGlobalBannerText || "").replace(
    "{count}",
    String(totalUnread)
  );

  return (
    <div
      className="w-100 border-bottom-light bg-light-3 py-15 px-60 md:px-40 sm:px-20"
      role="status"
    >
      <p className="text-15 lh-13 text-dark-1 fw-600 mb-8">{bannerText}</p>
      <Link
        href={chatHref}
        className="text-14 lh-13 fw-600 text-purple-1 underline"
      >
        {translatedTexts.chatUnreadGlobalBannerCta}
      </Link>
    </div>
  );
}
