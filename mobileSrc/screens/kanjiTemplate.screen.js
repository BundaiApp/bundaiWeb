import React, { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { toRomaji } from "wanakana";

import Hiragana from "../util/hiragana.json";
import Katakana from "../util/katakana.json";


import { provideData, provideTopWordsData } from "../util/jlptArray";
import COLORS from "../theme/colors";


const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const ITEM_COUNTS = [20, 50, 100, 200, 300, "All"];

function TemplateKanji({ navigation: { navigate }, route }) {
  const {
    jlptLevel,
    strokes,
    grades,
    isWord,
    nouns,
    verbs,
    adjectives,
    adverbs,
    katakana,
    hiragana,
  } = route.params;

  const [arr, setArr] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("N5");
  const [itemCount, setItemCount] = useState(20);

  function navigateToDetailScreen(item, index) {
    navigate("KanjiDetail", {
      paramsData: item,
      wholeArr: arr,
      itemIndex: index,
      isWord,
      isKana: hiragana || katakana,
      title: item.kanjiName,
    });
  }

  useEffect(() => {
    loadData();
  }, [selectedLevel, itemCount]);

  const loadData = () => {
    const count = itemCount === "All" ? 1000 : itemCount; // Using a large number for 'All'
    if (jlptLevel) setArr(provideData("jlpt", jlptLevel));
    if (strokes) setArr(provideData("strokes", strokes));
    if (grades) setArr(provideData("grade", grades));
    if (verbs) setArr(provideTopWordsData("verbs", selectedLevel.toLowerCase(), count));
    if (nouns) setArr(provideTopWordsData("nouns", selectedLevel.toLowerCase(), count));
    if (adjectives) setArr(provideTopWordsData("adjectives", selectedLevel.toLowerCase(), count));
    if (adverbs) setArr(provideTopWordsData("adverbs", selectedLevel.toLowerCase(), count));
    if (hiragana) setArr(Hiragana);
    if (katakana) setArr(Katakana);
  };

  const renderJLPTFilter = () => (
    <View style={styles.filterContainer}>
      {JLPT_LEVELS.map((level) => (
        <TouchableOpacity
          key={level}
          style={[styles.filterButton, selectedLevel === level && styles.selectedFilterButton]}
          onPress={() => setSelectedLevel(level)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === level && styles.selectedFilterButtonText,
            ]}
          >
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItemCountFilter = () => (
    <View style={styles.filterContainer}>
      {ITEM_COUNTS.map((count) => (
        <TouchableOpacity
          key={count}
          style={[styles.filterButton, itemCount === count && styles.selectedFilterButton]}
          onPress={() => setItemCount(count)}
        >
          <Text
            style={[
              styles.filterButtonText,
              itemCount === count && styles.selectedFilterButtonText,
            ]}
          >
            {count}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getFontSize = (text) => {
    if (!text) {
      return 10; // Default size if text is null or undefined
    }
    if (text.length <= 5) {
      return 10;
    } else if (text.length <= 8) {
      return 8;
    } else {
      return 6; // Even smaller for very long words
    }
  };

  return (
    <View style={styles.container}>
      {(nouns || verbs || adjectives || adverbs) && (
        <>
          {renderJLPTFilter()}
          {renderItemCountFilter()}
        </>
      )}
      <FlatList
        data={arr}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.block}
            onPress={() => navigateToDetailScreen(item, index)}
          >
            <Text style={styles.kanjiText}>{isWord ? item.kanji : item.kanjiName}</Text>
            {item.meanings && <Text style={[styles.meaningText, { fontSize: getFontSize(item.meanings[0]) }]}> {item.meanings[0]} </Text>}
            {item.kun && <Text style={[styles.romajiText, { fontSize: getFontSize(toRomaji(item.kun[0])) }]}> {toRomaji(item.kun[0])} </Text>}
          </TouchableOpacity>
        )}
        numColumns={isWord ? (Platform.OS != "ios" && Platform.OS != "android" ? 3 : 2) : 5}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "2%",
    backgroundColor: COLORS.background,
    // backgroundColor: '#C4C4B0'
  },
  // background color of the content
  flatListContent: {
    backgroundColor: COLORS.background,
    // backgroundColor: '#C4C4B0'
  },
  // background color of the FlatList
  flatList: {
    backgroundColor: COLORS.background,
    // backgroundColor: '#C4C4B0',
    paddingHorizontal: "3%",
  },
  sectionHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  separator: {
    height: hp("1%"),
  },
  block: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.brandPrimary,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  kanjiText: {
    fontSize: 30,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.outline,
    marginHorizontal: 2,
    backgroundColor: COLORS.surface,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  selectedFilterButtonText: {
    color: COLORS.surface,
  },
  meaningText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  romajiText: {
    fontSize: 10,
    color: COLORS.textPrimary,
  },
});

export default TemplateKanji;
