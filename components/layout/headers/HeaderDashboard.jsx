"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import CartToggle from "../component/CartToggle";
import { sidebarItems } from "../../../data/homeSidebarItems";
import { notifications } from "@/data/notifications";
import Messages from "../component/Messages";
import MyCourses from "../component/MyCourses";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitch from "@/components/common/LanguageSwitch";

export default function HeaderDashboard({
  realAmorText,
  methodeText,
  tarifsText,
  translatedTexts,
}) {
  const [messageOpen, setMessageOpen] = useState(false);
  const { userData } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [isfullScreen, setIsfullScreen] = useState(false);
  const [isOnNotification, setIsOnNotification] = useState(false);
  const [isOnProfile, setIsOnProfile] = useState(false);

  const [documentElement, setDocumentElement] = useState();
  const handleFullScreenToggle = () => {
    setIsfullScreen((pre) => !pre);
    if (!isfullScreen) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  };

  useEffect(() => {
    setDocumentElement(document.documentElement);
  }, []);
  const openFullscreen = () => {
    if (documentElement?.requestFullscreen) {
      documentElement?.requestFullscreen();
    } else if (documentElement?.webkitRequestFullscreen) {
      /* Safari */
      documentElement?.webkitRequestFullscreen();
    } else if (documentElement?.msRequestFullscreen) {
      /* IE11 */
      documentElement?.msRequestFullscreen();
    }
  };

  const handleDarkmode = () => {
    if (document) {
      document.getElementsByTagName("html")[0].classList.toggle("-dark-mode");
    }
  };

  const closeFullscreen = () => {
    if (document?.exitFullscreen) {
      document?.exitFullscreen();
    } else if (document?.webkitExitFullscreen) {
      /* Safari */
      document?.webkitExitFullscreen();
    } else if (document?.msExitFullscreen) {
      /* IE11 */
      document?.msExitFullscreen();
    }
  };

  useEffect(() => {
    if (window.innerWidth < 990) {
      document
        .getElementById("dashboardOpenClose")
        .classList.add("-is-sidebar-hidden");
    }
    const handleResize = () => {
      if (window.innerWidth < 990) {
        document
          .getElementById("dashboardOpenClose")
          .classList.add("-is-sidebar-hidden");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className="header -dashboard -dark-bg-dark-1 js-header">
        <div className="header__container py-20 px-30">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="header__explore text-dark-1">
                  <button
                    onClick={() => {
                      document
                        .getElementById("dashboardOpenClose")
                        .classList.toggle("-is-sidebar-hidden");
                    }}
                    className="d-flex items-center js-dashboard-home-9-sidebar-toggle"
                  >
                    <i className="icon -dark-text-white icon-explore"></i>
                  </button>
                </div>

                <div className="header__logo ml-30 md:ml-20">
                  <Link data-barba href="/">
                    <Image
                      className="-light-d-none"
                      width={140}
                      height={50}
                      src="/assets/img/RealAmorNoTextSVG.svg"
                      alt="Real Amor logo"
                    />
                    <Image
                      className="-dark-d-none"
                      width={140}
                      height={50}
                      src="/assets/img/RealAmorNoTextSVG.svg"
                      alt="Real Amor logo"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="text-white d-flex items-center lg:d-none mr-15">
                  <div className="dropdown bg-transparent px-0 py-0">
                    {/* <div className="d-flex items-center text-14 text-dark-1">
                      <Link
                        href="https://real-amor.com/"
                        className="d-block text-dark-1"
                      >
                        RealAmor
                      </Link>
                    </div>
                    <div className="d-flex items-center text-14 text-dark-1 ml-20">
                      <Link
                        href="https://real-amor.com/"
                        className="d-block text-dark-1"
                      >
                        {methodeText}
                      </Link>
                    </div>
                    <div className="d-flex items-center text-14 text-dark-1 ml-20">
                      <Link
                        href="https://real-amor.com/"
                        className="d-block text-dark-1"
                      >
                        {tarifsText}
                      </Link>
                    </div> */}
                    <div className="d-flex items-center text-14 text-dark-1 ml-20">
                      <LanguageSwitch />
                    </div>
                  </div>
                </div>

                <div
                  className="relative d-flex items-center ml-10"
                  onClick={() => setIsOnProfile((pre) => !pre)}
                >
                  <a href="#" data-el-toggle=".js-profile-toggle">
                    <Image
                      fill
                      className="object-cover"
                      src={userData?.images[0]?.fileUri}
                      alt="image"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Messages setMessageOpen={setMessageOpen} messageOpen={messageOpen} />
      </header>
    </>
  );
}
