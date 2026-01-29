"use client";

import React, { useEffect, useState } from "react";
import { authentication, db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import CoursesCardDashboard from "./DashBoardCards/CoursesCardDashboard";
import Pagination from "../common/Pagination";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MyCourses({ translatedTexts }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Persist "users per page" preference
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("adminUsersPerPage");
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) {
        setUsersPerPage(n);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("adminUsersPerPage", String(usersPerPage));
    } catch {
      // ignore
    }
  }, [usersPerPage]);

  // useEffect(() => {
  //   const authenticated = authentication;
  //   onAuthStateChanged(authenticated, (user) => {
  //     if (user && user.uid === "oQzVdA6ORHc3XNZFeLhB6Asnb7a2") {
  //       console.log("is user.......");
  //     } else {
  //       console.log("is user......no.");
  //       router.push("/login-admin");
  //     }
  //   });
  // }, []);

  // Fetch users from Firestore
  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const activeUsers = usersList.filter(
          (user) => !user?.deletedAccount?.isDeleted
        );

        // Sortare utilizatori după `registrationDate`
        activeUsers.sort((a, b) => {
          const dateA = new Date(
            a.registrationDate.split("-").reverse().join("-")
          );
          const dateB = new Date(
            b.registrationDate.split("-").reverse().join("-")
          );
          return dateB - dateA;
        });

        setUsers(activeUsers);
        setFilteredUsers(activeUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  // Filtrează utilizatorii pe baza termenului de căutare
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // If page size changes, reset to first page for consistent UX.
  useEffect(() => {
    setCurrentPage(1);
  }, [usersPerPage]);

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
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              {translatedTexts.listaUtilizatoriText}
            </h1>
          </div>
          <div className="col-auto">
            <input
              type="text"
              placeholder={translatedTexts.searchText}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="col-auto" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: "bold" }}>
              {translatedTexts?.usersPerPageLabelText || "Utilizatori / pagină"}
            </span>
            <select
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
              className="form-control"
              style={{ minWidth: 120 }}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Afișăm utilizatorii într-un tabel */}
        <div className="row y-gap-30 pt-30">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{translatedTexts.userText}</th>
                <th>{translatedTexts.emailText}</th>
                <th>{translatedTexts.registrationDateText}</th>
                <th>{translatedTexts.genText}</th>
                <th>{translatedTexts.contActivText}</th>
                <th>{translatedTexts.actiuniText}</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <CoursesCardDashboard
                  data={user}
                  key={user.id}
                  translatedTexts={translatedTexts}
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
  );
}
