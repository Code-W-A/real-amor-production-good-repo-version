"use client";

import "../public/assets/sass/styles.scss";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-calendar/dist/Calendar.css";
config.autoAddCss = false;

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import Context from "@/context/Context";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Cookies from "js-cookie";
import { GoogleTagManager } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  const [lang, setLang] = useState("fr"); // Setăm limba implicită la "fr"

  useEffect(() => {
    // Inițializăm AOS pentru animații
    AOS.init({
      duration: 700,
      offset: 120,
      easing: "ease-out",
      once: true,
    });

    // Obținem limba din cookie sau folosim limba implicită "fr"
    const savedLocale = Cookies.get("NEXT_LOCALE") || "fr";
    setLang(savedLocale); // Setăm limba pe baza valorii din cookie
  }, []);

  return (
    <html lang={lang} className="">
      <GoogleTagManager gtmId="G-RZ4DR59LZ5" />
      <head></head>
      <body>
        <Context>
          <AuthProvider>{children}</AuthProvider>
        </Context>
      </body>
    </html>
  );
}
