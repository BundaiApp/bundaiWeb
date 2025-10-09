import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import { getLevelContent } from '../util/levelSystem'
import { FONTS } from '../components/fonts'
import COLORS from '../theme/colors'

export const LevelDetails = ({ route, navigation }) => {
  const { level } = route.params
  const [levelData, setLevelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true)
        const data = await getLevelContent(level)
        setLevelData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLevelData()
  }, [level])

  if (loading) {
    return (
      <View style={styles.containerForLoading}>
        <ActivityIndicator size="large" color={COLORS.brandPrimary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.containerForLoading}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Kanji Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitleWithCount}>Kanji</Text>
            <View style={styles.sectionTitleCountContainer}>
              <Text style={styles.sectionTitleCount}>{levelData?.kanji?.length}</Text>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            {levelData?.kanji?.map((kanjiItem, index) => (
              <View key={index} style={[styles.itemBox, styles.kanjiBox]}>
                <Text style={styles.kanjiText}>{kanjiItem.kanji}</Text>
                <Text style={styles.readingText}>{kanjiItem.reading}</Text>
                <Text style={styles.meaningText}>{kanjiItem.meaning}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Words Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitleWithCount}>Words</Text>
            <View style={styles.sectionTitleCountContainer}>
              <Text style={styles.sectionTitleCount}>{levelData?.words?.length}</Text>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            {levelData?.words?.map((wordItem, index) => (
              <View key={index} style={[styles.itemBox, styles.wordBox]}>
                <Text style={styles.wordText}>{wordItem.word}</Text>
                <Text style={styles.readingText}>{wordItem.reading}</Text>
                <Text style={styles.meaningText}>{wordItem.meaning}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  containerForLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  content: {
    flex: 1,
    padding: 20
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 15
  },
  sectionTitleWithCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitleCountContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  sectionTitleCount: {
    fontSize: 10,
    color: COLORS.surface,
    fontWeight: 'bold'
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  itemBox: {
    width: '31%',
    minHeight: 80,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  kanjiBox: {
    //backgroundColor: COLORS.cardKanji,
    backgroundColor: '#E91E63'
  },
  wordBox: {
    backgroundColor: COLORS.cardWord
  },
  kanjiText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 5
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 5
  },
  readingText: {
    fontSize: 14,
    color: COLORS.surface,
    marginBottom: 3
  },
  meaningText: {
    fontSize: 12,
    color: COLORS.surface,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: COLORS.accentDanger,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: COLORS.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  retryText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600'
  }
})
