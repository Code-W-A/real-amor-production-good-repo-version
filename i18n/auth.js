import { getMessages, t } from "@/i18n";
import { normalizeRouteLocale } from "@/utils/routeLocale";

function getLocale(locale) {
  return normalizeRouteLocale(locale, "fr");
}

function getCommonText(locale, key) {
  return t(locale, "common", key);
}

function getAuthText(locale, key) {
  return t(locale, "auth", key);
}

function getMergedMessages(locale) {
  return {
    ...getMessages(locale, "common"),
    ...getMessages(locale, "auth"),
    lang: getLocale(locale),
  };
}

function buildTermsAndConditions(locale) {
  return {
    prefix: getAuthText(locale, "signupTermsPrefixText"),
    mentionsLegalesLinkText: getAuthText(
      locale,
      "signupTermsMentionsLegalesLinkText"
    ),
    mentionsLegalesSuffix: getAuthText(
      locale,
      "signupTermsMentionsLegalesSuffixText"
    ),
    politiqueConfidentialiteLinkText: getAuthText(
      locale,
      "signupTermsPolitiqueConfidentialiteLinkText"
    ),
    politiqueConfidentialiteSuffix: getAuthText(
      locale,
      "signupTermsPolitiqueConfidentialiteSuffixText"
    ),
    politiqueCookiesLinkText: getAuthText(
      locale,
      "signupTermsPolitiqueCookiesLinkText"
    ),
    suffix: getAuthText(locale, "signupTermsSuffixText"),
  };
}

