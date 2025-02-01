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
  const calculateCompatibility = (userResponses) => {
    const currentResponses = currentUserResponses || {};

    const questionSets = [
      "firstQuestions",
      "questionsSet1",
      "questionsSet2",
      "questionsSet3",
    ];

    // Verificăm dacă prima întrebare din `firstQuestions` are aceeași valoare pentru `answer`
    const currentFirstQuestion = currentResponses.firstQuestions?.[0];
    const userFirstQuestion = userResponses.firstQuestions?.[0];

    if (
      !currentFirstQuestion ||
      !userFirstQuestion ||
      JSON.stringify(currentFirstQuestion.answer) !==
        JSON.stringify(userFirstQuestion.answer)
    ) {
      console.log("return nulll");
      return null; // Returnăm `null` dacă prima întrebare nu este compatibilă
    }

    let commonQuestions = [];
    console.log("------------------log no compat...------------------");

    questionSets.forEach((set) => {
      const currentSet = currentResponses[set] || [];
      const userSet = userResponses[set] || [];

      // Creăm un Map cu chei compuse (set + id) pentru unicitate
      const userSetMap = new Map(
        userSet.map((q) => [`${set}_${q.id}`, q]) // Cheia este compusă din set și id
      );

      currentSet.forEach((currentQuestion) => {
        // Folosim cheia compusă pentru a găsi întrebarea corespunzătoare
        const matchedQuestion = userSetMap.get(`${set}_${currentQuestion.id}`);

        if (
          matchedQuestion &&
          currentQuestion.compatibility &&
          matchedQuestion.compatibility
        ) {
          const isCompatible =
            currentQuestion.answer &&
            matchedQuestion.answer &&
            JSON.stringify(currentQuestion.answer) ===
              JSON.stringify(matchedQuestion.answer);

          commonQuestions.push({
            questionId: currentQuestion.id,
            questionText: currentQuestion.text,
            currentUserAnswer: currentQuestion.answer,
            comparedUserAnswer: matchedQuestion.answer,
            isCompatible,
          });

          // Logăm întrebările incompatibile
          if (!isCompatible) {
            console.log("log no compat...", {
              setName: set,
              questionId: currentQuestion.id,
              currentUserAnswer: currentQuestion.answer,
              comparedUserAnswer: matchedQuestion.answer,
            });
          }
        }
      });
    });

    const compatibilityScore = commonQuestions.filter((q) => q.isCompatible)
      .length
      ? Math.round(
          (commonQuestions.filter((q) => q.isCompatible).length /
            commonQuestions.length) *
            100
        )
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
                          Lista Compatibilități
                        </h2>
                      </div>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nume</th>
                            <th>Gen</th>
                            <th>Status</th>
                            <th>Compatibilitate</th>
                            <th>Acțiuni</th>
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
