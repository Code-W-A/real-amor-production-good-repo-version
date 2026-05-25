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
import Cookies from "js-cookie";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

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
      <head>
        <Script id="meta-pixel-base" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1355483639967192');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1355483639967192&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Context>
          <AuthProvider>{children}</AuthProvider>
        </Context>
      </body>
    </html>
  );
}
