import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  where,
  query,
  collectionGroup,
  startAt,
  getCountFromServer,
} from "firebase/firestore";
import { authentication, db } from "../firebase";
import { handleDeleteAccount } from "./authUtils";
import { getCurrentDateTime } from "../utils/timeUtils";

const auth = authentication;
export const userLocation = `Users/${
  auth.currentUser ? auth.currentUser.uid : ""
}`; // Calea către document

export const getFirestoreCollectionLength = async (location) => {
  const coll = collection(db, location);
  const snapshot = await getCountFromServer(coll);
  console.log("count: ", snapshot.data().count);

  return snapshot.data().count;
};

export const getFirestoreQueryLength = async (
  location,
  queryParam,
  element
) => {
  const coll = collection(db, location);
  const q = query(coll, where(queryParam, "==", element));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const handleGetUserInfoJobs = async () => {
  let userData;
  let auth = authentication;
  try {
    const q = query(
      collection(db, "Users"),
      where("owner_uid", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userData = doc.data();
    });
    return userData;
  } catch (err) {
    console.log("error...handleGetUserInfo...", err);
  }
};

export const getFirestoreSubcollectionLength = async (
  subcollection,
  queryParam,
  element
) => {
  const q = query(
    collectionGroup(db, subcollection),
    where(queryParam, "==", element)
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

//FUNCTIE DE QUERY DIN SUBCOLLECTI CU NR NELIMITAT DE PARAMETRI
export const handleQueryFirestoreSubcollectionVariableParams = async (
  location,
  ...queryPairs
) => {
  let results = [];
  let constraints = [];

  // Construiește constrângerile interogării din perechile de parametri
  for (let i = 0; i < queryPairs.length; i += 2) {
    const queryParam = queryPairs[i];
    const element = queryPairs[i + 1];
    if (queryParam && element !== undefined) {
      constraints.push(where(queryParam, "==", element));
    }
  }

  // Dacă nu există constrângeri valide, returnează un array gol
  if (constraints.length === 0) {
    console.warn("No valid query constraints provided.");
    return results;
  }
  console.log("constraints...", constraints);
  // Interoghează subcolecția Localitati folosind constrângerile create
  let localitatiRef = query(collectionGroup(db, location), ...constraints);
  const querySnapshot = await getDocs(localitatiRef);

  // Adaugă fiecare document găsit în rezultate
  querySnapshot.forEach((doc) => {
    results.push(doc.data());
  });

  return results;
};

export const handleUpdateFirestore = async (
  location,
  updatedData,
  actionText
) => {
  try {
    //current date
    const dateTime = getCurrentDateTime();

    const ref = doc(db, location);

    const newData = {
      ...updatedData,
      EditDate: dateTime.date,
      Edittime: dateTime.time,
    };

    // UPLOAD ACTION OF USER
    if (actionText) {
      const currentUser = authentication.currentUser;
      let actionData = {
        actionText,
      };

      await handleUploadFirestoreSubcollection(
        actionData,
        `Users/${currentUser?.uid}/ActiuniJobs`,
        currentUser?.uid
      );
    }
    await updateDoc(ref, newData);
  } catch (err) {
    console.log("Error on...handleUpdateFirestore...", err);
  }
};

export const handleUploadFirestore = async (data, location, actionText) => {
  try {
    console.log("test.infor in handle upload firestore...");
    console.log(location);
    console.log(data);

    // Crează un nou document în colecție cu un ID generat automat

    const docRef = doc(collection(db, location));

    // preia length of location collection

    const collectionLength = await getFirestoreCollectionLength(location);
    let id = collectionLength + 1;

    //current date
    const dateTime = getCurrentDateTime();

    // Adaugă ID-ul generat în obiectul data
    const newData = {
      ...data,
      documentId: docRef.id,
      id,
      firstUploadDate: dateTime.date,
      firstUploadTime: dateTime.time,
    };
    // Face upload cu noul obiect de date care include ID-ul documentului
    await setDoc(docRef, newData);

    console.log(`Documentul cu ID-ul ${docRef.id} a fost adăugat cu succes.`);

    // UPLOAD ACTION OF USER
    // UPLOAD ACTION OF USER
    if (actionText) {
      const currentUser = authentication.currentUser;
      let actionData = {
        actionText,
      };

      await handleUploadFirestoreSubcollection(
        actionData,
        `Users/${currentUser?.uid}/ActiuniJobs`,
        currentUser?.uid
      );
    }
    return newData;
  } catch (err) {
    console.log("Eroare la handleUploadFirestore...", err);
  }
};

//ADD A DOCUMENT IN THE SUBCOLLECTION
export const handleUploadFirestoreSubcollection = async (
  data,
  location,
  collectionId,
  actionText
) => {
  console.log("create subcollection...", data);
  try {
    const collectionLength = await getFirestoreCollectionLength(location);
    let id = collectionLength + 1;
    // Adăugarea documentului în subcolecție

    const docRef = doc(collection(db, location));
    const dateTime = getCurrentDateTime();

    // Actualizarea datelor cu ID-ul documentului generat
    const newData = {
      ...data,
      documentId: docRef.id,
      id,
      firstUploadDate: dateTime.date,
      firstUploadTime: dateTime.time,
      collectionId,
    };
    await setDoc(docRef, newData); // Actualizează documentul cu noul set de date, dacă este necesar

    // UPLOAD ACTION OF USER
    if (actionText) {
      const currentUser = authentication.currentUser;
      let actionData = {
        actionText,
      };

      await handleUploadFirestoreSubcollection(
        actionData,
        `Users/${currentUser?.uid}/ActiuniJobs`,
        currentUser?.uid
      );
    }

    console.log(`Document adăugat în subcolecție cu ID-ul: ${docRef.id}`);
  } catch (err) {
    console.log("Error on...handleUploadFirestoreSubcollection...", err);
  }
};

//UPDATE A DOCUMENT IN THE SUBCOLLECTION
export const handleUpdateFirestoreSubcollection = async (
  updatedData,
  location,
  actionText
) => {
  console.log("create subcollection history...", updatedData);
  try {
    //current date
    const dateTime = getCurrentDateTime();

    const ref = doc(db, location);

    const newData = {
      ...updatedData,
      EditDate: dateTime.date,
      Edittime: dateTime.time,
    };

    // UPLOAD ACTION OF USER
    if (actionText) {
      const currentUser = authentication.currentUser;
      let actionData = {
        actionText,
      };

      await handleUploadFirestoreSubcollection(
        actionData,
        `Users/${currentUser?.uid}/ActiuniJobs`,
        currentUser?.uid
      );
    }

    await updateDoc(ref, newData);
  } catch (err) {
    console.log("Error on...handleUploadFirestoreSubcollection...", err);
  }
};

export const handleDeleteFirestoreAccount = async (
  location,
  currentPassword
) => {
  try {
    const ref = doc(db, location);

    await deleteDoc(ref).then(() => {
      handleDeleteAccount(currentPassword);
    });
  } catch (err) {
    console.log("Error on...handleDeleteFirestore...", err);
  }
};

//get firestore docs from a collection
export const handleGetFirestore = async (location, sortBy = null) => {
  let arr = []; // Specificați tipul de obiecte pe care îl conține matricea
  const querySnapshot = await getDocs(collection(db, location));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ` ${location} => `, doc.data());
    arr.push(doc.data());
  });
  // Sortează array-ul după id
  arr.sort((a, b) => {
    // console.log("sort...", a);
    // Presupunând că id-urile sunt numerice
    if (sortBy) {
      // Converteste șirurile de caractere 'firstUploadDate' la obiecte de tip Date
      const dateA = new Date(a[sortBy].split("-").reverse().join("-"));
      const dateB = new Date(b[sortBy].split("-").reverse().join("-"));

      // Compară obiectele de tip Date
      return dateB - dateA; // Sortare descrescătoare
    } else {
      return a.id - b.id;
    }

    // Dacă id-urile sunt string-uri și vrei să le sortezi lexicografic, folosește:
    // return a.id.localeCompare(b.id);
  });
  return arr;
};

