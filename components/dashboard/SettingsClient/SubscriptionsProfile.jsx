import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertBox from "@/components/uiElements/AlertBox";
import { DotLoader } from "react-spinners";

export default function SubscriptionsProfile({ activeTab, translatedTexts }) {
  const { userData, setUserData } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false); // Stare pentru spinner-ul de anulare
  const [reactivating, setReactivating] = useState(false); // Stare pentru spinner-ul de anulare
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Stare pentru dialogul de confirmare

  const confirmCancelSubscription = () => setShowConfirmDialog(true); // Afișează dialogul

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(
          translatedTexts.subscriptionCanceledSuccess,
          data.subscription
        );

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
          } ${new Date(
            subscription.current_period_end * 1000
          ).toLocaleDateString()}`,
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
    if (userData && userData?.subscriptionId) {
      fetchSubscriptionDetails(userData?.subscriptionId);
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`
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
    router.push("/profil-client");
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
      const response = await fetch("/api/reactivate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
              userData?.subscriptionActive ||
              userData?.subscriptionStatus === "canceledUntilEnd" ? (
                <>
                  <p className="text-14 lh-13 mt-5">
                    {translatedTexts.subscriptionDetailsText}:
                  </p>
                  <ul>
                    <li>
                      <strong>{translatedTexts.subscriptionIdText}:</strong>{" "}
                      {subscription?.id}
                    </li>
                    <li>
                      <strong>{translatedTexts.planText}:</strong>{" "}
                      {subscription?.productName}
                    </li>
                    <li>
                      <strong>{translatedTexts.expiryDateText}:</strong>{" "}
                      {new Date(
                        subscription?.current_period_end * 1000
                      ).toLocaleDateString()}
                    </li>

                    <li>
                      <strong>{translatedTexts.subscriptionStatusText}:</strong>{" "}
                      {userData?.subscriptionStatus === "active"
                        ? translatedTexts.activeStatusText
                        : userData?.subscriptionStatus === "canceledUntilEnd"
                        ? `${translatedTexts.subscriptionCanceledUntilText} ${
                            userData?.subscriptionEndDate instanceof Date
                              ? userData.subscriptionEndDate.toLocaleDateString()
                              : new Date(
                                  userData?.subscriptionEndDate?.seconds * 1000
                                ).toLocaleDateString()
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
                    ) : userData.subscriptionStatus === "canceledUntilEnd" ? (
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
                      <Link href="/subscriptions">
                        <button
                          type="button"
                          className="button -md -green-1 text-white"
                        >
                          {translatedTexts.newSubText}
                        </button>
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <p>
                  {translatedTexts.noSubscriptionText}{" "}
                  <Link className="buy-sub" href="/subscriptions">
                    {translatedTexts.buySubscriptionText}
                  </Link>
                </p>
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
            {translatedTexts.confirmCancelSubscriptionText ||
              translatedTexts.confirmationCancelSubText}
          </p>
          <button
            className="button -md -red-1 text-white"
            onClick={handleCancelConfirmation}
          >
            {translatedTexts.confirmCancelText || translatedTexts.cancelSub}
          </button>
          <button
            className="button -md -gray-1 text-dark-1"
            onClick={closeConfirmDialog}
            style={{ marginLeft: "10px" }}
          >
            {translatedTexts.cancelText || translatedTexts.nuAnulaText}
          </button>
        </div>
      )}
    </div>
  );
}
