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

function getBaseMessages(locale) {
  return {
    ...getMessages(locale, "common"),
    ...getMessages(locale, "commerce"),
    lang: getLocale(locale),
    home: getCommerceText(locale, "homeText"),
    realAmor: getCommerceText(locale, "realAmorText"),
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
  };
}

function getCheckoutUiMessages(locale) {
  return {
    stripeNotInitializedText: getCommerceText(
      locale,
      "checkoutStripeNotInitializedText"
    ),
    notAuthenticatedText: getCommerceText(
      locale,
      "checkoutNotAuthenticatedText"
    ),
    checkoutInitFailedText: getCommerceText(
      locale,
      "checkoutInitFailedText"
    ),
    errorPrefixText: getCommerceText(locale, "checkoutErrorPrefixText"),
  };
}

export function getPricingMessages(locale) {
  return {
    ...getBaseMessages(locale),
    ...getCheckoutUiMessages(locale),
    pricing: getCommerceText(locale, "pricingPagePricingText"),
    bookingText: getCommerceText(locale, "pricingPageBookingText"),
    paymentOneTimeText: getCommerceText(
      locale,
      "pricingPagePaymentOneTimeText"
    ),
    oneTimeFeature1: getCommerceText(
      locale,
      "pricingPageOneTimeFeature1Text"
    ),
    oneTimeFeature2: getCommerceText(
      locale,
      "pricingPageOneTimeFeature2Text"
    ),
    oneTimeFeature3: getCommerceText(
      locale,
      "pricingPageOneTimeFeature3Text"
    ),
    oneTimeFeature4: getCommerceText(
      locale,
      "pricingPageOneTimeFeature4Text"
    ),
    getStarted: getCommerceText(locale, "pricingPageGetStartedText"),
    acceptTermsText: getCommerceText(locale, "acceptTermsText"),
  };
}

export function getSubscriptionsMessages(locale) {
  return {
    ...getBaseMessages(locale),
    ...getCheckoutUiMessages(locale),
    pricing: getCommerceText(locale, "subscriptionsPagePricingText"),
    bookingTextPrim: getCommerceText(
      locale,
      "subscriptionsPageBookingTextPrim"
    ),
    bookingText: getCommerceText(locale, "subscriptionsPageBookingText"),
    bookingText2: getCommerceText(locale, "subscriptionsPageBookingText2"),
    paymentOneTimeText: getCommerceText(
      locale,
      "subscriptionsPagePaymentOneTimeText"
    ),
    threeMonthsText: getCommerceText(
      locale,
      "subscriptionsPageThreeMonthsText"
    ),
    oneTimeFeature1: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature1Text"
    ),
    oneTimeFeature2: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature2Text"
    ),
    oneTimeFeature3: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature3Text"
    ),
    oneTimeFeature4: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature4Text"
    ),
    oneTimeFeature5: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature5Text"
    ),
    oneTimeFeature6: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature6Text"
    ),
    oneTimeFeature7: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature7Text"
    ),
    oneTimeFeature8: getCommerceText(
      locale,
      "subscriptionsPageOneTimeFeature8Text"
    ),
    getStarted: getCommerceText(locale, "subscriptionsPageGetStartedText"),
    acceptTermsText: getCommerceText(locale, "acceptTermsText"),
    abonament12: getCommerceText(locale, "subscriptionsPageAbonament12Text"),
    abonament6: getCommerceText(locale, "subscriptionsPageAbonament6Text"),
    abonament3: getCommerceText(locale, "subscriptionsPageAbonament3Text"),
    abonament1anNoRenew: getCommerceText(
      locale,
      "subscriptionsPageAbonament1anNoRenewText"
    ),
    abonamentLifetime: getCommerceText(
      locale,
      "subscriptionsPageAbonamentLifetimeText"
    ),
    lifetimeFloaterCta: getCommerceText(
      locale,
      "subscriptionsPageLifetimeFloaterCtaText"
    ),
    lifetimeSectionHint: getCommerceText(
      locale,
      "subscriptionsPageLifetimeSectionHintText"
    ),
    monthText: getCommerceText(locale, "subscriptionsPageMonthText"),
    lifetimeDurationText: getCommerceText(
      locale,
      "subscriptionsPageLifetimeDurationText"
    ),
  };
}

export function getBookingMessages(locale) {
  return {
    ...getBaseMessages(locale),
    pricing: getCommerceText(locale, "bookingPagePricingText"),
    optiuneText: getCommerceText(locale, "bookingPageOptionPromptText"),
    selecteazaText: getCommerceText(locale, "bookingPageSelectText"),
    optiuneUnu: getCommerceText(locale, "bookingPageOption1Text"),
    optiuneDoi: getCommerceText(locale, "bookingPageOption2Text"),
    optiuneTrei: getCommerceText(locale, "bookingPageOption3Text"),
    reseteazaText: getCommerceText(locale, "bookingPageResetSelectionText"),
  };
}

