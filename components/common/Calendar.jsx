"use client";

import React, { useEffect, useState } from "react";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Presupunând că `db` este instanța de Firestore configurată
import { DotLoader } from "react-spinners";

const Calendar = ({ translatedLinks }) => {
  const { currentUser, loading: loadingContext, userData } = useAuth();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(""); // Starea pentru opțiunea selectată
  const [calendlyUrl, setCalendlyUrl] = useState(""); // Stare pentru URL-ul de Calendly
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("no userData...", userData?.username);
      // router.push("/signup");
    }
    if (!loadingContext && userData?.reservation?.hasReserved) {
      router.push("/profil-client");
    }
    if (!loadingContext && userData?.reservation?.status !== "paid") {
      router.push("/pricing");
    }
    if (!loadingContext && !userData?.responses) {
      router.push("/quiz");
    }
    setIsRedirecting(false);
  }, [loadingContext]);

  // Ascultă evenimentul de programare cu useCalendlyEventListener
  useCalendlyEventListener({
    onEventScheduled: async () => {
      if (userData?.uid) {
        try {
          const userDocRef = doc(db, "Users", userData.uid);
          await updateDoc(userDocRef, {
            "reservation.hasReserved": true,
          });
          -console.log("Rezervare actualizată cu succes în Firestore");
        } catch (error) {
          console.error("Eroare la actualizarea rezervării:", error);
        }
      }

      // Redirecționează către pagina „Thank You”
      router.push("/thank-you");
    },
  });

  // Actualizează URL-ul de Calendly pe baza selecției
  // useEffect(() => {
  //   const getCalendlyUrl = () => {
  //     switch (selectedOption) {
  //       case "1":
  //         return "https://calendly.com/webdynamicx/30-minute-meeting-clone"; // Agenda lui Christophe
  //       case "2":
  //         return "https://calendly.com/webdynamicx/30-minute-meeting-clone"; // Agenda lui Belinda (femei)
  //       case "3":
  //         return "https://calendly.com/webdynamicx/30-minute-meeting-clone"; // Agenda lui Belinda (neerlandez)
  //       default:
  //         return "";
  //     }
  //   };

  //   // Setăm URL-ul de Calendly în funcție de selecție
  //   setCalendlyUrl(getCalendlyUrl());
  // }, [selectedOption]);

  useEffect(() => {
    const getCalendlyUrl = () => {
      switch (selectedOption) {
        case "1":
          return "https://calendly.com/realamor-adm/je-suis-un-homme-et-je-parle-en-francais"; // Agenda lui Christophe
        case "2":
          return "https://calendly.com/realamor-adm/je-suis-un-femme"; // Agenda lui Belinda (femei)
        case "3":
          return "https://calendly.com/realamor-adm/ik-spreek-nederlands-man-vrouw"; // Agenda lui Belinda (neerlandez)
        default:
          return "";
      }
    };

    // Setăm URL-ul de Calendly în funcție de selecție
    setCalendlyUrl(getCalendlyUrl());
  }, [selectedOption]);

  // Funcția de resetare a selecției
  const handleResetSelection = () => {
    setSelectedOption("");
    setCalendlyUrl("");
  };

  if (isRedirecting) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <DotLoader color="#c13365" size={60} />
      </div>
    );
  }

  return (
    <div
      className="calendar-container"
      style={{
        height: !calendlyUrl ? "70vh" : "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Formularul de selecție este afișat doar dacă nu există un URL de Calendly */}
      {!calendlyUrl && (
        <div
          className="form-page__content lg:py-50 sm:py-25 relative"
          style={{ width: "100vw" }}
        >
          <form className="contact-form respondForm__form row y-gap-20 pt-30">
            <h2>{translatedLinks.optiuneText}:</h2>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="form-control"
            >
              <option value="">{translatedLinks.selecteazaText}...</option>
              <option value="1">{translatedLinks.optiuneUnu}</option>
              <option value="2">{translatedLinks.optiuneDoi}</option>
              <option value="3">{translatedLinks.optiuneTrei}</option>
            </select>
          </form>
        </div>
      )}

      {/* Widget-ul Calendly și butonul de resetare */}
      {calendlyUrl && (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <InlineWidget
            url={calendlyUrl} // URL actualizat în funcție de selecție
            styles={{
              flexGrow: 1,
              minHeight: "600px",
            }}
          />
          <button
            onClick={handleResetSelection}
            className="button mt-20 -md -outline-dark-1 fw-500"
            style={{ display: "block", margin: "20px auto" }}
          >
            {translatedLinks.reseteazaText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
