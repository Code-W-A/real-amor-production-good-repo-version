import React from "react";
import { useRouter } from "next/navigation";

export default function CoursesCardDashboard({ data, translatedTexts }) {
  const router = useRouter();

  const handleCardClick = () => {
    console.log("User Data:", data);
    router.push(`/informatii-utilizator?uid=${data.id}`);
  };

  return (
    <tr onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <td>{data.username}</td>
      <td>{data.email ? data.email : "N/A"}</td>
      <td>{data.registrationDate ? data.registrationDate : "N/A"}</td>
      <td>{data.gender ? data.gender : "N/A"}</td>

      <td>
        {data.isActivated
          ? translatedTexts.contActivText1
          : translatedTexts.contActivText2}
      </td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Previne redirecționarea la click pe buton
            handleCardClick();
          }}
          className="btn btn-primary"
        >
          {translatedTexts.veziDetaliiText}
        </button>
      </td>
    </tr>
  );
}
