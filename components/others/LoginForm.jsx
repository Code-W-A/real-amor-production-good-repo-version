"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authentication, db } from "@/firebase"; // Import Firebase authentication și provider-ul Google
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; // Pentru a redirecționa după autentificare
import { useAuth } from "@/context/AuthContext";
import { useTranslate } from "@/hooks/useTranslate";
import AlertBox from "../uiElements/AlertBox";
import { query } from "firebase/database";
import { collection, getDocs, where } from "firebase/firestore";

export default function LoginForm({
  emailText,
  parolaText,
  autentificareText,
  aiContText,
  inscrieText,
  translatedLinks,
}) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter(); // Instanța routerului pentru navigare
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const { userData, setUserData, setCurrentUser } = useAuth();

  // Funcție pentru actualizarea câmpurilor din formular
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funcție pentru autentificarea cu email și parolă
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage({ type: "", content: "", showAlert: false });

    try {
      const userCredential = await signInWithEmailAndPassword(
        authentication,
        formData.email,
        formData.password
      );
      console.log("user credential....", userCredential.user.uid);
      const q = query(
        collection(db, "Users"),
        where("uid", "==", userCredential.user.uid)
      );
      const querySnapshot = await getDocs(q); // Așteaptă răspunsul de la Firestore

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => setUserData(doc.data())); // Setează datele utilizatorului
      } else {
        console.log(
          "Niciun document găsit pentru acest UID în colecția Users."
        );
      }

      setAlertMessage({
        type: "success",
        content: translatedLinks.autentificareReusita,
        showAlert: true,
      });
      router.push("/quiz");
    } catch (err) {
      setAlertMessage({
        type: "danger",
        content: translatedLinks.autentificareEsuata + err.message,
        showAlert: true,
      });
    }
  };

  // Funcție pentru autentificarea cu Google
  // const handleGoogleSignIn = async () => {
  //   setError("");
  //   setSuccess("");

  //   try {
  //     await signInWithPopup(authentication, googleProvider);
  //     setSuccess("Autentificare cu Google reușită!");
  //     router.push("/dashboard"); // Navighează către o pagină (ex: /dashboard) după autentificare
  //   } catch (err) {
  //     // setError("Autentificare cu Google eșuată: " + err.message);
  //   }
  // };

  return (
    <div className="form-page__content lg:py-50">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-9 col-lg-9">
            <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">{autentificareText}</h3>
              <p className="mt-10">
                {aiContText}
                <Link href="/signup" className="text-purple-1">
                  {" "}
                  {inscrieText}
                </Link>
              </p>

              {/* Formular de autentificare */}
              <form
                className="contact-form respondForm__form row y-gap-20 pt-30"
                onSubmit={handleSubmit}
              >
                {/* Email */}
                <div className="col-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {emailText}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={emailText}
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Parolă */}
                <div className="col-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {parolaText}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={parolaText}
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Buton de login */}
                <div className="col-12">
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="button -md -purple-1 fw-500 w-1/1"
                  >
                    {autentificareText}
                  </button>
                </div>
              </form>

              {/* Mesaje de succes sau eroare */}
              {error && (
                <div className="bg-red-500 text-white py-2 px-4 rounded-md mt-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500 text-white py-2 px-4 rounded-md mt-4">
                  {success}
                </div>
              )}
              <p className="mt-10">
                {translatedLinks.aiUitatParolText}
                <Link href="/reset-password" className="text-purple-1">
                  {" "}
                  {translatedLinks.resetPassText}
                </Link>
              </p>
              {/* Opțiuni de autentificare alternativă */}
              {/* <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                Sau conectează-te folosind
              </div>

              <div className="d-flex x-gap-20 items-center justify-between pt-20">
       
                <div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14"
                  >
                    Autentificare cu Google+
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* Afișare componentă AlertBox */}
      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
    </div>
  );
}
