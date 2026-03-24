import { getMessages, t } from "@/i18n";
import { normalizeRouteLocale } from "@/utils/routeLocale";

function getLocale(locale) {
  return normalizeRouteLocale(locale, "fr");
}

function getCommonText(locale, key) {
  return t(locale, "common", key);
}

function getCommerceText(locale, key) {
  return t(locale, "commerce", key);
}

function getDashboardText(locale, key) {
  return t(locale, "dashboard", key);
}

function getBaseMessages(locale) {
  return {
    ...getMessages(locale, "common"),
    ...getMessages(locale, "commerce"),
    ...getMessages(locale, "dashboard"),
    lang: getLocale(locale),
    realAmorText: getCommerceText(locale, "realAmorText"),
    methodeText: getCommonText(locale, "methodeText"),
    tarifsText: getCommonText(locale, "tarifsText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
    abonamentLifetimeText: getCommerceText(
      locale,
      "subscriptionsPageAbonamentLifetimeText"
    ),
    lifetimeSectionHintText: getCommerceText(
      locale,
      "subscriptionsPageLifetimeSectionHintText"
    ),
    getStartedText: getCommerceText(
      locale,
      "subscriptionsPageGetStartedText"
    ),
    acceptTermsText: getCommerceText(locale, "acceptTermsText"),
    stripeNotInitializedText: getCommerceText(
      locale,
      "checkoutStripeNotInitializedText"
    ),
  };
}

export function getProfileMessages(locale) {
  return getBaseMessages(locale);
}

export function getCompatibilityListMessages(locale) {
  return {
    ...getBaseMessages(locale),
    genText: getDashboardText(locale, "compatibilityListGenderText"),
    getText: getDashboardText(locale, "compatibilityListGenderShortText"),
  };
}

export function getChatMessages(locale) {
  return getBaseMessages(locale);
}

export function getClientCompatibilityMessages(locale) {
  return {
    ...getBaseMessages(locale),
    quizText: getDashboardText(locale, "clientCompatibilityQuizText"),
    downloadQuizText: getDashboardText(
      locale,
      "clientCompatibilityDownloadQuizText"
    ),
  };
}
