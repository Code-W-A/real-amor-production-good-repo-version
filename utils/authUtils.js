import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import { authentication } from "../firebase";
import { FirebaseError } from "firebase/app";

import { deleteUserData } from "./deleteFirebaseData";
import { emailWithoutSpace } from "./strintText";
import { Router } from "next/router";

const auth = authentication;

export const handleChangeEmail = async (currentPassword, newEmail) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    console.log("user...", user);
    // Încercăm reautentificarea
    await reauthenticateWithCredential(user, credential);
    console.log("Reautentificare reușită.");

    // Dacă reautentificarea a reușit, încercăm să actualizăm emailul
    try {
      await verifyBeforeUpdateEmail(user, newEmail);
      console.log("Actualizarea emailului reușită.");
      return ""; // Returnăm un șir gol pentru a indica succesul
    } catch (error) {
      // Prindem orice eroare care apare la actualizarea emailului
      console.error("Eroare la actualizarea emailului:", error);
      return handleFirebaseAuthError(error); // Returnăm mesajul de eroare
    }
  } catch (error) {
    // Prindem orice eroare care apare la reautentificare
    console.error("Eroare la reautentificare:", error);
    return handleFirebaseAuthError(error); // Returnăm mesajul de eroare
  }
};

export const handleChangePassword = async (currentPassword, newPassword) => {
  console.log("change passowrd...");
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential)
      .then(async () => {
        await updatePassword(user, newPassword)
          .then(() => {
            console.log("password succesfuly changed");
          })
          .catch((error) => {
            console.log("password error changed", error);
          });
      })
      .catch((err) => {
        if (err.code == "auth/wrong-password") {
        } else if (err.code == "auth/too-many-requests") {
        }
      });
  } catch (err) {
    console.log("error on handlechange pass", err);
  }
};

export const handleLogout = async () => {
  console.log("Start....log out");
  try {
    await signOut(authentication);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to log out.");
  }
};

export const handleDeleteAccount = async (currentPassword) => {
  try {
    const auth = authentication;
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    console.log("-------test----");
    const result = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );

    await deleteUser(result.user).then(() => {
      console.log("deleted successfuly...auth account");
    });
  } catch (error) {
    console.error("error delete user auth or firestore...", error);
  }
};

export const handleResetPassword = async (email) => {
  const user = auth.currentUser;
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error(error);
  }
};

// firebaseErrors.js

// handleFirebaseAuthError.js
export const handleFirebaseAuthError = (error) => {
  let message = "";
  console.log("test...", error.code);
  switch (error.code) {
    case "auth/invalid-email":
      message = "E-mail invalid";
      break;
    case "auth/email-already-in-use":
      message = "E-mail deja folosit";
      break;
    case "auth/weak-password":
      message = "Parola slaba, parola trebuie sa fie de cel putin 6 caractere.";
      break;
    case "auth/user-not-found":
      message = "Utilizatorul nu a fost gasit";
      break;
    case "auth/user-disabled":
      message = "Utilizatorul este dezactivat, contactati echipa jobsMD!";
      break;
    case "auth/wrong-password":
      message = "Parola gresita";
      break;
    case "auth/too-many-requests":
      message =
        "Prea multe cereri de autentificare esuate. Va rugam sa resetati parola.";
      break;
    case "auth/operation-not-allowed":
      message = "Operatiunea nu este permisa, contactati echipa jobsMD!";
      break;
    case "auth/network-request-failed":
      message =
        "Cererea de rețea a eșuat. Verificați conexiunea la rețea și încercați din nou.";
      break;
    case "auth/invalid-credential":
      message = "Credentiale invalide";
      break;
    default:
      message = "Eroare necunoscuta. Contactati echipa jobsMD";
  }
  return message;
};

// HANLDE SIGN IN AND RETURN INFOR

export const handleSignIn = async (email, password) => {
  const emailNew = emailWithoutSpace(email);

  try {
    const userCredentials = await signInWithEmailAndPassword(
      authentication,
      emailNew,
      password
    );
    console.log("userCredentials...", userCredentials.user.uid);
    return userCredentials; // Returnează userCredentials pentru succes
  } catch (error) {
    console.log("error on sign in user...message...", error.message);
    console.log("error on sign in user...code...", error.code);
    throw error; // Propagă eroarea mai departe
  }
};
