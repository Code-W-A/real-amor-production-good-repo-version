"use client";

import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import FooterNine from "@/components/layout/footers/FooterNine";
import Notification from "./Notifications";
import Pagination from "@/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase";
import ListCompatibilitati from "../DashBoardCards/ListaCompatibilitatiComp";

const buttons = [
  "Edit Profile",
  "Password",
  "Social Profiles",
  "Notifications",
  "Close Account",
];

export default function Settings({ translatedTexts }) {
  const [users, setUsers] = useState([]);
  const [currentUserResponses, setCurrentUserResponses] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid"); // UID-ul utilizatorului curent

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obține datele utilizatorului curent
        const currentUserDoc = await getDoc(doc(db, "Users", uid));
        if (currentUserDoc.exists()) {
          setCurrentUserResponses(currentUserDoc.data().responses || {});
        }

        // Obține lista altor utilizatori
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== uid && user.responses); // Exclude utilizatorul curent și utilizatorii fără `responses`

        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users or current user:", error);
      }
    };

    fetchUsers();
  }, [uid]);

  // Filtrare utilizatori pe baza termenului de căutare
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Calculează utilizatorii care trebuie afișați pe pagina curentă
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Funcție de schimbare a paginii
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Funcție pentru calcularea compatibilității

  // const calculateCompatibility = (userResponses) => {
  //   const currentResponses = currentUserResponses || {};

  //   const questionSets = [
  //     "firstQuestions",
  //     "questionsSet1",
  //     "questionsSet2",
  //     "questionsSet3",
  //   ];

  //   // Verificăm dacă prima întrebare din `firstQuestions` are aceeași valoare pentru `answer`
  //   const currentFirstQuestion = currentResponses.firstQuestions?.[0];
  //   const userFirstQuestion = userResponses.firstQuestions?.[0];

  //   if (
  //     !currentFirstQuestion ||
  //     !userFirstQuestion ||
  //     JSON.stringify(currentFirstQuestion.answer) !==
  //       JSON.stringify(userFirstQuestion.answer)
  //   ) {
  //     return null; // Returnăm `null` dacă prima întrebare nu este compatibilă
  //   }

  //   let commonQuestions = [];
  //   const skipAnswer = "Je préfère ne pas répondre à la question";

  //   questionSets.forEach((set) => {
  //     const currentSet = currentResponses[set] || [];
  //     const userSet = userResponses[set] || [];

  //     const userSetMap = new Map(userSet.map((q) => [`${set}_${q.id}`, q]));

  //     currentSet.forEach((currentQuestion) => {
  //       const matchedQuestion = userSetMap.get(`${set}_${currentQuestion.id}`);

  //       if (
  //         matchedQuestion &&
  //         currentQuestion.compatibility &&
  //         matchedQuestion.compatibility
  //       ) {
  //         // Ignorăm întrebarea dacă oricare răspuns este "Je préfère ne pas répondre à la question"
  //         if (
  //           currentQuestion.answer !== skipAnswer &&
  //           matchedQuestion.answer !== skipAnswer
  //         ) {
  //           const isCompatible =
  //             currentQuestion.answer &&
  //             matchedQuestion.answer &&
  //             JSON.stringify(currentQuestion.answer) ===
  //               JSON.stringify(matchedQuestion.answer);

  //           commonQuestions.push({
  //             questionId: currentQuestion.id,
  //             questionText: currentQuestion.text,
  //             currentUserAnswer: currentQuestion.answer,
  //             comparedUserAnswer: matchedQuestion.answer,
  //             isCompatible,
  //           });
  //         }
  //       }
  //     });
  //   });

  //   // Calculăm scorul
  //   const totalQuestions = commonQuestions.length;
  //   const totalCompatible = commonQuestions.filter(
  //     (q) => q.isCompatible
  //   ).length;

  //   const compatibilityScore = totalQuestions
  //     ? Math.round((totalCompatible / totalQuestions) * 100)
  //     : 0;

  //   return {
  //     compatibilityScore,
  //     questions: commonQuestions,
  //   };
  // };

  const calculateCompatibility = (userResponses) => {
    const currentResponses = currentUserResponses || {};

    const questionSets = [
      "firstQuestions",
      "questionsSet1",
      "questionsSet2",
      "questionsSet3",
    ];

    const skipAnswer = "Je préfère ne pas répondre à la question";

    // Normalize answers so "same meaning" matches even if serialized differently
    // (e.g., multi-select arrays chosen in different order).
    const normalizeAnswer = (value) => {
      if (value === null || typeof value === "undefined") return null;
      // Firestore can store timestamps / dates as objects in some flows
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value?.toDate === "function") {
        try {
          return value.toDate().toISOString();
        } catch {
          return String(value);
        }
      }
      if (Array.isArray(value)) {
        // Sort elements to make order irrelevant
        const norm = value
          .map((v) => normalizeAnswer(v))
          .filter((v) => v !== null);
        return norm.sort((a, b) => String(a).localeCompare(String(b)));
      }
      if (typeof value === "object") {
        // Stable key order
        const keys = Object.keys(value).sort();
        const out = {};
        for (const k of keys) {
          out[k] = normalizeAnswer(value[k]);
        }
        return out;
      }
      if (typeof value === "string") {
        return value.trim();
      }
      return value;
    };

    const answersEqual = (a, b) => {
      const na = normalizeAnswer(a);
      const nb = normalizeAnswer(b);
      return JSON.stringify(na) === JSON.stringify(nb);
    };

    // Helpers for type-aware matching (so "opposite" answers can still be compatible)
    const parseDDMMYYYY = (str) => {
      if (typeof str !== "string") return null;
      const m = str.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!m) return null;
      const day = Number(m[1]);
      const month = Number(m[2]);
      const year = Number(m[3]);
      if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year))
        return null;
      const d = new Date(year, month - 1, day);
      if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day)
        return null;
      return d;
    };

    const computeAgeFromDate = (birthDate) => {
      if (!(birthDate instanceof Date)) return null;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const md = today.getMonth() - birthDate.getMonth();
      if (md < 0 || (md === 0 && today.getDate() < birthDate.getDate())) age--;
      return Number.isFinite(age) && age >= 0 && age <= 130 ? age : null;
    };

    const inRange = (value, range) => {
      if (!Number.isFinite(Number(value))) return false;
      const v = Number(value);
      const min = Number(range?.min);
      const max = Number(range?.max);
      if (!Number.isFinite(min) || !Number.isFinite(max)) return false;
      return v >= Math.min(min, max) && v <= Math.max(min, max);
    };

    const includesIgnore = (arrOrStr, needle) => {
      if (Array.isArray(arrOrStr)) return arrOrStr.includes(needle);
      if (typeof arrOrStr === "string") return arrOrStr.includes(needle);
      return false;
    };

    // Funcție actualizată pentru a căuta întrebările folosind expresii regulate
    const getAnswerByText = (responses, regex) => {
      for (const set of questionSets) {
        const question = responses[set]?.find((q) =>
          regex.test(q.text.trim().toLowerCase())
        );
        if (question?.answer) {
          return question.answer;
        }
      }
      return null;
    };

    // Expresii regulate pentru întrebările dorite
    const genderRegex = /etes-vous/i;
    const searchRegex = /cherchez-vous/i;

    const currentGender = getAnswerByText(currentResponses, genderRegex);
    const currentSearch = getAnswerByText(currentResponses, searchRegex);
    const userGender = getAnswerByText(userResponses, genderRegex);
    const userSearch = getAnswerByText(userResponses, searchRegex);

    console.log("currentGender", currentGender);
    console.log("currentSearch", currentSearch);
    console.log("userGender", userGender);
    console.log("userSearch", userSearch);

    // Verificăm compatibilitatea pe baza genului
    const genderCompatibility =
      currentSearch &&
      userGender &&
      currentSearch.includes(userGender) &&
      userSearch &&
      currentGender &&
      userSearch.includes(currentGender);

    if (!genderCompatibility) {
      console.log("Genuri incompatibile");
      return null; // Dacă genurile nu sunt compatibile, returnăm null
    }

    // Verificăm dacă prima întrebare din `firstQuestions` are aceeași valoare pentru `answer`
    const currentFirstQuestion = currentResponses.firstQuestions?.[0];
    const userFirstQuestion = userResponses.firstQuestions?.[0];

    if (
      !currentFirstQuestion ||
      !userFirstQuestion ||
      JSON.stringify(currentFirstQuestion.answer) !==
        JSON.stringify(userFirstQuestion.answer)
    ) {
      return null; // Returnăm `null` dacă prima întrebare nu este compatibilă
    }

    let commonQuestions = [];

    questionSets.forEach((set) => {
      const currentSet = currentResponses[set] || [];
      const userSet = userResponses[set] || [];

      const userSetMap = new Map(userSet.map((q) => [`${set}_${q.id}`, q]));

      currentSet.forEach((currentQuestion) => {
        const matchedQuestion = userSetMap.get(`${set}_${currentQuestion.id}`);

        if (
          matchedQuestion &&
          currentQuestion.compatibility &&
          matchedQuestion.compatibility
        ) {
          // Ignorăm întrebarea dacă oricare răspuns este "Je préfère ne pas répondre à la question"
          if (
            currentQuestion.answer !== skipAnswer &&
            matchedQuestion.answer !== skipAnswer
          ) {
            let isCompatible =
              currentQuestion.answer &&
              matchedQuestion.answer &&
              answersEqual(currentQuestion.answer, matchedQuestion.answer);

            // Special-case some questions: for compatibility, values are expected to differ.
            const qText = String(currentQuestion?.text || "").toLowerCase();
            const a = currentQuestion?.answer;
            const b = matchedQuestion?.answer;

            // Gender + seeking questions: already gated by genderCompatibility, so consider them compatible
            if (qText.includes("etes-vous") || qText.includes("cherchez-vous")) {
              isCompatible = true;
            }

            // Religion preference: treat "Sans importance" as a wildcard (compatible)
            if (qText.includes("préférence") && qText.includes("religion")) {
              const wildcard = "Sans importance";
              if (includesIgnore(a, wildcard) || includesIgnore(b, wildcard)) {
                isCompatible = true;
              }
            }

            // DOB vs partner age range: compatibility is range-based, not equality.
            if (qText.includes("date de naissance")) {
              const dob = typeof a === "string" ? parseDDMMYYYY(a) : null;
              const age = computeAgeFromDate(dob);
              // Find other user's preferred age range question
              const otherAgeRange = userSet.find((q) =>
                /tranche d’âge idéale/i.test(String(q?.text || ""))
              )?.answer;
              if (age !== null && otherAgeRange && typeof otherAgeRange === "object") {
                isCompatible = inRange(age, otherAgeRange);
              }
            }
            if (qText.includes("tranche d’âge idéale")) {
              const otherDob = typeof b === "string" ? parseDDMMYYYY(b) : null;
              const otherAge = computeAgeFromDate(otherDob);
              // Find current user's DOB question
              const currentDob = currentSet.find((q) =>
                /date de naissance/i.test(String(q?.text || ""))
              )?.answer;
              const currentAge =
                typeof currentDob === "string"
                  ? computeAgeFromDate(parseDDMMYYYY(currentDob))
                  : null;
              // Here a is the range, compare the other user's age into current range
              if (otherAge !== null && a && typeof a === "object") {
                isCompatible = inRange(otherAge, a);
              } else if (currentAge !== null && b && typeof b === "object") {
                // fallback (shouldn't happen): compare current age into other range
                isCompatible = inRange(currentAge, b);
              }
            }

            // Height/weight + preferred ranges
            if (qText.includes("votre taille")) {
              const otherRange = userSet.find((q) =>
                /taille minimum et maximum/i.test(String(q?.text || ""))
              )?.answer;
              if (typeof a === "number" && otherRange && typeof otherRange === "object") {
                isCompatible = inRange(a, otherRange);
              }
            }
            if (qText.includes("taille minimum et maximum")) {
              const otherHeight = userSet.find((q) =>
                /votre taille/i.test(String(q?.text || ""))
              )?.answer;
              if (typeof otherHeight === "number" && a && typeof a === "object") {
                isCompatible = inRange(otherHeight, a);
              }
            }

            if (qText.includes("votre poids")) {
              const otherRange = userSet.find((q) =>
                /poids minimum et maximum/i.test(String(q?.text || ""))
              )?.answer;
              if (typeof a === "number" && otherRange && typeof otherRange === "object") {
                isCompatible = inRange(a, otherRange);
              }
            }
            if (qText.includes("poids minimum et maximum")) {
              const otherWeight = userSet.find((q) =>
                /votre poids/i.test(String(q?.text || ""))
              )?.answer;
              if (typeof otherWeight === "number" && a && typeof a === "object") {
                isCompatible = inRange(otherWeight, a);
              }
            }

            commonQuestions.push({
              set,
              questionId: currentQuestion.id,
              questionText: currentQuestion.text,
              currentUserAnswer: currentQuestion.answer,
              comparedUserAnswer: matchedQuestion.answer,
              isCompatible,
            });
          }
        }
      });
    });

    // Calculăm scorul
    const totalQuestions = commonQuestions.length;
    const totalCompatible = commonQuestions.filter(
      (q) => q.isCompatible
    ).length;

    const compatibilityScore = totalQuestions
      ? Math.round((totalCompatible / totalQuestions) * 100)
      : 0;

    return {
      compatibilityScore,
      questions: commonQuestions,
    };
  };

  const compatibleUsers = users
    .filter((user) => user.responses) // Filtrează utilizatorii care au `responses`
    .map((user) => ({
      ...user,
      compatibility: calculateCompatibility(user.responses),
    }))
    .filter((user) => user.compatibility !== null) // Exclude utilizatorii incompatibili
    .sort(
      (a, b) =>
        b.compatibility.compatibilityScore - a.compatibility.compatibilityScore
    );

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                {/* Tabs Controls */}
                {/* <div className="tabs__controls d-flex x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light">
                  {buttons.map((elm, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i + 1)}
                      className={`tabs__button text-light-1 ${
                        activeTab == i + 1 ? "is-active" : ""
                      } `}
                      type="button"
                    >
                      {elm}
                    </button>
                  ))}
                </div> */}

                {/* Content Tabs */}
                <div className="tabs__content py-30 px-30 js-tabs-content">
                  {activeTab === 1 && (
                    <EditProfile
                      activeTab={activeTab}
                      translatedTexts={translatedTexts}
                    />
                  )}
                  {activeTab === 2 && <Password />}
                  {activeTab === 3 && <SocialProfiles />}
                  {activeTab === 4 && <Notification />}
                  {activeTab === 5 && <CloseAccount />}
                </div>

                {/* Lista Compatibilități */}
                <div className="tabs__content py-30 px-30 js-tabs-content mt-5">
                  <div className="tabs__pane -tab-item-1 is-active">
                    <div className="row y-gap-30 pt-30">
                      <div className="col-12">
                        <h2 className="text-black">
                          <i className="icon-person-2 text-40 mr-10"></i>
                          {translatedTexts.listCompText}
                        </h2>
                      </div>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nom d'utilisateur</th>
                            <th>{translatedTexts.genText}</th>
                            <th>Statut</th>
                            <th>Compatibilité</th>
                            <th>
                              {translatedTexts.compatibilityDetailsColText ||
                                "Détails"}
                            </th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compatibleUsers.map((user) => (
                            <ListCompatibilitati
                              data={user}
                              key={user.id}
                              compatibility={
                                user?.compatibility?.compatibilityScore
                              }
                              compatibilityDetails={user?.compatibility?.questions || []}
                              translatedTexts={translatedTexts}
                              userUid={uid}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row justify-center pt-30">
                      <div className="col-auto">
                        <Pagination
                          usersPerPage={usersPerPage}
                          totalUsers={filteredUsers.length}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNine />
    </div>
  );
}
