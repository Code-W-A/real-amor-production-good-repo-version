import Image from "next/image";
import { useSearchParams } from "next/navigation"; // Folosim useSearchParams în loc de useRouter
import React, { useRef, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Adăugăm updateDoc pentru a actualiza Firestore
import { db } from "@/firebase"; // Asigură-te că ai importat corect db-ul configurat pentru Firebase
import AlertBox from "@/components/uiElements/AlertBox";
import { Router, useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuizResultsDocument } from "../UtilizatorCompatibil/QuizResultsDocument";
import { useAuth } from "@/context/AuthContext";
import { DotLoader } from "react-spinners";
import { questionsSet1, questionsSet2, questionsSet3 } from "@/data/quiz";
import { getCountryPhoneOptions, normalizePhone } from "@/utils/phoneUtils";

function formatFirestoreDate(value) {
  if (!value) return null;
  // Firestore Timestamp (from SDK): has toDate()
  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleDateString();
  }
  // Timestamp-like (has seconds)
  if (typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleDateString();
  }
  // JS Date
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return null;
}

export default function EditProfile({ activeTab, translatedTexts }) {
  const searchParams = useSearchParams(); // Obține parametrii query din URL
  const uid = searchParams.get("uid"); // Extragem UID-ul din query-ul URL-ului
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader pentru a afișa în timp ce datele sunt preluate
  const [isActivated, setIsActivated] = useState(false); // Stare pentru a gestiona isActivated
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);
  const [showCancelSubscriptionDialog, setShowCancelSubscriptionDialog] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [editUserDraft, setEditUserDraft] = useState(null);
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Stare pentru dialogul de confirmare
  const [currentlyInCouple, setCurrentlyInCouple] = useState(false);
  const [isUpdatingLifetimeOffer, setIsUpdatingLifetimeOffer] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoadingAdminNotes, setIsLoadingAdminNotes] = useState(false);
  const [isSavingAdminNotes, setIsSavingAdminNotes] = useState(false);
  const [adminNotesSaveError, setAdminNotesSaveError] = useState("");
  const lastSavedAdminNotesRef = useRef("");
  const phoneCountryOptions = getCountryPhoneOptions();

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
        setCurrentlyInCouple(!!userData?.currentlyInCouple);
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Oprim loader-ul
    }
  };

  const adminCancelSubscription = async () => {
    if (!uid) return;
    if (!userData?.subscriptionId) {
      setAlertMessage({
        type: "danger",
        content: "Aucun abonnement actif trouvé pour cet utilisateur.",
        showAlert: true,
      });
      return;
    }
    if (userData?.subscriptionStatus === "lifetime" || userData?.lifetimeAccess) {
      setAlertMessage({
        type: "danger",
        content: "Cet utilisateur a un abonnement à vie.",
        showAlert: true,
      });
      return;
    }
    try {
      setIsCancelingSubscription(true);
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin-cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, subscriptionId: userData.subscriptionId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to cancel subscription");
      }

      // Refresh local view from Firestore
      await fetchUserData(uid);

      setAlertMessage({
        type: "success",
        content:
          "Abonnement annulé (le renouvellement automatique est désactivé).",
        showAlert: true,
      });
    } catch (error) {
      setAlertMessage({
        type: "danger",
        content: `Erreur: ${error.message}`,
        showAlert: true,
      });
      console.error("Error canceling subscription (admin):", error);
    } finally {
      setIsCancelingSubscription(false);
      setShowCancelSubscriptionDialog(false);
    }
  };

  const adminSetLifetimeOffer = async (enabled) => {
    if (!uid) return;
    try {
      setIsUpdatingLifetimeOffer(true);
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin-set-lifetime-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, enabled: !!enabled }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update lifetime offer");
      }

      // Refresh local view from Firestore
      await fetchUserData(uid);
    } catch (error) {
      setAlertMessage({
        type: "danger",
        content: `Erreur: ${error.message}`,
        showAlert: true,
      });
      console.error("Error updating lifetime offer (admin):", error);
    } finally {
      setIsUpdatingLifetimeOffer(false);
    }
  };

  const loadAdminNotes = async (uid) => {
    if (!uid) return;
    try {
      setIsLoadingAdminNotes(true);
      setAdminNotesSaveError("");
      const token = await currentUser?.getIdToken?.();
      if (!token) return;

      const res = await fetch(
        `/api/admin-user-notes?uid=${encodeURIComponent(uid)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok && typeof data?.notes === "string") {
        setAdminNotes(data.notes);
        lastSavedAdminNotesRef.current = data.notes;
      }
    } catch (e) {
      console.error("Failed to load admin notes:", e);
    } finally {
      setIsLoadingAdminNotes(false);
    }
  };

  const saveAdminNotes = async (nextNotes) => {
    if (!uid) return false;
    try {
      setIsSavingAdminNotes(true);
      setAdminNotesSaveError("");
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin-user-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, notes: nextNotes }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save notes");
      }
      lastSavedAdminNotesRef.current = String(nextNotes || "");
      return true;
    } catch (e) {
      setAdminNotesSaveError(e?.message || "Failed to save notes");
      return false;
    } finally {
      setIsSavingAdminNotes(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!uid) return;
    setShowConfirmDialog(false);
    try {
      setIsDeleting(true); // Arată mesajul de încărcare

      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      // Realizează ștergerea utilizatorului atât din Authentication, cât și din Firestore
      const deleteFromAuth = fetch("/api/admin-delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid }),
      });

      const authResponse = await deleteFromAuth;

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
        const data = await authResponse.json().catch(() => ({}));
        throw new Error(data?.error || translatedTexts.errorDeleteUserText);
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

  const toggleCurrentlyInCouple = async () => {
    try {
      const newValue = !currentlyInCouple;

      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin-set-currently-in-couple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, enabled: newValue }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update currentlyInCouple");
      }

      setCurrentlyInCouple(newValue);
      setUserData((prev) => ({ ...prev, currentlyInCouple: newValue }));
    } catch (error) {
      console.error("Error updating currentlyInCouple:", error);
    }
  };

  // Preluăm datele când UID-ul este disponibil
  useEffect(() => {
    if (uid) {
      fetchUserData(uid);
      loadAdminNotes(uid);
    }
  }, [uid]);

  // Keep an editable draft in sync with loaded user data (until admin starts editing).
  useEffect(() => {
    if (!userData) return;
    setEditUserDraft((prev) => {
      if (prev && isEditMode) return prev;
      return {
        username: userData?.username || "",
        gender: userData?.gender || "",
        purpose: userData?.purpose || "",
        age:
          userData?.age === null || typeof userData?.age === "undefined"
            ? ""
            : String(userData.age),
        phone: userData?.phone || "",
        phoneCountry: userData?.phoneCountry || "BE",
        email: userData?.email || "",
        aboutMe: userData?.aboutMe || "",
        address: userData?.address || "",
      };
    });
  }, [userData, isEditMode]);

  const saveUserEdits = async () => {
    if (!uid) return;
    if (!editUserDraft) return;
    const normalizedPhone = normalizePhone({
      phone: editUserDraft?.phone || "",
      selectedCountry: editUserDraft?.phoneCountry || null,
      targetLanguage: userData?.targetLanguage,
      strict: true,
    });
    if (!normalizedPhone.isValid) {
      setAlertMessage({
        type: "danger",
        content:
          translatedTexts?.phoneInvalidText || "Veuillez saisir un numero valide.",
        showAlert: true,
      });
      return;
    }
    try {
      setIsSavingUser(true);
      const token = await currentUser?.getIdToken?.();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin-update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, updates: editUserDraft }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save user");
      }

      await fetchUserData(uid);
      setIsEditMode(false);
      setAlertMessage({
        type: "success",
        content:
          translatedTexts?.adminUserSavedText ||
          "Modifications enregistrées.",
        showAlert: true,
      });
    } catch (e) {
      setAlertMessage({
        type: "danger",
        content: `Erreur: ${e.message}`,
        showAlert: true,
      });
    } finally {
      setIsSavingUser(false);
    }
  };

  // Notes are saved explicitly via button (no autosave).

  // Dacă încă se încarcă datele, afișăm un mesaj de încărcare
  if (loading) {
    return <p>Loading...</p>;
  }

  // Dacă nu există date despre utilizator, afișăm un mesaj de eroare
  if (!userData) {
    return <p>No user data found.</p>;
  }

  const personalityCategoryStats = (() => {
    try {
      const allQuestions = [
        ...(Array.isArray(questionsSet1) ? questionsSet1 : []),
        ...(Array.isArray(questionsSet2) ? questionsSet2 : []),
        ...(Array.isArray(questionsSet3) ? questionsSet3 : []),
      ];
      const idToCategory = new Map();
      for (const q of allQuestions) {
        if (q?.personalitate && q?.categoriePersonalitate && typeof q.id === "number") {
          idToCategory.set(q.id, String(q.categoriePersonalitate));
        }
      }

      // Initialize categories A..G
      const letters = ["A", "B", "C", "D", "E", "F", "G"];
      const stats = {};
      for (const l of letters) stats[l] = { yes: 0, total: 0 };

      const responsesBySet = userData?.responses || {};
      const sets = Object.keys(responsesBySet);
      for (const setName of sets) {
        const arr = Array.isArray(responsesBySet[setName]) ? responsesBySet[setName] : [];
        for (const r of arr) {
          const id = r?.id;
          if (typeof id !== "number") continue;
          const cat = idToCategory.get(id);
          if (!cat) continue;
          const m = cat.match(/CATEGORIA\s+([A-G])/i);
          const letter = m?.[1]?.toUpperCase() || null;
          if (!letter || !stats[letter]) continue;
          if (typeof r?.answer === "undefined" || r?.answer === null) continue;
          stats[letter].total += 1;
          if (String(r.answer).toLowerCase() === "oui") stats[letter].yes += 1;
        }
      }

      const hasAny = letters.some((l) => stats[l].total > 0);
      return { hasAny, stats, letters };
    } catch {
      return { hasAny: false, stats: {}, letters: [] };
    }
  })();

  const isDeletedAccount = !!userData?.deletedAccount?.isDeleted;

  return (
    <div
      className={`tabs__pane -tab-item-1 ${activeTab == 1 ? "is-active" : ""} `}
    >
      <div className="row pb-50 mb-10">
        <div className="col-auto" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 className="text-30 lh-12 fw-700" style={{ margin: 0 }}>
            {userData.username}
          </h1>
          {userData?.deletedAccount?.isDeleted ? (
            <span
              style={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Compte supprimé
            </span>
          ) : null}
          {/* <div className="mt-10">
              Lorem ipsum dolor sit amet, consectetur.
            </div> */}
        </div>
      </div>

      <div className="row mb-20">
        <div className="col-12" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className={`button -md ${isEditMode ? "-gray-1 text-dark-1" : "-purple-1 text-white"}`}
            onClick={() => setIsEditMode((v) => !v)}
            disabled={isSavingUser}
          >
            {isEditMode
              ? translatedTexts?.adminEditCancelText || "Annuler l'édition"
              : translatedTexts?.adminEditEnableText || "Modifier"}
          </button>
          {isEditMode ? (
            <button
              type="button"
              className="button -md -green-1 text-white"
              onClick={saveUserEdits}
              disabled={isSavingUser || !editUserDraft}
            >
              {isSavingUser
                ? translatedTexts?.adminSavingUserText || "Enregistrement..."
                : translatedTexts?.adminSaveUserText || "Enregistrer"}
            </button>
          ) : null}
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
          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts?.adminNotesLabelText || "Notes (admin uniquement)"}
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={
                translatedTexts?.adminNotesPlaceholderText ||
                "Notes internes (non visibles par le client)…"
              }
              rows={6}
              className="form-control"
              style={{ resize: "vertical", borderRadius: 8 }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 12,
              }}
            >
              {isLoadingAdminNotes ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DotLoader color="#c13365" size={20} />
                  <span style={{ fontWeight: "bold" }}>
                    {translatedTexts?.adminNotesLoadingText || "Chargement..."}
                  </span>
                </div>
              ) : null}
              <button
                type="button"
                className="button -md -purple-1 text-white"
                onClick={() => saveAdminNotes(adminNotes)}
                disabled={isSavingAdminNotes || isLoadingAdminNotes}
              >
                {isSavingAdminNotes
                  ? translatedTexts?.adminNotesSavingText || "Enregistrement..."
                  : translatedTexts?.adminNotesSaveText || "Enregistrer"}
              </button>
              {adminNotesSaveError ? (
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {translatedTexts?.adminNotesStatusErrorText ||
                    "Erreur d'enregistrement"}
                </span>
              ) : null}
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.userNameText}
            </label>
            <input
              readOnly={!isEditMode}
              required
              type="text"
              placeholder="Nume Utilizator"
              value={isEditMode ? editUserDraft?.username || "" : userData?.username || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), username: e.target.value }))
              }
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.genText}
            </label>
            {isEditMode ? (
              <select
                name="gender"
                value={editUserDraft?.gender || ""}
                onChange={(e) =>
                  setEditUserDraft((p) => ({ ...(p || {}), gender: e.target.value }))
                }
                className="form-control"
              >
                <option value="">{translatedTexts.selecteazaText}</option>
                <option value="male">{translatedTexts.hommeText}</option>
                <option value="female">{translatedTexts.femmeText}</option>
              </select>
            ) : (
            <input
              readOnly
              required
              type="text"
                value={
                  userData?.gender === "male"
                    ? translatedTexts.hommeText
                    : userData?.gender === "female"
                    ? translatedTexts.femmeText
                    : userData?.gender || ""
                }
            />
            )}
          </div>
          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">Age</label>
            <input
              readOnly={!isEditMode}
              required
              type="text"
              placeholder="Nume Utilizator"
              value={isEditMode ? editUserDraft?.age ?? "" : userData?.age || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), age: e.target.value }))
              }
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.phoneNumberText}
            </label>
            {isEditMode ? (
              <select
                name="phoneCountry"
                value={editUserDraft?.phoneCountry || "BE"}
                onChange={(e) =>
                  setEditUserDraft((p) => ({
                    ...(p || {}),
                    phoneCountry: e.target.value,
                  }))
                }
                className="form-control"
                style={{ marginBottom: 8 }}
              >
                {phoneCountryOptions.map((opt) => (
                  <option key={opt.country} value={opt.country}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : null}
            <input
              readOnly={!isEditMode}
              required
              type="text"
              placeholder="Telefon"
              value={isEditMode ? editUserDraft?.phone || "" : userData?.phone || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), phone: e.target.value }))
              }
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.emailText}
            </label>
            <input
              readOnly={!isEditMode}
              required
              type="text"
              placeholder="Email"
              value={isEditMode ? editUserDraft?.email || "" : userData?.email || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), email: e.target.value }))
              }
            />
          </div>
          <div className="col-md-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.scopText}
            </label>
            {isEditMode ? (
              <select
                name="purpose"
                value={editUserDraft?.purpose || ""}
                onChange={(e) =>
                  setEditUserDraft((p) => ({ ...(p || {}), purpose: e.target.value }))
                }
                className="form-control"
              >
                <option value="">{translatedTexts.selecteazaText}</option>
                <option value="love">{translatedTexts.amourText}</option>
                <option value="casual">{translatedTexts.sexText}</option>
                <option value="friendship">{translatedTexts.amitieText}</option>
              </select>
            ) : (
            <input
              readOnly
              required
              type="text"
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
            )}
          </div>

          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.aboutMeText}
            </label>
            <textarea
              readOnly={!isEditMode}
              required
              placeholder="Despre mine"
              rows="7"
              value={isEditMode ? editUserDraft?.aboutMe || "" : userData?.aboutMe || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), aboutMe: e.target.value }))
              }
            ></textarea>
          </div>
          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.AddressText}
            </label>
            <textarea
              readOnly={!isEditMode}
              required
              placeholder="Despre mine"
              rows="7"
              value={isEditMode ? editUserDraft?.address || "" : userData?.address || ""}
              onChange={(e) =>
                setEditUserDraft((p) => ({ ...(p || {}), address: e.target.value }))
              }
            ></textarea>
          </div>

          {/* Personality categories A..G (admin-only view) */}
          <div className="col-12">
            <div className="border-top-light pt-20 mt-10">
              <h3 className="text-18 fw-700 text-dark-1">
                {translatedTexts?.personalityCategoriesTitleText ||
                  "Catégories de personnalité"}
              </h3>
              {personalityCategoryStats.hasAny ? (
                <div className="mt-10">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{translatedTexts?.personalityCategoryColText || "Catégorie"}</th>
                        <th>{translatedTexts?.personalityScoreColText || "Score"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalityCategoryStats.letters.map((l) => {
                        const s = personalityCategoryStats.stats[l];
                        const pct = s.total ? Math.round((s.yes / s.total) * 100) : 0;
                        return (
                          <tr key={l}>
                            <td>{`CATEGORIA ${l}`}</td>
                            <td>{`${pct}% (${s.yes}/${s.total})`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="text-13 text-light-1">
                    {translatedTexts?.personalityCategoriesHintText ||
                      "Calcul basé sur les questions de personnalité (réponses Oui/Non)."}
                  </div>
                </div>
              ) : (
                <p className="mt-10">
                  {translatedTexts?.personalityCategoriesEmptyText ||
                    "Aucune réponse de personnalité trouvée pour ce profil."}
                </p>
              )}
            </div>
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
                L'utilisateur n'a pas terminé le questionnaire.
              </span>
            </div>
          )}

          {!isDeletedAccount ? (
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
          ) : null}

          {!isDeletedAccount ? (
            userData?.isActivated ? (
              userData.subscriptionActive ||
              userData.subscriptionStatus === "canceledUntilEnd" ? (
                <>
                {/*
                  Lifetime users don't have subscriptionStartDate/subscriptionEndDate/subscriptionId/subscriptionAmount.
                  They use lifetimePurchasedAt/lifetimeAmount/lifetimeSessionId instead.
                */}
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
                    <strong>{translatedTexts.subscriptionStatusText}:</strong>
                    {userData.subscriptionStatus === "lifetime" ||
                    userData.lifetimeAccess
                      ? translatedTexts.lifetimeStatusText ||
                        "Abonnement à vie"
                      : userData.subscriptionStatus === "active"
                      ? translatedTexts.activeStatusText || "Activ"
                      : userData.subscriptionStatus === "canceledUntilEnd"
                      ? `${
                          translatedTexts.subscriptionCanceledUntilText ||
                          "Anulat până la"
                        } ${formatFirestoreDate(userData?.subscriptionEndDate) || "-"}`
                      : userData.subscriptionStatus === "canceledImmediately"
                      ? translatedTexts.subscriptionCanceledImmediatelyText ||
                        "Anulat imediat"
                      : translatedTexts.subscriptionExpiredText || "Expirat"}
                  </li>

                  {userData.subscriptionStatus === "lifetime" ||
                  userData.lifetimeAccess ? (
                    <>
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
                        {formatFirestoreDate(userData?.lifetimePurchasedAt) ||
                          "-"}
                      </li>
                      <li
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          textAlign: "start",
                        }}
                      >
                        <strong>
                          {translatedTexts.subscriptionIdText ||
                            "Identifiant"}
                          :
                        </strong>{" "}
                        {userData?.lifetimeSessionId || "-"}
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
                        {typeof userData?.lifetimeAmount === "number"
                          ? `${userData.lifetimeAmount} EUR`
                          : "-"}
                      </li>
                    </>
                  ) : (
                    <>
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
                        {formatFirestoreDate(userData?.subscriptionStartDate) ||
                          "-"}
                      </li>
                      <li
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          textAlign: "start",
                        }}
                      >
                        <strong>{translatedTexts.expiryDateText}:</strong>{" "}
                        {formatFirestoreDate(userData?.subscriptionEndDate) ||
                          "-"}
                      </li>
                      <li
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          textAlign: "start",
                        }}
                      >
                        <strong>{translatedTexts.subscriptionIdText}:</strong>{" "}
                        {userData?.subscriptionId || "-"}
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
                        {typeof userData?.subscriptionAmount === "number"
                          ? `${userData.subscriptionAmount} EUR`
                          : "-"}
                      </li>
                    </>
                  )}
                </ul>

                {/* Admin action: cancel user's subscription */}
                {userData?.subscriptionStatus !== "lifetime" &&
                !userData?.lifetimeAccess &&
                userData?.subscriptionId &&
                userData?.subscriptionStatus === "active" ? (
                  <div className="col-12 mt-20">
                    {isCancelingSubscription ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <DotLoader color="#c13365" size={24} />
                        <span style={{ fontWeight: "bold" }}>
                          Annulation en cours...
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="button -md -red-1 text-white"
                        onClick={() => setShowCancelSubscriptionDialog(true)}
                      >
                        {translatedTexts.cancelSubscriptionText ||
                          "Annuler l'abonnement"}
                      </button>
                    )}
                  </div>
                ) : null}
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
            )
          ) : null}

          {userData && !isDeletedAccount ? (
            <div
              className="col-12 mt-20"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <input
                type="checkbox"
                className="large-checkbox"
                style={{ width: 22, height: 22, cursor: "pointer" }}
                checked={!!userData?.lifetimeOfferEnabled}
                disabled={isUpdatingLifetimeOffer}
                onChange={(e) => adminSetLifetimeOffer(e.target.checked)}
              />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {translatedTexts?.lifetimeOfferLabelText ||
                  "Autoriser l'offre “abonnement à vie” (ce compte uniquement)"}
              </span>
              {isUpdatingLifetimeOffer ? (
                <DotLoader color="#c13365" size={18} />
              ) : null}
            </div>
          ) : null}

          {!isDeletedAccount ? (
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
          ) : null}

          {!isDeletedAccount ? (
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
          ) : null}

          {!isDeletedAccount ? (
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
          ) : null}

            {!isDeletedAccount ? (
              <div
                className="col-12 mt-20"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={currentlyInCouple}
                  onChange={toggleCurrentlyInCouple}
                  className="large-checkbox"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {translatedTexts.currentlyInCoupleText || "În prezent în cuplu"}
                </span>
              </div>
            ) : null}
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

      {showCancelSubscriptionDialog && (
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
            width: "420px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "bold" }}>
            Confirmer l'annulation de l'abonnement pour cet utilisateur ?
          </p>
          <p style={{ marginTop: 8 }}>
            Cela désactivera le renouvellement automatique (Stripe:
            cancel_at_period_end).
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              className="button -md -red-1 text-white"
              onClick={adminCancelSubscription}
              disabled={isCancelingSubscription}
            >
              Annuler l'abonnement
            </button>
            <button
              className="button -md -gray-1 text-dark-1"
              onClick={() => setShowCancelSubscriptionDialog(false)}
              disabled={isCancelingSubscription}
            >
              Fermer
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
