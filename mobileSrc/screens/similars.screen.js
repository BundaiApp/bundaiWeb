import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { provideKanjiObject } from "../util/jlptArray.js";
import COLORS from "../theme/colors";

export default function SimilarScreen({ navigation: { navigate } }) {
  const [search, setSearch] = useState("");
  const SIMILAR_DATA = useMemo(() => provideKanjiObject(), []);
  const [filteredData, setFilteredData] = useState(Object.keys(SIMILAR_DATA));

  const searchKanji = (query) => {
    if (!query) return Object.keys(SIMILAR_DATA);

    return Object.entries(SIMILAR_DATA).filter(([kanji, data]) => {
      const lowerQuery = query.toLowerCase();

      // Check kanji
      if (kanji.includes(query)) return true;

      // Check meaning (now a string)
      if (data.meaning && data.meaning.toLowerCase().includes(lowerQuery)) return true;

      // Check on readings
      if (data.furigana && data.furigana.includes(query)) return true;

      return false;
    }).map(([kanji]) => kanji);
  };

  const handleSearch = (text) => {
    setSearch(text);
    const results = searchKanji(text);
    setFilteredData(results);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search here..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item}
            style={styles.block}
            onPress={() => {
              const kanjiData = SIMILAR_DATA[item];

              navigate("SimilarDetail", {
                kanji: item,
                meaning: kanjiData.meaning,
                furigana: kanjiData.furigana,
                kanjiArray: kanjiData.related_kanji,
                usedIn: kanjiData.usedIn,
              });
            }}
          >
            <Text style={styles.kanjiText}>{item}</Text>
          </TouchableOpacity>
        )}
        numColumns={5}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

// ... styles remain unchanged

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
  searchBar: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
    borderColor: COLORS.brandPrimary,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    borderRadius: 12,
  },
});
