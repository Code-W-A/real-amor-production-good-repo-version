"use client";

import MobileFooter from "./MobileFooter";

import { menuList } from "../../../data/menu";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitch from "@/components/common/LanguageSwitch";
import { useAuth } from "@/context/AuthContext";

export default function MobileMenu({
  setActiveMobileMenu,
  activeMobileMenu,
  tarifsText,
  methodeText,
  translatedLinks,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuNesting, setMenuNesting] = useState([]);
  const [menuItem, setMenuItem] = useState("");
  const [submenu, setSubmenu] = useState("");
  const { userData, currentUser } = useAuth();

  useEffect(() => {
    menuList.forEach((elm) => {
      elm?.links?.forEach((elm2) => {
        if (elm2.href?.split("/")[1] == pathname?.split("/")[1]) {
          setMenuItem(elm.title);
        } else {
          elm2?.links?.map((elm3) => {
            if (elm3.href?.split("/")[1] == pathname?.split("/")[1]) {
              setMenuItem(elm.title);
              setSubmenu(elm2.title);
            }
          });
        }
      });
    });
  }, []);
  useEffect(() => {
    setShowMenu(true);
  }, []);
  const pathname = usePathname();
  return (
    <div
      className={`header-menu js-mobile-menu-toggle ${
        activeMobileMenu ? "-is-el-visible" : ""
      }`}
    >
      <div className="header-menu__content">
        <div className="mobile-bg js-mobile-bg"></div>

        <div className="d-none xl:d-flex items-center px-20 py-20 border-bottom-light">
          {!currentUser ? (
            <>
              <Link
                href="/login"
                className={`text-dark-1 ${
                  pathname == "/login" ? "activeMenu" : "inActiveMenu"
                } `}
              >
                {translatedLinks.logInText}
              </Link>
              <Link
                href="/signup"
                className={`text-dark-1 ml-30 ${
                  pathname == "/signup" ? "activeMenu" : "inActiveMenu"
                } `}
              >
                {translatedLinks.signUpText}
              </Link>
            </>
          ) : (
            <Link
              href="/profil-client"
              className={`text-dark-1 ml-30 ${
                pathname == "/signup" ? "activeMenu" : "inActiveMenu"
              } `}
            >
              {translatedLinks.contText}
            </Link>
          )}

          <div className="ml-30">
            <LanguageSwitch />
          </div>
        </div>

        {/* {showMenu && activeMobileMenu && (
          <div className="mobileMenu text-dark-1">
            <div className="submenuOne">
              <div className="title">
                <Link
                  className={
                    menuItem == "Real Amor" ? "activeMenu" : "inActiveMenu"
                  }
                  href="https://real-amor.com/"
                >
                  Real Amor
                </Link>
              </div>
            </div>
            <div className="submenuOne">
              <div className="title">
                <Link
                  className={
                    menuItem == "tarifsText" ? "activeMenu" : "inActiveMenu"
                  }
                  href="https://real-amor.com/"
                >
                  {tarifsText}
                </Link>
              </div>
            </div>
            <div className="submenuOne">
              <div className="title">
                <Link
                  className={
                    menuItem == "Real Amor" ? "activeMenu" : "inActiveMenu"
                  }
                  href="https://real-amor.com/"
                >
                  {methodeText}
                </Link>
              </div>
            </div>
          </div>
        )} */}

        {/* mobile footer start */}
        {/* <MobileFooter /> */}
        {/* mobile footer end */}
      </div>

      <div
        className="header-menu-close"
        onClick={() => {
          setActiveMobileMenu(false);
        }}
        data-el-toggle=".js-mobile-menu-toggle"
      >
        <div className="size-40 d-flex items-center justify-center rounded-full bg-white">
          <div className="icon-close text-dark-1 text-16"></div>
        </div>
      </div>

      <div
        className="header-menu-bg"
        onClick={() => setActiveMobileMenu(false)}
      ></div>
    </div>
  );
}
