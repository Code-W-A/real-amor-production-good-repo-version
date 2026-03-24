// import { createContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// export const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState("fr"); // Limba implicită
//   const router = useRouter();

//   useEffect(() => {
//     // Verificăm `lang` în query și valoarea din cookie
//     const urlParams = new URLSearchParams(window.location.search);
//     const langParam = urlParams.get("lang");
//     const cookieLocale = Cookies.get("NEXT_LOCALE");
//     console.log("lang...", langParam);

//     if (langParam && langParam !== cookieLocale) {
//       // Dacă `lang` din query diferă de cookie, actualizăm limba și cookie-ul
//       setLanguage(langParam);
//       Cookies.set("NEXT_LOCALE", langParam, { expires: 365, path: "/" });

//       // Redirecționăm la URL-ul curat cu limba setată ca prefix
//       const currentPath = window.location.pathname.replace(
//         /^\/(en|ro|fr|nl)(\/|$)/,
//         ""
//       );
//       const newUrl = `/${langParam}${currentPath}`;
//       router.replace(newUrl);
//     } else {
//       // Folosim valoarea din cookie dacă `lang` nu este în query
//       setLanguage(cookieLocale || "fr");
//     }
//   }, [router]);

//   const changeLanguage = (newLang) => {
//     setLanguage(newLang);
//     Cookies.set("NEXT_LOCALE", newLang, { expires: 365, path: "/" });

//     // Navigăm către URL-ul cu noua limbă ca prefix
//     const currentPath = window.location.pathname.replace(
//       /^\/(en|ro|fr|nl)(\/|$)/,
//       ""
//     );
//     const newUrl = `/${newLang}${currentPath}`;
//     router.push(newUrl);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, changeLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };
