const REMINDER_STAGES = {
  quiz_incomplete: {
    cooldownHours: 48,
    messages: {
      fr: {
        subject: "RealAmor: complétez votre questionnaire",
        body: (username) =>
          `Bonjour ${username || ""},\n\n` +
          "Nous avons vu que votre questionnaire n'est pas encore finalisé.\n" +
          "Complétez-le pour accéder à la suite du parcours RealAmor.\n\n" +
          "Lien: https://app.real-amor.com/quiz\n\n" +
          "Cordialement,\nL'équipe RealAmor",
      },
      nl: {
        subject: "RealAmor: vul je vragenlijst aan",
        body: (username) =>
          `Hallo ${username || ""},\n\n` +
          "We hebben gezien dat je vragenlijst nog niet volledig is ingevuld.\n" +
          "Vul deze in om verder te gaan met je RealAmor-traject.\n\n" +
          "Link: https://app.real-amor.com/quiz\n\n" +
          "Met vriendelijke groet,\nHet RealAmor-team",
      },
    },
  },
  booking_not_paid: {
    cooldownHours: 48,
    messages: {
      fr: {
        subject: "RealAmor: finalisez votre réservation",
        body: (username) =>
          `Bonjour ${username || ""},\n\n` +
          "Votre questionnaire est prêt. Il vous reste à finaliser le paiement du rendez-vous.\n\n" +
          "Lien: https://app.real-amor.com/pricing\n\n" +
          "Cordialement,\nL'équipe RealAmor",
      },
      nl: {
        subject: "RealAmor: rond je reservering af",
        body: (username) =>
          `Hallo ${username || ""},\n\n` +
          "Je vragenlijst is klaar. De volgende stap is de betaling van je afspraak afronden.\n\n" +
          "Link: https://app.real-amor.com/pricing\n\n" +
          "Met vriendelijke groet,\nHet RealAmor-team",
      },
    },
  },
  booking_not_scheduled: {
    cooldownHours: 48,
    messages: {
      fr: {
        subject: "RealAmor: planifiez votre rendez-vous",
        body: (username) =>
          `Bonjour ${username || ""},\n\n` +
          "Votre paiement est bien reçu. Prochaine étape: planifier votre rendez-vous vidéo.\n\n" +
          "Lien: https://app.real-amor.com/booking\n\n" +
          "Cordialement,\nL'équipe RealAmor",
      },
      nl: {
        subject: "RealAmor: plan je afspraak in",
        body: (username) =>
          `Hallo ${username || ""},\n\n` +
          "We hebben je betaling goed ontvangen. De volgende stap is je videogesprek plannen.\n\n" +
          "Link: https://app.real-amor.com/booking\n\n" +
          "Met vriendelijke groet,\nHet RealAmor-team",
      },
    },
  },
  no_subscription: {
    cooldownHours: 72,
    messages: {
     fr: {
  subject: "RealAmor: activez votre abonnement",
  body: (username) =>
    `Bonjour ${username || ""},\n\n` +
    "Continuez votre suivi avec RealAmor. Activez un abonnement pour entrer dans la phase de matching.\n\n" +
    "Lien : https://app.real-amor.com/subscriptions\n\n" +
    "Cordialement,\nL'équipe RealAmor",
},
      nl: {
        subject: "RealAmor: activeer je abonnement",
        body: (username) =>
          `Hallo ${username || ""},\n\n` +
          "Je traject is ver gevorderd. Activeer een abonnement om naar de matchingfase te gaan.\n\n" +
          "Link: https://app.real-amor.com/subscriptions\n\n" +
          "Met vriendelijke groet,\nHet RealAmor-team",
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

function matchesReminderStage(userData, stage) {
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

function isReminderInCooldown(userData, stage, cooldownHours) {
  const last = userData?.reminders?.[stage]?.lastSentAt || null;
  const lastMs = toMillis(last);
  if (!lastMs) return false;
  const ageMs = Date.now() - lastMs;
  return ageMs < cooldownHours * 60 * 60 * 1000;
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

async function sendReminderForUser(stage, user, opts) {
  const { admin, transporter, force = false } = opts;
  const config = REMINDER_STAGES[stage];
  if (!config) {
    return { status: "skipped", reason: "invalid_stage" };
  }

  const inCooldown = isReminderInCooldown(user.userData, stage, config.cooldownHours);
  if (inCooldown && !force) {
    return { status: "skipped", reason: "cooldown" };
  }

  const message = getReminderMessage(stage, user.userData);
  if (!message) {
    return { status: "skipped", reason: "missing_template" };
  }

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "office@real-amor.com",
    to: user.email,
    subject: message.subject,
    text: message.body(user.username),
  });

  const previousCount = Number(user.userData?.reminders?.[stage]?.count || 0);
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
      const inCooldown = isReminderInCooldown(user.userData, stage, config.cooldownHours);
      const row = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        inCooldown,
      };
      if (inCooldown && !force) {
        wouldSkip.push({ ...row, reason: "cooldown" });
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
        inCooldown: isReminderInCooldown(u.userData, stage, config.cooldownHours),
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
  matchesReminderStage,
  sendReminderForUser,
  runReminderEngine,
};
