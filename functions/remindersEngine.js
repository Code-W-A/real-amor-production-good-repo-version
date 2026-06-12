const { getMailFrom } = require("./mailTransport");

/** Intervals between sends: first mail 24h after stageEnteredAt; then 3d, 7d, 7d… */
const MS_24H = 24 * 60 * 60 * 1000;
const MS_3D = 3 * MS_24H;
const MS_7D = 7 * MS_24H;

const REMINDER_STAGES = {
  quiz_incomplete: {
    messages: {
      fr: {
        subject: "Il ne manque plus qu'une étape pour finaliser votre profil",
        body: (firstName) =>
          `Bonjour ${firstName},\n\n` +
          "Votre aventure avec RealAmor a déjà commencé, et il ne vous reste qu'une petite étape pour la poursuivre pleinement : compléter votre questionnaire en ligne.\n\n" +
          "Ce questionnaire est bien plus qu'une formalité. Il nous permet de mieux comprendre votre univers émotionnel, vos valeurs et vos aspirations, afin de vous présenter des profils vraiment compatibles avec vous.\n\n" +
          "Je complète mon questionnaire maintenant : https://app.real-amor.com/quiz\n\n" +
          "Prenez ces quelques minutes pour vous – pour ce que vous désirez vraiment vivre. Chaque réponse que vous donnerez nous rapproche de la rencontre qui pourrait changer votre histoire.\n\n" +
          "Avec douceur et bienveillance,\n\n" +
          "L'équipe RealAmor\n\n" +
          "www.real-amor.com",
      },
      nl: {
        subject: "Er ontbreekt maar één stap om je profiel af te ronden",
        body: (firstName) =>
          `Hallo ${firstName},\n\n` +
          "Jouw avontuur met RealAmor is al begonnen; er is nog maar één kleine stap om het volledig voort te zetten: je online vragenlijst invullen.\n\n" +
          "Deze vragenlijst is meer dan een formaliteit. Zo begrijpen we beter je emotionele wereld, je waarden en je verwachtingen, zodat we je profielen kunnen voorstellen die écht bij je passen.\n\n" +
          "Ik vul mijn vragenlijst nu in: https://app.real-amor.com/quiz\n\n" +
          "Neem deze minuten voor jezelf – voor wat je echt wilt leven. Elk antwoord brengt je dichter bij de ontmoeting die je leven kan veranderen.\n\n" +
          "Met warmte en zorg,\n\n" +
          "Het RealAmor-team\n\n" +
          "www.real-amor.com",
      },
    },
  },
  booking_not_paid: {
    messages: {
      fr: {
        subject: "Il est temps de franchir une belle étape avec RealAmor",
        body: (firstName) =>
          `Bonjour ${firstName},\n\n` +
          "Vous êtes tout près de vivre une expérience unique, conçue pour vous aider à comprendre vos véritables affinités et à rencontrer l'amour d'une manière authentique.\n\n" +
          "Le Rendez-vous de validation a un prix de 159,00€. Nous vous invitons à procéder à ce paiement par virement bancaire à\n" +
          "RealAmor SRL\n" +
          "Rue Charles Martel 8, 1000 Bruxelles, Belgique\n" +
          "TVA1015481815\n" +
          "IBAN : BE32 0019 9397 1002\n" +
          "BIC : GEBABEBB\n" +
          "Communication : nom/prénom/adresse/mail\n" +
          "Une fois le paiement reçu, vous pourrez accéder à notre agenda RealAmor pour la prise du Rendez-vous, en vous connectant à votre compte !\n" +
          "Il ne vous reste plus qu'à planifier votre rendez-vous de validation avec notre Equipe Neuroscientifique. Lors de cet échange, nous prendrons le temps de décrypter votre profil émotionnel et de peaufiner votre compatibilité avec précision.\n\n" +
          "Je réserve mon rendez-vous maintenant : https://app.real-amor.com/pricing\n\n" +
          "Ce moment est une étape précieuse sur votre chemin vers une relation sincère et durable. Nous serons ravis de vous accompagner dans cette belle aventure.\n\n" +
          "À très bientôt,\n\n" +
          "L'équipe RealAmor\n\n" +
          "www.real-amor.com",
      },
      nl: {
        subject: "Het is tijd voor een mooie volgende stap met RealAmor",
        body: (firstName) =>
          `Hallo ${firstName},\n\n` +
          "Je staat op het punt een unieke ervaring te beleven, om je ware affiniteiten beter te begrijpen en liefde op een authentieke manier te ontmoeten.\n\n" +
          "De kosten voor de validatieafspraak bedragen € 159,00. U kunt dit bedrag overmaken via bankoverschrijving naar:\n" +
          "RealAmor SRL\n" +
          "Rue Charles Martel 8, 1000 Brussel, België\n" +
          "BTW-nummer: 1015481815\n" +
          "IBAN: BE32 0019 9397 1002\n" +
          "BIC: GEBABEBB\n" +
          "Referentie: naam/achternaam/adres/e-mail\n" +
          "Zodra de betaling is ontvangen, kunt u via uw account inloggen op de RealAmor-agenda om uw afspraak te boeken.\n" +
          "Je hoeft alleen nog je validatieafspraak te plannen met ons neurowetenschappelijk team. Tijdens dit gesprek nemen we de tijd om je emotionele profiel te verhelderen en je compatibiliteit zorgvuldig af te stemmen.\n\n" +
          "Ik reserveer nu mijn afspraak: https://app.real-amor.com/pricing\n\n" +
          "Dit is een waardevolle stap op weg naar een oprechte en duurzame relatie. We begeleiden je graag in dit mooie avontuur.\n\n" +
          "Tot heel binnenkort,\n\n" +
          "Het RealAmor-team\n\n" +
          "www.real-amor.com",
      },
    },
  },
  booking_not_scheduled: {
    messages: {
      fr: {
        subject: "Votre rendez-vous RealAmor vous attend !",
        body: (firstName) =>
          `Bonjour ${firstName},\n\n` +
          "Merci d'avoir fait confiance à RealAmor et d'avoir confirmé votre engagement en réglant votre rendez-vous de validation neuroscientifique. Vous venez de poser une belle action en direction d'une relation plus vraie, plus alignée avec qui vous êtes vraiment.\n\n" +
          "Il ne vous reste plus qu'une étape : réserver la date et l'heure de votre rendez-vous avec notre Equipe Neuroscientifique en visioconférence. Lors de cet échange, nous prendrons le temps d'explorer votre fonctionnement émotionnel, vos besoins profonds et vos compatibilités afin d'affiner au mieux vos futures rencontres.\n\n" +
          "Je choisis mon créneau de rendez-vous : https://app.real-amor.com/booking\n\n" +
          "Ce moment est un espace privilégié, entièrement dédié à vous, à votre histoire et à votre manière d'aimer. Nous avons hâte de vous rencontrer et de vous accompagner dans cette nouvelle étape de votre vie sentimentale.\n\n" +
          "Avec bienveillance,\n\n" +
          "L'équipe RealAmor\n\n" +
          "www.real-amor.com",
      },
      nl: {
        subject: "Je RealAmor-afspraak wacht op je!",
        body: (firstName) =>
          `Hallo ${firstName},\n\n` +
          "Bedankt voor je vertrouwen in RealAmor en dat je je validatieafspraak neuroscientifiek hebt betaald. Je zette net een mooie stap richting een relatie die eerlijker en beter bij je past.\n\n" +
          "Er is nog één stap: kies datum en uur voor je videogesprek met ons neurowetenschappelijk team. We nemen de tijd om je emotionele patronen, je diepere behoeften en je compatibiliteit te verkennen om je toekomstige matches te verfijnen.\n\n" +
          "Ik kies nu mijn tijdslot: https://app.real-amor.com/booking\n\n" +
          "Dit is een bijzonder moment, helemaal voor jou, je verhaal en je manier van liefhebben. We kijken ernaar uit je te ontmoeten en je te begeleiden in deze nieuwe fase.\n\n" +
          "Met zorg,\n\n" +
          "Het RealAmor-team\n\n" +
          "www.real-amor.com",
      },
    },
  },
  no_subscription: {
    messages: {
      fr: {
        subject: "Votre histoire commence ici !",
        body: (firstName) =>
          `Bonjour ${firstName},\n\n` +
          "Votre inscription sur RealAmor montre déjà votre envie de vivre une belle aventure, profonde et authentique. Il ne vous reste plus qu'une étape pour ouvrir la porte à des rencontres qui vous ressemblent : activer votre abonnement.\n\n" +
          "En validant votre abonnement aujourd'hui, vous rejoignez un univers où chaque profil est soigneusement accompagné, avec l'appui de notre Equipe Neuroscientifique et de notre approche émotionnelle unique.\n\n" +
          "J'active mon abonnement maintenant : https://app.real-amor.com/subscriptions\n\n" +
          "Nota Bene : tous nos abonnements sont payables uniquement en un seul paiement.\n\n" +
          "Tarifs:\n" +
          "- Abonnement 3 mois: Total de 417€ (139€/mois pendant 3 mois), renouvellement à 3 mois.\n" +
          "- Abonnement 6 mois: Total de 654€ (109€/mois pendant 6 mois), renouvellement à 6 mois.\n" +
          "- Abonnement 12 mois: Total de 1068€ (89€/mois pendant 12 mois), renouvellement à 12 mois.\n" +
          "- Abonnement à vie: Total de 1068€ (89€/mois pendant 12 mois). PROMO du moment ! Votre abonnement ne sera pas renouvelé et votre compte sera suivi à vie !\n\n" +
          "Vous pouvez trouver les tarifs et le descriptif de chaque abonnement sur la page : https://real-amor.com/#tarifs\n\n" +
          "Nous vous invitons à procéder à ce paiement par virement bancaire à\n" +
          "RealAmor SRL\n" +
          "Rue Charles Martel 8, 1000 Bruxelles, Belgique\n" +
          "TVA1015481815\n" +
          "IBAN : BE32 0019 9397 1002\n" +
          "BIC : GEBABEBB\n" +
          "Communication : nom/prénom/adresse/mail\n\n" +
          "Ne laissez pas cette belle chance en suspens. Nous serions ravis de vous aider à écrire la suite de votre histoire… avec sincérité, respect et émotion.\n\n" +
          "Avec toute notre bienveillance,\n\n" +
          "L'équipe RealAmor\n\n" +
          "www.real-amor.com",
      },
      nl: {
        subject: "Jouw verhaal begint hier!",
        body: (firstName) =>
          `Hallo ${firstName},\n\n` +
          "Je inschrijving bij RealAmor laat al zien dat je een diepe, authentieke ontmoeting wilt. Er is nog één stap om de deur te openen naar mensen die bij je passen: je abonnement activeren.\n\n" +
          "Door vandaag te abonneren, word je deel van een omgeving waar elk profiel zorgvuldig wordt begeleid, met de steun van ons neurowetenschappelijk team en onze unieke emotionele aanpak.\n\n" +
          "Ik activeer nu mijn abonnement: https://app.real-amor.com/subscriptions\n\n" +
          "Let op: al onze abonnementen dienen in één keer te worden betaald.\n\n" +
          "Prijzen:\n" +
          "- Abonnement van 3 maanden: Totaal € 417 (€ 139 per maand gedurende 3 maanden), wordt elke 3 maanden verlengd.\n" +
          "- Abonnement van 6 maanden: Totaal € 654 (€ 109 per maand gedurende 6 maanden), wordt elke 6 maanden verlengd.\n" +
          "- Abonnement van 12 maanden: Totaal € 1068 (€ 89 per maand gedurende 12 maanden), wordt elke 12 maanden verlengd.\n" +
          "- Levenslang abonnement: Totaal € 1068 (€ 89 per maand gedurende 12 maanden). Speciale aanbieding! Uw abonnement wordt niet verlengd en uw account wordt levenslang gevolgd!\n\n" +
          "De prijzen en een beschrijving van elk abonnement vindt u op de pagina: https://real-amor.com/#tarifs\n\n" +
          "Wij verzoeken u de betaling te verrichten via bankoverschrijving naar:\n" +
          "RealAmor SRL\n" +
          "Rue Charles Martel 8, 1000 Brussel, België\n" +
          "BTW-nummer: 1015481815\n" +
          "IBAN: BE32 0019 9397 1002\n" +
          "BIC: GEBABEBB\n" +
          "Referentie: naam/achternaam/adres/e-mailadres\n\n" +
          "Laat deze kans niet liggen. We helpen je graag het volgende hoofdstuk van je verhaal te schrijven… met oprechtheid, respect en emotie.\n\n" +
          "Met alle goeds,\n\n" +
          "Het RealAmor-team\n\n" +
          "www.real-amor.com",
      },
    },
  },
};

