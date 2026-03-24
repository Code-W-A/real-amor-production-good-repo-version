import { useState, useEffect } from 'react';

export const useTranslate = (text, targetLanguage) => {
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    // Funcție pentru a verifica cache-ul în localStorage
    const getCachedTranslation = (text, language) => {
      const cachedTranslations = JSON.parse(localStorage.getItem('translations')) || {};
      return cachedTranslations[`${text}_${language}`];
    };

    // Funcție pentru a salva traducerea în cache
    const cacheTranslation = (text, language, translation) => {
      const cachedTranslations = JSON.parse(localStorage.getItem('translations')) || {};
      cachedTranslations[`${text}_${language}`] = translation;
      localStorage.setItem('translations', JSON.stringify(cachedTranslations));
    };

    const fetchTranslation = async () => {
      const cached = getCachedTranslation(text, targetLanguage);

      // Dacă traducerea este în cache, o folosim și afișăm un log
      if (cached) {
        console.log(`Using cached translation for "${text}" in "${targetLanguage}"`);
        setTranslatedText(cached);
      } else {
        // Dacă nu e în cache, facem cererea la Google Translate API
        console.log(`Fetching translation from API for "${text}" in "${targetLanguage}"`);
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, targetLanguage }),
          });
          const result = await response.json();
          
          // Salvăm traducerea în state și cache
          setTranslatedText(result);
          cacheTranslation(text, targetLanguage, result);
        } catch (err) {
          console.error('Translation error:', err);
        }
      }
    };

    if (targetLanguage) {
      fetchTranslation();
    }
  }, [text, targetLanguage]);

  return translatedText;
};
