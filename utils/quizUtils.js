export const prepareResponses = (allQuestionSets, userAnswers) => {
  const result = {};
  console.log("Debug: Start preparing responses");
  console.log("All Question Sets:", allQuestionSets);
  console.log("User Answers:", userAnswers);

  allQuestionSets.forEach((set, setIndex) => {
    if (!set || !set.questions) {
      console.error(
        `Error: Missing or invalid questions in set at index ${setIndex}`,
        set
      );
      return;
    }

    result[set.name] = set.questions.map((question, questionIndex) => {
      if (!question) {
        console.error(
          `Error: Undefined question at index ${questionIndex} in set ${set.name}`
        );
        return null; // Sau poate decide să arunci o eroare
      }

      console.log(
        `Mapping question ${question.id} in set ${set.name}:`,
        question
      );

      return {
        ...question,
        answer: userAnswers?.[set.name]?.[question.id] || null, // Adaugă răspunsul dacă există
      };
    });
  });

  console.log("Debug: Finished preparing responses", result);
  return result;
};
