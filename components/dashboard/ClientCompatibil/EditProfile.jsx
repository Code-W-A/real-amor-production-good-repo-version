"use client";

import AlertBox from "@/components/uiElements/AlertBox";
import { db } from "@/firebase";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { Router, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QuizResultsDocument } from "./QuizResultsDocument";
import { useAuth } from "@/context/AuthContext";
import { query } from "firebase/database";

export default function EditProfile({
  activeTab,
  translatedTexts,
  targetLanguage,
}) {
  const searchParams = useSearchParams(); // Obține parametrii query din URL
  const uid = searchParams.get("uid"); // Extragem UID-ul din query-ul URL-ului
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader pentru a afișa în timp ce datele sunt preluate
  const [isActivated, setIsActivated] = useState(false); // Stare pentru a gestiona isActivated
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Stare pentru dialogul de confirmare
  const { userData: currentUserData } = useAuth(); // Datele utilizatorului curent
  const router = useRouter();

  // Funcție pentru eliminarea compatibilității
  const handleRemoveCompatibility = async () => {
    if (!currentUserData?.uid || !uid) return;

    try {
      setIsDeleting(true);

      // Șterge documentul din subcolecția utilizatorului curent
      const currentUserRef = collection(
        db,
        "Users",
        currentUserData.uid,
        "Compatibilitati"
      );
      const currentUserQuery = query(
        currentUserRef,
        where("compatibleUserId", "==", uid)
      );
      const currentUserSnapshot = await getDocs(currentUserQuery);

      currentUserSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });

      // Șterge documentul din subcolecția utilizatorului compatibil
      const compatibleUserRef = collection(db, "Users", uid, "Compatibilitati");
      const compatibleUserQuery = query(
        compatibleUserRef,
        where("compatibleUserId", "==", currentUserData.uid)
      );
      const compatibleUserSnapshot = await getDocs(compatibleUserQuery);

      compatibleUserSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });

      setAlertMessage({
        type: "success",
        content: translatedTexts.eliminaCompSuccess,
        showAlert: true,
      });

      // Redirecționează utilizatorul la lista compatibilităților
      router.push("/lista-compatibilitati");
    } catch (error) {
      console.error("Error removing compatibility:", error);
      setAlertMessage({
        type: "error",
        content: translatedTexts.eliminaCompError,
        showAlert: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Funcție pentru a prelua datele utilizatorului din Firebase pe baza UID-ului
  const fetchUserData = async (uid) => {
    if (!uid) return;

    try {
      const userDocRef = doc(db, "Users", uid); // Referință către documentul utilizatorului
      const userSnapshot = await getDoc(userDocRef); // Preluăm documentul

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("user data....informatiii", userData);
        setUserData(userData); // Setăm datele utilizatorului
        setIsActivated(userData?.isActivated || false); // Setăm isActivated
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Oprim loader-ul
    }
  };

  // Preluăm datele când UID-ul este disponibil
  useEffect(() => {
    if (uid) {
      fetchUserData(uid);
    }
  }, [uid]);

  // Dacă încă se încarcă datele, afișăm un mesaj de încărcare
  if (loading) {
    return <p>Loading...</p>;
  }

  // Dacă nu există date despre utilizator, afișăm un mesaj de eroare
  if (!userData) {
    return <p>No user data found.</p>;
  }
  return (
    <div
      className={`tabs__pane -tab-item-1 ${activeTab == 1 ? "is-active" : ""} `}
    >
      <div className="row pb-50 mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-12 fw-700">{userData.username}</h1>
          {/* <div className="mt-10">
            Lorem ipsum dolor sit amet, consectetur.
          </div> */}
        </div>
      </div>
      <div className="row y-gap-20 x-gap-20 items-center">
        {/* Afișăm toate imaginile utilizatorului */}
        {userData?.images?.length > 0
          ? userData.images.map((image, index) => (
              <div
                key={image.fileUri || index} // Folosește fie fileUri (dacă există), fie index ca și cheie
                style={{ width: 300, height: 300, overflow: "hidden" }}
              >
                <Image
                  width={300}
                  height={300}
                  className="size-300"
                  src={image.fileUri}
                  alt={`User image ${index + 1}`}
                  style={{
                    objectFit: "cover", // Asigură că imaginea se întinde corect
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            ))
          : null}
      </div>

      <div className="border-top-light pt-30 mt-30">
        <form className="contact-form row y-gap-30">
          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.userNameText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={userData?.username || ""}
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.genText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={userData?.gender || ""}
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.phoneNumberText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Telefon"
              value={userData?.phone || ""}
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.emailText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Email"
              value={userData?.email || ""}
            />
          </div>
          <div className="col-md-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.scopText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={
                userData?.purpose === "love"
                  ? translatedTexts.amourText
                  : userData?.purpose === "casual"
                  ? translatedTexts.sexText
                  : userData?.purpose === "friendship"
                  ? translatedTexts.amitieText
                  : ""
              }
            />
          </div>

          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.aboutMeText}
            </label>
            <textarea
              readOnly
              required
              placeholder="Despre mine"
              rows="7"
              value={userData?.aboutMe || ""}
            ></textarea>
          </div>
          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.AddressText}
            </label>
            <textarea
              readOnly
              required
              placeholder="Despre mine"
              rows="7"
              value={userData?.address || ""}
            ></textarea>
          </div>

          {/* <div className="col-12">
          <button
            className="button -md -purple-1 text-white"
            onClick={() => router.push("/chat")}
          >
            <i className="icon-document text-30 mr-10"></i>
            Download questions PDF
          </button>
        </div> */}

          <div className="col-12">
            <button
              className="button -md -purple-1 text-white"
              onClick={(e) => {
                e.preventDefault();
                router.push("/chat");
              }}
            >
              <i className="icon-message text-30 mr-10"></i>
              {translatedTexts.chatText}
            </button>
          </div>

          <div className="col-lg-12 mt-20">
            <label className="text-30 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.quizText}
            </label>
          </div>
          {userData?.responses && (
            <div className="col-lg-6">
              <PDFDownloadLink
                document={
                  <QuizResultsDocument
                    userData={userData}
                    targetLanguage={targetLanguage}
                    noShowPersonalitateQuestions={true}
                  />
                }
                fileName={`Rezultate_Chestionar_${
                  userData?.username || "Utilizator"
                }.pdf`}
                className="button -md -purple-1 text-white"
              >
                {({ loading }) =>
                  loading
                    ? "Generare PDF..."
                    : `${translatedTexts.downloadQuizText}`
                }
              </PDFDownloadLink>
            </div>
          )}

          <div className="col-12">
            <button
              type="button"
              className="button -md -red-1 text-white"
              onClick={handleRemoveCompatibility}
              disabled={isDeleting}
            >
              {isDeleting
                ? translatedTexts.eliminaCompLoading
                : translatedTexts.eliminaComp}
            </button>
          </div>
        </form>
      </div>

      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
    </div>
  );
}