const REMINDER_LOCK_COLLECTION = "_System";
const REMINDER_LOCK_DOC = "ReminderSequenceLock";
const REMINDER_RUNS_COLLECTION = "ReminderRuns";
const REMINDER_LOCK_TTL_MINUTES = 20;
const DEFAULT_BATCH_LIMIT = 300;

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toDate === "function") {
    return value.toDate().getTime();
  }
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

/**
 * Prénom pour les salutations : champ dédié si présent, sinon premier mot du pseudo.
 * @param {Object} userData Données utilisateur Firestore
 * @return {string}
 */
function getFirstName(userData) {
  if (!userData || typeof userData !== "object") return "";
  const raw = String(userData.firstName || "").trim();
  if (raw) return raw;
  const u = String(userData.username || "").trim();
  if (!u) return "";
  return u.split(/\s+/)[0] || "";
}

function hasActiveSubscription(userData) {
  return (
    userData?.lifetimeAccess === true ||
    userData?.subscriptionStatus === "lifetime" ||
    userData?.subscriptionStatus === "active" ||
    userData?.subscriptionStatus === "canceledUntilEnd" ||
    userData?.subscriptionActive === true
  );
}

function hasCompletedQuiz(userData) {
  const responses = userData?.responses;
  if (!responses || typeof responses !== "object") return false;

  return Object.values(responses).some(
    (group) => Array.isArray(group) && group.some((item) => item?.answer !== undefined)
  );
}

