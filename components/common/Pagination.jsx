"use client";

import React from "react";

export default function Pagination({
  usersPerPage,
  totalUsers,
  paginate,
  currentPage,
}) {
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = [];

  // Adăugăm numărul total de pagini în lista `pageNumbers`
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const pages = [];
    let showDotsBefore = false;
    let showDotsAfter = false;

    pageNumbers.forEach((number) => {
      if (
        number === 1 || // Primele două pagini
        number === 2 ||
        number === totalPages || // Ultimele două pagini
        number === totalPages - 1 ||
        (number >= currentPage - 1 && number <= currentPage + 1) // În jurul paginii curente
      ) {
        pages.push(
          <a
            key={number}
            href="#"
            className={`pagination__link ${
              currentPage === number ? "-count-is-active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              paginate(number);
            }}
          >
            {number}
          </a>
        );
      } else {
        // Condiționează punctele
        if (number < currentPage && !showDotsBefore) {
          pages.push(
            <span key="dots-before" className="pagination__dots">
              ...
            </span>
          );
          showDotsBefore = true;
        } else if (number > currentPage && !showDotsAfter) {
          pages.push(
            <span key="dots-after" className="pagination__dots">
              ...
            </span>
          );
          showDotsAfter = true;
        }
      }
    });

    return pages;
  };

  return (
    <div className="pagination -buttons">
      <button
        className="pagination__button -prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <i className="icon icon-chevron-left"></i>
      </button>

      <div className="pagination__count">{renderPageNumbers()}</div>

      <button
        className="pagination__button -next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
