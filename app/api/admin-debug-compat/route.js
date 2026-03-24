import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";
import { requireAuth } from "../_utils/requireAuth";
import { getAdminUidSet } from "../_utils/adminUids";

const SKIP_ANSWER = "Je préfère ne pas répondre à la question";
const MAX_DIFFS = 200;

function normalizeAnswer(value) {
  if (value === null || typeof value === "undefined") return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value?.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return String(value);
    }
  }
  if (Array.isArray(value)) {
    const norm = value
      .map((v) => normalizeAnswer(v))
      .filter((v) => v !== null);
    return norm.sort((a, b) => String(a).localeCompare(String(b)));
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const out = {};
    for (const k of keys) out[k] = normalizeAnswer(value[k]);
    return out;
  }
  if (typeof value === "string") return value.trim();
  return value;
}

function answersEqual(a, b) {
  return JSON.stringify(normalizeAnswer(a)) === JSON.stringify(normalizeAnswer(b));
}

function getAnswerByText(responses, questionSets, regex) {
  for (const set of questionSets) {
    const question = responses?.[set]?.find((q) =>
      regex.test(String(q?.text || "").trim().toLowerCase())
    );
    if (question?.answer) return question.answer;
  }
  return null;
}

function calculateCompatibilityDetailed(currentResponses, userResponses) {
  const questionSets = [
    "firstQuestions",
    "questionsSet1",
    "questionsSet2",
    "questionsSet3",
  ];

  // Gender/search compatibility gate (same logic as UI)
  const genderRegex = /etes-vous/i;
  const searchRegex = /cherchez-vous/i;
  const currentGender = getAnswerByText(currentResponses, questionSets, genderRegex);
  const currentSearch = getAnswerByText(currentResponses, questionSets, searchRegex);
  const userGender = getAnswerByText(userResponses, questionSets, genderRegex);
  const userSearch = getAnswerByText(userResponses, questionSets, searchRegex);

  const genderCompatibility =
    currentSearch &&
    userGender &&
    String(currentSearch).includes(String(userGender)) &&
    userSearch &&
    currentGender &&
    String(userSearch).includes(String(currentGender));

  if (!genderCompatibility) {
    return {
      eligible: false,
      reason: "genderCompatibility=false",
      meta: { currentGender, currentSearch, userGender, userSearch },
      totalQuestions: 0,
      totalCompatible: 0,
      compatibilityScore: 0,
      diffs: [],
      skipped: [],
    };
  }

  const currentFirstQuestion = currentResponses?.firstQuestions?.[0];
  const userFirstQuestion = userResponses?.firstQuestions?.[0];
  if (
    !currentFirstQuestion ||
    !userFirstQuestion ||
    !answersEqual(currentFirstQuestion.answer, userFirstQuestion.answer)
  ) {
    return {
      eligible: false,
      reason: "firstQuestionMismatch",
      meta: {
        currentFirstAnswer: currentFirstQuestion?.answer ?? null,
        userFirstAnswer: userFirstQuestion?.answer ?? null,
      },
      totalQuestions: 0,
      totalCompatible: 0,
      compatibilityScore: 0,
      diffs: [],
      skipped: [],
    };
  }

  const compared = [];
  const skipped = [];

  questionSets.forEach((set) => {
    const currentSet = currentResponses?.[set] || [];
    const userSet = userResponses?.[set] || [];
    const userSetMap = new Map(userSet.map((q) => [`${set}_${q.id}`, q]));

    currentSet.forEach((currentQuestion) => {
      const matchedQuestion = userSetMap.get(`${set}_${currentQuestion.id}`);
      if (!matchedQuestion) {
        skipped.push({
          set,
          id: currentQuestion?.id ?? null,
          text: currentQuestion?.text ?? null,
          reason: "missingInOtherUser",
        });
        return;
      }

      if (!currentQuestion?.compatibility || !matchedQuestion?.compatibility) {
        skipped.push({
          set,
          id: currentQuestion?.id ?? null,
          text: currentQuestion?.text ?? null,
          reason: "compatibilityFlagOff",
        });
        return;
      }

      if (
        currentQuestion?.answer === SKIP_ANSWER ||
        matchedQuestion?.answer === SKIP_ANSWER
      ) {
        skipped.push({
          set,
          id: currentQuestion?.id ?? null,
          text: currentQuestion?.text ?? null,
          reason: "skipAnswer",
        });
        return;
      }

      const isCompatible =
        currentQuestion?.answer &&
        matchedQuestion?.answer &&
        answersEqual(currentQuestion.answer, matchedQuestion.answer);

      compared.push({
        set,
        questionId: currentQuestion?.id ?? null,
        questionText: currentQuestion?.text ?? null,
        currentUserAnswer: currentQuestion?.answer ?? null,
        comparedUserAnswer: matchedQuestion?.answer ?? null,
        isCompatible,
      });
    });
  });

  const totalQuestions = compared.length;
  const totalCompatible = compared.filter((q) => q.isCompatible).length;
  const compatibilityScore = totalQuestions
    ? Math.round((totalCompatible / totalQuestions) * 100)
    : 0;

  const diffs = compared.filter((q) => q.isCompatible === false).slice(0, MAX_DIFFS);

  return {
    eligible: true,
    reason: "ok",
    meta: { currentGender, currentSearch, userGender, userSearch },
    totalQuestions,
    totalCompatible,
    compatibilityScore,
    diffs,
    skipped,
  };
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const adminUids = getAdminUidSet();
    if (!adminUids.has(auth.uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      uidA,
      uidB,
      responsesA,
      responsesB,
      includeAnswers = false,
    } = body || {};

    const envAllowsAnswers = String(process.env.DEBUG_COMPAT || "").toLowerCase() === "true";
    const allowAnswers = !!includeAnswers && envAllowsAnswers;

    let a = responsesA || null;
    let b = responsesB || null;

    if ((!a || !b) && uidA && uidB) {
      const snapA = await adminDb.collection("Users").doc(uidA).get();
      const snapB = await adminDb.collection("Users").doc(uidB).get();
      if (!snapA.exists || !snapB.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      a = (snapA.data() || {}).responses || null;
      b = (snapB.data() || {}).responses || null;
    }

    if (!a || !b) {
      return NextResponse.json(
        { error: "Missing uidA/uidB or responsesA/responsesB" },
        { status: 400 }
      );
    }

    const result = calculateCompatibilityDetailed(a, b);

    // If answers are not allowed, redact them (keep only normalized equality / question text)
    if (!allowAnswers) {
      result.diffs = result.diffs.map((d) => ({
        set: d.set,
        questionId: d.questionId,
        questionText: d.questionText,
        isCompatible: d.isCompatible,
      }));
    }

    return NextResponse.json(
      {
        ok: true,
        allowAnswers,
        note:
          allowAnswers
            ? "Answers included (DEBUG_COMPAT=true)."
            : "Answers redacted. Set DEBUG_COMPAT=true and includeAnswers=true to include them.",
        ...result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("admin-debug-compat error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

