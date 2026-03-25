/**
 * Strict extraction and mutual matching for quiz gender + "Cherchez-vous" (romantic gate).
 * Avoids the broad /etes-vous/i regex which matched "Etes-vous satisfait…", "Etes-vous :", etc.
 */

const QUIZ_SETS = ["questionsSet1", "questionsSet2", "questionsSet3"];

/** Demographic gender line in quiz source (not "Etes-vous :" homeowner question). */
const GENDER_QUESTION_RE = /^etes-vous:\s*$/i;

/** Only two "Cherchez-vous:" blocks exist in data/quiz.js (set1 + set2). */
const SEEKING_QUESTION_RE = /^cherchez-vous:\s*$/i;

function answerIsPresent(answer) {
  if (answer == null) return false;
  if (typeof answer === "string" && answer.trim() === "") return false;
  if (Array.isArray(answer) && answer.length === 0) return false;
  return true;
}

/**
 * Flatten quiz answer values to trimmed strings (arrays → each element; objects → shallow values).
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeGenderSeekingValue(value) {
  if (value == null) return [];
  if (typeof value === "string") {
    const t = value.trim();
    return t ? [t] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v) => normalizeGenderSeekingValue(v));
  }
  if (typeof value === "object") {
    return Object.values(value).flatMap((v) => normalizeGenderSeekingValue(v));
  }
  const s = String(value).trim();
  return s ? [s] : [];
}

/**
 * @param {Record<string, unknown>|null|undefined} responses
 * @returns {{ myGender: unknown, mySeeking: unknown, setName: string | null }}
 */
export function extractGenderSeekingFromResponses(responses) {
  if (!responses || typeof responses !== "object") {
    return { myGender: null, mySeeking: null, setName: null };
  }
  for (const setName of QUIZ_SETS) {
    const arr = responses[setName];
    if (!Array.isArray(arr) || arr.length === 0) continue;

    const genderQ = arr.find((q) =>
      GENDER_QUESTION_RE.test(String(q?.text || "").trim())
    );
    const seekingQ = arr.find((q) =>
      SEEKING_QUESTION_RE.test(String(q?.text || "").trim())
    );

    const myGender = genderQ?.answer ?? null;
    const mySeeking = seekingQ?.answer ?? null;

    if (answerIsPresent(myGender) && answerIsPresent(mySeeking)) {
      return { myGender, mySeeking, setName };
    }
  }
  return { myGender: null, mySeeking: null, setName: null };
}

/** @param {string} profileGender Firestore Users.gender */
export function profileGenderToQuizLabel(profileGender) {
  if (!profileGender || typeof profileGender !== "string") return null;
  const g = profileGender.trim().toLowerCase();
  if (g === "male") return "Homme";
  if (g === "female") return "Femme";
  return null;
}

/**
 * Merge quiz gender with optional profile fallback (Homme/Femme only).
 * @param {Record<string, unknown>|null|undefined} responses
 * @param {string|null|undefined} profileGender
 */
export function extractGenderSeekingWithProfileFallback(responses, profileGender) {
  const base = extractGenderSeekingFromResponses(responses);
  let myGender = base.myGender;
  if (!answerIsPresent(myGender)) {
    const fromProfile = profileGenderToQuizLabel(profileGender);
    if (fromProfile) {
      myGender = fromProfile;
    }
  }
  const ok =
    answerIsPresent(myGender) && answerIsPresent(base.mySeeking);
  return {
    myGender,
    mySeeking: base.mySeeking,
    setName: base.setName,
    complete: ok,
  };
}

const BISEXUEL_SEEKING_LABEL = "bisexuel/le";

function normKey(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Map a single quiz "Etes-vous" answer to one compatibility token.
 * @returns {string|null}
 */
export function genderAnswerToToken(raw) {
  const parts = normalizeGenderSeekingValue(raw);
  const s = parts[0];
  if (!s) return null;
  const k = normKey(s);

  if (k === "homme" || k === "male" || k === "man") return "homme";
  if (k === "femme" || k === "female" || k === "woman" || k === "vrouw") {
    return "femme";
  }
  if (k.includes("non-binaire") || k.includes("non binaire")) return "non_binaire";
  if (k.includes("couple libertin")) return "couple_libertin";
  if (k.includes("couple libre")) return "couple_libre";

  return null;
}

/**
 * What gender/identity tokens does this "Cherchez-vous" selection accept?
 * @param {unknown} rawSeeking
 * @returns {Set<string>}
 */
export function seekingAnswerToAcceptedTokens(rawSeeking) {
  const labels = normalizeGenderSeekingValue(rawSeeking);
  const accepted = new Set();

  for (const label of labels) {
    const k = normKey(label);

    if (k === BISEXUEL_SEEKING_LABEL || k === "bisexuelle" || k === "biseksueel") {
      accepted.add("homme");
      accepted.add("femme");
      continue;
    }
    if (k === "homme" || k === "male" || k === "man") {
      accepted.add("homme");
      continue;
    }
    if (k === "femme" || k === "female" || k === "woman" || k === "vrouw") {
      accepted.add("femme");
      continue;
    }
    if (k.includes("couple libertin")) {
      accepted.add("couple_libertin");
      continue;
    }
    if (k.includes("couple libre")) {
      accepted.add("couple_libre");
      continue;
    }
  }

  return accepted;
}

/**
 * Mutual romantic gate: A's seeking must accept B's gender token and vice versa.
 */
export function areRomanticGenderSeekingCompatible(
  aGender,
  aSeeking,
  bGender,
  bSeeking
) {
  const ta = genderAnswerToToken(aGender);
  const tb = genderAnswerToToken(bGender);
  if (!ta || !tb) return false;

  const aAccepts = seekingAnswerToAcceptedTokens(aSeeking);
  const bAccepts = seekingAnswerToAcceptedTokens(bSeeking);
  if (aAccepts.size === 0 || bAccepts.size === 0) return false;

  return aAccepts.has(tb) && bAccepts.has(ta);
}

/**
 * For skipping per-question score diffs on demographic lines (strict match only).
 */
export function isDemographicGenderOrSeekingQuestionText(text) {
  const t = String(text || "").trim();
  return GENDER_QUESTION_RE.test(t) || SEEKING_QUESTION_RE.test(t);
}