function hasPaidReservation(userData) {
  const status = String(userData?.reservation?.status || "").toLowerCase();
  if (["paid", "complete", "completed", "succeeded"].includes(status)) {
    return true;
  }

  return Boolean(
    userData?.reservation?.sessionId ||
      (typeof userData?.reservation?.cost === "number" && userData.reservation.cost > 0)
  );
}

function hasScheduledReservation(userData) {
  return (
    userData?.reservation?.hasReserved === true ||
    !!userData?.reservation?.scheduledAt ||
    !!userData?.reservation?.bookedAt ||
    !!userData?.reservation?.calendlyEventUri ||
    !!userData?.reservation?.inviteeUri
  );
}

/**
 * Champ Firestore `currentlyInCouple` (admin « actuellement en couple »), pas du texte FR dans la DB.
 * @param {Object} userData Document Users
 * @return {boolean}
 */
function isUserCurrentlyInCouple(userData) {
  const v = userData?.currentlyInCouple;
  if (v === true) return true;
  // Donnée manuelle / edge case
  if (v === "true") return true;
  return false;
}

function matchesReminderStage(userData, stage) {
  if (isUserCurrentlyInCouple(userData)) {
    return false;
  }

  const quizCompleted = hasCompletedQuiz(userData);
  const bookingPaid = hasPaidReservation(userData);
  const bookingScheduled = hasScheduledReservation(userData);
  const subscribed = hasActiveSubscription(userData);

  if (stage === "quiz_incomplete") return !quizCompleted;
  if (stage === "booking_not_paid") return quizCompleted && !bookingPaid;
  if (stage === "booking_not_scheduled") return bookingPaid && !bookingScheduled;
  if (stage === "no_subscription") return bookingScheduled && !subscribed;
  return false;
}

