import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Extragem textul și limba țintă din corpul cererii
    const { text, texts, targetLanguage } = await request.json();
    const textList = Array.isArray(texts)
      ? texts.filter((value) => typeof value === "string" && value.trim())
      : typeof text === "string" && text.trim()
      ? [text]
      : [];

    if (!textList.length) {
      return NextResponse.json(Array.isArray(texts) ? {} : "");
    }

    console.log("Received text count:", textList.length);
    console.log("Target language:", targetLanguage);

    // Verificăm dacă cheia API este setată
    const API_KEY = process.env.GOOGLE_CLOUD_API_KEY; // Asigură-te că variabila este corectă

    if (!API_KEY) {
      throw new Error("Google API key not provided");
    }

    // Construim URL-ul pentru cererea către Google Translation API
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    console.log("API URL:", url);

    // Facem cererea către Google Translation API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: textList,
        target: targetLanguage,
        format: "text",
      }),
    });
    console.log("Response status:", response.status);

    // Verificăm dacă cererea a avut succes
    if (!response.ok) {
      const errorText = await response.text(); // Extragem mesajul de eroare
      console.error("Error response from Google API:", errorText);
      return NextResponse.json(
        { error: "Translation API request failed" },
        { status: response.status }
      );
    }

    // Parsăm răspunsul ca JSON
    const data = await response.json();
    console.log("API response data:", data);

    // Verificăm dacă datele sunt în formatul așteptat
    if (!data.data || !data.data.translations || !data.data.translations[0]) {
      console.error("Unexpected API response format:", data);
      return NextResponse.json(
        { error: "Unexpected API response format" },
        { status: 500 }
      );
    }

    const translatedItems = data.data.translations.map(
      (item) => item?.translatedText || ""
    );

    if (!Array.isArray(texts)) {
      const translatedText = translatedItems[0] || text;
      console.log("Translated text:", translatedText);
      return NextResponse.json(translatedText);
    }

    const translationMap = {};
    textList.forEach((sourceText, index) => {
      translationMap[sourceText] = translatedItems[index] || sourceText;
    });

    return NextResponse.json(translationMap);
  } catch (error) {
    console.error("Error during translation request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
