"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarItems } from "@/data/dashBoardSidebar";
import { handleLogout } from "@/utils/authUtils";
import { Router } from "next/router";

export default function Sidebar({ adminText, usersText, disconnectText }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="sidebar -dashboard">
      <div className={`sidebar__item`}>
        <Link
          href={"/lista-utilizatori"}
          className="d-flex items-center text-17 lh-1 fw-500 "
        >
          <i className={`text-20 icon-discovery mr-15`}></i>
          {usersText}
        </Link>
      </div>

      <div className={`sidebar__item`}>
        <Link
          href={"/login-admin"}
          onClick={() => {
            handleLogout();
            router.push("/");
          }}
          className="d-flex items-center text-17 lh-1 fw-500 "
        >
          <i className={`text-20 icon-person-3 mr-15`}></i>
          Se Déconnecter
        </Link>
      </div>
    </div>
  );
}