/**
 * Résout l'ancre temporelle pour le premier envoi (24h après entrée dans l'étape).
 * @param {Object} userData Données utilisateur
 * @param {string} stage Clé d'étape reminder
 * @return {number} Timestamp en millisecondes
 */
function resolveAnchorMs(userData, stage) {
  const stageRem = userData?.reminders?.[stage] || {};
  const fromStage = toMillis(stageRem.stageEnteredAt);
  if (fromStage) return fromStage;
  return toMillis(userData?.createdAt);
}

/**
 * Éligibilité pour preview (sans écriture Firestore) : même échelle que l'envoi réel.
 * @param {Object} userData Données utilisateur
 * @param {string} stage Clé d'étape reminder
 * @return {boolean}
 */
function isReminderEligibleForPreview(userData, stage) {
  const count = Number(userData?.reminders?.[stage]?.count || 0);
  const lastSentMs = toMillis(userData?.reminders?.[stage]?.lastSentAt);
  const anchorMs = resolveAnchorMs(userData, stage);
  const now = Date.now();

  if (count === 0) {
    if (!anchorMs) return false;
    return now >= anchorMs + MS_24H;
  }
  if (count === 1) {
    if (!lastSentMs) return false;
    return now >= lastSentMs + MS_3D;
  }
  if (!lastSentMs) return false;
  return now >= lastSentMs + MS_7D;
}

