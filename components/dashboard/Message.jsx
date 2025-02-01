"use client";

import React, { useEffect, useRef, useState } from "react";
import FooterNine from "../layout/footers/FooterNine";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { query } from "firebase/database";
import TypingAnimation from "./TypingAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Message() {
  const { userData } = useAuth();
  const [compatibleUsers, setCompatibleUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unseenMessages, setUnseenMessages] = useState({});

  // Referință pentru containerul de mesaje
  const messagesEndRef = useRef(null);

  // Funcție pentru scroll la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch compatible users and count unseen messages
  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      if (!userData?.uid) return;

      try {
        const compatibilitatiRef = collection(
          db,
          "Users",
          userData?.uid,
          "Compatibilitati"
        );
        const compatibilitatiSnapshot = await getDocs(compatibilitatiRef);

        const compatibleUserIds = compatibilitatiSnapshot.docs.map(
          (doc) => doc.data().compatibleUserId
        );

        const usersWithLastMessage = await Promise.all(
          compatibleUserIds.map(async (userId) => {
            // Ignoră utilizatorul curent dacă apare în lista de compatibilități
            if (userId === userData?.uid) return null;

            const userDocRef = doc(db, "Users", userId);
            const userSnapshot = await getDoc(userDocRef);
            const userInfo = { id: userSnapshot.id, ...userSnapshot.data() };

            // Sortare UID-uri pentru `chatPath`
            const chatPath = [userId, userData?.uid].sort().join("-");
            const messagesQuery = query(
              collection(db, "Chats", chatPath, "Messages")
            );

            const messagesSnapshot = await getDocs(messagesQuery);
            if (messagesSnapshot.empty) {
              console.log(`No messages found for chat: ${chatPath}`);
              return { ...userInfo, lastMessageTimestamp: null };
            }

            // Găsește ultimul mesaj
            const lastMessage = messagesSnapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())[0];
            const mainImage =
              userInfo?.images?.find((image) => image.isMain)?.fileUri ||
              userInfo?.images?.[0]?.fileUri ||
              "/default-avatar.png";

            return {
              ...userInfo,
              mainImage,
              lastMessageTimestamp: lastMessage?.timestamp?.toDate() || null,
            };
          })
        );

        // Sortează utilizatorii
        const sortedUsers = usersWithLastMessage
          .filter(Boolean) // Elimină utilizatorii invalizi (ex. null)
          .sort((a, b) => {
            if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
              return b.lastMessageTimestamp - a.lastMessageTimestamp;
            }
            if (a.lastMessageTimestamp) return -1;
            if (b.lastMessageTimestamp) return 1;
            return 0;
          });
        console.log("sortedUsers...", sortedUsers);
        setCompatibleUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching compatible users:", error);
      }
    };

    fetchCompatibleUsers();
  }, [userData?.uid]);

  // Scroll la ultimul mesaj atunci când lista de mesaje se schimbă
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time listener for messages between user and selected user
  useEffect(() => {
    if (!selectedUser) return;

    const chatRef = collection(
      db,
      "Chats",
      `${userData?.uid}-${selectedUser.id}`,
      "Messages"
    );

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const fetchedMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.timestamp?.toDate() - b.timestamp?.toDate());

      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedUser, userData?.uid]);

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      senderId: userData?.uid,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date(),
      seen: false,
    };

    await addDoc(
      collection(
        db,
        "Chats",
        `${userData?.uid}-${selectedUser.id}`,
        "Messages"
      ),
      messageData
    );
    await addDoc(
      collection(
        db,
        "Chats",
        `${selectedUser.id}-${userData?.uid}`,
        "Messages"
      ),
      messageData
    );

    setNewMessage("");
  };

  // Handle sending message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // Adaugă un nou rând
      setNewMessage((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      // Trimite mesajul
      e.preventDefault(); // Previne adăugarea unui nou rând în textarea
      handleSendMessage();
    }
  };

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;

    const typingRef = doc(
      db,
      "Chats",
      `${userData?.uid}-${selectedUser.id}`,
      "Typing",
      "State"
    );

    console.log("Listening to typing updates for:", typingRef.path);

    const unsubscribe = onSnapshot(typingRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Typing document data:", docSnapshot.data());
        setIsTyping(docSnapshot.data()?.isTyping || false);
      } else {
        console.log("Typing document does not exist at:", typingRef.path);
      }
    });

    return () => unsubscribe();
  }, [selectedUser, userData?.uid]);

  const handleTyping = async () => {
    if (!selectedUser) return;

    const typingRef = doc(
      db,
      "Chats",
      `${selectedUser.id}-${userData?.uid}`, // Asigură-te că ordinea este corectă
      "Typing",
      "State"
    );

    try {
      console.log("Setting typing state to true at:", typingRef.path);
      await setDoc(typingRef, { isTyping: true }, { merge: true }); // Creează documentul dacă nu există
      console.log("Typing state set to true successfully");

      setTimeout(async () => {
        console.log("Resetting typing state to false at:", typingRef.path);
        await setDoc(typingRef, { isTyping: false }, { merge: true });
        console.log("Typing state reset to false successfully");
      }, 3000);
    } catch (error) {
      console.error("Error in handleTyping:", error);
    }
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Messages</h1>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-xl-4">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Chats</h2>
              </div>

              <div className="py-30 px-30">
                <div className="y-gap-30">
                  {compatibleUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`d-flex justify-between cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-light-5" : ""
                      }`}
                    >
                      <div className="d-flex items-center">
                        <div className="shrink-0">
                          {user?.mainImage ? (
                            <Image
                              width={50}
                              height={50}
                              src={user.mainImage || "/default-avatar.png"}
                              alt="image"
                              className="size-50"
                              style={{
                                borderRadius: "25%", // Imaginea rotundă
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUserCircle}
                              size="2x"
                              className="text-muted"
                              style={{
                                width: "50px",
                                height: "50px",
                              }}
                            />
                          )}
                        </div>
                        <div className="ml-10">
                          <div className="lh-11 fw-500 text-dark-1">
                            {user.username}
                          </div>
                        </div>
                      </div>

                      {unseenMessages[user.id] > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            backgroundColor: "#FF0000",
                            color: "#FFFFFF",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "12px",
                          }}
                        >
                          {unseenMessages[user.id]}
                        </div>
                      )}

                      {/* <div className="d-flex items-end flex-column pt-8">
                        {unseenMessages[user.id] > 0 && (
                          <div className="d-flex justify-center items-center size-20 bg-green-5 rounded-full mt-8">
                            <span className="text-11 lh-1 text-white fw-500">
                              {unseenMessages[user.id]}
                            </span>
                          </div>
                        )}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              {selectedUser ? (
                <div className="d-flex items-center justify-between py-20 px-30 border-bottom-light">
                  <div className="d-flex items-center">
                    <div className="shrink-0">
                      {selectedUser?.mainImage ? (
                        <Image
                          width={50}
                          height={50}
                          src={selectedUser?.mainImage || "/default-avatar.png"}
                          alt="image"
                          className="size-50"
                          style={{
                            borderRadius: "25%", // Imaginea rotundă
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          size="2x"
                          className="text-muted"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      )}
                    </div>
                    <div className="ml-10">
                      <div className="lh-11 fw-500 text-dark-1">
                        {selectedUser ? selectedUser.username : "Select a user"}
                      </div>
                      {/* <div className="text-14 lh-11 mt-5">Active</div> */}
                    </div>
                  </div>
                  {/* <a
                    href="#"
                    className="text-14 lh-11 fw-500 text-orange-1 underline"
                  >
                    Delete Conversation
                  </a> */}
                </div>
              ) : (
                <div className="d-flex items-center justify-between py-20 px-30 border-bottom-light">
                  <div className="d-flex items-center">
                    <div className="ml-10">
                      <div className="lh-11 fw-500 text-dark-1">
                        {selectedUser ? selectedUser.username : "Select a user"}
                      </div>
                      {/* <div className="text-14 lh-11 mt-5">Active</div> */}
                    </div>
                  </div>
                </div>
              )}

              {/* Container with fixed height and scroll for messages */}
              <div
                className="messages-container py-40 px-40"
                style={{ height: "400px", overflowY: "auto" }}
              >
                <div className="row y-gap-20">
                  {messages.map((msg) => (
                    <div
                      key={msg?.id}
                      className={`col-xl-7 col-lg-10 ${
                        msg?.senderId === userData?.uid
                          ? "offset-xl-5 offset-lg-2 text-right"
                          : ""
                      }`}
                    >
                      <div
                        className={`d-flex items-center ${
                          msg?.senderId === userData?.uid ? "justify-end" : ""
                        }`}
                      >
                        {msg?.senderId !== userData?.uid && (
                          <div className="shrink-0">
                            {selectedUser?.mainImage ? (
                              <Image
                                width={50}
                                height={50}
                                src={
                                  selectedUser?.mainImage ||
                                  "/default-avatar.png"
                                }
                                alt="image"
                                className="size-50"
                                style={{
                                  borderRadius: "25%", // Imaginea rotundă
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faUserCircle}
                                size="2x"
                                className="text-muted"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                            )}
                          </div>
                        )}
                        <div className="lh-11 fw-500 text-dark-1 ml-10">
                          {msg?.senderId === userData?.uid
                            ? "You"
                            : selectedUser?.username}
                        </div>
                        <div className="text-14 lh-11 ml-10">
                          {msg?.timestamp instanceof Date
                            ? `${msg.timestamp.toLocaleDateString()} ${msg.timestamp.toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}`
                            : msg?.timestamp?.toDate()?.toLocaleDateString() +
                              " " +
                              msg?.timestamp?.toDate()?.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </div>
                      </div>
                      <div className="d-inline-block mt-15">
                        <div
                          className={`py-20 px-30 rounded-8 message-content ${
                            msg?.senderId === userData?.uid
                              ? "bg-light-7 -dark-bg-dark-2 text-purple-1 text-right"
                              : "bg-light-3"
                          }`}
                          style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                          }}
                        >
                          {msg?.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Adăugăm secțiunea pentru "is typing" după mesaje */}
                  {isTyping && (
                    <div
                      className="d-flex align-items-center mt-10"
                      style={{
                        marginLeft: "10px", // Pentru aliniere
                        gap: "10px", // Spațiu între imagine și animație
                      }}
                    >
                      {selectedUser?.mainImage ? (
                        <Image
                          src={selectedUser?.mainImage || "/default-avatar.png"}
                          alt="Typing User"
                          width={50}
                          height={50}
                          style={{
                            borderRadius: "25%", // Imaginea rotundă
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          size="2x"
                          className="text-muted"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      )}
                      <div>
                        <TypingAnimation />
                      </div>
                    </div>
                  )}

                  {/* Div pentru scroll automat */}
                  <div ref={messagesEndRef}></div>
                </div>
              </div>

              <div className="py-25 px-40 border-top-light">
                <div className="row y-gap-10 justify-between">
                  <div className="col-lg-7">
                    <textarea
                      required
                      className="-dark-bg-dark-1 py-20 w-1/1"
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a Message"
                      onKeyDown={(e) => {
                        handleKeyDown(e);
                        handleTyping(); // Apelează funcția de tastare
                      }}
                      style={{
                        resize: "none", // Dezactivează redimensionarea manuală
                        maxHeight: "100px", // Înălțime fixă
                        width: "100%", // Lățime fixă sau proporțională
                        boxSizing: "border-box", // Include padding în dimensiuni
                        border: "1px solid #ccc", // Linie de contur
                        padding: "10px", // Spațiu interior
                        overflowY: "auto", // Scroll vertical dacă textul depășește înălțimea
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      onClick={handleSendMessage}
                      className="button -md -purple-1 text-white shrink-0"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNine />
    </div>
  );
}
