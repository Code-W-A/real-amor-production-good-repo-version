/**
 * Conținutul e-mailului trimis prin SMTP (subiect + HTML/text) este în fr sau nl.
 * Pagina găzduită de Firebase la click pe link (resetare parolă în browser) folosește
 * limba din Firebase Console (Auth → setări / șabloane) și poate rămâne în engleză
 * dacă nu e localizată acolo — asta nu schimbă limba acestui e-mail.
 */
const SUPPORTED_PASSWORD_RESET_LOCALES = new Set(["fr", "nl"]);

export function normalizePasswordResetLocale(locale, fallback = null) {
  const normalizedLocale = String(locale || "")
    .trim()
    .toLowerCase()
    .split("-")[0];

  if (SUPPORTED_PASSWORD_RESET_LOCALES.has(normalizedLocale)) {
    return normalizedLocale;
  }

  return fallback;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const TEMPLATE_BUILDERS = {
  fr: ({ appName, email, link }) => {
    const rawAppName = String(appName || "");
    const rawEmail = String(email || "");
    const safeAppName = escapeHtml(appName);
    const safeEmail = escapeHtml(email);
    const safeLink = escapeHtml(link);

    return {
      subject: `Réinitialisez votre mot de passe ${appName}`,
      text:
        `Bonjour,\n\n` +
        `Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte ${rawEmail} sur ${rawAppName}.\n\n` +
        `Utilisez ce lien pour définir un nouveau mot de passe :\n${link}\n\n` +
        `Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.\n\n` +
        `L'équipe ${rawAppName}`,
      html: `
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte <strong>${safeEmail}</strong> sur <strong>${safeAppName}</strong>.</p>
        <p>
          <a href="${safeLink}" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
        <p><a href="${safeLink}">${safeLink}</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        <p>L'équipe ${safeAppName}</p>
      `,
    };
  },
  nl: ({ appName, email, link }) => {
    const rawAppName = String(appName || "");
    const rawEmail = String(email || "");
    const safeAppName = escapeHtml(appName);
    const safeEmail = escapeHtml(email);
    const safeLink = escapeHtml(link);

    return {
      subject: `Reset je wachtwoord voor ${appName}`,
      text:
        `Hallo,\n\n` +
        `We hebben een aanvraag ontvangen om het wachtwoord van je ${rawAppName}-account ${rawEmail} opnieuw in te stellen.\n\n` +
        `Gebruik deze link om een nieuw wachtwoord in te stellen:\n${link}\n\n` +
        `Heb je deze aanvraag niet gedaan, dan kun je deze e-mail negeren.\n\n` +
        `Het ${rawAppName}-team`,
      html: `
        <p>Hallo,</p>
        <p>We hebben een aanvraag ontvangen om het wachtwoord van je <strong>${safeAppName}</strong>-account <strong>${safeEmail}</strong> opnieuw in te stellen.</p>
        <p>
          <a href="${safeLink}" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;">
            Wachtwoord resetten
          </a>
        </p>
        <p>Werkt de knop niet, kopieer en plak dan deze link in je browser:</p>
        <p><a href="${safeLink}">${safeLink}</a></p>
        <p>Heb je deze aanvraag niet gedaan, dan kun je deze e-mail negeren.</p>
        <p>Het ${safeAppName}-team</p>
      `,
    };
  },
};

export function buildPasswordResetEmail({ locale, appName, email, link }) {
  const resolvedLocale = normalizePasswordResetLocale(locale, "fr");
  const builder = TEMPLATE_BUILDERS[resolvedLocale] || TEMPLATE_BUILDERS.fr;

  return builder({ appName, email, link });
}