function isReminderEligibleByLadder(userData, stage) {
  return isReminderEligibleForPreview(userData, stage);
}

/**
 * Assure reminders[stage].stageEnteredAt (création du compte ou serveur). Si serverTimestamp seulement, skip l'envoi ce tour.
 * @param {FirebaseFirestore.DocumentReference} userRef Référence document utilisateur
 * @param {Object} userData Données utilisateur
 * @param {string} stage Clé d'étape reminder
 * @param {Object} admin Instance firebase-admin
 * @return {!Promise<{ userData: Object, anchorJustInitializedWithServerTime: boolean }>}
 */
async function ensureStageEnteredAtIfMissing(userRef, userData, stage, admin) {
  const stageRem = userData?.reminders?.[stage] || {};
  if (stageRem.stageEnteredAt) {
    return { userData, anchorJustInitializedWithServerTime: false };
  }

  const createdAt = userData?.createdAt;
  if (createdAt) {
    await userRef.set(
      {
        reminders: {
          [stage]: {
            stageEnteredAt: createdAt,
          },
        },
      },
      { merge: true }
    );
    return {
      userData: {
        ...userData,
        reminders: {
          ...(userData.reminders || {}),
          [stage]: {
            ...stageRem,
            stageEnteredAt: createdAt,
          },
        },
      },
      anchorJustInitializedWithServerTime: false,
    };
  }

  await userRef.set(
    {
      reminders: {
        [stage]: {
          stageEnteredAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
    },
    { merge: true }
  );
  return { userData, anchorJustInitializedWithServerTime: true };
}

function getReminderLanguage(userData) {
  return String(userData?.targetLanguage || "").toLowerCase() === "nl" ? "nl" : "fr";
}

function getReminderMessage(stage, userData) {
  const config = REMINDER_STAGES[stage];
  if (!config) return null;
  const language = getReminderLanguage(userData);
  return config.messages?.[language] || config.messages?.fr || null;
}

function buildReminderEmail(stage, userData) {
  const message = getReminderMessage(stage, userData);
  if (!message) return null;
  const firstName = getFirstName(userData);
  return {
    subject: message.subject,
    text: message.body(firstName),
  };
}

const REMINDER_SAMPLE_STAGE_ORDER = [
  "quiz_incomplete",
  "booking_not_paid",
  "booking_not_scheduled",
  "no_subscription",
];

function orderedReminderSampleStages() {
  const keys = Object.keys(REMINDER_STAGES);
  const ordered = [];
  for (const s of REMINDER_SAMPLE_STAGE_ORDER) {
    if (keys.includes(s)) ordered.push(s);
  }
  for (const s of keys) {
    if (!ordered.includes(s)) ordered.push(s);
  }
  return ordered;
}

/**
 * Trimite un singur email de reminder de probă (fără Firestore).
 * @return {!Promise<Object>} Rezultat cu ok, stage, lang, messageId, subject sau error
 */
async function sendReminderSampleToInbox({
  transporter,
  to,
  username = "",
  stage,
  targetLanguage = "fr",
}) {
  if (!REMINDER_STAGES[stage]) {
    return { ok: false, error: "invalid_stage", stage };
  }
  const lang = String(targetLanguage).toLowerCase() === "nl" ? "nl" : "fr";
  const emailPayload = buildReminderEmail(stage, {
    username,
    firstName: username,
    targetLanguage: lang,
  });
  if (!emailPayload) {
    return { ok: false, error: "missing_template", stage, lang };
  }
  const info = await transporter.sendMail({
    from: getMailFrom(),
    to,
    subject: emailPayload.subject,
    text: emailPayload.text,
  });
  return {
    ok: true,
    stage,
    lang,
    subject: emailPayload.subject,
    messageId: info?.messageId || null,
  };
}

/**
 * Trimite toate tipurile de reminder de probă la un inbox (fără Firestore).
 * @param {?Array<string>} langsOverride Dacă e setat (ex. ["nl"]), ignoră allLangs
 * @return {!Promise<Object>} Rezultat cu ok, sent, errors
 */
async function sendReminderSamplesToInbox({
  transporter,
  to,
  username = "",
  allLangs = false,
  langsOverride = null,
}) {
  let langs;
  if (Array.isArray(langsOverride) && langsOverride.length) {
    langs = langsOverride.map((l) =>
      String(l).toLowerCase() === "nl" ? "nl" : "fr"
    );
  } else {
    langs = allLangs ? ["fr", "nl"] : ["fr"];
  }
  const stages = orderedReminderSampleStages();
  const sent = [];
  const errors = [];

  for (const lang of langs) {
    for (const stage of stages) {
      try {
        const result = await sendReminderSampleToInbox({
          transporter,
          to,
          username,
          stage,
          targetLanguage: lang,
        });
        if (result.ok) {
          sent.push({
            stage: result.stage,
            lang: result.lang,
            messageId: result.messageId,
          });
        } else {
          errors.push({
            stage: result.stage,
            lang: result.lang,
            reason: result.error || "unknown",
          });
        }
      } catch (err) {
        errors.push({
          stage,
          lang,
          reason: err?.message || "send_failed",
        });
      }
    }
  }

  return {
    ok: errors.length === 0,
    sent,
    errors,
  };
}

async function sendReminderForUser(stage, user, opts) {
  const { admin, transporter, force = false } = opts;
  const config = REMINDER_STAGES[stage];
  if (!config) {
    return { status: "skipped", reason: "invalid_stage" };
  }

  let workingData = user.userData;

  if (!force) {
    const ensured = await ensureStageEnteredAtIfMissing(
      user.userRef,
      workingData,
      stage,
      admin
    );
    if (ensured.anchorJustInitializedWithServerTime) {
      return { status: "skipped", reason: "anchor_initialized" };
    }
    workingData = ensured.userData;

    if (!isReminderEligibleByLadder(workingData, stage)) {
      return { status: "skipped", reason: "ladder_wait" };
    }
  }

  const emailPayload = buildReminderEmail(stage, workingData);
  if (!emailPayload) {
    return { status: "skipped", reason: "missing_template" };
  }

  const info = await transporter.sendMail({
    from: getMailFrom(),
    to: user.email,
    subject: emailPayload.subject,
    text: emailPayload.text,
  });

  const previousCount = Number(workingData?.reminders?.[stage]?.count || 0);

  await user.userRef.set(
    {
      reminders: {
        [stage]: {
          lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
          count: previousCount + 1,
          lastMessageId: info?.messageId || null,
        },
      },
    },
    { merge: true }
  );

  return { status: "sent", messageId: info?.messageId || null };
}

async function acquireReminderRunLock(db, admin, runId) {
  const lockRef = db.collection(REMINDER_LOCK_COLLECTION).doc(REMINDER_LOCK_DOC);
  const now = Date.now();
  const lockedUntil = now + REMINDER_LOCK_TTL_MINUTES * 60 * 1000;

  const acquired = await db.runTransaction(async (tx) => {
    const snap = await tx.get(lockRef);
    const data = snap.data() || {};
    const existingLockedUntil = toMillis(data.lockedUntil);
    if (existingLockedUntil > now && data.ownerRunId && data.ownerRunId !== runId) {
      return false;
    }

    tx.set(
      lockRef,
      {
        ownerRunId: runId,
        lockedAt: admin.firestore.FieldValue.serverTimestamp(),
        lockedUntil: new Date(lockedUntil),
      },
      { merge: true }
    );
    return true;
  });

  return acquired;
}

async function releaseReminderRunLock(db, admin, runId) {
  const lockRef = db.collection(REMINDER_LOCK_COLLECTION).doc(REMINDER_LOCK_DOC);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(lockRef);
    const data = snap.data() || {};
    if (data.ownerRunId !== runId) return;
    tx.set(
      lockRef,
      {
        ownerRunId: null,
        releasedAt: admin.firestore.FieldValue.serverTimestamp(),
        lockedUntil: null,
      },
      { merge: true }
    );
  });
}

