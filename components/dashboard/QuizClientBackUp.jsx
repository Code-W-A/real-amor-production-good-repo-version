// "use client";

// import React, { useEffect, useState } from "react";
// import { Range } from "react-range"; // Slider pentru valori multiple
// import FooterNine from "../layout/footers/FooterNine";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "@/firebase";
// import FinishedQuizComp from "../common/FinishQuizComp";
// import { useAuth } from "@/context/AuthContext";
// import {
//   firstQuestions,
//   questionsSet1,
//   questionsSet2,
//   questionsSet3,
// } from "@/data/quiz";
// import QuestionWithApiValidation from "./QuestionWithApiValidation";
// import { prepareResponses } from "@/utils/quizUtils";
// import AlertBox from "../uiElements/AlertBox";
// import { useRouter } from "next/navigation";
// import { DotLoader } from "react-spinners";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const getQuestionSetName = (currentQuestions) => {
//   if (currentQuestions === firstQuestions) return "firstQuestions";
//   if (currentQuestions === questionsSet1) return "questionsSet1";
//   if (currentQuestions === questionsSet2) return "questionsSet2";
//   if (currentQuestions === questionsSet3) return "questionsSet3";
//   return "unknownSet";
// };

// export default function QuizClient({ targetLanguage, translatedLinks }) {
//   const [currentQuestions, setCurrentQuestions] = useState(firstQuestions);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   // const [currentQuestions, setCurrentQuestions] = useState(firstQuestions);
//   // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [inputAnswers, setInputAnswers] = useState({});
//   const [rangeValues, setRangeValues] = useState([]);

//   const [progress, setProgress] = useState(0);
//   const [quizFinished, setQuizFinished] = useState(false);
//   const { currentUser, loading: loadingContext, userData } = useAuth();
//   const [answers, setAnswers] = useState({
//     firstQuestions,
//     questionsSet1,
//     questionsSet2,
//     questionsSet3,
//   });
//   const [showProgressBar, setShowProgressBar] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [isRedirecting, setIsRedirecting] = useState(true);
//   const [userAge, setUserAge] = useState(null);
//   const [selectedDate, setSelectedDate] = useState({});
//   const [translatedOptions, setTranslatedOptions] = useState({});
//   const [translatedQuestionText, setTranslatedQuestionText] = useState("");
//   const [selectedDateRange, setSelectedDateRange] = useState({});

//   const router = useRouter();

//   const handleDateChange = (date) => {
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     console.log("date,,,,", date);
//     setSelectedDate((prev) => ({
//       ...prev,
//       [currentQuestion.id]: date,
//     }));
//   };