export function getLoginMessages(locale) {
  const messages = getMergedMessages(locale);

  return {
    emailText: getAuthText(locale, "emailText"),
    parolaText: getAuthText(locale, "loginPasswordText"),
    autentificareText: getAuthText(locale, "loginHeadingText"),
    aiContText: getAuthText(locale, "loginNoAccountText"),
    inscrieText: getAuthText(locale, "loginSignupCtaText"),
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    lang: messages.lang,
    autentificareReusita: getAuthText(locale, "loginSuccessText"),
    autentificareEsuata: getAuthText(locale, "loginErrorPrefixText"),
    aiUitatParolText: getAuthText(locale, "loginForgotPasswordText"),
    resetPassText: getAuthText(locale, "loginResetPasswordLinkText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
    showPasswordLabel: getCommonText(locale, "passwordShowAriaLabel"),
    hidePasswordLabel: getCommonText(locale, "passwordHideAriaLabel"),
  };
}

export function getLoginAdminMessages(locale) {
  const messages = getMergedMessages(locale);

  return {
    emailText: getAuthText(locale, "emailText"),
    parolaText: getAuthText(locale, "loginPasswordText"),
    autentificareText: getAuthText(locale, "loginAdminHeadingText"),
    aiContText: getAuthText(locale, "loginNoAccountText"),
    inscrieText: getAuthText(locale, "loginSignupCtaText"),
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    lang: messages.lang,
    autentificareReusita: getAuthText(locale, "loginSuccessText"),
    autentificareEsuata: getAuthText(locale, "loginErrorPrefixText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
    showPasswordLabel: getCommonText(locale, "passwordShowAriaLabel"),
    hidePasswordLabel: getCommonText(locale, "passwordHideAriaLabel"),
  };
}

export function getResetPasswordMessages(locale) {
  return {
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    emailText: getAuthText(locale, "emailText"),
    resetPasswordHeader: getAuthText(locale, "resetPasswordHeadingText"),
    sendResetText: getAuthText(locale, "resetPasswordSendText"),
    successMessage: getAuthText(locale, "resetPasswordSuccessText"),
    errorMessage: getAuthText(locale, "resetPasswordErrorText"),
    loginRedirectText: getAuthText(locale, "resetPasswordBackToLoginText"),
    contText: getCommonText(locale, "contText"),
    getNecesarText: getAuthText(locale, "genderRequiredText"),
    genText: getAuthText(locale, "genText"),
    hommeText: getAuthText(locale, "hommeText"),
    femmeText: getAuthText(locale, "femmeText"),
    selecteazaText: getAuthText(locale, "selecteazaText"),
    scopNecesarText: getAuthText(locale, "purposeRequiredText"),
    scopText: getAuthText(locale, "scopText"),
    amourText: getAuthText(locale, "amourText"),
    sexText: getAuthText(locale, "sexText"),
    amitieText: getAuthText(locale, "amitieText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
  };
}

export function getCompletePhoneMessages(locale) {
  return {
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    signUpText: getCommonText(locale, "signUpText"),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
    titleText: getAuthText(locale, "completePhoneTitleText"),
    subtitleText: getAuthText(locale, "completePhoneSubtitleText"),
    whyText: getAuthText(locale, "completePhoneWhyText"),
    phoneLabelText: getAuthText(locale, "completePhoneLabelText"),
    phonePlaceholderText: getAuthText(locale, "completePhonePlaceholderText"),
    continueText: getAuthText(locale, "continueText"),
    savingText: getAuthText(locale, "savingText"),
    saveSuccessText: getAuthText(locale, "completePhoneSaveSuccessText"),
    saveErrorText: getAuthText(locale, "completePhoneSaveErrorText"),
    phoneInvalidText: getAuthText(locale, "phoneInvalidText"),
    notAuthenticatedText: getAuthText(locale, "notAuthenticatedText"),
  };
}

export function getSignupMessages(locale) {
  return {
    termsAndConditionsText: getAuthText(locale, "signupTermsAndConditionsText"),
    mentionsLegalesText: getAuthText(locale, "signupMentionsLegalesText"),
    politiqueConfidentialiteText: getAuthText(
      locale,
      "signupPolitiqueConfidentialiteText"
    ),
    politiqueCookiesText: getAuthText(locale, "signupPolitiqueCookiesText"),
    signUpText: getCommonText(locale, "signUpText"),
    alreadyHaveAccountText: getAuthText(locale, "signupAlreadyHaveAccountText"),
    conectText: getAuthText(locale, "signupConectText"),
    registerText: getAuthText(locale, "signupRegisterText"),
    emailPlaceholder: getAuthText(locale, "signupEmailPlaceholderText"),
    emailAdresaPlaceholder: getAuthText(
      locale,
      "signupEmailAddressPlaceholderText"
    ),
    usernamePlaceholder: getAuthText(
      locale,
      "signupUsernamePlaceholderText"
    ),
    passwordPlaceholder: getAuthText(
      locale,
      "signupPasswordPlaceholderText"
    ),
    confirmPasswordPlaceholder: getAuthText(
      locale,
      "signupConfirmPasswordPlaceholderText"
    ),
    phonePlaceholder: getAuthText(locale, "signupPhonePlaceholderText"),
    aboutMePlaceholder: getAuthText(locale, "signupAddressPlaceholderText"),
    videoPlaceholder: getAuthText(locale, "signupVideoPlaceholderText"),
    pozePlaceholder: getAuthText(locale, "signupPhotosPlaceholderText"),
    tarifsText: getCommonText(locale, "tarifsText"),
    methodeText: getCommonText(locale, "methodeText"),
    lang: getLocale(locale),
    userNameRequired: getAuthText(locale, "signupUsernameRequiredText"),
    passLength: getAuthText(locale, "signupPassLengthText"),
    phoneRequired: getAuthText(locale, "signupPhoneRequiredText"),
    addressRequired: getAuthText(locale, "signupAddressRequiredText"),
    completeazaCampuri: getAuthText(locale, "signupCompleteFieldsText"),
    utilizatorInregistrat: getAuthText(
      locale,
      "signupRegistrationSuccessText"
    ),
    logInText: getCommonText(locale, "logInText"),
    contText: getCommonText(locale, "contText"),
    getNecesarText: getAuthText(locale, "genderRequiredText"),
    genText: getAuthText(locale, "genText"),
    hommeText: getAuthText(locale, "hommeText"),
    femmeText: getAuthText(locale, "femmeText"),
    selecteazaText: getAuthText(locale, "selecteazaText"),
    scopNecesarText: getAuthText(locale, "purposeRequiredText"),
    scopText: getAuthText(locale, "scopText"),
    amourText: getAuthText(locale, "amourText"),
    sexText: getAuthText(locale, "sexText"),
    amitieText: getAuthText(locale, "amitieText"),
    phoneInvalidText: getAuthText(locale, "phoneInvalidText"),
    emailRequiredText: getAuthText(locale, "signupEmailRequiredText"),
    passwordMinLengthText: getAuthText(
      locale,
      "signupPasswordMinLengthText"
    ),
    loadingText: getAuthText(locale, "signupLoadingText"),
    termsAndConditions: buildTermsAndConditions(locale),
    showPasswordLabel: getCommonText(locale, "passwordShowAriaLabel"),
    hidePasswordLabel: getCommonText(locale, "passwordHideAriaLabel"),
  };
}
