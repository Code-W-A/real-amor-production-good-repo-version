import { getMessages } from "@/i18n";
import { normalizeRouteLocale } from "@/utils/routeLocale";

export function getQuizMessages(locale) {
  const lang = normalizeRouteLocale(locale, "fr");
  const messages = getMessages(lang, "quiz");

  return {
    ...messages,
    "întrebareaText": messages.intrebareaText,
    lang,
  };
}