//   const handleDateRangeChange = (range) => {
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     setSelectedDateRange((prev) => ({
//       ...prev,
//       [currentQuestion.id]: range,
//     }));
//   };

//   useEffect(() => {
//     if (!loadingContext && !userData?.username) {
//       console.log("no userData...", userData?.username);
//       router.push("/signup");
//     }
//     if (!loadingContext && userData?.responses) {
//       router.push("/pricing");
//     }
//     // if (!loadingContext && userData?.reservation?.hasReserved) {
//     //   router.push("/profil-client");
//     // }
//     // if (!loadingContext && userData?.reservation?.status !== "paid") {
//     //   router.push("/pricing");
//     // }
//     setIsRedirecting(false);
//   }, [loadingContext]);

//   const saveResponsesToFirestore = async (
//     userId,
//     userAnswers,
//     currentQuestions
//   ) => {
//     try {
//       // Identificăm setul activ de întrebări pe baza răspunsului din firstQuestions
//       let activeQuestionSetName = "firstQuestions"; // Default

//       if (
//         userAnswers.firstQuestions[0]?.answer ===
//         "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable."
//       ) {
//         activeQuestionSetName = "questionsSet1";
//       } else if (
//         userAnswers.firstQuestions[0]?.answer ===
//         "Je cherche des rencontres coquines en toute discrétion."
//       ) {
//         activeQuestionSetName = "questionsSet2";
//       } else if (
//         userAnswers.firstQuestions[0]?.answer ===
//         "Je cherche à élargir mon cercle d’amis."
//       ) {
//         activeQuestionSetName = "questionsSet3";
//       }

//       // Construim răspunsurile doar pentru seturile relevante
//       const filteredResponses = {
//         firstQuestions: prepareResponses(
//           [{ name: "firstQuestions", questions: firstQuestions }],
//           userAnswers
//         ),
//         [activeQuestionSetName]: prepareResponses(
//           [{ name: activeQuestionSetName, questions: currentQuestions }],
//           userAnswers
//         ),
//       };

//       // Salvează răspunsurile filtrate în Firestore
//       const userDocRef = doc(db, "Users", userId);
//       await updateDoc(userDocRef, { responses: filteredResponses });

//       console.log(
//         "Doar răspunsurile relevante au fost salvate în Firestore:",
//         filteredResponses
//       );
//       setQuizFinished(true);
//     } catch (error) {
//       console.error("Eroare la salvarea răspunsurilor:", error);
//     }
//   };

//   const handleOptionChange = (option) => {
//     const currentQuestion = currentQuestions[currentQuestionIndex];

//     // Gestionăm opțiunea "Autre"
//     if (option.includes("Autre")) {
//       setSelectedOptions((prev) => ({
//         ...prev,
//         [currentQuestion.id]: "custom", // Marcăm opțiunea ca personalizată
//       }));
//     } else {
//       // Gestionare opțiuni normale
//       if (currentQuestion.type === "multiple") {
//         setSelectedOptions((prev) => {
//           const options = prev[currentQuestion.id] || [];
//           return {
//             ...prev,
//             [currentQuestion.id]: options.includes(option)
//               ? options.filter((o) => o !== option)
//               : [...options, option],
//           };
//         });
//       } else {
//         setSelectedOptions((prev) => ({
//           ...prev,
//           [currentQuestion.id]: option,
//         }));
//       }
//     }
//   };

//   const handleCustomInputChange = (e) => {
//     const { value } = e.target;
//     const currentQuestion = currentQuestions[currentQuestionIndex];

//     setInputAnswers((prev) => ({
//       ...prev,
//       [`custom_${currentQuestion.id}`]: value, // Stocăm răspunsul personalizat
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { value } = e.target;
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     setInputAnswers((prev) => ({
//       ...prev,
//       [currentQuestion.id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("userAge...1", userAge);
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     let selectedAnswer;
//     if (currentQuestion.type === "date-picker") {
//       selectedAnswer = selectedDate[currentQuestion.id];
//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     } else if (currentQuestion.type === "date-range-picker") {
//       selectedAnswer = selectedDateRange[currentQuestion.id];
//       if (
//         !selectedAnswer ||
//         !selectedAnswer.startDate ||
//         !selectedAnswer.endDate
//       ) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     } else if (currentQuestion.type === "image-selection") {
//       selectedAnswer = selectedOptions[currentQuestion.id];

//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     }

//     // Gestionăm răspunsurile personalizate pentru opțiunea "Autre"
//     else if (selectedOptions[currentQuestion.id] === "custom") {
//       selectedAnswer = inputAnswers[`custom_${currentQuestion.id}`];
//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     }
//     // Gestionăm răspunsurile pentru întrebările de tip "input"
//     else if (currentQuestion.type === "input") {
//       selectedAnswer = inputAnswers[currentQuestion.id];
//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     }
//     // Gestionăm răspunsurile pentru întrebările de tip "range"
//     else if (currentQuestion.type === "range") {
//       if (currentQuestion.singleValue) {
//         selectedAnswer = rangeValues[0]; // Valoare unică
//       } else {
//         selectedAnswer = { min: rangeValues[0], max: rangeValues[1] }; // Interval
//       }
//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     }

//     // Gestionăm răspunsurile pentru întrebările de tip "multiple"
//     else if (currentQuestion.type === "multiple") {
//       selectedAnswer = selectedOptions[currentQuestion.id] || [];
//       if (selectedAnswer.length === 0) {
//         setAlertMessage(translatedLinks.selectOneOptionText);
//         setShowAlert(true);
//         return;
//       }
//     }
//     // Gestionăm răspunsurile pentru întrebările de tip "single"
//     else {
//       selectedAnswer = selectedOptions[currentQuestion.id];
//       if (!selectedAnswer) {
//         setAlertMessage(translatedLinks.selectedAnswerText);
//         setShowAlert(true);
//         return;
//       }
//     }

//     // Identificăm setul de întrebări curent
//     const questionSetName = getQuestionSetName(currentQuestions);

//     // Salvăm răspunsul în starea globală
//     setAnswers((prev) => ({
//       ...prev,
//       [questionSetName]: prev[questionSetName].map((q) =>
//         q.id === currentQuestion.id ? { ...q, answer: selectedAnswer } : q
//       ),
//     }));

//     // Gestionare cazuri speciale pentru întrebările cu `conditionalNext`
//     if (currentQuestion.conditionalNext) {
//       const nextQuestionId = currentQuestion.conditionalNext[selectedAnswer];
//       if (nextQuestionId) {
//         const nextQuestionIndex = currentQuestions.findIndex(
//           (q) => q.id === nextQuestionId
//         );
//         if (nextQuestionIndex !== -1) {
//           setCurrentQuestionIndex(nextQuestionIndex);
//           setProgress(
//             ((nextQuestionIndex + 1) / currentQuestions.length) * 100
//           );
//           return; // Ieșim din funcție după gestionarea `conditionalNext`
//         }
//       }
//     }

//     // Gestionare trecere la întrebarea următoare
//     const nextQuestionIndex = currentQuestionIndex + 1;
//     if (nextQuestionIndex < currentQuestions.length) {
//       setCurrentQuestionIndex(nextQuestionIndex);
//       setProgress(((nextQuestionIndex + 1) / currentQuestions.length) * 100);
//     }
//     // Gestionare tranziție la alte seturi de întrebări
//     else if (currentQuestions === firstQuestions) {
//       switch (selectedOptions[1]) {
//         case "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.":
//           setCurrentQuestions(questionsSet1);
//           break;
//         case "Je cherche des rencontres coquines en toute discrétion.":
//           setCurrentQuestions(questionsSet2);
//           break;
//         case "Je cherche à élargir mon cercle d’amis.":
//           setCurrentQuestions(questionsSet3);
//           break;
//         default:
//           console.error("Răspuns necunoscut la întrebarea 1.");
//           return;
//       }

//       setCurrentQuestionIndex(0);
//       setShowProgressBar(true);
//       setProgress(0);
//     }
//     // Finalizare chestionar
//     else {
//       if (userData?.uid) {
//         try {
//           console.log("Salvez răspunsurile în Firestore...", answers);

//           const userDocRef = doc(db, "Users", userData.uid);

//           // const dataToSave = { responses: answers };
//           const dataToSave = {
//             responses: {
//               ...answers,
//               [questionSetName]: answers[questionSetName].map((q) =>
//                 q.id === currentQuestion.id
//                   ? { ...q, answer: selectedAnswer }
//                   : q
//               ),
//             },
//           };
//           console.log("userAge...2", userAge);
//           if (userAge !== null) {
//             dataToSave.age = userAge; // Adăugăm vârsta calculată
//           }

//           await updateDoc(userDocRef, dataToSave);

//           console.log("Răspunsurile și vârsta au fost salvate cu succes!");
//           setQuizFinished(true);
//         } catch (error) {
//           console.error("Eroare la salvarea răspunsurilor:", error);
//         }
//       } else {
//         console.error("Utilizatorul nu este autentificat.");
//       }
//     }
//   };

//   const handleNextQuestion = () => {
//     if (
//       currentQuestions === firstQuestions &&
//       currentQuestionIndex === currentQuestions.length - 1
//     ) {
//       switch (selectedOptions[1]) {
//         case "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.":
//           setCurrentQuestions(questionsSet1);
//           break;
//         case "Je cherche des rencontres coquines en toute discrétion.":
//           setCurrentQuestions(questionsSet2);
//           break;
//         case "Je cherche à élargir mon cercle d’amis.":
//           setCurrentQuestions(questionsSet3);
//           break;
//         default:
//           console.error("Răspuns necunoscut la întrebarea 1");
//           return;
//       }
//       setCurrentQuestionIndex(0);
//       setProgress(0);
//       return;
//     }

//     const nextQuestionIndex = currentQuestionIndex + 1;
//     if (nextQuestionIndex < currentQuestions.length) {
//       setCurrentQuestionIndex(nextQuestionIndex);

//       // Resetează selecțiile pentru următoarea întrebare
//       setSelectedOptions((prev) => ({
//         ...prev,
//         [currentQuestions[nextQuestionIndex]?.id]: [], // Setează un array gol pentru următoarea întrebare
//       }));

//       setProgress(((nextQuestionIndex + 1) / currentQuestions.length) * 100);
//     } else {
//       if (userData?.uid) {
//         saveResponsesToFirestore(userData.uid, answers, currentQuestions);
//       } else {
//         console.error("Utilizatorul nu este autentificat");
//       }
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//       setProgress(
//         ((currentQuestionIndex - 1 + 1) / currentQuestions.length) * 100
//       );
//     }
//   };

//   const handleValidatedAnswer = (validatedAnswer) => {
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     const questionSetName = getQuestionSetName(currentQuestions);

//     // Gestionăm răspunsul pentru întrebarea cu id: 9
//     if (currentQuestion.api && currentQuestion.type === "input") {
//       const postalCode = validatedAnswer?.split(",")[0]?.trim();
//       const city = validatedAnswer?.split(",")[1]?.trim();

//       if (!postalCode || !city) {
//         console.error("Codul poștal sau orașul sunt invalide.");
//         return;
//       }

//       // Formatăm răspunsul ca string: "city, postalCode"
//       const formattedAnswer = `${city}, ${postalCode}`;

//       // Adăugăm răspunsul formatat în answers
//       setAnswers((prev) => ({
//         ...prev,
//         [questionSetName]: prev[questionSetName].map((q) =>
//           q.id === currentQuestion.id ? { ...q, answer: formattedAnswer } : q
//         ),
//       }));

//       handleNextQuestion(); // Trecem la următoarea întrebare
//       return;
//     }

//     // Gestionăm cazurile generale
//     setAnswers((prev) => ({
//       ...prev,
//       [questionSetName]: prev[questionSetName].map((q) =>
//         q.id === currentQuestion.id ? { ...q, answer: validatedAnswer } : q
//       ),
//     }));

//     handleNextQuestion(); // Trecem la următoarea întrebare
//   };

//   const handleDateInputChange = (e) => {
//     let { value } = e.target;
//     console.log("asdas");
//     // Elimină orice caracter non-numeric sau slash
//     value = value.replace(/[^0-9]/g, "");

//     // Adaugă slash-uri automat după fiecare două cifre
//     if (value.length > 2 && value.length <= 4) {
//       value = `${value.slice(0, 2)}/${value.slice(2)}`;
//     } else if (value.length > 4) {
//       value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
//     }

//     // Actualizează starea pentru inputul curent
//     const currentQuestion = currentQuestions[currentQuestionIndex];
//     setInputAnswers((prev) => ({
//       ...prev,
//       [currentQuestion.id]: value,
//     }));

//     // Dacă data este completă (lungimea este 10), calculăm vârsta
//     if (value.length === 10) {
//       const [day, month, year] = value.split("/").map(Number);
//       const birthDate = new Date(year, month - 1, day);
//       const today = new Date();

//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDifference = today.getMonth() - birthDate.getMonth();
//       if (
//         monthDifference < 0 ||
//         (monthDifference === 0 && today.getDate() < birthDate.getDate())
//       ) {
//         age--;
//       }

//       console.log("age...", age);
//       // Validăm vârsta calculată
//       if (!isNaN(age) && age >= 0 && age <= 120) {
//         setUserAge(age); // Setăm vârsta în starea componentelor
//       } else {
//         setUserAge(null); // Resetăm vârsta dacă data este invalidă
//       }
//     } else {
//       setUserAge(null); // Resetăm vârsta dacă data este incompletă
//     }
//   };

//   const currentQuestion = currentQuestions[currentQuestionIndex];

//   useEffect(() => {
//     const question = currentQuestions[currentQuestionIndex];

//     if (question?.type === "range") {
//       const min = question.validation?.min || 30;
//       const max = question.validation?.max || 300;

//       // Verificăm și setăm explicit valorile
//       if (question.singleValue) {
//         console.log("Resetting range for single value");
//         setRangeValues([min]); // Slider cu o singură valoare
//       } else {
//         console.log("Resetting range for interval");
//         setRangeValues([min, max]); // Slider cu interval
//       }
//     } else {
//       // Dacă întrebarea nu este de tip range, resetează starea
//       setRangeValues([]);
//     }
//   }, [currentQuestionIndex, currentQuestions]);

//   // TRADUCERI //

//   const translateText = async (text) => {
//     try {
//       const API_KEY = process.env.GOOGLE_CLOUD_API_KEY; // Asigură-te că această cheie este disponibilă
//       const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           q: text,
//           target: targetLanguage,
//           format: "text",
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Eroare la Google API:", errorText);
//         throw new Error("Translation failed");
//       }

//       const data = await response.json();
//       return data.data.translations[0].translatedText;
//     } catch (error) {
//       console.error("Eroare la traducerea textului:", error);
//       return text; // Returnează textul original ca fallback
//     }
//   };

//   const translateQuestionText = async (text) => {
//     const translatedText = await translateText(text);
//     setTranslatedQuestionText(translatedText);
//   };

//   const translateAndStoreOptions = async (options) => {
//     const translations = {};
//     for (const option of options) {
//       const translatedText = await translateText(option); // Traducem fiecare opțiune
//       translations[option] = translatedText;
//     }
//     setTranslatedOptions(translations);
//   };

//   useEffect(() => {
//     if (currentQuestion?.text) {
//       translateQuestionText(currentQuestion.text);
//     }
//   }, [currentQuestion]);

//   useEffect(() => {
//     if (currentQuestion?.options?.length > 0) {
//       translateAndStoreOptions(currentQuestion.options);
//     }
//   }, [currentQuestion]);

//   // TRADUCERI //

//   if (quizFinished) {
//     return <FinishedQuizComp translatedLinks={translatedLinks} />;
//   }

//   if (isRedirecting) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <DotLoader color="#c13365" size={60} />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="dashboard__main pl-0">
//         <div className="dashboard__content bg-light-4 pt-20">
//           {/* <div className="row pb-20 mb-10">
//             <div className="col-auto">
//               <h1 className="text-30 lh-12 fw-700">Chestionar</h1>
//             </div>
//           </div> */}

//           <div className="row y-gap-30">
//             <div className={showProgressBar ? "col-xl-9" : "col-xl-12"}>
//               <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4">
//                 <div className="py-30 px-30">
//                   <div className="row pb-20 mb-10">
//                     <div className="col-auto">
//                       <h1 className="text-30 lh-12 fw-700">
//                         {translatedLinks.chestionarText}
//                       </h1>
//                     </div>
//                   </div>
//                   <div className="border-light overflow-hidden rounded-8">
//                     <div className="py-40 px-40 bg-dark-5">
//                       <h4 className="text-18 lh-1 fw-500 text-white">
//                         {translatedLinks.întrebareaText} {currentQuestion.id}
//                       </h4>
//                       <div className="text-20 lh-1 text-white mt-15">
//                         {translatedQuestionText || currentQuestion.text}{" "}
//                         {/* Tradus sau fallback */}
//                       </div>
//                     </div>
//                     <div className="px-40 py-40">
//                       {currentQuestion.type === "date-picker" ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             <label>{currentQuestion.text}</label>
//                             <DatePicker
//                               selected={
//                                 selectedDate[currentQuestion.id] || null
//                               }
//                               onChange={(date) => handleDateChange(date)}
//                               showMonthYearPicker
//                               dateFormat="MM/yyyy"
//                               placeholderText={currentQuestion.placeholder}
//                               className="form-control"
//                             />
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex !== 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                               disabled={!selectedDate[currentQuestion.id]}
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.type === "date-range-picker" ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             <label>{currentQuestion.text}</label>
//                             <DatePicker
//                               selected={
//                                 selectedDateRange[currentQuestion.id]
//                                   ?.startDate || null
//                               }
//                               onChange={(dates) => {
//                                 const [start, end] = dates;
//                                 handleDateRangeChange({
//                                   startDate: start,
//                                   endDate: end,
//                                 });
//                               }}
//                               startDate={
//                                 selectedDateRange[currentQuestion.id]
//                                   ?.startDate || null
//                               }
//                               endDate={
//                                 selectedDateRange[currentQuestion.id]
//                                   ?.endDate || null
//                               }
//                               selectsRange
//                               dateFormat="MM/yyyy"
//                               placeholderText={currentQuestion.placeholder}
//                               className="form-control"
//                             />
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex !== 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                               disabled={
//                                 !selectedDateRange[currentQuestion.id]
//                                   ?.startDate ||
//                                 !selectedDateRange[currentQuestion.id]?.endDate
//                               }
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.type === "image-selection" ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="image-selection-container">
//                             {currentQuestion.options.map((option, index) => (
//                               <div
//                                 key={index}
//                                 className={`image-option ${
//                                   selectedOptions[currentQuestion.id] ===
//                                   option.image
//                                     ? "selected"
//                                     : ""
//                                 }`}
//                                 onClick={() =>
//                                   setSelectedOptions((prev) => ({
//                                     ...prev,
//                                     [currentQuestion.id]: option.image,
//                                   }))
//                                 }
//                               >
//                                 <img
//                                   src={`/assets/img/${option.image}`}
//                                   alt={`Option ${index + 1}`}
//                                   className="image-thumbnail"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex !== 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                               disabled={!selectedOptions[currentQuestion.id]}
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.type === "input" &&
//                         !currentQuestion.api &&
//                         currentQuestion.placeholder !== "JJ/MM/AAAA" ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             <input
//                               type="text"
//                               placeholder={currentQuestion.placeholder}
//                               value={inputAnswers[currentQuestion.id] || ""}
//                               onChange={handleInputChange}
//                               className="form-control custom-input"
//                             />
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex != 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                                 disabled={currentQuestionIndex === 0}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.type === "range" &&
//                         currentQuestion.singleValue ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             {/* Slider pentru o singură valoare */}
//                             <Range
//                               step={1}
//                               min={currentQuestion.validation.min}
//                               max={currentQuestion.validation.max}
//                               values={rangeValues}
//                               onChange={(values) => setRangeValues(values)}
//                               renderTrack={({ props, children }) => (
//                                 <div
//                                   {...props}
//                                   className="range-track"
//                                   style={{
//                                     height: "6px",
//                                     background: "#ddd",
//                                     borderRadius: "3px",
//                                   }}
//                                 >
//                                   {children}
//                                 </div>
//                               )}
//                               renderThumb={({ props, value }) => (
//                                 <div
//                                   {...props}
//                                   className="range-thumb"
//                                   style={{
//                                     height: "20px",
//                                     width: "20px",
//                                     background: "#6c63ff",
//                                     borderRadius: "50%",
//                                     outline: "none",
//                                   }}
//                                 >
//                                   <div className="value-tooltip">{value}</div>
//                                 </div>
//                               )}
//                             />
//                             <div className="range-labels">
//                               <span>{rangeValues[0]}</span>
//                             </div>
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex !== 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                                 disabled={currentQuestionIndex === 0}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.type === "range" &&
//                         !currentQuestion.singleValue ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             {/* Slider pentru interval */}
//                             <Range
//                               step={1}
//                               min={currentQuestion.validation.min}
//                               max={currentQuestion.validation.max}
//                               values={rangeValues}
//                               onChange={(values) => setRangeValues(values)} // Actualizează ambele valori direct
//                               renderTrack={({ props, children }) => (
//                                 <div
//                                   {...props}
//                                   className="range-track"
//                                   style={{
//                                     height: "6px",
//                                     background: "#ddd",
//                                     borderRadius: "3px",
//                                   }}
//                                 >
//                                   {children}
//                                 </div>
//                               )}
//                               renderThumb={({ props, value, index }) => (
//                                 <div
//                                   {...props}
//                                   className="range-thumb"
//                                   style={{
//                                     height: "20px",
//                                     width: "20px",
//                                     background: "#6c63ff",
//                                     borderRadius: "50%",
//                                     outline: "none",
//                                   }}
//                                 >
//                                   <div className="value-tooltip">{value}</div>
//                                 </div>
//                               )}
//                             />
//                             <div className="range-labels">
//                               <span>{rangeValues[0]}</span>
//                               <span>{rangeValues[1]}</span>
//                             </div>
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex !== 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                                 disabled={currentQuestionIndex === 0}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : currentQuestion.api &&
//                         currentQuestion.type === "input" ? (
//                         <QuestionWithApiValidation
//                           question={currentQuestion}
//                           onValidatedAnswer={handleValidatedAnswer}
//                         />
//                       ) : currentQuestion.validation?.type === "date" ? (
//                         <form onSubmit={handleSubmit}>
//                           <div className="form-group">
//                             <input
//                               type="text"
//                               placeholder={
//                                 currentQuestion.placeholder || "JJ/MM/AAAA"
//                               }
//                               value={inputAnswers[currentQuestion.id] || ""}
//                               onChange={handleDateInputChange} // Utilizarea funcției pentru gestionarea formatării
//                               className="form-control custom-input"
//                               maxLength={10} // Limitează lungimea la 10 caractere (dd/MM/yyyy)
//                             />
//                           </div>
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex != 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                                 disabled={currentQuestionIndex === 0}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       ) : (
//                         <form onSubmit={handleSubmit}>
//                           {currentQuestion.options?.map((option, index) => (
//                             <div
//                               key={index}
//                               className="form-radio d-flex items-center mt-20"
//                             >
//                               <div className="radio">
//                                 <input
//                                   type={
//                                     currentQuestion.type === "multiple"
//                                       ? "checkbox"
//                                       : "radio"
//                                   }
//                                   value={option}
//                                   checked={
//                                     currentQuestion.type === "multiple"
//                                       ? selectedOptions[
//                                           currentQuestion.id
//                                         ]?.includes(option)
//                                       : selectedOptions[currentQuestion.id] ===
//                                         option
//                                   }
//                                   onChange={() => handleOptionChange(option)}
//                                 />
//                                 <div className="radio__mark">
//                                   <div className="radio__icon"></div>
//                                 </div>
//                               </div>
//                               <div className="fw-500 ml-12">
//                                 {translatedOptions[option] || option}
//                               </div>
//                             </div>
//                           ))}
//                           {/* Câmp input pentru opțiunea "Autre" */}
//                           {selectedOptions[currentQuestion.id] === "custom" &&
//                             currentQuestion.allowsCustom && (
//                               <div className="form-group mt-20">
//                                 <input
//                                   type="text"
//                                   placeholder="Introduceți răspunsul personalizat"
//                                   value={
//                                     inputAnswers[
//                                       `custom_${currentQuestion.id}`
//                                     ] || ""
//                                   }
//                                   onChange={handleCustomInputChange}
//                                   className="form-control custom-input"
//                                 />
//                               </div>
//                             )}
//                           <div className="d-flex justify-end">
//                             {currentQuestionIndex != 0 && (
//                               <button
//                                 type="button"
//                                 className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
//                                 onClick={handlePreviousQuestion}
//                                 disabled={currentQuestionIndex === 0}
//                               >
//                                 {translatedLinks.inapoiText}
//                               </button>
//                             )}
//                             <button
//                               type="submit"
//                               className="button -md -dark-1 text-white -dark-button-white mt-40"
//                             >
//                               {translatedLinks.urmatorulText}
//                             </button>
//                           </div>
//                         </form>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-between items-center mt-40"></div>
//               </div>
//             </div>

//             {showProgressBar && (
//               <div className="col-xl-3 col-lg-3">
//                 <div className="row y-gap-30">
//                   <div className="col-12">
//                     <div className="pt-20 pb-30 px-30 rounded-16 bg-white -dark-bg-dark-1 shadow-4">
//                       <h5 className="text-17 fw-500 mb-30">
//                         {translatedLinks.progresText}
//                       </h5>
//                       <div className="d-flex items-center">
//                         <div className="progress-bar w-1/1">
//                           <div className="progress-bar__bg bg-light-3"></div>
//                           <div
//                             className="progress-bar__bar bg-purple-1"
//                             style={{ width: `${progress}%` }}
//                           ></div>
//                         </div>
//                         <div className="d-flex y-gap-10 justify-between items-center ml-15">
//                           <div>{progress.toFixed(0)}%</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <FooterNine />
//       </div>
//       {showAlert && (
//         <AlertBox
//           type="danger"
//           message={alertMessage}
//           showAlert={showAlert}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//     </>
//   );
// }