function buildCandidateUsers(userDocs, stage) {
  const candidates = [];
  for (const userDoc of userDocs) {
    const userData = userDoc.data() || {};
    if (userData?.deletedAccount?.isDeleted) continue;
    if (!userData?.email) continue;
    if (!matchesReminderStage(userData, stage)) continue;
    candidates.push({
      userRef: userDoc.ref,
      uid: userDoc.id,
      email: userData.email,
      username: userData.username || "",
      userData,
    });
  }
  return candidates;
}

async function runReminderStage(stage, opts) {
  const {
    db,
    admin,
    transporter,
    action,
    force,
    limit,
  } = opts;
  const config = REMINDER_STAGES[stage];
  if (!config) {
    return {
      stage,
      totalMatched: 0,
      attempted: 0,
      totalPreviewed: 0,
      sentCount: 0,
      skippedCount: 0,
      failedCount: 0,
      sent: [],
      skipped: [],
      failed: [],
      sample: [],
      wouldSendCount: 0,
      wouldSkipCount: 0,
      wouldSend: [],
      wouldSkip: [],
    };
  }

  const usersSnapshot = await db.collection("Users").get();
  const candidates = buildCandidateUsers(usersSnapshot.docs, stage);
  const capped = candidates.slice(0, limit);

  if (action === "preview") {
    const wouldSend = [];
    const wouldSkip = [];
    for (const user of capped) {
      const eligible = force || isReminderEligibleForPreview(user.userData, stage);
      const row = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        eligible,
      };
      if (!eligible && !force) {
        wouldSkip.push({ ...row, reason: "ladder_wait_or_no_anchor" });
      } else {
        wouldSend.push(row);
      }
    }

    return {
      stage,
      totalMatched: candidates.length,
      totalPreviewed: capped.length,
      sample: capped.slice(0, 25).map((u) => ({
        uid: u.uid,
        email: u.email,
        username: u.username,
        eligible: force || isReminderEligibleForPreview(u.userData, stage),
      })),
      wouldSendCount: wouldSend.length,
      wouldSkipCount: wouldSkip.length,
      wouldSend,
      wouldSkip,
      attempted: 0,
      sentCount: 0,
      skippedCount: 0,
      failedCount: 0,
      sent: [],
      skipped: [],
      failed: [],
    };
  }

  const sent = [];
  const skipped = [];
  const failed = [];

  for (const user of capped) {
    try {
      const outcome = await sendReminderForUser(stage, user, {
        admin,
        transporter,
        force: !!force,
      });
      if (outcome.status === "sent") {
        sent.push({ uid: user.uid, email: user.email });
        continue;
      }

      skipped.push({
        uid: user.uid,
        email: user.email,
        reason: outcome.reason || "skipped",
      });
    } catch (error) {
      failed.push({
        uid: user.uid,
        email: user.email,
        error: error?.message || "send_failed",
      });
    }
  }

  return {
    stage,
    totalMatched: candidates.length,
    attempted: capped.length,
    totalPreviewed: 0,
    sentCount: sent.length,
    skippedCount: skipped.length,
    failedCount: failed.length,
    sent,
    skipped,
    failed,
    sample: [],
  };
}

