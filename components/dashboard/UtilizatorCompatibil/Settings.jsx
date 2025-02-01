"use client";

import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import FooterNine from "@/components/layout/footers/FooterNine";
import Notification from "./Notifications";
import CoursesCardDashboard from "../DashBoardCards/CoursesCardDashboard";
import Pagination from "@/components/common/Pagination";
import { coursesData } from "@/data/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
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
  const [pageItems, setPageItems] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Obține parametrii query din URL
  const uid = searchParams.get("uid"); // Extragem UID-ul din query-ul URL-ului

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== uid); // Exclude utilizatorul curent

        // Sortare utilizatori după `registrationDate`
        usersList.sort((a, b) => {
          const dateA = new Date(
            a.registrationDate.split("-").reverse().join("-")
          );
          const dateB = new Date(
            b.registrationDate.split("-").reverse().join("-")
          );
          return dateB - dateA;
        });

        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [uid]);

  // Filtrează utilizatorii pe baza termenului de căutare
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
    window.scrollTo({ top: 0, behavior: "smooth" }); // opțional: scroll la partea de sus a componentei după schimbarea paginii
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                {/* <div className="tabs__controls d-flex  x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  {buttons.map((elm, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i + 1)}
                      className={`tabs__button text-light-1 js-tabs-button ${
                        activeTab == i + 1 ? "is-active" : ""
                      } `}
                      type="button"
                    >
                      {elm}
                    </button>
                  ))}
                </div> */}

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <EditProfile
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                  />
                </div>
                <div className="tabs__content py-30 px-30 js-tabs-content mt-5">
                  <div className="tabs__pane -tab-item-1 is-active">
                    <div className="row y-gap-30 pt-30">
                      <div className="col-12">
                        <h2 className="text-black">
                          <i className="icon-person-2 text-40 mr-10"></i>
                          Lista Compatibilitati
                        </h2>
                      </div>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nume</th>
                            <th>Gen</th>
                            <th>Status</th>
                            <th>Compatibilitate</th>
                            <th>Actiuni</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers
                            .filter((user) => user.responses) // Filtrează utilizatorii care au `responses`
                            .map((user) => (
                              <ListCompatibilitati
                                data={user}
                                key={user.id}
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

                  <div className="tabs__pane -tab-item-2"></div>
                  <div className="tabs__pane -tab-item-3"></div>
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
