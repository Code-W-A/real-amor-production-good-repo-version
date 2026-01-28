"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Pagination from "../common/Pagination";
import DeletedUsersRow from "./DashBoardCards/DeletedUsersRow";

export default function DeletedUsers({ translatedTexts }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("adminDeletedUsersPerPage");
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) {
        setItemsPerPage(n);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "adminDeletedUsersPerPage",
        String(itemsPerPage)
      );
    } catch {
      // ignore
    }
  }, [itemsPerPage]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!currentUser) return;
        const ref = collection(db, "DeletedUsers");
        const q = query(ref, orderBy("deletedAt", "desc"), limit(1000));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(list);
        setFilteredItems(list);
      } catch (error) {
        console.error("Error fetching deleted users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentUser]);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      setFilteredItems(items);
      setCurrentPage(1);
      return;
    }
    const filtered = items.filter((item) => {
      const haystack = [
        item?.username,
        item?.email,
        item?.uid,
        item?.deletedByEmail,
        item?.deletedByUid,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              {translatedTexts.deletedUsersTitle}
            </h1>
          </div>
          <div className="col-auto">
            <input
              type="text"
              placeholder={translatedTexts.searchText}
              aria-label={translatedTexts.searchText}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div
            className="col-auto"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ fontWeight: "bold" }}>
              {translatedTexts?.usersPerPageLabelText || "Utilizatori / pagină"}
            </span>
            <select
              value={itemsPerPage}
              aria-label={translatedTexts?.usersPerPageLabelText}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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

        {loading ? (
          <div>{translatedTexts.loadingText}</div>
        ) : (
          <div className="row y-gap-30 pt-30">
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table
                className="table table-striped"
                style={{ minWidth: 900 }}
              >
              <thead>
                <tr>
                  <th>{translatedTexts.userText}</th>
                  <th>{translatedTexts.emailText}</th>
                  <th>{translatedTexts.deletedAtText}</th>
                  <th>{translatedTexts.deletedByText}</th>
                  <th>{translatedTexts.registrationDateText}</th>
                  <th>{translatedTexts.genText}</th>
                  <th>{translatedTexts.deletionSourceText}</th>
                  <th>{translatedTexts.deletionReasonText}</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <DeletedUsersRow
                    data={item}
                    key={item.id}
                    translatedTexts={translatedTexts}
                  />
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="row justify-center pt-30">
          <div className="col-auto">
            <Pagination
              usersPerPage={itemsPerPage}
              totalUsers={filteredItems.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

