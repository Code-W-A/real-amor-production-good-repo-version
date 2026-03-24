// import { db, authentication } from "@/firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";

// export const handleGetUserInfo = async () => {
//   let userData;
//   try {
//     const auth = authentication;

//     // Asigură-te că utilizatorul este autentificat
//     if (!auth.currentUser) {
//       throw new Error("Utilizatorul nu este autentificat. Vă rugăm să vă autentificați mai întâi.");
//     }

//     const q = query(
//       collection(db, "Users"),
//       where("uid", "==", auth.currentUser.uid)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       userData = doc.data();
//     });
//     return userData;
//   } catch (err) {
//     console.log("error...handleGetUserInfo...", err);
//     throw err;
//   }
// };

// export const handleGetUserInfoJobs = async () => {
//   let userData;
//   try {
//     const auth = authentication;

//     // Verificare dacă utilizatorul este autentificat
//     if (!auth.currentUser) {
//       throw new Error("Utilizatorul nu este autentificat. Vă rugăm să vă autentificați mai întâi.");
//     }

//     const q = query(
//       collection(db, "Users"),
//       where("uid", "==", auth.currentUser.uid)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       userData = doc.data();
//     });
//     return userData;
//   } catch (err) {
//     console.log("error...handleGetUserInfo...", err);
//     throw err;
//   }
// };
