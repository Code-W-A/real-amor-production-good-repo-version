import frCommon from "./messages/fr/common.json";
import enCommon from "./messages/en/common.json";
import nlCommon from "./messages/nl/common.json";
import roCommon from "./messages/ro/common.json";
import frAuth from "./messages/fr/auth.json";
import enAuth from "./messages/en/auth.json";
import nlAuth from "./messages/nl/auth.json";
import roAuth from "./messages/ro/auth.json";
import frCommerce from "./messages/fr/commerce.json";
import enCommerce from "./messages/en/commerce.json";
import nlCommerce from "./messages/nl/commerce.json";
import roCommerce from "./messages/ro/commerce.json";
import frDashboard from "./messages/fr/dashboard.json";
import enDashboard from "./messages/en/dashboard.json";
import nlDashboard from "./messages/nl/dashboard.json";
import roDashboard from "./messages/ro/dashboard.json";
import frAdmin from "./messages/fr/admin.json";
import enAdmin from "./messages/en/admin.json";
import nlAdmin from "./messages/nl/admin.json";
import roAdmin from "./messages/ro/admin.json";
import frQuiz from "./messages/fr/quiz.json";
import enQuiz from "./messages/en/quiz.json";
import nlQuiz from "./messages/nl/quiz.json";
import roQuiz from "./messages/ro/quiz.json";
import { normalizeRouteLocale } from "@/utils/routeLocale";

const MESSAGE_REGISTRY = Object.freeze({
  fr: Object.freeze({
    common: frCommon,
    auth: frAuth,
    commerce: frCommerce,
    dashboard: frDashboard,
    admin: frAdmin,
    quiz: frQuiz,
  }),
  en: Object.freeze({
    common: enCommon,
    auth: enAuth,
    commerce: enCommerce,
    dashboard: enDashboard,
    admin: enAdmin,
    quiz: enQuiz,
  }),
  nl: Object.freeze({
    common: nlCommon,
    auth: nlAuth,
    commerce: nlCommerce,
    dashboard: nlDashboard,
    admin: nlAdmin,
    quiz: nlQuiz,
  }),
  ro: Object.freeze({
    common: roCommon,
    auth: roAuth,
    commerce: roCommerce,
    dashboard: roDashboard,
    admin: roAdmin,
    quiz: roQuiz,
  }),
});

const warnedMissingMessages = new Set();
const warnedFallbackNamespaces = new Set();

function shouldWarn() {
  return process.env.NODE_ENV !== "production";
}

function logNamespaceFallback(locale, namespace, fallbackMessages, localizedMessages) {
  if (!shouldWarn()) {
    return;
  }

  if (locale === "fr") {
    return;
  }

  const fallbackKeys = Object.keys(fallbackMessages);
  if (fallbackKeys.length === 0) {
    return;
  }

  const missingKeys = fallbackKeys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(localizedMessages, key)
  );

  if (missingKeys.length === 0) {
    return;
  }

  const warningKey = `${locale}:${namespace}`;
  if (warnedFallbackNamespaces.has(warningKey)) {
    return;
  }

  warnedFallbackNamespaces.add(warningKey);
  console.info(
    `[i18n] Falling back to "fr" for locale "${locale}", namespace "${namespace}". Missing ${missingKeys.length}/${fallbackKeys.length} keys. Sample keys: ${missingKeys
      .slice(0, 5)
      .join(", ")}`
  );
}

function warnMissingMessage(namespace, key, locale) {
  if (!shouldWarn()) {
    return;
  }

  const warningKey = `${locale}:${namespace}:${key}`;
  if (warnedMissingMessages.has(warningKey)) {
    return;
  }

  warnedMissingMessages.add(warningKey);
  console.warn(
    `[i18n] Missing message for locale "${locale}", namespace "${namespace}", key "${key}".`
  );
}

function getRegistryLocale(locale) {
  const normalizedLocale = normalizeRouteLocale(locale, "fr");
  return MESSAGE_REGISTRY[normalizedLocale] ? normalizedLocale : "fr";
}

function getNamespaceMessages(locale, namespace) {
  const registryLocale = getRegistryLocale(locale);
  return MESSAGE_REGISTRY[registryLocale]?.[namespace] || {};
}

export function getMessages(locale, namespace) {
  const registryLocale = getRegistryLocale(locale);
  const fallbackMessages = getNamespaceMessages("fr", namespace);
  const localizedMessages = getNamespaceMessages(registryLocale, namespace);

  logNamespaceFallback(
    registryLocale,
    namespace,
    fallbackMessages,
    localizedMessages
  );

  return {
    ...fallbackMessages,
    ...localizedMessages,
  };
}

export function t(locale, namespace, key) {
  const messages = getMessages(locale, namespace);

  if (Object.prototype.hasOwnProperty.call(messages, key)) {
    return messages[key];
  }

  warnMissingMessage(namespace, key, getRegistryLocale(locale));
  return key;
}
