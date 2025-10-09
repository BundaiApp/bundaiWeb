import { StyleSheet, Text } from "react-native";
import { VerticalSpacer } from "../components/spacers";
import COLORS from "../theme/colors";

export const TextBlock = ({ tx1, tx2 }) => {
  return (
    <>
      <Text style={styles.h1}>{tx1}</Text>
      <VerticalSpacer height={2} />
      <Text style={styles.h4}>{tx2}</Text>
      <VerticalSpacer height={2} />
    </>
  );
};

export const HeroTextBlock = ({ tx2, tx3, tx2Color, tx3Color }) => {
  return (
    <>
      <Text style={[styles.bottomHeaderLineTwo, { color: tx2Color }]}>{tx2}</Text>
      <Text style={[styles.bottomHeaderLineThree, { color: tx3Color }]}>{tx3}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start",
    fontFamily: "menlo",
    color: COLORS.textPrimary,
  },
  h4: {
    fontWeight: "300",
    fontSize: 15,
    fontFamily: "menlo",
    color: COLORS.textSecondary,
  },
  // hero text block
  bottomHeaderLineTwo: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  bottomHeaderLineThree: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
