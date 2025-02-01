import Image from "next/image";
import { useSearchParams } from "next/navigation"; // Folosim useSearchParams în loc de useRouter
import React, { useState, useEffect } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"; // Adăugăm updateDoc pentru a actualiza Firestore
import { db } from "@/firebase"; // Asigură-te că ai importat corect db-ul configurat pentru Firebase
import AlertBox from "@/components/uiElements/AlertBox";
import { Router, useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuizResultsDocument } from "../UtilizatorCompatibil/QuizResultsDocument ";

export default function EditProfile({ activeTab, translatedTexts }) {
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

  const router = useRouter();

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

  const deleteUserFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(db, "Users", uid); // Referință către documentul utilizatorului în Firestore
      await deleteDoc(userDocRef); // Ștergem documentul utilizatorului
      console.log("User deleted from Firestore successfully.");
    } catch (error) {
      console.error("Error deleting user from Firestore:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!uid) return;
    setShowConfirmDialog(false);
    try {
      setIsDeleting(true); // Arată mesajul de încărcare

      // Realizează ștergerea utilizatorului atât din Authentication, cât și din Firestore
      const deleteFromAuth = fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      const deleteFromFirestore = deleteDoc(doc(db, "Users", uid));

      // Așteptăm finalizarea ambelor promisiuni
      const [authResponse] = await Promise.all([
        deleteFromAuth,
        deleteFromFirestore,
      ]);

      if (authResponse.ok) {
        setAlertMessage({
          type: "success",
          content: translatedTexts.successDeleteUserText,
          showAlert: true,
        });

        console.log(
          "User deleted from Authentication and Firestore successfully."
        );
      } else {
        // Dacă ștergerea din Authentication nu a reușit, anulăm și ștergerea din Firestore
        throw new Error(translatedTexts.errorDeleteUserText);
      }
    } catch (error) {
      setAlertMessage({
        type: "danger",
        content: `${translatedTexts.errorDeleteUserText}: ${error.message}`,
        showAlert: true,
      });
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false); // Elimină mesajul de încărcare
    }
  };

  // Funcție pentru a schimba valoarea isActivated
  const toggleActivation = async () => {
    try {
      const userDocRef = doc(db, "Users", uid);
      const newIsActivated = !isActivated;
      await updateDoc(userDocRef, { isActivated: newIsActivated }); // Actualizăm valoarea în Firestore
      setIsActivated(newIsActivated); // Actualizăm starea locală
    } catch (error) {
      console.error("Error updating isActivated:", error);
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
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">Age</label>
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={userData?.age || ""}
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

          {userData.responses ? (
            <div className="col-12">
              <PDFDownloadLink
                document={<QuizResultsDocument userData={userData} />}
                fileName={`Rezultate_Chestionar_${
                  userData?.username || "Utilizator"
                }.pdf`}
                className="button -md -purple-1 text-white"
              >
                {({ loading }) =>
                  loading ? "Generare PDF..." : "Descarcă PDF cu răspunsuri"
                }
              </PDFDownloadLink>
            </div>
          ) : (
            <div
              className="col-12"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "red",
                }}
              >
                Utilizatorul nu a finalizat chestionarul de intrebari
              </span>
            </div>
          )}

          <div
            className="col-12"
            style={{ display: "flex", alignItems: "center" }}
          >
            {userData?.reservation?.status === "paid" ? (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                {translatedTexts.paidForReservationText}
              </span>
            ) : (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "red",
                }}
              >
                {translatedTexts.hasNotPaidForReservationText}
              </span>
            )}
          </div>

          {userData?.isActivated ? (
            userData.subscriptionActive ||
            userData.subscriptionStatus === "canceledUntilEnd" ? (
              <>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    textAlign: "start",
                  }}
                >
                  {translatedTexts.subscriptionDetailsText}:
                </p>
                <ul>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>{translatedTexts.planText}:</strong>{" "}
                    {userData.subName}
                  </li>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>
                      {translatedTexts.subscriptionStartDateText ||
                        "Data de început"}
                      :
                    </strong>{" "}
                    {new Date(
                      userData.subscriptionStartDate.seconds * 1000
                    ).toLocaleDateString()}
                  </li>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>{translatedTexts.expiryDateText}:</strong>{" "}
                    {new Date(
                      userData.subscriptionEndDate.seconds * 1000
                    ).toLocaleDateString()}
                  </li>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>{translatedTexts.subscriptionStatusText}:</strong>
                    {userData.subscriptionStatus === "active"
                      ? translatedTexts.activeStatusText || "Activ"
                      : userData.subscriptionStatus === "canceledUntilEnd"
                      ? `${
                          translatedTexts.subscriptionCanceledUntilText ||
                          "Anulat până la"
                        } ${new Date(
                          userData.subscriptionEndDate.seconds * 1000
                        ).toLocaleDateString()}`
                      : userData.subscriptionStatus === "canceledImmediately"
                      ? translatedTexts.subscriptionCanceledImmediatelyText ||
                        "Anulat imediat"
                      : translatedTexts.subscriptionExpiredText || "Expirat"}
                  </li>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>{translatedTexts.subscriptionIdText}:</strong>{" "}
                    {userData.subscriptionId}
                  </li>
                  <li
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "start",
                    }}
                  >
                    <strong>
                      {translatedTexts.subscriptionAmountText ||
                        "Suma abonament"}
                      :
                    </strong>{" "}
                    {userData.subscriptionAmount} EUR
                  </li>
                </ul>
              </>
            ) : (
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "start",
                }}
              >
                {translatedTexts.noSubscriptionText}
              </p>
            )
          ) : (
            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "start",
              }}
            >
              {translatedTexts.accountNotActivatedText}
            </p>
          )}

          <div
            className="col-12"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* <input
              type="checkbox"
              checked={isActivated}
              onChange={toggleActivation}
              className="large-checkbox"
              style={{
                width: "25px",
                height: "25px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            /> */}
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {isActivated
                ? translatedTexts.contActivText
                : translatedTexts.contDezactivatText}
            </span>
          </div>

          <div
            className="col-4 mt-20"
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <button
              type="button"
              onClick={toggleActivation}
              className="button -md -green-5"
            >
              {isActivated
                ? translatedTexts.deactivateContText
                : translatedTexts.activateContText}
            </button>
          </div>

          <div
            className="col-8 mt-20"
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <button
              type="button"
              onClick={() => setShowConfirmDialog(true)}
              className="button -md -purple-1"
              disabled={isDeleting}
            >
              {isDeleting
                ? translatedTexts.deletingUserText
                : translatedTexts.deleteUserText}
            </button>
          </div>
        </form>
      </div>
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
            borderRadius: "8px",
            width: "400px", // Ajustează lățimea dialogului
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p>{translatedTexts.confirmDeleteMessage}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              className="button -md -red-1 text-white"
              onClick={handleDeleteUser} // Confirmă ștergerea
            >
              {translatedTexts.confirmText}
            </button>
            <button
              className="button -md -gray-1 text-dark-1"
              onClick={() => setShowConfirmDialog(false)} // Închide dialogul
            >
              {translatedTexts.cancelText}
            </button>
          </div>
        </div>
      )}

      <AlertBox
        type={alertMessage.type}
        message={alertMessage.content}
        showAlert={alertMessage.showAlert}
        onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
      />
    </div>
  );
}
