"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authentication, db } from "../firebase";
import { handleGetUserInfo } from "../utils/handleFirebaseQuery";
import {
  handleGetFirestore,
  handleGetUserInfoJobs,
} from "@/utils/firestoreUtils";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user); // Așteaptă ca utilizatorul să fie setat

        try {
          // Asigură-te că UID-ul utilizatorului este disponibil
          const q = query(
            collection(db, "Users"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q); // Așteaptă răspunsul de la Firestore

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => setUserData(doc.data())); // Setează datele utilizatorului
          } else {
            console.log(
              "Niciun document găsit pentru acest UID în colecția Users."
            );
          }
        } catch (error) {
          console.error(
            "Eroare la preluarea datelor utilizatorului din Firestore:",
            error
          );
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }

      setLoading(false); // Setează `loading` ca `false` după finalizarea procesului
    });

    return unsubscribe;
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    currentUser,
    userData,
    loading,

    setUserData,
    setCurrentUser,
    setLoading,

    language,
    changeLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
