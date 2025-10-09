import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// utils
import { FONTS } from "../components/fonts";
import COLORS from "../theme/colors";
// mutation
import CALCULATE_NEXT_REVIEW_DATE from "../mutations/calculateNextReviewDate.mutation";
// utils
import AuthContext from "../contexts/authContext";

export const SRS_Engine = ({ navigation, route }) => {
  // route params
  const { questionsArray } = route.params;
  // state
  const [number, setNumber] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  // context
  const { auth } = useContext(AuthContext);
  // mutation
  const [calculateNextReviewDate] = useMutation(CALCULATE_NEXT_REVIEW_DATE);

  const moveToNextQuestion = async (answer) => {
    setSelectedAns(answer, questionsArray[number].meanings);
    let rating = questionsArray[number].rating;
    // mutation to change kanjis next review date
    let x = await calculateNextReviewDate({
      variables: {
        userId: auth.userId,
        kanjiName: questionsArray[number].kanjiName,
        rating: questionsArray[number].meanings.includes(answer) ? rating++ : rating--,
      },
    });
    setTimeout(() => {
      if (number !== questionsArray.length - 1) {
        setNumber(number + 1);
        setSelectedAns(null);
      } else {
        navigation.popToTop();
      }
    }, 500); // Adjust the delay as needed
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.kanjiText}>{questionsArray[number].kanjiName}</Text>
      </View>

      <View style={styles.bottomSection}>
        {questionsArray[number].quizAnswers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              {
                backgroundColor: selectedAns
                  ? selectedAns === answer
                    ? questionsArray[number].meanings.includes(answer)
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
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  kanjiText: {
    fontSize: 80,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  kanjiTextBig: {
    fontSize: 200,
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
  buttonText: {
    ...FONTS.bold18,
    marginVertical: 15,
    color: COLORS.textPrimary,
  },
  quizButton: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: COLORS.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
});
