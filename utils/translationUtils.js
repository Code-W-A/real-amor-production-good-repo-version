// In-memory cache for translations
const translationCache = {};

export async function fetchTranslation(text, targetLanguage) {
  if (!text) return ""; // Evită erori pentru texte goale

  const cacheKey = `${text}_${targetLanguage}`;

  // 1️⃣ Verificăm dacă traducerea este deja în cache
  if (translationCache[cacheKey]) {
    console.log(
      `✅ Using cached translation for "${text}" in "${targetLanguage}"`
    );
    return translationCache[cacheKey];
  }

  // 2️⃣ Dacă nu este în cache, facem cererea la API
  const url =
    "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Cheia API stocată în variabilele de mediu
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "auto",
      to: targetLanguage,
      text: text,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.trans) {
      // 3️⃣ Salvăm traducerea în cache pentru utilizări viitoare
      translationCache[cacheKey] = data.trans;
      console.log(`✅ Cached translation for "${text}" in "${targetLanguage}"`);
      return data.trans;
    } else {
      console.error("❌ Translation API response error:", data);
      return text; // Dacă API-ul nu răspunde corect, returnează textul original
    }
  } catch (error) {
    console.error("❌ Translation API fetch error:", error);
    return text; // Dacă apare o eroare, returnează textul original
  }
}

export async function translateTextQuiz(text, targetLanguage) {
  if (!text) return "";

  console.log(
    `🔵 [translateTextQuiz] Traduc textul: "${text}" în "${targetLanguage}"`
  );

  const url =
    "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Cheia API RapidAPI
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "auto",
      to: targetLanguage,
      text: text,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.trans) {
      console.log(
        `✅ [translateTextQuiz] Rezultatul traducerii: "${data.trans}"`
      );
      return data.trans;
    } else {
      console.error(
        "❌ [translateTextQuiz] Translation API response error:",
        data
      );
      return text; // Returnează textul original în caz de eroare
    }
  } catch (error) {
    console.error("❌ [translateTextQuiz] Translation API fetch error:", error);
    return text; // Returnează textul original în caz de eroare
  }
}