//DELETE FROM FIRESTORE DATA

export const handleDeleteFirestoreData = async (
  locationToDelete,
  getNewData,
  locationToGet = null,
  locationToGetQueryType = ""
) => {
  try {
    console.log("STart....delete...location to delete....", locationToDelete);
    const ref = doc(db, locationToDelete);
    await deleteDoc(ref);

    // Dacă getNewData este true, procedează la obținerea și actualizarea datelor
    let data = [];
    if (getNewData) {
      data = await handleGetFirestore(locationToGet); // Presupunem că returnează un array de obiecte

      // Sortează datele în ordinea crescătoare a ID-urilor
      console.log("data before sort...", data);
      data.sort((a, b) => a.id - b.id);
      console.log("data after sort...", data);

      let updatedData = []; // Inițializează un array gol pentru a stoca datele actualizate

      // Actualizează ID-urile documentelor rămase pentru a fi consecutive
      console.log("iteratie...");
      for (let i = 0; i < data.length; i++) {
        const newId = i + 1; // Calculul noului ID
        const docRef = doc(db, locationToGet, data[i].user_uid); // Presupunem că fiecare document are un `docId` unic
        await updateDoc(docRef, {
          id: newId, // Actualizează ID-ul pentru a fi consecutiv
        });

        // Adaugă documentul actualizat în array-ul updatedData cu noul ID
        updatedData.push({
          ...data[i],
          id: newId,
        });
      }
      console.log("stergere din firestore cu success....");
      return updatedData; // Returnează datele actualizate dacă getNewData este true
    }
    // Dacă getNewData este false, nu returna nimic sau returnează o valoare specifică
    return null; // Sau orice altă valoare semnificativă pentru cazul tău
  } catch (err) {
    console.log("Error on...handleDeleteFirestore...", err);
    // Returnează null sau o valoare de eroare specifică în caz de eroare
    return null;
  }
};

