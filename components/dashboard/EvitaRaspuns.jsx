import React from "react";

export default function EvitaRaspuns({
  selectedOptions,
  currentQuestion,
  setSelectedOptions,
  translatedLinks,
}) {
  return (
    <div className="form-radio d-flex items-center mt-20">
      <div className="radio">
        <input
          type="checkbox"
          value="Je préfère ne pas répondre à la question"
          checked={selectedOptions[currentQuestion.id]?.includes(
            "Je préfère ne pas répondre à la question"
          )}
          onChange={() => {
            // Dacă este selectată, resetează celelalte selecții
            setSelectedOptions((prev) => ({
              ...prev,
              [currentQuestion.id]: [
                "Je préfère ne pas répondre à la question",
              ],
            }));
          }}
        />
        <div className="radio__mark">
          <div className="radio__icon"></div>
        </div>
      </div>
      <div className="fw-500 ml-12">
        {translatedLinks.prefereNePasRepondreText}
      </div>
    </div>
  );
}
