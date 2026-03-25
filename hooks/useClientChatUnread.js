"use client";

import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { sortedChatPath } from "@/utils/chatPath";

function countUnreadForReceiver(snapshotDocs, receiverUid) {
  let n = 0;
  snapshotDocs.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.receiverId === receiverUid && data.seen !== true) {
      n += 1;
    }
  });
  return n;
}

/**
 * Mesaje necitite primite de utilizatorul curent, per interlocutor + total.
 * Se bazează pe calea canonică sortată a chatului.
 */
export function useClientChatUnread(uid) {
  const [unreadByUserId, setUnreadByUserId] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const countsRef = useRef({});

  useEffect(() => {
    if (!uid) {
      countsRef.current = {};
      setUnreadByUserId({});
      setTotalUnread(0);
      return undefined;
    }

    const messageUnsubs = [];

    const unsubCompat = onSnapshot(
      collection(db, "Users", uid, "Compatibilitati"),
      (compatSnap) => {
        messageUnsubs.forEach((u) => u());
        messageUnsubs.length = 0;
        countsRef.current = {};
        setUnreadByUserId({});
        setTotalUnread(0);

        const peerIds = [
          ...new Set(
            compatSnap.docs
              .map((d) => d.data().compatibleUserId)
              .filter((id) => id && id !== uid)
          ),
        ];

        if (peerIds.length === 0) {
          setUnreadByUserId({});
          setTotalUnread(0);
          return;
        }

        peerIds.forEach((otherId) => {
          const path = sortedChatPath(uid, otherId);
          const unsubMsgs = onSnapshot(
            collection(db, "Chats", path, "Messages"),
            (msgSnap) => {
              const n = countUnreadForReceiver(msgSnap.docs, uid);
              countsRef.current[otherId] = n;
              setUnreadByUserId({ ...countsRef.current });
              setTotalUnread(
                Object.values(countsRef.current).reduce((a, b) => a + b, 0)
              );
            }
          );
          messageUnsubs.push(unsubMsgs);
        });
      }
    );

    return () => {
      unsubCompat();
      messageUnsubs.forEach((u) => u());
    };
  }, [uid]);

  return { unreadByUserId, totalUnread };
}