//DELETE FROM FIRESTORE SUBCOLLECTION DATA

export const handleDeleteFirestoreSubcollectionData = async (
  locationToDelete,
  getNewData,
  locationToGet = null,
  itemToDelete
) => {
  try {
    console.log("STart....delete...");
    const ref = doc(db, locationToDelete);
    await deleteDoc(ref);

    // Dacă getNewData este true, procedează la obținerea și actualizarea datelor
    if (getNewData) {
      const data = await handleGetFirestore(locationToGet); // Presupunem că returnează un array de obiecte

      // Sortează datele în ordinea crescătoare a ID-urilor
      data.sort((a, b) => a.id - b.id);

      console.log("test...", data);

      let updatedData = []; // Inițializează un array gol pentru a stoca datele actualizate

      // Actualizează ID-urile documentelor rămase pentru a fi consecutive
      for (let i = 0; i < data.length; i++) {
        const newId = i + 1; // Calculul noului ID

        const ref = doc(
          db,
          `Users/${data[i].collectionId}/Oferte/${data[i].documentId}`
        );

        const newData = {
          id: newId, // Actualizează ID-ul pentru a fi consecutiv
        };

        await updateDoc(ref, newData);

        // Adaugă documentul actualizat în array-ul updatedData cu noul ID
        updatedData.push({
          ...data[i],
          id: newId,
        });
      }

      return updatedData; // Returnează datele actualizate dacă getNewData este true
    }
    // Dacă getNewData este false, nu returna nimic sau returnează o valoare specifică
    return null; // Sau orice altă valoare semnificativă pentru cazul tău
  } catch (err) {
    console.log("Error on...handleDeleteFirestore...", err);
    // Returnează null sau o valoare de eroare specifică în caz de eroare
    return null;
  }
};