export function getPaymentSuccessMessages(locale) {
  return {
    ...getBaseMessages(locale),
    pricing: getCommerceText(locale, "paymentSuccessPagePricingText"),
    paymentTitle: getCommerceText(locale, "paymentSuccessPageTitleText"),
    paymentText: getCommerceText(locale, "paymentSuccessPageBodyText"),
    paymentConfirmation: getCommerceText(
      locale,
      "paymentSuccessPageConfirmationText"
    ),
    loadingText: getCommerceText(locale, "paymentSuccessPageLoadingText"),
    successText: getCommerceText(locale, "paymentSuccessPageSuccessText"),
    continueBookingText: getCommerceText(
      locale,
      "paymentSuccessPageContinueText"
    ),
    detaliiRezervareText: getCommerceText(
      locale,
      "paymentSuccessPageDetailsText"
    ),
    nameText: getCommerceText(locale, "paymentSuccessPageNameText"),
    emailText: getCommerceText(locale, "paymentSuccessPageEmailText"),
    phoneText: getCommerceText(locale, "paymentSuccessPagePhoneText"),
    amountPaidText: getCommerceText(
      locale,
      "paymentSuccessPageAmountPaidText"
    ),
    paymentNotCompletedText: getCommerceText(
      locale,
      "paymentSuccessPageNotCompletedText"
    ),
  };
}

export function getSubscriptionSuccessMessages(locale) {
  return {
    ...getBaseMessages(locale),
    pricing: getCommerceText(locale, "subscriptionSuccessPagePricingText"),
    paymentTitle: getCommerceText(locale, "subscriptionSuccessPageTitleText"),
    paymentText: getCommerceText(locale, "subscriptionSuccessPageBodyText"),
    paymentConfirmation: getCommerceText(
      locale,
      "subscriptionSuccessPageConfirmationText"
    ),
    loadingText: getCommerceText(locale, "subscriptionSuccessPageLoadingText"),
    successText: getCommerceText(locale, "subscriptionSuccessPageSuccessText"),
    continueBookingText: getCommerceText(
      locale,
      "subscriptionSuccessPageContinueText"
    ),
    detaliiRezervareText: getCommerceText(
      locale,
      "subscriptionSuccessPageDetailsText"
    ),
    nameText: getCommerceText(locale, "subscriptionSuccessPageNameText"),
    emailText: getCommerceText(locale, "subscriptionSuccessPageEmailText"),
    phoneText: getCommerceText(locale, "subscriptionSuccessPagePhoneText"),
    amountPaidText: getCommerceText(
      locale,
      "subscriptionSuccessPageAmountPaidText"
    ),
  };
}

export function getThankYouMessages(locale) {
  return {
    ...getBaseMessages(locale),
    pricing: getCommerceText(locale, "thankYouPagePricingText"),
    reservationTitle: getCommerceText(
      locale,
      "thankYouPageReservationTitleText"
    ),
    reservationText: getCommerceText(locale, "thankYouPageReservationText"),
    reservationConfirmation: getCommerceText(
      locale,
      "thankYouPageReservationConfirmationText"
    ),
    approvalPendingText: getCommerceText(
      locale,
      "thankYouPageApprovalPendingText"
    ),
    loadingText: getCommerceText(locale, "thankYouPageLoadingText"),
    successText: getCommerceText(locale, "thankYouPageSuccessText"),
    homePageText: getCommerceText(locale, "thankYouPageHomePageText"),
    detailsText: getCommerceText(locale, "thankYouPageDetailsText"),
    nameText: getCommerceText(locale, "thankYouPageNameText"),
    emailText: getCommerceText(locale, "thankYouPageEmailText"),
    phoneText: getCommerceText(locale, "thankYouPagePhoneText"),
    dateText: getCommerceText(locale, "thankYouPageDateText"),
    timeText: getCommerceText(locale, "thankYouPageTimeText"),
    reservationNotCompletedText: getCommerceText(
      locale,
      "thankYouPageNotCompletedText"
    ),
  };
}

export function getAdminLifetimeSuccessMessages(locale) {
  return {
    ...getBaseMessages(locale),
    pricing: getCommerceText(locale, "adminLifetimeSuccessPagePricingText"),
    title: getCommerceText(locale, "adminLifetimeSuccessPageTitleText"),
    text: getCommerceText(locale, "adminLifetimeSuccessPageText"),
    backText: getCommerceText(locale, "adminLifetimeSuccessPageBackText"),
    hintText: getCommerceText(locale, "adminLifetimeSuccessPageHintText"),
  };
}
