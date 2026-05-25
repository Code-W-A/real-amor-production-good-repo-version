import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { withLocalePath } from "@/utils/routeLocale";
import AlertBox from "@/components/uiElements/AlertBox";
import { DotLoader } from "react-spinners";

export default function SubscriptionsProfile({ activeTab, translatedTexts }) {
  const { userData, setUserData, currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false); // Stare pentru spinner-ul de anulare
  const [reactivating, setReactivating] = useState(false); // Stare pentru spinner-ul de anulare
  const [buyingLifetime, setBuyingLifetime] = useState(false);
  const [lifetimeAccepted, setLifetimeAccepted] = useState(false);
  const [promoLoading, setPromoLoading] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [globalLifetimeEnabled, setGlobalLifetimeEnabled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeLocale = translatedTexts?.lang || "fr";

  const formatProfileDate = (value) => {
    if (value == null || value === "") return "";
    const d =
      value instanceof Date
        ? value
        : typeof value?.seconds === "number"
          ? new Date(value.seconds * 1000)
          : new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(routeLocale);
  };
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Stare pentru dialogul de confirmare

  const confirmCancelSubscription = () => setShowConfirmDialog(true); // Afișează dialogul

  useEffect(() => {
    const loadPromo = async () => {
      setPromoLoading(true);
      try {
        const snap = await getDoc(doc(db, "Config", "subscriptionPromo"));
        if (snap.exists()) {
          const data = snap.data() || {};
          setDiscountPercent(
            Number.isFinite(Number(data?.discountPercent))
              ? Number(data.discountPercent)
              : 0
          );
          setGlobalLifetimeEnabled(!!data?.lifetimePromoEnabled);
        } else {
          setDiscountPercent(0);
          setGlobalLifetimeEnabled(false);
        }
      } catch {
        setDiscountPercent(0);
        setGlobalLifetimeEnabled(false);
      } finally {
        setPromoLoading(false);
      }
    };
    loadPromo();
  }, []);

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const token = await currentUser?.getIdToken?.();
      if (!token)
        throw new Error(translatedTexts.checkoutNotAuthenticatedText);
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });

      const data = await response.json();
      if (data.success) {
        // Actualizăm detaliile în Firestore
        await updateSubscriptionInFirestore({
          status: "canceledUntilEnd",
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: true,
        });

        // Afișează mesajul de alertă cu data expirării
        setAlertMessage({
          type: "success",
          content: `${
            translatedTexts.subscriptionCancelledUntilText
          } ${formatProfileDate(
            subscription.current_period_end * 1000
          )}`,
          showAlert: true,
        });
      } else {
        console.error(translatedTexts.subscriptionCanceledError, data.error);
      }
    } catch (error) {
      console.error(translatedTexts.subscriptionCanceledError, error);
    } finally {
      setCanceling(false);
    }
  };

  const handleCancelConfirmation = async () => {
    setCanceling(true);
    // Aici, codul de anulare a abonamentului rămâne la fel
    await cancelSubscription();
    setCanceling(false);
    setShowConfirmDialog(false); // Închide dialogul după anulare
  };

  const closeConfirmDialog = () => setShowConfirmDialog(false); // Închide dialogul fără anulare

  useEffect(() => {
    if (userData?.subscriptionStatus === "lifetime" || userData?.lifetimeAccess) {
      setLoading(false);
      return;
    }
    if (userData && userData?.subscriptionId) {
      fetchSubscriptionDetails(userData?.subscriptionId);
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const token = await currentUser?.getIdToken?.();
      if (!token)
        throw new Error(translatedTexts.checkoutNotAuthenticatedText);
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      const isCanceled = data.cancel_at_period_end; // Adevărat dacă e programat să se anuleze la finalul perioadei curente
      const isExpired = data.status === "canceled" && !data.current_period_end; // True dacă e anulat fără perioadă activă
      const isActive = data.status === "active";
      const isImmediatelyCanceled =
        data.status === "canceled" && data.current_period_end === null;

      setSubscription({
        ...data,
        status: isActive
          ? "active"
          : isImmediatelyCanceled
          ? "canceledImmediately"
          : isCanceled
          ? "canceledUntilEnd"
          : "expired",
      });
      setLoading(false);
    } catch (error) {
      console.error(translatedTexts.subscriptionDetailsError, error);
      setLoading(false);
    }
  };

  // Funcția de actualizare în Firestore pentru anulare
  const updateSubscriptionInFirestore = async (updateData) => {
    if (!userData || !userData?.uid) return;
    const userDocRef = doc(db, "Users", userData.uid);

    await updateDoc(userDocRef, {
      subscriptionActive: updateData.status === "active",
      subscriptionStatus: updateData.status,
      subscriptionEndDate: updateData.subscriptionEndDate,
      cancelAtPeriodEnd: updateData.cancelAtPeriodEnd,
    });
    router.push(withLocalePath(pathname, "/profil-client"));
    // Actualizăm și datele locale din context pentru UI
    setUserData((prevUserData) => ({
      ...prevUserData,
      subscriptionActive: updateData.status === "active",
      subscriptionStatus: updateData.status,
      subscriptionEndDate: updateData.subscriptionEndDate,
      cancelAtPeriodEnd: updateData.cancelAtPeriodEnd,
    }));
    router.refresh();
  };

  const reactivateSubscription = async () => {
    try {
      setReactivating(true);
      const token = await currentUser?.getIdToken?.();
      if (!token)
        throw new Error(translatedTexts.checkoutNotAuthenticatedText);
      const response = await fetch("/api/reactivate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });

      const data = await response.json();
      if (data.success) {
        await updateSubscriptionInFirestore({
          status: "active",
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: false,
        });

        setAlertMessage({
          type: "success",
          content: translatedTexts.subscriptionReactivatedSuccessText,
          showAlert: true,
        });
      } else {
        console.error(
          translatedTexts.subscriptionReactivationErrorText,
          data.error
        );
      }
      setReactivating(false);
    } catch (error) {
      setReactivating(false);
      console.error(translatedTexts.subscriptionReactivationErrorText, error);
    }
  };

  const canShowLifetimeOffer = () => {
    const alreadyLifetime =
      userData?.subscriptionStatus === "lifetime" || userData?.lifetimeAccess;
    if (alreadyLifetime) return false;

    const userOverride =
      typeof userData?.lifetimeOfferEnabled === "boolean"
        ? userData.lifetimeOfferEnabled
        : null;
    const lifetimeEnabled =
      userOverride === true
        ? true
        : userOverride === false
        ? false
        : globalLifetimeEnabled;

    return !!lifetimeEnabled;
  };

  const initiateLifetimeCheckout = async () => {
    if (!lifetimeAccepted) return;
    try {
      setBuyingLifetime(true);

      const token = await currentUser?.getIdToken?.();
      if (!token)
        throw new Error(translatedTexts.checkoutNotAuthenticatedText);

      const res = await fetch("/api/manual-payment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentType: "lifetime",
          planKey: "LIFETIME",
          planLabel: translatedTexts.abonamentLifetimeText,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error ||
            `${translatedTexts.checkoutErrorPrefixText}${res.status} - ${res.statusText}`
        );
      }

      setAlertMessage({
        type: "success",
        content:
          translatedTexts.manualPaymentRequestSuccessText ||
          `Email trimis cu IBAN + sumă + cod (${data?.referenceCode || "-"})`,
        showAlert: true,
      });
    } catch (err) {
      console.error(translatedTexts.checkoutInitFailedText, err);
      setAlertMessage({
        type: "danger",
        content: err?.message || translatedTexts.checkoutInitFailedText,
        showAlert: true,
      });
    } finally {
      setBuyingLifetime(false);
    }
  };

  const LifetimeOfferCard = () => {
    if (!canShowLifetimeOffer()) return null;

    return (
      <div className="mt-30">
        <div style={{ maxWidth: 520 }}>
          <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
            <div className="priceCard__content py-30 px-30 text-center">
              <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                {translatedTexts.abonamentLifetimeText}
              </div>
              <div className="text-14 text-light-1 mt-5">
                {translatedTexts.lifetimeSectionHintText}
              </div>

              {!promoLoading && discountPercent > 0 && (
                <div className="mt-10 text-14 text-purple-1">
                  {translatedTexts.promoLabelText}: -{discountPercent}%
                </div>
              )}

              <div className="terms-acceptance mt-20">
                <label>
                  <input
                    type="checkbox"
                    checked={lifetimeAccepted}
                    onChange={() => setLifetimeAccepted(!lifetimeAccepted)}
                  />{" "}
                  {translatedTexts.acceptTermsText}
                </label>
              </div>

              <div className="d-inline-block mt-20">
                <button
                  type="button"
                  className={`button px-30 py-15 fw-500 ${
                    lifetimeAccepted ? "-purple-1" : "disabled-button"
                  }`}
                  disabled={!lifetimeAccepted || buyingLifetime}
                  onClick={initiateLifetimeCheckout}
                >
                  {buyingLifetime ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <DotLoader color="#ffffff" size={18} />
                      {translatedTexts.processingText}
                    </span>
                  ) : (
                    translatedTexts.getStartedText
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`tabs__pane -tab-item-4 ${activeTab == 4 ? "is-active" : ""}`}
    >
      <form className="contact-form">
        <div className="row">
          <div className="col-12">
            <div className="text-16 fw-500 text-dark-1">
              {translatedTexts.manageSubscriptionText}
            </div>

            {loading ? (
              <div className="spinner-container">
                <p>{translatedTexts.loadingText}</p>
                <DotLoader color="#c13365" size={30} />
              </div>
            ) : userData?.isActivated ? (
              userData?.subscriptionStatus === "lifetime" ||
              userData?.lifetimeAccess ||
              userData?.subscriptionActive ||
              userData?.subscriptionStatus === "canceledUntilEnd" ? (
                <>
                  <p className="text-14 lh-13 mt-5">
                    {translatedTexts.subscriptionDetailsText}:
                  </p>
                  <ul>
                    <li>
                      <strong>{translatedTexts.subscriptionIdText}:</strong>{" "}
                      {userData?.subscriptionStatus === "lifetime" ||
                      userData?.lifetimeAccess
                        ? userData?.lifetimeSessionId || "-"
                        : subscription?.id}
                    </li>
                    <li>
                      <strong>{translatedTexts.planText}:</strong>{" "}
                      {userData?.subscriptionStatus === "lifetime" ||
                      userData?.lifetimeAccess
                        ? userData?.subName || translatedTexts.abonamentLifetimeText
                        : subscription?.productName}
                    </li>
                    <li>
                      <strong>{translatedTexts.expiryDateText}:</strong>{" "}
                      {userData?.subscriptionStatus === "lifetime" ||
                      userData?.lifetimeAccess
                        ? "-"
                        : formatProfileDate(
                            subscription?.current_period_end * 1000
                          )}
                    </li>

                    <li>
                      <strong>{translatedTexts.subscriptionStatusText}:</strong>{" "}
                      {userData?.subscriptionStatus === "lifetime" ||
                      userData?.lifetimeAccess
                        ? translatedTexts.lifetimeStatusText
                        : userData?.subscriptionStatus === "active"
                        ? translatedTexts.activeStatusText
                        : userData?.subscriptionStatus === "canceledUntilEnd"
                        ? `${translatedTexts.subscriptionCanceledUntilText} ${
                            userData?.subscriptionEndDate instanceof Date
                              ? formatProfileDate(userData.subscriptionEndDate)
                              : formatProfileDate(
                                  userData?.subscriptionEndDate
                                )
                          }`
                        : userData?.subscriptionStatus === "canceledImmediately"
                        ? translatedTexts.subscriptionCanceledImmediatelyText
                        : translatedTexts.subscriptionExpiredText}
                    </li>
                  </ul>

                  <div className="col-12">
                    {canceling ? (
                      <div className="spinner-container">
                        <p>{translatedTexts.cancelingText}</p>
                        <DotLoader color="#c13365" size={30} />
                      </div>
                    ) : reactivating ? (
                      <div className="spinner-container">
                        <p>{translatedTexts.reactivatingText}</p>
                        <DotLoader color="#c13365" size={30} />
                      </div>
                    ) : userData?.subscriptionStatus === "lifetime" ||
                      userData?.lifetimeAccess ? null : userData.subscriptionStatus === "canceledUntilEnd" ? (
                      <button
                        type="button"
                        className="button -md -green-1 text-white"
                        onClick={reactivateSubscription}
                      >
                        {translatedTexts.reactivateSubscriptionText}
                      </button>
                    ) : userData?.subscriptionStatus === "active" ? (
                      <button
                        type="button"
                        className="button -md -red-1 text-white"
                        onClick={confirmCancelSubscription}
                      >
                        {translatedTexts.cancelSubscriptionText}
                      </button>
                    ) : (
                      <Link href={withLocalePath(pathname, "/subscriptions")}>
                        <button
                          type="button"
                          className="button -md -green-1 text-white"
                        >
                          {translatedTexts.newSubText}
                        </button>
                      </Link>
                    )}
                  </div>
                  <LifetimeOfferCard />
                </>
              ) : (
                <>
                <p>
                  {translatedTexts.noSubscriptionText}{" "}
                  <Link
                    className="buy-sub"
                    href={withLocalePath(pathname, "/subscriptions")}
                  >
                    {translatedTexts.buySubscriptionText}
                  </Link>
                </p>
                  <LifetimeOfferCard />
                </>
              )
            ) : (
              <p>{translatedTexts.accountNotActivatedText}</p>
            )}
          </div>
        </div>
      </form>
      {/* Afișare componentă AlertBox */}
      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
      {showConfirmDialog && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          <p>
            {translatedTexts.confirmationCancelSubText}
          </p>
          <button
            className="button -md -red-1 text-white"
            onClick={handleCancelConfirmation}
          >
            {translatedTexts.confirmCancelText}
          </button>
          <button
            className="button -md -gray-1 text-dark-1"
            onClick={closeConfirmDialog}
            style={{ marginLeft: "10px" }}
          >
            {translatedTexts.cancelText}
          </button>
        </div>
      )}
    </div>
  );
}
