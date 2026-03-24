"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function QuestionWithApiValidation({
  question,
  onValidatedAnswer,
  translatedLinks,
  displayLabel,
  displayPlaceholder,
}) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setError(null);
  };

  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!country) {
      setError(translatedLinks.locationCountryRequiredText);
      return;
    }

    if (!city.trim()) {
      setError(translatedLinks.locationCityRequiredText);
      return;
    }

    if (!postalCode.trim()) {
      setError(translatedLinks.locationPostalCodeRequiredText);
      return;
    }

    onValidatedAnswer({
      country,
      city: city.trim(),
      postalCode: postalCode.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="question-group">
        <label htmlFor={`input-${question.id}`}>{displayLabel || question.text}</label>
        <div className="mt-20">
          <label className="mb-8 d-block">
            {translatedLinks.locationCountryLabelText}
          </label>
          <select
            id={`country-${question.id}`}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setError(null);
            }}
            className="form-control question-input"
          >
            <option value="">
              {translatedLinks.locationCountryPlaceholderText}
            </option>
            <option value="BE">{translatedLinks.locationCountryBelgiumText}</option>
            <option value="FR">{translatedLinks.locationCountryFranceText}</option>
          </select>
        </div>

        <div className="mt-20">
          <label htmlFor={`city-${question.id}`} className="mb-8 d-block">
            {translatedLinks.locationCityLabelText}
          </label>
          <input
            type="text"
            id={`city-${question.id}`}
            placeholder={translatedLinks.locationCityPlaceholderText}
            value={city}
            onChange={handleCityChange}
            className="form-control question-input"
          />
        </div>

        <div className="mt-20">
          <label htmlFor={`postal-${question.id}`} className="mb-8 d-block">
            {translatedLinks.locationPostalCodeLabelText}
          </label>
          <input
            type="text"
            id={`postal-${question.id}`}
            placeholder={
              translatedLinks.locationPostalCodePlaceholderText ||
              displayPlaceholder ||
              question.placeholder
            }
            value={postalCode}
            onChange={handlePostalCodeChange}
            className="form-control question-input"
          />
        </div>
      </div>
      {error && <div className="question-error-text">{error}</div>}
      <div className="d-flex justify-end">
        <button
          type="submit"
          className="button -md -dark-1 text-white -dark-button-white mt-40"
        >
          <FontAwesomeIcon icon={faArrowRight} />{" "}
        </button>
      </div>
    </form>
  );
}
