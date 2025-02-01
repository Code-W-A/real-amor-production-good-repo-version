import React from "react";

export default function QuestionMultipleChoice({
  question,
  selectedOptions,
  onAnswer,
}) {
  const handleChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    onAnswer(updatedOptions);
  };

  return (
    <>
      {question.options.map((option, index) => (
        <div key={index} className="form-radio d-flex items-center mt-20">
          <div className="radio">
            <input
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
            />
            <div className="radio__mark">
              <div className="radio__icon"></div>
            </div>
          </div>
          <div className="fw-500 ml-12">{option}</div>
        </div>
      ))}
    </>
  );
}