//get all subcolletion from a collection
export const handleGetSubcollections = async (subcollection, sortBy = null) => {
  try {
    // Creează o interogare pentru grupul de colecții "Localitati"
    const q = query(collectionGroup(db, subcollection));

    // Execută interogarea și preia documentele
    const querySnapshot = await getDocs(q);

    // Crează un array pentru a stoca rezultatele
    const docs = [];

    // Iterează prin rezultatele interogării
    querySnapshot.forEach((doc) => {
      // Adaugă documentul la array
      docs.push({ ...doc.data() });
    });

    docs.sort((a, b) => {
      console.log("sort...", a);
      // Presupunând că id-urile sunt numerice
      if (sortBy) {
        // Converteste șirurile de caractere 'firstUploadDate' la obiecte de tip Date
        const dateA = new Date(a[sortBy].split("-").reverse().join("-"));
        const dateB = new Date(b[sortBy].split("-").reverse().join("-"));

        // Compară obiectele de tip Date
        return dateB - dateA; // Sortare descrescătoare
      } else {
        return a.id - b.id;
      }

      // Dacă id-urile sunt string-uri și vrei să le sortezi lexicografic, folosește:
      // return a.id.localeCompare(b.id);
    });

    // Returnează array-ul de localități
    return docs;
  } catch (err) {
    console.error("Eroare la preluarea subcolectiilor..... ", err);
    throw err; // Repropagă eroarea
  }
};

export const handleGetFirestoreSingleArrayData = async (location) => {
  console.log("Start...take from firestore array single", location);
  try {
    let arr = []; // Specificați tipul de obiecte pe care îl conține matricea
    const querySnapshot = await getDocs(collection(db, location));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ` ${location} => `, doc.data());
      arr = doc.data();
    });
    return arr;
  } catch (err) {
    console.log("Error at handleGetFirestoreSingleArrayData...", err);
    return [];
  }
};

export const handleQueryFirestore = async (
  location,
  queryParam,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null
) => {
  let arr = []; // Specificați tipul de obiecte pe care îl conține matricea, de exemplu: let arr = [{}];
  let conditions = [];

  conditions.push(collection(db, location));

  if (elementOne) {
    conditions.push(where(queryParam, "==", elementOne));
  }

  if (elementTwo) {
    conditions.push(where(queryParamTwo, "==", elementTwo));
  }

  const q = query(...conditions);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    arr.push(doc.data()); // Dacă dorești să adaugi un anumit câmp, specifică, de exemplu: doc.data().numeCamp
  });
  return arr;
};

export const handleQueryFirestoreSubcollection = async (
  location,
  queryParamOne,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null
) => {
  let arr = [];
  let localitatiRef;
  // Pasul 1: Interoghează subcolecția Localitati
  if (queryParamTwo) {
    localitatiRef = query(
      collectionGroup(db, location),
      where(queryParamOne, "==", elementOne),
      where(queryParamTwo, "==", elementTwo)
    );
  } else {
    localitatiRef = query(
      collectionGroup(db, location),
      where(queryParamOne, "==", elementOne)
    );
  }

  const querySnapshot = await getDocs(localitatiRef);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

export const handleQueryRandom = async (location, id) => {
  console.log("start query firestore location...", location);
  console.log("start query firestore id...", id);
  let obj = {}; // Specificați tipul de obiecte pe care îl conține matricea
  const q = query(collection(db, location), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // arr.push(doc.data().data);
    obj = { ...doc.data() };
  });
  return obj;
};

export const handleQueryDoubleParam = async (
  location,
  paramOne,
  elementOne,
  paramTwo,
  elementTwo
) => {
  let arr = []; // Specificați tipul de obiecte pe care îl conține matricea
  const q = query(
    collection(db, location),
    where(paramOne, "==", elementOne),
    where(paramTwo, "==", elementTwo)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // arr.push(doc.data().data);
    arr.push(doc.data());
  });
  return arr;
};
export const handleQueryTripleParam = async (
  location,
  paramOne,
  elementOne,
  paramTwo,
  elementTwo,
  paramThree,
  elementThree,
  maxQuery = null
) => {
  let arr = []; // Specificați tipul de obiecte pe care îl conține matricea
  const q = query(
    collection(db, location),
    where(paramOne, "==", elementOne),
    where(paramTwo, "==", elementTwo),
    where(paramThree, "==", elementThree)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // arr.push(doc.data().data);
    arr.push(doc.data());
  });
  return arr;
};
export const handleQueryPatruParam = async (
  location,
  paramOne,
  elementOne,
  paramTwo,
  elementTwo,
  paramThree,
  elementThree,
  paramPatru,
  elementPatru
) => {
  let arr = []; // Specificați tipul de obiecte pe care îl conține matricea
  const q = query(
    collection(db, location),
    where(paramOne, "==", elementOne),
    where(paramTwo, "==", elementTwo),
    where(paramThree, "==", elementThree),
    where(paramPatru, "==", elementPatru)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // arr.push(doc.data().data);
    arr.push(doc.data());
  });
  return arr;
};

