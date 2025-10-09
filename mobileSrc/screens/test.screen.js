import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import COLORS from "../theme/colors";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.secondContainer}>
        <ScrollView horizontal>
          {new Array(24).fill(1).map((i, index) => (
            <View style={styles.box}>
              <Text>Box {index}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.secondContainer}>
        <ScrollView horizontal>
          {new Array(24).fill(1).map((i, index) => (
            <View style={styles.box}>
              <Text>Box {index}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  secondContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
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
});

export default App;
