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
import { questions } from "@/data/quiz";
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
  userUid,
}) {
  const router = useRouter();
  const [isCompatible, setIsCompatible] = useState(false); // Starea pentru compatibilitate

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

  // Document PDF generat local
  const PDFDocument = (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>
          {translatedTexts.rezultateleChestionaruluiText} {data?.username}
        </Text>
        {questions &&
          questions.map((question, index) => (
            <View key={question.id}>
              <Text style={styles.question}>
                {index + 1}. {question.text || "Întrebare indisponibilă"}
              </Text>
              <Text style={styles.answer}>
                {translatedTexts.raspunsulUtilizatoruluiText}:{" "}
                {data?.responses?.[question.id] || "N/A"}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );

  return (
    <tr>
      <td>{data.username}</td>
      <td>{data.gender ? data.gender : "N/A"}</td>
      <td>{data.isActivated ? "Cont activ" : "Cont inactiv"}</td>
      <td>{compatibility}%</td>
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
