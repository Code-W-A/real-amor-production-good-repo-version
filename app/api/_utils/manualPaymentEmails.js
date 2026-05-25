import {
  MANUAL_BANK_BENEFICIARY,
  MANUAL_BANK_IBAN,
  MANUAL_BANK_CURRENCY,
} from "./manualPayments.js";

function getDisplayName(user) {
  return String(user?.username || user?.email || "Client").trim();
}

export function buildManualPaymentRequestEmail({ user, amountEur, referenceCode }) {
  const name = getDisplayName(user);
  const amount = Number(amountEur || 0).toFixed(2);

  const text =
    `Chère Cliente/Cher Client,\n\n` +
    `Nous vous remercions de votre confiance !\n` +
    `Afin de continuer votre histoire avec RealAmor, nous vous invitons à payer le montant de ${amount} € sur le compte de ${MANUAL_BANK_BENEFICIARY}, ${MANUAL_BANK_IBAN}, avec mention de votre nom/prénom et du code de référence ${referenceCode} dans la communication.\n\n` +
    `RealAmor vous donne la bienvenue dans sa communauté !\n\n` +
    `Notre équipe vous contactera sous peu pour la suite de notre suivi !\n\n` +
    `À bientôt,\n` +
    `Équipe RealAmor\n\n` +
    `-----------------------------------------\n\n` +
    `Beste klant,\n\n` +
    `Hartelijk dank voor uw vertrouwen!\n` +
    `Om uw traject met RealAmor voort te zetten, vragen wij u het bedrag van ${amount} € over te maken op de rekening van ${MANUAL_BANK_BENEFICIARY}, ${MANUAL_BANK_IBAN}, met vermelding van uw voornaam/achternaam en de referentiecode ${referenceCode} in de mededeling.\n\n` +
    `RealAmor heet u van harte welkom in haar community!\n\n` +
    `Ons team neemt binnenkort contact met u op voor de volgende stappen!\n\n` +
    `Tot snel,\n` +
    `RealAmor-team\n\n` +
    `-----------------------------------------\n\n` +
    `Dear Client,\n\n` +
    `Thank you for your trust!\n` +
    `To continue your journey with RealAmor, please transfer ${amount} € to ${MANUAL_BANK_BENEFICIARY}, ${MANUAL_BANK_IBAN}, and include your full name and reference code ${referenceCode} in the payment communication.\n\n` +
    `RealAmor welcomes you to its community!\n\n` +
    `Our team will contact you shortly with the next steps.\n\n` +
    `See you soon,\n` +
    `RealAmor Team\n\n` +
    `---\n` +
    `Reference code: ${referenceCode}\n` +
    `Amount: ${amount} ${MANUAL_BANK_CURRENCY}\n` +
    `Beneficiary: ${MANUAL_BANK_BENEFICIARY}\n` +
    `IBAN: ${MANUAL_BANK_IBAN}\n` +
    `Client: ${name}`;

  return {
    subject: `RealAmor - Instructions de paiement - ${referenceCode}`,
    text,
  };
}

export function buildManualPaymentConfirmedEmail({ user, amountEur, referenceCode }) {
  const name = getDisplayName(user);
  const amount = Number(amountEur || 0).toFixed(2);

  const text =
    `Bonjour ${name},\n\n` +
    `Nous confirmons la bonne réception de votre paiement (${amount} ${MANUAL_BANK_CURRENCY}).\n` +
    `Référence: ${referenceCode}\n\n` +
    `Votre accès RealAmor a été activé avec succès.\n\n` +
    `Cordialement,\n` +
    `L'équipe RealAmor\n\n` +
    `-----------------------------------------\n\n` +
    `Hallo ${name},\n\n` +
    `We bevestigen de ontvangst van uw betaling (${amount} ${MANUAL_BANK_CURRENCY}).\n` +
    `Referentie: ${referenceCode}\n\n` +
    `Uw RealAmor-toegang is succesvol geactiveerd.\n\n` +
    `Met vriendelijke groet,\n` +
    `Het RealAmor-team\n\n` +
    `-----------------------------------------\n\n` +
    `Hello ${name},\n\n` +
    `We confirm receipt of your payment (${amount} ${MANUAL_BANK_CURRENCY}).\n` +
    `Reference: ${referenceCode}\n\n` +
    `Your RealAmor access has been successfully activated.\n\n` +
    `Sincerely,\n` +
    `The RealAmor Team`;

  return {
    subject: `RealAmor - Paiement confirmé - ${referenceCode}`,
    text,
  };
}

export function buildManualPaymentRejectedEmail({ user, referenceCode }) {
  const name = getDisplayName(user);

  const text =
    `Bonjour ${name},\n\n` +
    `Nous n'avons pas pu confirmer votre paiement pour la référence ${referenceCode}.\n` +
    `Merci de vérifier la communication de votre virement ou de nous contacter à info@real-amor.com.\n\n` +
    `Cordialement,\n` +
    `L'équipe RealAmor\n\n` +
    `-----------------------------------------\n\n` +
    `Hallo ${name},\n\n` +
    `We konden uw betaling met referentie ${referenceCode} niet bevestigen.\n` +
    `Controleer de betalingsmededeling of neem contact op via info@real-amor.com.\n\n` +
    `Met vriendelijke groet,\n` +
    `Het RealAmor-team\n\n` +
    `-----------------------------------------\n\n` +
    `Hello ${name},\n\n` +
    `We could not confirm your payment for reference ${referenceCode}.\n` +
    `Please check your transfer communication or contact us at info@real-amor.com.\n\n` +
    `Sincerely,\n` +
    `The RealAmor Team`;

  return {
    subject: `RealAmor - Paiement non confirmé - ${referenceCode}`,
    text,
  };
}
