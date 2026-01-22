import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { QuizResultsDocument } from "../InformatiiUtilizator/QuizResultsDocument";
import { QuizResultsDocumentListComp } from "./QuizResultsDocumentListaComp";

export default function ListCompatibilitati({
  data,
  translatedTexts,
  compatibility,
  compatibilityDetails = [],
  userUid,
}) {
  const router = useRouter();
  const [isCompatible, setIsCompatible] = useState(false); // Starea pentru compatibilitate
  const [showDiffDialog, setShowDiffDialog] = useState(false);
  const [copiedDebug, setCopiedDebug] = useState(false);
  const debugCompatEnabled = process.env.NEXT_PUBLIC_DEBUG_COMPAT === "true";

  const formatAnswer = (value) => {
    if (value === null || typeof value === "undefined") return "-";
    if (typeof value?.toDate === "function") {
      try {
        return value.toDate().toLocaleString();
      } catch {
        return String(value);
      }
    }
    if (value instanceof Date) return value.toLocaleString();
    if (Array.isArray(value)) return value.map(formatAnswer).join(", ");
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const diffQuestions = Array.isArray(compatibilityDetails)
    ? compatibilityDetails.filter((q) => q && q.isCompatible === false)
    : [];

  const buildDebugPayload = () => ({
    generatedAt: new Date().toISOString(),
    currentUserId: userUid,
    compatibleUserId: data?.id || null,
    compatibleUsername: data?.username || null,
    compatibilityPercent: compatibility,
    diffs: diffQuestions.map((q) => ({
      set: q?.set || null,
      questionId: q?.questionId ?? null,
      questionText: q?.questionText ?? null,
      currentUserAnswer: q?.currentUserAnswer ?? null,
      comparedUserAnswer: q?.comparedUserAnswer ?? null,
    })),
  });

  const copyDebugPayload = async () => {
    try {
      const payload = buildDebugPayload();
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopiedDebug(true);
      setTimeout(() => setCopiedDebug(false), 2500);
    } catch (e) {
      console.error("Failed to copy debug payload:", e);
    }
  };

  const handleCopyResponses = async () => {
    try {
      const userRef = doc(db, "Users", userUid); // Referința utilizatorului selectat
      await updateDoc(userRef, { responses: data.responses || {} }); // Copiază răspunsurile
      alert("Răspunsurile au fost copiate cu succes!");
    } catch (error) {
      console.error("Eroare la copierea răspunsurilor:", error);
      alert("A apărut o eroare la copierea răspunsurilor.");
    }
  };

  useEffect(() => {
    const checkCompatibility = async () => {
      try {
        const compatibilitatiRef = collection(
          db,
          "Users",
          userUid,
          "Compatibilitati"
        );
        const q = query(
          compatibilitatiRef,
          where("compatibleUserId", "==", data.id)
        );
        const querySnapshot = await getDocs(q);
        setIsCompatible(!querySnapshot.empty); // Setează `isCompatible` pe baza rezultatului
      } catch (error) {
        console.error("Error checking compatibility:", error);
      }
    };

    checkCompatibility();
  }, [data.id, userUid]);

  const handleCardClick = () => {
    router.push(`/informatii-utilizator?uid=${data.id}`);
  };

  const handleToggleCompatibility = async () => {
    try {
      const compatibilitatiRefUser1 = collection(
        db,
        "Users",
        userUid,
        "Compatibilitati"
      );
      const compatibilitatiRefUser2 = collection(
        db,
        "Users",
        data.id,
        "Compatibilitati"
      );

      if (isCompatible) {
        // Găsește și șterge documentul de compatibilitate la ambii utilizatori
        const q1 = query(
          compatibilitatiRefUser1,
          where("compatibleUserId", "==", data.id)
        );
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });

        const q2 = query(
          compatibilitatiRefUser2,
          where("compatibleUserId", "==", userUid)
        );
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });

        setIsCompatible(false);
      } else {
        // Adaugă document nou în subcolecția ambilor utilizatori și actualizează `documentId`
        const docRefUser1 = await addDoc(compatibilitatiRefUser1, {
          compatibleUserId: data.id,
          markedAt: new Date(),
        });
        await updateDoc(docRefUser1, { documentId: docRefUser1.id });

        const docRefUser2 = await addDoc(compatibilitatiRefUser2, {
          compatibleUserId: userUid,
          markedAt: new Date(),
        });
        await updateDoc(docRefUser2, { documentId: docRefUser2.id });

        setIsCompatible(true);
      }
    } catch (error) {
      console.error("Error toggling compatibility:", error);
    }
  };

  // Stiluri pentru PDF
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
      color: "#003366",
    },
    question: {
      fontSize: 12,
      marginBottom: 5,
      color: "#333333",
    },
    answer: {
      fontSize: 10,
      marginBottom: 15,
      color: "#666666",
    },
  });

  return (
    <tr>
      <td>{data.username}</td>
      <td>{data.gender ? data.gender : "N/A"}</td>
      <td>{data.isActivated ? "Cont activ" : "Cont inactiv"}</td>
      <td>{compatibility}%</td>
      <td>
        <button
          type="button"
          className="btn custom-btn-compatibilitati"
          onClick={(e) => {
            e.stopPropagation();
            setShowDiffDialog(true);
          }}
        >
          {translatedTexts.compatibilityDiffButtonText || "Voir"}
        </button>

        {showDiffDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setShowDiffDialog(false)}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                width: "min(900px, 95vw)",
                maxHeight: "85vh",
                overflow: "auto",
                padding: 20,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {translatedTexts.compatibilityDetailsHeaderText ||
                    "Réponses non compatibles"}
                </h3>
                <button
                  type="button"
                  className="button -sm -gray-1 text-dark-1"
                  onClick={() => setShowDiffDialog(false)}
                >
                  {translatedTexts.closeText || "Fermer"}
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                {debugCompatEnabled && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 12,
                      padding: 12,
                      borderRadius: 10,
                      background: "#f7f7ff",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {translatedTexts.compatibilityDebugCopyTitleText ||
                          "Debug compatibilité"}
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>
                        {translatedTexts.compatibilityDebugCopyHintText ||
                          "Copiez le JSON des réponses non compatibles pour analyse."}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="button -sm -purple-1 text-white"
                      onClick={copyDebugPayload}
                    >
                      {copiedDebug
                        ? translatedTexts.compatibilityDebugCopiedText || "Copié"
                        : translatedTexts.compatibilityDebugCopyButtonText ||
                          "Copier"}
                    </button>
                  </div>
                )}
                {diffQuestions.length === 0 ? (
                  <p style={{ margin: 0 }}>
                    {translatedTexts.compatibilityNoDiffText ||
                      "Aucune différence détectée."}
                  </p>
                ) : (
                  <table className="table table-striped" style={{ marginTop: 10 }}>
                    <thead>
                      <tr>
                        <th>
                          {translatedTexts.compatibilityQuestionText ||
                            "Question"}
                        </th>
                        <th>
                          {translatedTexts.compatibilityYourAnswerText ||
                            "Réponse (utilisateur)"}
                        </th>
                        <th>
                          {translatedTexts.compatibilityOtherAnswerText ||
                            "Réponse (compatible)"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {diffQuestions.map((q) => (
                        <tr key={`${q.questionId}-${q.questionText}`}>
                          <td style={{ width: "45%" }}>
                            {q.questionText || "-"}
                          </td>
                          <td style={{ width: "27.5%" }}>
                            {formatAnswer(q.currentUserAnswer)}
                          </td>
                          <td style={{ width: "27.5%" }}>
                            {formatAnswer(q.comparedUserAnswer)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </td>
      <td style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="btn custom-btn-compatibilitati"
        >
          {translatedTexts.veziDetaliiText}
        </button>

        <PDFDownloadLink
          document={<QuizResultsDocumentListComp userData={data} />}
          fileName={`Results_${data.username}.pdf`}
        >
          {({ loading }) => (
            <button
              onClick={(e) => e.stopPropagation()}
              className="btn custom-btn-compatibilitati"
            >
              {loading ? "Génération du PDF..." : "Télécharger le PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleCompatibility();
          }}
          className="btn custom-btn-compatibilitati"
        >
          {isCompatible
            ? "Supprimer la compatibilité"
            : "Marquer la compatibilité"}
        </button>

        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopyResponses();
          }}
          className="btn custom-btn-compatibilitati"
        >
          Copiază Răspunsuri
        </button> */}
      </td>
    </tr>
  );
}
