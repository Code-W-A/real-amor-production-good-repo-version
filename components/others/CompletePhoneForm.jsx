"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import AlertBox from "../uiElements/AlertBox";
import { useAuth } from "@/context/AuthContext";
import {
  getCountryPhoneOptions,
  getPreferredCountry,
  hasValidatedPhoneBundle,
  normalizePhone,
} from "@/utils/phoneUtils";
import { withLocalePath } from "@/utils/routeLocale";

/** Same funnel as QuizClient: avoid sending finished users through /quiz → /profil-client. */
function getPostOnboardingPath(pathname, profile) {
  if (profile?.reservation?.hasReserved) {
    return withLocalePath(pathname, "/profil-client");
  }
  if (profile?.reservation?.status === "paid") {
    return withLocalePath(pathname, "/booking");
  }
  if (profile?.responses) {
    return withLocalePath(pathname, "/pricing");
  }
  return withLocalePath(pathname, "/quiz");
}

export default function CompletePhoneForm({ translatedTexts, locale: localeProp }) {
  const { currentUser, userData, setUserData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  /** Prefer server-passed locale so SSR and hydration match (useParams can differ on first paint). */
  const lang = String(localeProp ?? params?.lang ?? "fr").toLowerCase();
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(
    getPreferredCountry(lang, userData?.phoneCountry)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });

  const phoneCountryOptions = useMemo(
    () => getCountryPhoneOptions(lang),
    [lang]
  );

  const showAlert = (type, content) => {
    setAlertMessage({ type, content, showAlert: true });
  };

  useEffect(() => {
    if (!currentUser?.uid || !pathname) return;
    if (!hasValidatedPhoneBundle(userData)) return;
    router.replace(getPostOnboardingPath(pathname, userData));
  }, [currentUser, userData, pathname, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage({ type: "", content: "", showAlert: false });

    if (!currentUser?.uid) {
      showAlert("danger", translatedTexts.notAuthenticatedText);
      return;
    }

    const check = normalizePhone({
      phone,
      selectedCountry: phoneCountry,
      targetLanguage: lang,
      strict: true,
    });
    if (!check.isValid) {
      showAlert("danger", translatedTexts.phoneInvalidText);
      return;
    }

    try {
      setIsSaving(true);
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/complete-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          selectedCountry: phoneCountry,
          targetLanguage: lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || translatedTexts.saveErrorText);
      }

      const merged = { ...(userData || {}), ...(data?.phone || {}) };
      setUserData(merged);
      showAlert("success", translatedTexts.saveSuccessText);
      setTimeout(() => {
        router.replace(getPostOnboardingPath(pathname, merged));
      }, 350);
    } catch (error) {
      showAlert("danger", error?.message || translatedTexts.saveErrorText);
    } finally {
      setIsSaving(false);
    }
  };

  if (currentUser?.uid && hasValidatedPhoneBundle(userData)) {
    return null;
  }

  return (
    <div className="form-page__content lg:py-50">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-8 col-lg-9">
            <div className="px-40 py-40 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">{translatedTexts.titleText}</h3>
              <p className="mt-10">{translatedTexts.subtitleText}</p>
              <p className="mt-10">{translatedTexts.whyText}</p>

              <form className="contact-form row y-gap-20 pt-20" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {translatedTexts.phoneLabelText}
                  </label>
                  <div style={{ marginBottom: 8 }}>
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value)}
                      className="form-control"
                    >
                      {phoneCountryOptions.map((opt) => (
                        <option key={opt.country} value={opt.country}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={translatedTexts.phonePlaceholderText}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="button -md -purple-1 fw-500 w-1/1"
                    disabled={isSaving}
                  >
                    {isSaving ? translatedTexts.savingText : translatedTexts.continueText}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage((prev) => ({ ...prev, showAlert: false }))}
      />
    </div>
  );
}
