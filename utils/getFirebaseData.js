import { authentication, db, storage } from "../firebase";
// import { collection, query, where } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const auth = authentication;

const getDaysArray = (function () {
  const names = Object.freeze([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  return (year, month) => {
    const monthIndex = month - 1;
    const date = new Date(year, monthIndex, 1);
    const result = [];

    while (date.getMonth() == monthIndex) {
      // result.push(`${date.getDate()}-${names[date.getDay()]}`);
      result.push(`${names[date.getDay()]}`);
      date.setDate(date.getDate() + 1);
    }
    return result;
  };
})();

export const retrieveTypeOfUser = async (uid) => {
  let userType = "";
  const docRef = doc(db, "Users", uid);
  const docSnap = await getDoc(docRef);
  try {
    if (docSnap.data().isClinic) {
      userType = "isClinic";
    } else {
      userType = "isPatient";
    }
  } catch (err) {
    console.log("Error retrieveTypeOfUser...", err);
  }

  return userType;
};
