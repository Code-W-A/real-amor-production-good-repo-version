const SUPPORTED_NOTIFICATION_KINDS = new Set([
  "reservation",
  "subscription",
  "lifetime",
]);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeKind(kind) {
  const normalized = String(kind || "").trim().toLowerCase();
  if (SUPPORTED_NOTIFICATION_KINDS.has(normalized)) {
    return normalized;
  }
  return "reservation";
}

function formatAmount(amountTotal, currency) {
  const amount = Number(amountTotal);
  if (!Number.isFinite(amount)) return "Inconnu";
  const resolvedCurrency = String(currency || "eur").toUpperCase();
  return `${(amount / 100).toFixed(2)} ${resolvedCurrency}`;
}

function formatStripeDate(unixSeconds) {
  const seconds = Number(unixSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return "Inconnue";
  return new Date(seconds * 1000).toISOString();
}

function resolveUserName(session, userData) {
  return (
    String(
      userData?.username ||
        session?.metadata?.nume ||
        session?.customer_details?.name ||
        ""
    ).trim() || "Non renseigné"
  );
}

function resolveEmail(session, userData) {
  return (
    String(
      userData?.email ||
        session?.customer_details?.email ||
        session?.customer_email ||
        ""
    ).trim() || "Non renseigné"
  );
}

function resolvePhone(session, userData) {
  return (
    String(
      userData?.phoneDisplay ||
        userData?.phone ||
        session?.metadata?.phone ||
        session?.customer_details?.phone ||
        ""
    ).trim() || "Non renseigné"
  );
}

function resolveSubName(session, userData, kind) {
  if (kind === "lifetime") {
    return (
      String(userData?.subName || session?.metadata?.subName || "").trim() ||
      "Abonnement à vie"
    );
  }

  return (
    String(userData?.subName || session?.metadata?.subName || "").trim() ||
    "Abonnement"
  );
}

function resolveBookingStatus(userData) {
  return userData?.reservation?.hasReserved === true
    ? "déjà réservé"
    : "non réservé";
}

function buildTextBody(title, fields) {
  const lines = fields.map(
    ({ label, value }) => `${label}: ${String(value || "Non renseigné")}`
  );

  return `${title}\n\n${lines.join("\n")}\n\nL'équipe RealAmor`;
}

function buildHtmlBody(title, fields) {
  const items = fields
    .map(
      ({ label, value }) =>
        `<li><strong>${escapeHtml(label)} :</strong> ${escapeHtml(
          String(value || "Non renseigné")
        )}</li>`
    )
    .join("");

  return `
    <p>${escapeHtml(title)}</p>
    <ul>${items}</ul>
    <p>L'équipe RealAmor</p>
  `;
}

export function buildPaymentNotificationEmail({ kind, session, event, userData }) {
  const resolvedKind = normalizeKind(kind);
  const userName = resolveUserName(session, userData);
  const email = resolveEmail(session, userData);
  const phone = resolvePhone(session, userData);
  const uid = String(session?.metadata?.uid || "").trim() || "Non renseigné";
  const sessionId = String(session?.id || "").trim() || "Non renseigné";
  const subscriptionId =
    typeof session?.subscription === "string"
      ? session.subscription
      : String(session?.subscription?.id || "").trim() || "Non renseigné";
  const amount = formatAmount(session?.amount_total, session?.currency);
  const stripeDate = formatStripeDate(event?.created || session?.created);
  const subName = resolveSubName(session, userData, resolvedKind);

  if (resolvedKind === "reservation") {
    const title = "Paiement réservation confirmé";
    const fields = [
      { label: "Nom", value: userName },
      { label: "Email", value: email },
      { label: "Téléphone", value: phone },
      { label: "UID", value: uid },
      { label: "Montant", value: amount },
      {
        label: "Devise",
        value: String(session?.currency || "eur").toUpperCase(),
      },
      { label: "Session Stripe", value: sessionId },
      { label: "Date Stripe", value: stripeDate },
      { label: "Statut booking Calendly", value: resolveBookingStatus(userData) },
    ];

    return {
      subject: `RealAmor - Paiement réservation confirmé - ${userName}`,
      text: buildTextBody(title, fields),
      html: buildHtmlBody(title, fields),
    };
  }

  if (resolvedKind === "lifetime") {
    const title = "Paiement abonnement à vie confirmé";
    const fields = [
      { label: "Nom", value: userName },
      { label: "Email", value: email },
      { label: "Téléphone", value: phone },
      { label: "UID", value: uid },
      { label: "Abonnement", value: subName },
      { label: "Montant", value: amount },
      {
        label: "Devise",
        value: String(session?.currency || "eur").toUpperCase(),
      },
      { label: "Session Stripe", value: sessionId },
      { label: "Subscription Stripe", value: subscriptionId },
      { label: "Date Stripe", value: stripeDate },
    ];

    return {
      subject: `RealAmor - Paiement abonnement à vie confirmé - ${userName}`,
      text: buildTextBody(title, fields),
      html: buildHtmlBody(title, fields),
    };
  }

  const title = "Paiement abonnement confirmé";
  const fields = [
    { label: "Nom", value: userName },
    { label: "Email", value: email },
    { label: "Téléphone", value: phone },
    { label: "UID", value: uid },
    { label: "Abonnement", value: subName },
    { label: "Montant", value: amount },
    {
      label: "Devise",
      value: String(session?.currency || "eur").toUpperCase(),
    },
    { label: "Session Stripe", value: sessionId },
    { label: "Subscription Stripe", value: subscriptionId },
    { label: "Date Stripe", value: stripeDate },
  ];

  return {
    subject: `RealAmor - Paiement abonnement confirmé - ${subName}`,
    text: buildTextBody(title, fields),
    html: buildHtmlBody(title, fields),
  };
}
