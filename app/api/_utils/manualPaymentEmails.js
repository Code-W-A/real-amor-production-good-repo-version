import {
  MANUAL_BANK_BENEFICIARY,
  MANUAL_BANK_IBAN,
  MANUAL_BANK_CURRENCY,
} from "./manualPayments.js";

function getDisplayName(user) {
  return String(user?.username || user?.email || "Client").trim();
}

function buildTechnicalFooter({ name, amount, referenceCode }) {
  return (
    `---\n` +
    `Reference code: ${referenceCode}\n` +
    `Amount: ${amount} ${MANUAL_BANK_CURRENCY}\n` +
    `Beneficiary: ${MANUAL_BANK_BENEFICIARY}\n` +
    `IBAN: ${MANUAL_BANK_IBAN}\n` +
    `Client: ${name}`
  );
}

function buildReservationRequestBody() {
  return (
    `Chère Cliente/Cher Client,\n\n` +
    `Nous vous remercions de votre confiance !\n` +
    `Le Rendez-vous de validation a un prix de 159,00€. Nous vous invitons à procéder à ce paiement par virement bancaire à\n` +
    `RealAmor SRL\n` +
    `Rue Charles Martel 8, 1000 Bruxelles, Belgique\n` +
    `TVA1015481815\n` +
    `IBAN : BE32 0019 9397 1002\n` +
    `BIC : GEBABEBB\n` +
    `Communication : nom/prénom/adresse/mail\n` +
    `Une fois le paiement reçu, vous pourrez accéder à notre agenda RealAmor pour la prise du Rendez-vous, en vous connectant à votre compte !\n` +
    `RealAmor vous donne la bienvenue dans sa communauté !\n\n` +
    `Notre équipe vous contactera sous peu pour la suite de notre suivi !\n\n` +
    `À bientôt,\n` +
    `Équipe RealAmor\n\n` +
    `-----------------------------------------\n\n` +
    `Beste klant,\n\n` +
    `Hartelijk dank voor uw vertrouwen!\n` +
    `De kosten voor de validatieafspraak bedragen € 159,00. U kunt dit bedrag overmaken via bankoverschrijving naar:\n` +
    `RealAmor SRL\n` +
    `Rue Charles Martel 8, 1000 Brussel, België\n` +
    `BTW-nummer: 1015481815\n` +
    `IBAN: BE32 0019 9397 1002\n` +
    `BIC: GEBABEBB\n` +
    `Referentie: naam/achternaam/adres/e-mail\n` +
    `Zodra de betaling is ontvangen, kunt u via uw account inloggen op de RealAmor-agenda om uw afspraak te boeken.\n` +
    `RealAmor heet u van harte welkom in haar community!\n\n` +
    `Ons team neemt binnenkort contact met u op voor de volgende stappen!\n\n` +
    `Tot snel,\n` +
    `RealAmor-team\n\n` +
    `-----------------------------------------\n\n` +
    `Dear Client,\n\n` +
    `Thank you for your trust!\n` +
    `The validation appointment costs €159.00. Please make this payment by bank transfer to:\n` +
    `RealAmor SRL\n` +
    `Rue Charles Martel 8, 1000 Brussels, Belgium\n` +
    `VAT No. 1015481815\n` +
    `IBAN: BE32 0019 9397 1002\n` +
    `BIC: GEBABEBB\n` +
    `Reference: name/surname/address/email\n` +
    `Once payment is received, you will be able to access our RealAmor calendar to book your appointment by logging into your account!\n` +
    `RealAmor welcomes you to its community!\n\n` +
    `Our team will contact you shortly with the next steps.\n\n` +
    `See you soon,\n` +
    `RealAmor Team\n\n`
  );
}

function buildSubscriptionRequestBody({ amount, referenceCode }) {
  return (
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
    `RealAmor Team\n\n`
  );
}

export function buildManualPaymentRequestEmail({
  user,
  amountEur,
  referenceCode,
  paymentType,
}) {
  const name = getDisplayName(user);
  const amount = Number(amountEur || 0).toFixed(2);
  const isReservation = String(paymentType || "").trim().toLowerCase() === "reservation";

  const body = isReservation
    ? buildReservationRequestBody()
    : buildSubscriptionRequestBody({ amount, referenceCode });

  const text = body + buildTechnicalFooter({ name, amount, referenceCode });

  return {
    subject: `RealAmor - Instructions de paiement - ${referenceCode}`,
    text,
  };
}

export function buildValidationPaymentConfirmedEmail() {
  const text =
    `Madame, Monsieur,\n\n` +
    `Nous vous remercions pour le règlement de votre rendez-vous de validation auprès de notre agence RealAmor.\n\n` +
    `Votre paiement a bien été pris en compte. Cette étape est essentielle afin de mieux comprendre vos attentes et de vous proposer un accompagnement personnalisé, en parfaite adéquation avec votre projet.\n\n` +
    `Nous nous réjouissons de vous rencontrer prochainement et de vous accompagner dans cette démarche.\n\n` +
    `Restant à votre disposition pour toute question d'ici là,\n\n` +
    `Bien cordialement,\n` +
    `L'équipe RealAmor\n` +
    `www.real-amor.com\n\n` +
    `-----------------------------------------\n\n` +
    `Geachte mevrouw, geachte heer,\n\n` +
    `Wij danken u voor de betaling van uw validatieafspraak bij ons agentschap RealAmor.\n\n` +
    `Uw betaling is goed ontvangen. Deze stap is essentieel om uw verwachtingen beter te begrijpen en u een persoonlijke begeleiding aan te bieden die perfect aansluit bij uw project.\n\n` +
    `Wij kijken ernaar uit u binnenkort te ontmoeten en u in deze stap te begeleiden.\n\n` +
    `Wij blijven tot dan ter beschikking voor al uw vragen,\n\n` +
    `Met vriendelijke groet,\n` +
    `Het RealAmor-team\n` +
    `www.real-amor.com\n\n` +
    `-----------------------------------------\n\n` +
    `Dear Madam, Dear Sir,\n\n` +
    `We thank you for paying for your validation appointment with our RealAmor agency.\n\n` +
    `Your payment has been received. This step is essential to better understand your expectations and offer you personalised support that perfectly matches your project.\n\n` +
    `We look forward to meeting you soon and accompanying you in this process.\n\n` +
    `We remain at your disposal for any questions until then,\n\n` +
    `Kind regards,\n` +
    `The RealAmor Team\n` +
    `www.real-amor.com`;

  return {
    subject: "Confirmation et remerciement – Rendez-vous de validation",
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
