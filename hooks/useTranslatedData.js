"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouteLocale } from "@/hooks/useRouteLocale";

function getCache() {
  try {
    return JSON.parse(localStorage.getItem("translations") || "{}");
  } catch (_error) {
    return {};
  }
}

function setCache(cache) {
  try {
    localStorage.setItem("translations", JSON.stringify(cache));
  } catch (_error) {
    // Ignore storage failures.
  }
}

function translateDeep(data, fieldNames, translations) {
  if (Array.isArray(data)) {
    return data.map((item) => translateDeep(item, fieldNames, translations));
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  const next = {};
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string" && fieldNames.has(key)) {
      next[key] = translations[value] || value;
      return;
    }

    next[key] = translateDeep(value, fieldNames, translations);
  });

  return next;
}

function collectTexts(data, fieldNames, bucket = new Set()) {
  if (Array.isArray(data)) {
    data.forEach((item) => collectTexts(item, fieldNames, bucket));
    return bucket;
  }

  if (!data || typeof data !== "object") {
    return bucket;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string" && fieldNames.has(key) && value.trim()) {
      bucket.add(value);
      return;
    }

    collectTexts(value, fieldNames, bucket);
  });

  return bucket;
}

export function useTranslatedData(data, fields, targetLanguage) {
  const locale = targetLanguage || useRouteLocale("fr");
  const fieldKey = Array.isArray(fields) ? fields.join("|") : String(fields || "");
  const fieldNames = useMemo(() => new Set(fields), [fieldKey]);
  const sourceData = useMemo(() => data, [data]);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    let isCancelled = false;
    const texts = [...collectTexts(sourceData, fieldNames)];
    if (!texts.length) {
      setTranslations({});
      return;
    }

    const cache = getCache();
    const nextTranslations = {};
    const missing = [];

    texts.forEach((text) => {
      const cacheKey = `${text}_${locale}`;
      if (cache[cacheKey]) {
        nextTranslations[text] = cache[cacheKey];
      } else {
        missing.push(text);
      }
    });

    if (!missing.length) {
      setTranslations(nextTranslations);
      return;
    }

    const loadTranslations = async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texts: missing,
            targetLanguage: locale,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to translate dataset");
        }

        const result = await response.json();
        missing.forEach((text) => {
          const translatedText = result?.[text] || text;
          nextTranslations[text] = translatedText;
          cache[`${text}_${locale}`] = translatedText;
        });
        setCache(cache);

        if (!isCancelled) {
          setTranslations(nextTranslations);
        }
      } catch (_error) {
        if (!isCancelled) {
          setTranslations(nextTranslations);
        }
      }
    };

    loadTranslations();

    return () => {
      isCancelled = true;
    };
  }, [fieldNames, locale, sourceData]);

  return useMemo(
    () => translateDeep(sourceData, fieldNames, translations),
    [fieldNames, sourceData, translations]
  );
}
