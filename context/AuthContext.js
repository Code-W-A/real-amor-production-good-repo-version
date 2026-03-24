"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authentication, db } from "../firebase";
import { handleGetUserInfo } from "../utils/handleFirebaseQuery";
import {
  handleGetFirestore,
  handleGetUserInfoJobs,
} from "@/utils/firestoreUtils";
import { isAdminUid } from "@/utils/adminUids";
import { hasValidatedPhoneBundle } from "@/utils/phoneUtils";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getLocaleFromPathname } from "@/utils/routeLocale";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("fr");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLanguage(getLocaleFromPathname(pathname));
  }, [pathname]);

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
            setUserData(null);
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

  useEffect(() => {
    if (loading) return;
    if (!currentUser?.uid) return;
    if (!pathname) return;

    // Admin users are excluded from the phone-completion gate.
    if (isAdminUid(currentUser.uid)) return;

    // Nu folosi pathParts[0]: pe căi fără prefix (ex. /client-compatibil) primul segment nu e locale
    const locale = getLocaleFromPathname(pathname);
    const completePhonePath = `/${locale}/complete-phone`;
    const isOnCompletePhonePage =
      pathname === completePhonePath || pathname.startsWith(`${completePhonePath}/`);
    const clientCompatibilityPath = `/${locale}/client-compatibil`;
    const isOnClientCompatibilityPage =
      pathname === clientCompatibilityPath ||
      pathname.startsWith(`${clientCompatibilityPath}/`);
    const hasPhone = hasValidatedPhoneBundle(userData);

    if (!hasPhone && !isOnCompletePhonePage && !isOnClientCompatibilityPage) {
      router.replace(completePhonePath);
    }
  }, [loading, currentUser, userData, pathname, router]);

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
