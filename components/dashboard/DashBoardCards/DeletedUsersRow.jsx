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
  return (
    <tr>
      <td>{data?.username || na}</td>
      <td>{data?.email || na}</td>
      <td>{deletedAt}</td>
      <td>{data?.deletedByEmail || data?.deletedByUid || na}</td>
      <td>{data?.registrationDate || na}</td>
      <td>{data?.gender || na}</td>
      <td>{data?.deletionSource || na}</td>
      <td>{data?.deletionReason || na}</td>
    </tr>
  );
}

