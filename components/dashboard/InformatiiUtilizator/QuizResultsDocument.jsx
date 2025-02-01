import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  firstQuestions,
  questionsSet1,
  questionsSet2,
  questionsSet3,
} from "@/data/quiz";
import moment from "moment";

// Definește stilurile pentru PDF
const styles = StyleSheet.create({
  option: {
    fontSize: 10,
    marginLeft: 10,
    color: "#555555",
  },
  imageOption: {
    marginVertical: 5,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  page: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#003366",
  },
  section: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    color: "#003366",
  },
  question: {
    fontSize: 12,
    marginBottom: 5,
    color: "#333333",
  },
  answer: {
    fontSize: 11,
    marginBottom: 15,
    color: "#666666",
  },
});

// Funcție pentru a genera calea completă a imaginii
const getImagePath = (image) => `/assets/img/${image}`;

// Configurează limbajul pentru Moment.js
moment.locale("fr");

// Funcție pentru formatul Timestamp
const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp.seconds * 1000);
    return moment(date).format("DD MMMM YYYY");
  } catch {
    return "Data invalidă";
  }
};

// Funcție pentru intervalele de date
const formatDateRange = (range) => {
  try {
    const startDate = new Date(range.startDate.seconds * 1000);
    const endDate = new Date(range.endDate.seconds * 1000);
    return `${moment(startDate).format("DD MMMM YYYY")} - ${moment(
      endDate
    ).format("DD MMMM YYYY")}`;
  } catch {
    return "Interval invalid";
  }
};

// Funcție pentru formatarea răspunsurilor
const formatAnswer = (answer) => {
  if (!answer) return "N/A";

  if (answer.startDate && answer.endDate) {
    return formatDateRange(answer);
  }

  if (answer.seconds) {
    return formatTimestamp(answer);
  }

  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  if (typeof answer === "string") {
    return answer;
  }

  if (typeof answer === "number") {
    return answer.toString();
  }

  if (typeof answer === "object" && "min" in answer && "max" in answer) {
    return `${answer.min} - ${answer.max}`;
  }

  return "Tip de răspuns necunoscut";
};

// Componenta PDF
export const QuizResultsDocument = ({
  userData,
  noShowPersonalitateQuestions,
}) => {
  const allSections = [
    {
      sectionName: "Premières Questions",
      sectionNameAlt: "Premières Questions",
      questions: firstQuestions,
      responses: userData?.responses?.firstQuestions || [],
    },
    {
      sectionName: "Questions Ensemble 1",
      sectionNameAlt: "Amor",
      questions: questionsSet1,
      responses: userData?.responses?.questionsSet1 || [],
    },
    {
      sectionName: "Questions Ensemble 2",
      sectionNameAlt: "Sexe",
      questions: questionsSet2,
      responses: userData?.responses?.questionsSet2 || [],
    },
    {
      sectionName: "Questions Ensemble 3",
      sectionNameAlt: "Amitie",
      questions: questionsSet3,
      responses: userData?.responses?.questionsSet3 || [],
    },
  ];
  let questionId = 0;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>
          Résultats du Questionnaire pour {userData?.username || "Utilisateur"}
        </Text>

        {allSections
          .filter(({ responses }) =>
            responses.some((response) => response?.answer !== undefined)
          )
          .map(({ sectionNameAlt, questions, responses }) => (
            <View key={sectionNameAlt}>
              <Text style={styles.section}>{sectionNameAlt}</Text>

              {questions
                .filter(
                  (question) =>
                    !(
                      noShowPersonalitateQuestions &&
                      question.personalitate === true
                    )
                )
                .map((question) => {
                  const userAnswer = responses.find(
                    (response) => response.id === question.id
                  );

                  if (userAnswer?.consentFor) {
                    return null;
                  }
                  questionId += 1;

                  return (
                    <View key={question.id}>
                      <Text style={styles.question}>
                        {questionId}. {question.text}
                      </Text>

                      {question.options &&
                        question.options.map((option, index) => {
                          if (typeof option === "string") {
                            return (
                              <Text key={index} style={styles.option}>
                                - {option}
                              </Text>
                            );
                          } else if (
                            typeof option === "object" &&
                            option.image
                          ) {
                            return (
                              <View key={index} style={styles.imageOption}>
                                <Image
                                  src={getImagePath(option.image)}
                                  style={styles.image}
                                />
                              </View>
                            );
                          } else {
                            return null;
                          }
                        })}
                      {question.type === "image-selection" ? (
                        <View style={styles.imageOption}>
                          <Text style={styles.answer}>
                            Réponse de l'utilisateur :
                          </Text>
                          <Image
                            src={getImagePath(userAnswer?.answer)}
                            style={styles.image}
                          />
                        </View>
                      ) : (
                        <Text style={styles.answer}>
                          Réponse de l'utilisateur :{" "}
                          {formatAnswer(userAnswer?.answer)}
                        </Text>
                      )}
                    </View>
                  );
                })}
            </View>
          ))}
      </Page>
    </Document>
  );
};
