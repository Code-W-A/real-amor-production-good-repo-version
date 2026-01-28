import React from "react";

function formatDeletedAt(value, fallbackText) {
  if (!value) return fallbackText;
  if (typeof value?.toDate === "function") return value.toDate().toLocaleString();
  const seconds = value?.seconds ?? value?._seconds;
  if (typeof seconds === "number") {
    return new Date(seconds * 1000).toLocaleString();
  }
  if (value instanceof Date) return value.toLocaleString();
  return fallbackText;
}

export default function DeletedUsersRow({ data, translatedTexts }) {
  const naText = translatedTexts?.naText || "";
  return (
    <tr>
      <td>{data?.username || naText}</td>
      <td>{data?.email || naText}</td>
      <td>{formatDeletedAt(data?.deletedAt, naText)}</td>
      <td>{data?.deletedByEmail || data?.deletedByUid || naText}</td>
      <td>{data?.registrationDate || naText}</td>
      <td>{data?.gender || naText}</td>
      <td>{data?.deletionSource || naText}</td>
      <td>{data?.deletionReason || naText}</td>
    </tr>
  );
}

