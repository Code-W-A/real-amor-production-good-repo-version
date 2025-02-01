"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function QuestionWithApiValidation({
  question,
  onValidatedAnswer,
  translatedLinks,
}) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);

    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(
          `${question.api.url}${question.api.params.country}/${value}`
        );
        if (!response.ok) {
          throw new Error(translatedLinks.codPostalInvalidText);
        }
        const data = await response.json();

        if (data) {
          const newResults = data.places.map((place) => ({
            postalCode: data["post code"],
            city: place["place name"],
          }));

          setResults(newResults);
          setDropdownVisible(true);
        } else {
          setResults([]);
          setDropdownVisible(false);
        }
      } catch (error) {
        setError(error.message || "A apărut o eroare.");
        setResults([]);
        setDropdownVisible(false);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setDropdownVisible(false);
    }
  };

  const handleSelect = (result) => {
    setInputValue(`${result.postalCode}, ${result.city}`);
    setDropdownVisible(false); // Ascunde dropdown-ul
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue) {
      setError("Saisissez un code postal.");
      return;
    }

    onValidatedAnswer(inputValue); // Trimitem răspunsul validat către QuizClient
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="question-group">
        <label htmlFor={`input-${question.id}`}>{question.text}</label>
        <input
          type="text"
          id={`input-${question.id}`}
          placeholder={question.placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="question-input"
        />
        {dropdownVisible && results.length > 0 && (
          <ul className="question-dropdown-menu">
            {results.map((result, index) => (
              <li
                key={index}
                className="question-dropdown-item"
                onClick={() => handleSelect(result)}
              >
                {result.postalCode}, {result.city}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="question-error-text">{error}</div>}
      {loading ? (
        <div>Se încarcă...</div>
      ) : (
        <div className="d-flex justify-end">
          <button
            type="submit"
            className="button -md -dark-1 text-white -dark-button-white mt-40"
          >
            <FontAwesomeIcon icon={faArrowRight} />{" "}
          </button>
        </div>
      )}
    </form>
  );
}
