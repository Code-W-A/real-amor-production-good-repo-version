"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DotLoader from "react-spinners/DotLoader";
import AlertBox from "@/components/uiElements/AlertBox";

const PROMO_DOC = ["Config", "subscriptionPromo"];

export default function AdminPromotions({ translatedTexts }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [lifetimePromoEnabled, setLifetimePromoEnabled] = useState(false);
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const t = (key, fallback) => translatedTexts?.[key] || fallback;

  const percentOptions = useMemo(
    // Keep options aligned with business needs (Stripe supports 0..100).
    () => [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
    []
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const ref = doc(db, PROMO_DOC[0], PROMO_DOC[1]);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setDiscountPercent(
            Number.isFinite(Number(data?.discountPercent))
              ? Number(data.discountPercent)
              : 0
          );
          setLifetimePromoEnabled(!!data?.lifetimePromoEnabled);
        } else {
          setDiscountPercent(0);
          setLifetimePromoEnabled(false);
        }
      } catch (e) {
        setError(
          e?.message ||
            t(
              "loadPromoSettingsErrorText",
              "Failed to load promo settings"
            )
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccessAlert(false);
    try {
      const ref = doc(db, PROMO_DOC[0], PROMO_DOC[1]);
      await setDoc(
        ref,
        {
          discountPercent,
          lifetimePromoEnabled,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      setSuccessAlert(true);
    } catch (e) {
      setError(
        e?.message ||
          t("savePromoSettingsErrorText", "Failed to save promo settings")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40vh",
        }}
      >
        <DotLoader color="#c13365" size={40} />
      </div>
    );
  }

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <AlertBox
          type="success"
          message={t("saveSuccessToast", "Modificările au fost salvate.")}
          showAlert={successAlert}
          onClose={() => setSuccessAlert(false)}
        />
        <div className="row pb-30 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              <i className="icon-discount text-purple-1 mr-10"></i>
              {t("promoTitle", "Promoții abonamente")}
            </h1>
            <div className="mt-10 text-light-1">
              {t(
                "promoDesc",
                "Configurează reducerile și promoțiile pentru abonamente"
              )}
            </div>
          </div>
        </div>

        <div className="row y-gap-30">
          {/* Card 1 - Discount Percentage */}
          <div className="col-lg-6 col-md-12">
            <div className="rounded-16 bg-white shadow-4 h-100">
              <div className="d-flex items-center py-25 px-30 border-bottom-light">
                <div className="size-50 d-flex justify-center items-center rounded-full bg-purple-1-05 mr-15">
                  <i className="text-24 icon-percent text-purple-1"></i>
                </div>
                <div>
                  <h4 className="text-18 lh-1 fw-500 text-dark-1">
                    {t("discountPercentLabel", "Reducere abonamente")}
                  </h4>
                  <p className="text-14 lh-1 text-light-1 mt-5">
                    {t("discountPercentHint", "Procent aplicat în Stripe")}
                  </p>
                </div>
              </div>

              <div className="py-30 px-30">
                <div className="d-flex items-center justify-between mb-20">
                  <span className="text-14 text-light-1">
                    {t("discountPercentValueLabel", "Procent reducere:")}
                  </span>
                  <span className="text-24 lh-1 fw-700 text-purple-1">
                    {discountPercent}%
                  </span>
                </div>

                <select
                  className="form-control"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  style={{
                    padding: "12px 16px",
                    fontSize: "16px",
                    borderRadius: "8px",
                  }}
                >
                  {percentOptions.map((p) => (
                    <option key={p} value={p}>
                      {p === 0
                        ? t("discountNoneOption", "Fără reducere")
                        : p === 100
                        ? `100% ${t("discountSuffix", "reducere")} ${t(
                            "discountFreeHint",
                            "(gratuit)"
                          )}`
                        : `${p}% ${t("discountSuffix", "reducere")}`}
                    </option>
                  ))}
                </select>

                {discountPercent > 0 && (
                  <div className="mt-20 p-15 rounded-8 bg-purple-1-05">
                    <div className="text-14 text-dark-1">
                      <i className="icon-check text-purple-1 mr-5"></i>
                      {t(
                        "discountAppliedHint",
                        "Reducerea va fi aplicată automat la checkout"
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 - Lifetime Promo Toggle */}
          <div className="col-lg-6 col-md-12">
            <div className="rounded-16 bg-white shadow-4 h-100">
              <div className="d-flex items-center py-25 px-30 border-bottom-light">
                <div className="size-50 d-flex justify-center items-center rounded-full bg-green-1-05 mr-15">
                  <i className="text-24 icon-infinity text-green-1"></i>
                </div>
                <div>
                  <h4 className="text-18 lh-1 fw-500 text-dark-1">
                    {t("lifetimePromoLabel", 'Promoție "Pe viață"')}
                  </h4>
                  <p className="text-14 lh-1 text-light-1 mt-5">
                    {t("lifetimePromoHint", 'Afișare card "1 an = pe viață"')}
                  </p>
                </div>
              </div>

              <div className="py-30 px-30">
                <div className="d-flex items-center justify-between mb-20">
                  <span className="text-14 text-light-1">
                    {t("statusLabel", "Status:")}
                  </span>
                  <span
                    className={`px-15 py-5 rounded-8 text-12 fw-500 ${
                      lifetimePromoEnabled
                        ? "bg-green-1 text-white"
                        : "bg-light-4 text-dark-1"
                    }`}
                  >
                    {lifetimePromoEnabled
                      ? t("statusActive", "ACTIV")
                      : t("statusInactive", "INACTIV")}
                  </span>
                </div>

                <div
                  className="d-flex items-center justify-between p-20 rounded-8 border-light cursor-pointer"
                  onClick={() => setLifetimePromoEnabled((prev) => !prev)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: lifetimePromoEnabled
                      ? "2px solid #6440FB"
                      : "2px solid #E5E7EB",
                  }}
                >
                  <div>
                    <div className="text-16 fw-500 text-dark-1">
                      {lifetimePromoEnabled
                        ? t("deactivatePromo", "Dezactivează")
                        : t("activatePromo", "Activează")}{" "}
                      {t("promoWord", "promoția")}
                    </div>
                    <div className="text-14 text-light-1 mt-5">
                      {lifetimePromoEnabled
                        ? t("lifetimeClickHide", "Click pentru a ascunde cardul")
                        : t(
                            "lifetimeClickShow",
                            "Click pentru a afișa cardul"
                          )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    style={{
                      width: "50px",
                      height: "28px",
                      backgroundColor: lifetimePromoEnabled
                        ? "#6440FB"
                        : "#E5E7EB",
                      borderRadius: "14px",
                      position: "relative",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "3px",
                        left: lifetimePromoEnabled ? "25px" : "3px",
                        transition: "left 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {lifetimePromoEnabled && (
                  <div className="mt-20 p-15 rounded-8 bg-green-1-05">
                    <div className="text-14 text-dark-1">
                      <i className="icon-check text-green-1 mr-5"></i>
                      {t(
                        "lifetimeVisibleHint",
                        'Cardul "Abonnement à vie" este vizibil pentru clienți'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="col-12">
              <div className="rounded-16 bg-red-1 text-white p-20">
                <i className="icon-close mr-10"></i>
                {error}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="col-12">
            <div
              className="rounded-16 bg-white shadow-4 p-30"
              style={{ padding: 30, boxSizing: "border-box" }}
            >
              <div className="d-flex items-center justify-between">
                <div>
                  <h4 className="text-18 fw-500 text-dark-1">
                    {t("saveChangesTitle", "Salvează modificările")}
                  </h4>
                  <p className="text-14 text-light-1 mt-5">
                    {t(
                      "saveChangesDesc",
                      "Configurațiile vor fi aplicate imediat"
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="button -md -purple-1 text-white px-40"
                  onClick={save}
                  disabled={saving}
                  style={{
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? (
                    <>
                      <i className="icon-loading mr-10"></i>
                      {t("savingText", "Salvez...")}
                    </>
                  ) : (
                    <>
                      <i className="icon-check mr-10"></i>
                      {t("saveText", "Salvează")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

