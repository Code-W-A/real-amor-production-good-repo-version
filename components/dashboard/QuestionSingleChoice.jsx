import React from "react";

export default function QuestionSingleChoice({
  question,
  selectedOption,
  onAnswer,
}) {
  const handleChange = (option) => {
    onAnswer(option);
  };

  return (
    <>
      {question.options.map((option, index) => (
        <div key={index} className="form-radio d-flex items-center mt-20">
          <div className="radio">
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
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
