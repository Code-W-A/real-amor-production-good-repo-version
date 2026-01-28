import React from "react";

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
  const na = translatedTexts?.naText || "";
  const deletedAt = formatDeletedAt(data?.deletedAt) || na;
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

  const sourceValue = data?.deletionSource;
  const sourceLabel =
    (isFrench && data?.deletionSourceLabelFr) ||
    (sourceValue === "self_close"
      ? translatedTexts?.deletionSourceSelfCloseText
      : sourceValue === "admin_delete"
      ? translatedTexts?.deletionSourceAdminDeleteText
      : null);

  const reasonValue = data?.deletionReason;
  const reasonLabel =
    (isFrench && data?.deletionReasonLabelFr) ||
    (reasonValue === "self_close"
      ? translatedTexts?.deletionReasonSelfCloseText
      : reasonValue === "admin_delete"
      ? translatedTexts?.deletionReasonAdminDeleteText
      : null);
  return (
    <tr>
      <td>{data?.username || na}</td>
      <td>{data?.email || na}</td>
      <td>{deletedAt}</td>
      <td>{data?.deletedByEmail || data?.deletedByUid || na}</td>
      <td>{data?.registrationDate || na}</td>
      <td>{genderLabel || genderValue || na}</td>
      <td>{sourceLabel || sourceValue || na}</td>
      <td>{reasonLabel || reasonValue || na}</td>
    </tr>
  );
}

