"use client";

import React, { useEffect, useState } from "react";
import { authentication, db, functionsClient } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import CoursesCardDashboard from "./DashBoardCards/CoursesCardDashboard";
import Pagination from "../common/Pagination";
import { onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useParams, useRouter } from "next/navigation";

export default function MyCourses({ translatedTexts }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportingFormat, setExportingFormat] = useState("");
  const [reminderStage, setReminderStage] = useState("quiz_incomplete");
  const [isRemindersLoading, setIsRemindersLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const getExportFileBaseName = (lang) => {
    if (lang === "nl") return "gebruikers-export";
    if (lang === "en") return "users-export";
    return "utilisateurs-export";
  };

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

  const handleExportUsers = async (format) => {
    try {
      setExportingFormat(format);
      const currentUser = authentication?.currentUser;
      const token = await currentUser?.getIdToken?.();
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const exportFormat = format === "xlsx" ? "xlsx" : "csv";
      const lang = String(params?.lang || "fr").toLowerCase();
      const res = await fetch(
        `/api/admin-export-users?format=${exportFormat}&lang=${encodeURIComponent(lang)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to export users");
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition") || "";
      const match = contentDisposition.match(/filename="([^"]+)"/i);
      const fallbackBaseName = getExportFileBaseName(lang);
      const filename =
        match?.[1] ||
        `${fallbackBaseName}-${Date.now()}.${exportFormat === "xlsx" ? "xlsx" : "csv"}`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export users failed:", error);
      alert(error?.message || "Export failed");
    } finally {
      setExportingFormat("");
    }
  };

  const runReminderAction = async (action) => {
    try {
      setIsRemindersLoading(true);
      const runReminders = httpsCallable(functionsClient, "runRemindersCallable");
      const result = await runReminders({
        action,
        stage: reminderStage,
        limit: 200,
      });
      const data = result?.data || {};
      const stageResult = Array.isArray(data?.stageResults)
        ? data.stageResults.find((s) => s.stage === reminderStage) || data.stageResults[0]
        : null;

      if (action === "preview") {
        const matched = Number(stageResult?.totalMatched || data?.summary?.totalMatched || 0);
        const previewed = Number(stageResult?.totalPreviewed || data?.summary?.totalPreviewed || 0);
        alert(
          `Preview ${reminderStage}\nMatched: ${matched}\nPreviewed: ${previewed}`
        );
      } else {
        const sentCount = Number(stageResult?.sentCount || data?.summary?.sentCount || 0);
        const skippedCount = Number(stageResult?.skippedCount || data?.summary?.skippedCount || 0);
        const failedCount = Number(stageResult?.failedCount || data?.summary?.failedCount || 0);
        alert(
          `Send ${reminderStage}\nSent: ${sentCount}\nSkipped: ${skippedCount}\nFailed: ${failedCount}`
        );
      }
    } catch (error) {
      console.error("Reminder action failed:", error);
      alert(error?.message || "Reminder action failed");
    } finally {
      setIsRemindersLoading(false);
    }
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
          <div className="col-auto" style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="button -sm -purple-1 text-white"
              onClick={() => handleExportUsers("csv")}
              disabled={!!exportingFormat}
            >
              {exportingFormat === "csv" ? "Export..." : "Export CSV"}
            </button>
            <button
              type="button"
              className="button -sm -purple-1 text-white"
              onClick={() => handleExportUsers("xlsx")}
              disabled={!!exportingFormat}
            >
              {exportingFormat === "xlsx" ? "Export..." : "Export Excel"}
            </button>
          </div>
          <div className="col-auto" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              className="form-control"
              value={reminderStage}
              onChange={(e) => setReminderStage(e.target.value)}
              style={{ minWidth: 220 }}
            >
              <option value="quiz_incomplete">Reminder: quiz incomplet</option>
              <option value="booking_not_paid">Reminder: booking neplatit</option>
              <option value="booking_not_scheduled">
                Reminder: booking neprogramat
              </option>
              <option value="no_subscription">Reminder: fara abonament</option>
            </select>
            <button
              type="button"
              className="button -sm -gray-1 text-dark-1"
              onClick={() => runReminderAction("preview")}
              disabled={isRemindersLoading}
            >
              Preview
            </button>
            <button
              type="button"
              className="button -sm -red-1 text-white"
              onClick={() => runReminderAction("send")}
              disabled={isRemindersLoading}
            >
              {isRemindersLoading ? "Running..." : "Send"}
            </button>
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
