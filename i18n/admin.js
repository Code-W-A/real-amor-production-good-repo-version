import { getMessages } from "@/i18n";
import { normalizeRouteLocale } from "@/utils/routeLocale";

function getLocale(locale) {
  return normalizeRouteLocale(locale, "fr");
}

function getBaseMessages(locale) {
  const common = getMessages(locale, "common");
  const commerce = getMessages(locale, "commerce");
  const dashboard = getMessages(locale, "dashboard");
  const admin = getMessages(locale, "admin");

  return {
    ...common,
    ...commerce,
    ...dashboard,
    ...admin,
    lang: getLocale(locale),
  };
}

export function getAdminDashboardMessages(locale) {
  const base = getBaseMessages(locale);

  return {
    ...base,
    title: base.listaUtilizatoriText,
    description: base.listaUtilizatoriText,
  };
}

export function getUserListMessages(locale) {
  const base = getBaseMessages(locale);

  return {
    ...base,
    title: base.listaUtilizatoriText,
    description: base.listaUtilizatoriText,
    searchText: base.searchByUsernameText,
    userText: base.userNameTableText,
    emailText: base.emailTableText,
    actiuniText: base.actionsText,
    registrationDateText: base.registrationDateText,
    contActivText: base.accountStatusHeaderText,
    contActivText1: base.accountActiveText,
    contActivText2: base.accountInactiveText,
    veziDetaliiText: base.viewDetailsText,
    genText: base.genderTableText,
    scopText: base.purposeTableText,
  };
}

export function getDeletedUsersMessages(locale) {
  const base = getBaseMessages(locale);

  return {
    ...base,
    title: base.deletedUsersTitle,
    description: base.deletedUsersTitle,
    searchText: base.searchByUsernameText,
    userText: base.userNameTableText,
    emailText: base.emailTableText,
    actiuniText: base.actionsText,
    veziDetaliiText: base.viewDetailsText,
    genText: base.genderTableText,
  };
}

export function getUserDetailsMessages(locale) {
  const base = getBaseMessages(locale);

  return {
    ...base,
    title: base.listaUtilizatoriText,
    description: base.listaUtilizatoriText,
    genText: base.genderFieldText,
  };
}

export function getUserCompatibilityMessages(locale) {
  return getUserDetailsMessages(locale);
}

export function getAdminPromotionsMessages(locale) {
  const base = getBaseMessages(locale);

  return {
    ...base,
    title: base.promoTitle,
    description: base.promoTitle,
  };
}
