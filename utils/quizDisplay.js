import { quizDisplayNl } from "@/data/quizDisplay.nl";
import { normalizeRouteLocale } from "@/utils/routeLocale";

function getOptionKey(option) {
  if (typeof option === "string") {
    return option;
  }

  if (option && typeof option === "object" && typeof option.image === "string") {
    return option.image;
  }

  return null;
}

function buildDefaultOptionLabels(options = []) {
  return options.reduce((acc, option) => {
    const key = getOptionKey(option);
    if (!key) return acc;

    acc[key] = typeof option === "string" ? option : key;
    return acc;
  }, {});
}

export function getQuizDisplayQuestion(locale, setName, question) {
  if (!question) {
    return {
      text: "",
      placeholder: undefined,
      optionLabels: {},
    };
  }

  const lang = normalizeRouteLocale(locale, "fr");
  const defaultOptionLabels = buildDefaultOptionLabels(question.options);
  const nlOverlay =
    lang === "nl" ? quizDisplayNl?.[setName]?.[String(question.id)] || null : null;

  return {
    text: nlOverlay?.text || question.text,
    placeholder:
      nlOverlay && Object.prototype.hasOwnProperty.call(nlOverlay, "placeholder")
        ? nlOverlay.placeholder
        : question.placeholder,
    optionLabels: {
      ...defaultOptionLabels,
      ...(nlOverlay?.optionLabels || {}),
    },
  };
}