function resolveStages(stage) {
  if (!stage || stage === "all") return Object.keys(REMINDER_STAGES);
  if (!REMINDER_STAGES[stage]) return null;
  return [stage];
}

async function runReminderEngine(opts) {
  const {
    db,
    admin,
    transporter,
    source = "callable",
    actorUid = null,
    stage = "all",
    action = "send",
    force = false,
    limit = DEFAULT_BATCH_LIMIT,
  } = opts;

  const stageList = resolveStages(stage);
  if (!stageList) {
    return {
      ok: false,
      error: "Invalid stage",
      allowed: Object.keys(REMINDER_STAGES),
    };
  }

  if (action !== "preview" && action !== "send") {
    return { ok: false, error: "Invalid action. Use preview or send." };
  }

  const normalizedLimit = Math.max(1, Number(limit) || DEFAULT_BATCH_LIMIT);
  const runId = `${source}-${Date.now()}`;
  const runRef = db.collection(REMINDER_RUNS_COLLECTION).doc(runId);
  const shouldLock = action === "send";

  if (shouldLock) {
    const lockAcquired = await acquireReminderRunLock(db, admin, runId);
    if (!lockAcquired) {
      await runRef.set(
        {
          runId,
          source,
          actorUid,
          action,
          stage,
          status: "skipped_locked",
          limit: normalizedLimit,
          startedAt: admin.firestore.FieldValue.serverTimestamp(),
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return {
        ok: true,
        runId,
        source,
        action,
        stage,
        status: "skipped_locked",
        stageResults: [],
      };
    }
  }

  await runRef.set(
    {
      runId,
      source,
      actorUid,
      action,
      stage,
      force: !!force,
      limit: normalizedLimit,
      status: "running",
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const stageResults = [];
  try {
    for (const stageName of stageList) {
      const stageStarted = Date.now();
      const result = await runReminderStage(stageName, {
        db,
        admin,
        transporter,
        action,
        force: !!force,
        limit: normalizedLimit,
      });
      stageResults.push({
        ...result,
        durationMs: Date.now() - stageStarted,
      });
    }

    const summary = stageResults.reduce(
      (acc, s) => {
        acc.totalMatched += Number(s.totalMatched || 0);
        acc.totalPreviewed += Number(s.totalPreviewed || 0);
        acc.attempted += Number(s.attempted || 0);
        acc.sentCount += Number(s.sentCount || 0);
        acc.skippedCount += Number(s.skippedCount || 0);
        acc.failedCount += Number(s.failedCount || 0);
        return acc;
      },
      {
        totalMatched: 0,
        totalPreviewed: 0,
        attempted: 0,
        sentCount: 0,
        skippedCount: 0,
        failedCount: 0,
      }
    );

    await runRef.set(
      {
        status: "completed",
        stageResults,
        summary,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      ok: true,
      runId,
      source,
      action,
      stage,
      force: !!force,
      limit: normalizedLimit,
      status: "completed",
      summary,
      stageResults,
    };
  } catch (error) {
    await runRef.set(
      {
        status: "failed",
        stageResults,
        error: error?.message || "unknown_error",
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    throw error;
  } finally {
    if (shouldLock) {
      await releaseReminderRunLock(db, admin, runId);
    }
  }
}

module.exports = {
  REMINDER_STAGES,
  buildReminderEmail,
  matchesReminderStage,
  sendReminderForUser,
  runReminderEngine,
  sendReminderSampleToInbox,
  sendReminderSamplesToInbox,
  orderedReminderSampleStages,
  getFirstName,
  isReminderEligibleByLadder,
};
