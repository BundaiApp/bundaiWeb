import React from "react";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../theme/colors";

export function ExamScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Exam</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.textPrimary,
  },
});
