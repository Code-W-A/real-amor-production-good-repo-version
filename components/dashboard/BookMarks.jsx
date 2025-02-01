"use client";

import React, { useEffect, useState } from "react";
import CourseCardTwoDash from "./DashBoardCards/CourseCardTwoDash";
import FooterNine from "../layout/footers/FooterNine";
import Pagination from "../common/Pagination";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function BookMarks({ translatedTexts }) {
  const { userData, currentUser } = useAuth();
  const [compatibleUsers, setCompatibleUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      if (!userData?.uid) return;
      try {
        const compatibilitatiRef = collection(
          db,
          "Users",
          userData.uid,
          "Compatibilitati"
        );
        const compatibilitatiSnapshot = await getDocs(compatibilitatiRef);

        // Obține ID-urile utilizatorilor compatibili
        const compatibleUserIds = compatibilitatiSnapshot.docs.map(
          (doc) => doc.data().compatibleUserId
        );

        // Obține documentele fiecărui utilizator compatibil
        const usersData = await Promise.all(
          compatibleUserIds.map(async (userId) => {
            const userDocRef = doc(db, "Users", userId); // Folosește `doc` pentru referință specifică
            const userSnapshot = await getDoc(userDocRef);
            return { id: userSnapshot.id, ...userSnapshot.data() };
          })
        );

        setCompatibleUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching compatible users:", error);
      }
    };

    fetchCompatibleUsers();
  }, [userData?.uid]);

  // Paginarea
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Lista compatibilitati</h1>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="py-30 px-30">
                <div className="row y-gap-30">
                  {currentUsers.map((user) => (
                    <CourseCardTwoDash
                      data={user}
                      key={user.id}
                      translatedTexts={translatedTexts}
                    />
                  ))}
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
      <FooterNine />
    </div>
  );
}