export const handlePaginateFirestore = (location) => {
  const auth = authentication;
  const citiesRef = collection(db, "Users", auth.currentUser.uid, location);
  const q = query(citiesRef, startAt(1000000));
};

export const uploadJudete = async (jd) => {
  console.log("Start upload judete...");
  for (let i = 0; i < jd.length; i++) {
    const judetDoc = doc(collection(db, "Judete"));
    const judetData = {
      id: i + 1, // Numărul județului
      judet: jd[i].judet,
      documentId: judetDoc.id, // Adăugăm ID-ul documentului
    };
    await setDoc(judetDoc, judetData);

    for (let j = 0; j < jd[i].localitati.length; j++) {
      const localitateDoc = doc(collection(judetDoc, "Localitati"));
      const localitateData = {
        id: j + 1, // Numărul localității în cadrul județului
        localitate: jd[i].localitati[j],
        judet: jd[i].judet,
        documentId: localitateDoc.id, // Adăugăm ID-ul documentului
      };
      await setDoc(localitateDoc, localitateData);
    }
  }
};

export const handleQueryFirestoreSubcollectionTripleParam = async (
  location,
  queryParamOne,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null,
  queryParamThree = null,
  elementThree = null
) => {
  let arr = [];
  let localitatiRef;
  // Pasul 1: Interoghează subcolecția Localitati

  localitatiRef = query(
    collectionGroup(db, location),
    where(queryParamOne, "==", elementOne),
    where(queryParamTwo, "==", elementTwo),
    where(queryParamThree, "==", elementThree)
  );

  const querySnapshot = await getDocs(localitatiRef);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};
export const handleQueryFirestoreSubcollectionPatruParam = async (
  location,
  queryParamOne,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null,
  queryParamThree = null,
  elementThree = null,
  queryParamPatru = null,
  elementPatru = null
) => {
  let arr = [];
  let localitatiRef;
  // Pasul 1: Interoghează subcolecția Localitati

  localitatiRef = query(
    collectionGroup(db, location),
    where(queryParamOne, "==", elementOne),
    where(queryParamTwo, "==", elementTwo),
    where(queryParamThree, "==", elementThree),
    where(queryParamPatru, "==", elementPatru)
  );

  const querySnapshot = await getDocs(localitatiRef);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};
export const handleQueryFirestoreSubcollectionCinciParam = async (
  location,
  queryParamOne,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null,
  queryParamThree = null,
  elementThree = null,
  queryParamPatru = null,
  elementPatru = null,
  queryParamCinici = null,
  elementCinci = null
) => {
  let arr = [];
  let localitatiRef;
  // Pasul 1: Interoghează subcolecția Localitati

  localitatiRef = query(
    collectionGroup(db, location),
    where(queryParamOne, "==", elementOne),
    where(queryParamTwo, "==", elementTwo),
    where(queryParamThree, "==", elementThree),
    where(queryParamPatru, "==", elementPatru),
    where(queryParamCinici, "==", elementCinci)
  );

  const querySnapshot = await getDocs(localitatiRef);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};
