import React, { useState } from "react";

export default function QuestionRange({ question, onAnswer }) {
  const [range, setRange] = useState({ min: "", max: "" });

  const handleChange = (field, value) => {
    const updatedRange = { ...range, [field]: value };
    setRange(updatedRange);
    if (updatedRange.min && updatedRange.max) {
      onAnswer(updatedRange);
    }
  };

  return (
    <div className="d-flex mt-2">
      <input
        type="number"
        placeholder={question.placeholder?.min || "Min"}
        value={range.min}
        onChange={(e) => handleChange("min", e.target.value)}
        className="form-control me-2"
      />
      <input
        type="number"
        placeholder={question.placeholder?.max || "Max"}
        value={range.max}
        onChange={(e) => handleChange("max", e.target.value)}
        className="form-control"
      />
    </div>
  );
}
