import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { toHiragana } from "wanakana";

// utils
import { FONTS } from "../components/fonts";
import COLORS from "../theme/colors";

export const QuizEngine = ({ navigation, route }) => {
  // route params
  const { questionsArray, quizType, isWritten } = route.params;
  // state
  const [number, setNumber] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [kana, setKana] = useState(null);
  const [textAnswer, setIsTextAnswer] = useState("static");

  const textIn = useRef(null);

  const stateColors = {
    right: COLORS.accentSuccess,
    wrong: COLORS.accentDanger,
    static: COLORS.brandSecondary,
  };

  const returnColor = () => stateColors[textAnswer] ?? COLORS.brandSecondary;

  const moveToNextQuestion = (answer) => {
    setSelectedAns(answer);
    setTimeout(() => {
      if (number !== questionsArray.length - 1) {
        setNumber(number + 1);
        setSelectedAns(null);
      } else {
        navigation.popToTop();
      }
    }, 500);
  };

  const writeToNextQuestion = () => {
    setTimeout(() => {
      if (number !== questionsArray.length - 1) {
        setNumber(number + 1);
        setKana(null);
        setIsTextAnswer("static");
      } else {
        navigation.popToTop();
      }
    }, 500);
  };

  // Helper function to check answers
  const checkAnswer = () => {
    const currentQuestion = questionsArray[number];
    
    if (quizType === "part") {
      console.log("in on");
      console.log(currentQuestion);
      if (currentQuestion?.on && currentQuestion.on.includes(kana)) {
        setIsTextAnswer("right");
      } else {
        setIsTextAnswer("wrong");
      }
    }

    if (quizType === "full") {
      console.log("in kun");
      console.log(currentQuestion);
      if (currentQuestion?.kun && currentQuestion.kun.includes(kana)) {
        setIsTextAnswer("right");
      } else {
        setIsTextAnswer("wrong");
      }
    }

    if (quizType === "meaning") {
      if (
        currentQuestion?.meanings && 
        kana &&
        currentQuestion.meanings.includes(
          kana[0].toUpperCase() + kana.substring(1)
        )
      ) {
        setIsTextAnswer("right");
      } else {
        setIsTextAnswer("wrong");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barHolder} />

      <View style={styles.topSection}>
        <Text style={styles.kanjiText}>{questionsArray[number]?.kanjiName}</Text>
      </View>

      <View style={styles.bottomSection}>
        {isWritten
          ? (
            <>
              <TextInput
                style={styles.textInput}
                value={kana}
                placeholder={"write your answer here"}
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize={"none"}
                blurOnSubmit={false}
                autoFocus={true}
                ref={textIn}
                onChangeText={(text) => {
                  if (quizType === "part" || quizType === "full") {
                    let ans = toHiragana(text);
                    setKana(ans);
                  } else {
                    setKana(text);
                  }
                }}
                onSubmitEditing={(event) => {
                  checkAnswer();
                  writeToNextQuestion();
                  setTimeout(() => {
                    textIn.current?.focus();
                  }, 1);
                }}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: returnColor(),
                  },
                ]}
                onPress={() => {
                  checkAnswer();
                  writeToNextQuestion();
                }}
              >
                <Text style={styles.buttonText}>answer</Text>
              </TouchableOpacity>
            </>
          )
          : quizType === "meaning"
          ? (
            questionsArray[number]?.quizAnswers?.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  {
                    backgroundColor: selectedAns
                      ? selectedAns === answer
                        ? questionsArray[number]?.meanings?.includes(answer)
                          ? COLORS.accentSuccess
                          : COLORS.accentDanger
                        : COLORS.surface
                      : COLORS.surface,
                  },
                ]}
                onPress={() => moveToNextQuestion(answer)}
              >
                <Text style={styles.optionText}>{answer}</Text>
              </TouchableOpacity>
            )) || []
          )
          : quizType === "part"
          ? (
            questionsArray[number]?.quizAnswersOn?.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  {
                    backgroundColor: selectedAns
                      ? selectedAns === answer
                        ? questionsArray[number]?.on?.includes(answer)
                          ? COLORS.accentSuccess
                          : COLORS.accentDanger
                        : COLORS.surface
                      : COLORS.surface,
                  },
                ]}
                onPress={() => moveToNextQuestion(answer)}
              >
                <Text style={styles.optionText}>{answer}</Text>
              </TouchableOpacity>
            )) || []
          )
          : (
            questionsArray[number]?.quizAnswersKun?.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  {
                    backgroundColor: selectedAns
                      ? selectedAns === answer
                        ? questionsArray[number]?.kun?.includes(answer)
                          ? COLORS.accentSuccess
                          : COLORS.accentDanger
                        : COLORS.surface
                      : COLORS.surface,
                  },
                ]}
                onPress={() => moveToNextQuestion(answer)}
              >
                <Text style={styles.optionText}>{answer}</Text>
              </TouchableOpacity>
            )) || []
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: "15%",
  },
  barHolder: {
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
  },
  // 3 sections
  topSection: {
    flex: 3 / 2,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  bottomSection: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },
  buttonContainer: {
    flex: 1 / 5,
    width: "100%",
    paddingHorizontal: "5%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },

  kanjiText: {
    fontSize: 100,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  option: {
    width: "45%", // Approximate for two columns, adjust as needed
    height: "40%", // Two rows
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    margin: 2,
    borderRadius: 10,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  optionText: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  quizButton: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: COLORS.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "80%",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.outline,
    color: COLORS.textPrimary,
    ...FONTS.regular14,
    paddingBottom: "1%",
    height: "15%",
  },
  button: {
    marginTop: "10%",
    height: "20%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.brandSecondary,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    ...FONTS.bold21,
    color: COLORS.textPrimary,
  },
});
