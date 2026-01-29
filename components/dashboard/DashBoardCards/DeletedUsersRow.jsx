import React from "react";
import { useRouter } from "next/navigation";

function formatDeletedAt(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate().toLocaleString();
  const seconds = value?.seconds ?? value?._seconds;
  if (typeof seconds === "number") {
    return new Date(seconds * 1000).toLocaleString();
  }
  if (value instanceof Date) return value.toLocaleString();
  return null;
}

export default function DeletedUsersRow({ data, translatedTexts }) {
  const router = useRouter();
  const na = translatedTexts?.naText || "";
  const deletedAt = formatDeletedAt(data?.deletedAccount?.deletedAt) || na;
  const isFrench = translatedTexts?.lang === "fr";
  const genderValue = data?.gender;
  const genderLabel =
    (isFrench && data?.genderLabelFr) ||
    (genderValue === "male"
      ? translatedTexts?.genderMaleText
      : genderValue === "female"
      ? translatedTexts?.genderFemaleText
      : genderValue === "other"
      ? translatedTexts?.genderOtherText
      : null);

  const sourceValue = data?.deletedAccount?.deletionSource;
  const sourceLabel =
    (isFrench && data?.deletedAccount?.deletionSourceLabelFr) ||
    (sourceValue === "self_close"
      ? translatedTexts?.deletionSourceSelfCloseText
      : sourceValue === "admin_delete"
      ? translatedTexts?.deletionSourceAdminDeleteText
      : null);

  const reasonValue = data?.deletedAccount?.deletionReason;
  const reasonLabel =
    (isFrench && data?.deletedAccount?.deletionReasonLabelFr) ||
    (reasonValue === "self_close"
      ? translatedTexts?.deletionReasonSelfCloseText
      : reasonValue === "admin_delete"
      ? translatedTexts?.deletionReasonAdminDeleteText
      : null);
  const handleRowClick = () => {
    const userUid = data?.uid || data?.id;
    if (!userUid) return;
    router.push(`/informatii-utilizator?uid=${userUid}`);
  };

  return (
    <tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <td>{data?.username || na}</td>
      <td>{data?.email || na}</td>
      <td>{deletedAt}</td>
      <td>
        {data?.deletedAccount?.deletedByEmail ||
          data?.deletedAccount?.deletedByUid ||
          na}
      </td>
      <td>{data?.registrationDate || na}</td>
      <td>{genderLabel || genderValue || na}</td>
      <td>{sourceLabel || sourceValue || na}</td>
      <td>{reasonLabel || reasonValue || na}</td>
      <td style={{ width: 140, minWidth: 140 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick();
          }}
          className="btn btn-primary"
        >
          {translatedTexts?.veziDetaliiText || "Vezi detalii"}
        </button>
      </td>
    </tr>
  );
}

