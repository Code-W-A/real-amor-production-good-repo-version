import { authentication, db, storage } from "../firebase";
// import { collection, query, where } from "firebase/firestore";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
  orderBy,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";

import { ref, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { handleDeleteAccount } from "./authUtils";

const auth = authentication;

export const deleteUserData = async () => {
  console.log("deleting...user data from firebase...");
  try {
    // DELETE DOC FROM DOCTOR COLLECTION AND SUBCOLLECTIO
    await deleteDoc(
      doc(db, "Users", auth.currentUser.uid, auth.currentUser.uid)
    ).then(() => {
      handleDeleteAccount();
    });
  } catch (err) {
    console.log("error deleting doctor", err);
  }
};
