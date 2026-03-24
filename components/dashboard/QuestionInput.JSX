import React from "react";

export default function QuestionInput({ question, onAnswer }) {
  const handleChange = (e) => {
    onAnswer(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={question.placeholder || ""}
      onChange={handleChange}
      className="form-control mt-20"
    />
  );
}
