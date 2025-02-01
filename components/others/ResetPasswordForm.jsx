"use client";

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation"; // Pentru redirecționare
import AlertBox from "../uiElements/AlertBox";
import Link from "next/link";
import { authentication } from "@/firebase";

export default function ResetPasswordForm({
  emailText,
  resetPasswordHeader,
  sendResetText,
  successMessage,
  errorMessage,
  loginRedirectText,
}) {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Funcția pentru trimiterea emailului de resetare a parolei
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setAlertMessage({ type: "", content: "", showAlert: false });

    try {
      await sendPasswordResetEmail(authentication, email);
      setAlertMessage({
        type: "success",
        content: successMessage,
        showAlert: true,
      });
    } catch (err) {
      console.log("eroare la resetare parola: ", err);
      setAlertMessage({
        type: "danger",
        content: errorMessage + err.message,
        showAlert: true,
      });
    }
  };

  return (
    <div className="form-page__content lg:py-50">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-6 col-lg-8">
            <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">{resetPasswordHeader}</h3>

              <form
                className="contact-form respondForm__form row y-gap-20 pt-30"
                onSubmit={handlePasswordReset}
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
                    value={email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Buton de resetare */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="button -md -purple-1 fw-500 w-1/1"
                  >
                    {sendResetText}
                  </button>
                </div>
              </form>

              {/* Afișare componentă AlertBox */}
              <AlertBox
                type={alertMessage.type}
                message={alertMessage.content}
                showAlert={alertMessage.showAlert}
                onClose={() =>
                  setAlertMessage({ ...alertMessage, showAlert: false })
                }
              />

              {/* Link pentru revenire la autentificare */}
              <div className="text-center mt-4">
                <Link href="/login" className="text-purple-1">
                  {loginRedirectText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