export const handleQueryFirestoreSubcollectionSaseParam = async (
  location,
  queryParamOne,
  elementOne = null,
  queryParamTwo = null,
  elementTwo = null,
  queryParamThree = null,
  elementThree = null,
  queryParamPatru = null,
  elementPatru = null,
  queryParamCinici = null,
  elementCinci = null,
  queryParamSase = null,
  elementSase = null
) => {
  let arr = [];
  let localitatiRef;
  // Pasul 1: Interoghează subcolecția Localitati
  console.log("....start....");
  localitatiRef = query(
    collectionGroup(db, location),
    where(queryParamOne, "==", elementOne),
    where(queryParamTwo, "==", elementTwo),
    where(queryParamThree, "==", elementThree),
    where(queryParamPatru, "==", elementPatru),
    where(queryParamCinici, "==", elementCinci),
    where(queryParamSase, "==", elementSase)
  );
  console.log("....start....2");

  const querySnapshot = await getDocs(localitatiRef);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

export async function getLocalitatiWithUserCounts() {
  // const countyCapitals = [
  //   "Alba Iulia",
  //   "Arad",
  //   "Pitesti",
  //   "Bacau",
  //   "Oradea",
  //   "Bistrita",
  //   "Botosani",
  //   "Braila",
  //   "Brasov",
  //   "Bucuresti",
  //   "Buzau",
  //   "Calarasi",
  //   "Resita",
  //   "Cluj-Napoca",
  //   "Constanta",
  //   "Sfantu Gheorghe",
  //   "Targoviste",
  //   "Craiova",
  //   "Galati",
  //   "Giurgiu",
  //   "Targu Jiu",
  //   "Miercurea Ciuc",
  //   "Deva",
  //   "Slobozia",
  //   "Iasi",
  //   "Baia Mare",
  //   "Drobeta-Turnu Severin",
  //   "Targu Mures",
  //   "Piatra Neamt",
  //   "Slatina",
  //   "Ploiesti",
  //   "Satu Mare",
  //   "Zalau",
  //   "Sibiu",
  //   "Suceava",
  //   "Alexandria",
  //   "Timisoara",
  //   "Tulcea",
  //   "Ramnicu Valcea",
  //   "Vaslui",
  //   "Focsani",
  //   "Afumati",
  //   "Popesti-Leordeni",
  //   "Voluntari",
  //   "Otopeni",
  //   "Chitila",
  //   "Magurele",
  //   "Corbeanca",
  //   "Buftea",
  //   "Bragadiru",
  //   "Pantelimon",
  // ];
  const counties = [
    "Alba",
    "Arad",
    "Arges",
    "Bacau",
    "Bihor",
    "Bistrita-Nasaud",
    "Botosani",
    "Braila",
    "Brasov",
    "Bucuresti",
    "Buzau",
    "Calarasi",
    "Caras-Severin",
    "Cluj",
    "Constanta",
    "Covasna",
    "Dambovita",
    "Dolj",
    "Galati",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomita",
    "Iasi",
    "Ilfov",
    "Maramures",
    "Mehedinti",
    "Mures",
    "Neamt",
    "Olt",
    "Prahova",
    "Salaj",
    "Satu Mare",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timis",
    "Tulcea",
    "Valcea",
    "Vaslui",
    "Vrancea",
  ];

  try {
    const counts = [];

    for (const judet of counties) {
      console.log(judet);
      const q = query(
        collection(db, "Users"),
        where("judet", "==", judet),
        where("statusCont", "==", "Activ"),
        where("userType", "==", "Partener")
      );
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      if (count > 0) {
        counts.push({ localitate: judet, count });
      }
    }

    // Sortează rezultatele descrescător după count
    counts.sort((a, b) => b.count - a.count);

    return counts;
  } catch (error) {
    console.error("Error during data retrieval and processing: ", error);
    throw error; // Aruncă eroarea mai departe dacă dorești să o gestionezi și în alte părți ale aplicației
  }
}

//-------- PAGINATION -----

const handleGetFirestorePaginated = async (pageSize, collectionPath) => {
  const ref = collection(db, collectionPath);
  let pageQuery;

  pageQuery = query(ref, orderBy("firstUploadDate", "desc"), limit(pageSize));
  setLastVisible(null);
  setFirstVisible(null);
};

//-------- PAGINATION -----
