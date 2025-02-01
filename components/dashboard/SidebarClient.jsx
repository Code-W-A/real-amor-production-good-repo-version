"use client";

import { sidebarItems, sidebarItemsClient } from "@/data/dashBoardSidebar";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "@/firebase";

export default function SidebarClient({
  contText,
  listaCompatibilitatiText,
  chatText,
  profileText,
  deconectareText,
}) {
  const pathname = usePathname();
  const {
    currentUser,
    userData,
    loading,
    setLoading,
    setCurrentUser,
    setUserData,
  } = useAuth();
  const router = useRouter();

  // Înlocuim textele statice din `sidebarItemsClient` cu textele traduse primite prin props
  const translatedSidebarItems = [
    // { ...sidebarItemsClient[0], text: contText },
    { ...sidebarItemsClient[1], text: listaCompatibilitatiText },
    { ...sidebarItemsClient[2], text: chatText },
    { ...sidebarItemsClient[3], text: profileText },
    { ...sidebarItemsClient[4], text: deconectareText },
  ];

  useEffect(() => {
    setLoading(true);
    const authenticated = authentication;
    onAuthStateChanged(authenticated, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("is user.......");
        setLoading(false);
        // ...
      } else {
        console.log("is user......no.");
        router.push("/login");
        setLoading(false);
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <div className="sidebar -dashboard">
      {translatedSidebarItems.map((elm, i) => (
        <div
          key={i}
          className={`sidebar__item   ${
            pathname == elm.href ? "-is-active" : ""
          } `}
        >
          <Link
            key={i}
            href={elm.href}
            className="d-flex items-center text-17 lh-1 fw-500 "
            onClick={() =>
              elm.id === 8 ? handleLogout() : console.log("click")
            }
          >
            <i className={`${elm.iconClass} mr-15`}></i>
            {elm.text}
          </Link>
        </div>
      ))}
    </div>
  );
}
