import React from "react";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../theme/colors";

const Game = () => {
  return (
    <View style={styles.container}>
      <View style={styles.secondContainer}>
        <Text style={styles.text}>Game</Text>
      </View>
      <View style={styles.secondContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  secondContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    width: "100%",
  },
  box: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  text: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});

export default Game;
