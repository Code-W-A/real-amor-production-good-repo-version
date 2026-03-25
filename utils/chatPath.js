/**
 * Cheie canonică Firestore pentru thread-ul de chat între doi utilizatori.
 */
export function sortedChatPath(uidA, uidB) {
  return [uidA, uidB].sort().join("-");
}
