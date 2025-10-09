import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { FONTS } from './fonts'
import COLORS from '../theme/colors'

const KANJI_SIMILAR_LIMIT = 4
const KANJI_USED_IN_LIMIT = 6

export const ensureArray = (value) => {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

const formatMetaLabel = (label, value) => {
  if (!value && value !== 0) {
    return null
  }
  return `${label} ${value}`
}

export const KanjiDetailCard = React.memo(({ item, contentPadding = 12 }) => {
  if (!item) {
    return null
  }

  const glyph = item?.kanjiName || item?.kanji || ''
  const meanings = useMemo(() => {
    const source = ensureArray(item?.meanings || item?.meaning)
    return source.slice(0, 8)
  }, [item?.meanings, item?.meaning])
  const onyomi = useMemo(() => ensureArray(item?.on).slice(0, 6), [item?.on])
  const kunyomi = useMemo(() => ensureArray(item?.kun).slice(0, 6), [item?.kun])
  const similars = useMemo(() => {
    if (!Array.isArray(item?.similars)) {
      return []
    }
    return item.similars.slice(0, KANJI_SIMILAR_LIMIT)
  }, [item?.similars])
  const usedIn = useMemo(() => {
    if (!Array.isArray(item?.usedIn)) {
      return []
    }
    return item.usedIn.slice(0, KANJI_USED_IN_LIMIT)
  }, [item?.usedIn])

  const jlptLabel = item?.jlpt ? `JLPT N${item.jlpt}` : null
  const gradeLabel = formatMetaLabel('Grade', item?.grade)
  const strokesLabel = formatMetaLabel('Strokes', item?.strokes)
  const frequencyLabel = item?.freq ? `Freq ${item.freq}` : null

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingHorizontal: contentPadding }]}>
      <View style={styles.glyphWrapper}>
        <Text style={styles.glyph}>{glyph}</Text>
        <View style={styles.metaRow}>
          {[jlptLabel, gradeLabel, strokesLabel, frequencyLabel]
            .filter(Boolean)
            .map((label) => (
              <View key={label} style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{label}</Text>
              </View>
            ))}
        </View>
      </View>

      {meanings.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meanings</Text>
          <View style={styles.chipRow}>
            {meanings.map((meaning) => (
              <View key={`meaning-${meaning}`} style={styles.meaningChip}>
                <Text style={styles.meaningChipText}>{meaning}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {onyomi.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onyomi</Text>
          <View style={styles.chipRow}>
            {onyomi.map((reading) => (
              <View key={`onyomi-${reading}`} style={styles.readingChip}>
                <Text style={styles.readingChipText}>{reading}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {kunyomi.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kunyomi</Text>
          <View style={styles.chipRow}>
            {kunyomi.map((reading) => (
              <View key={`kunyomi-${reading}`} style={styles.readingChip}>
                <Text style={styles.readingChipText}>{reading}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {usedIn.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Used In</Text>
          <View style={styles.usedList}>
            {usedIn.map((word, index) => (
              <View key={`${word.kanji || word.word || index}`} style={styles.usedRow}>
                <View style={styles.usedWordCol}>
                  <Text style={styles.usedWord}>{word.kanji || word.word}</Text>
                  {word.reading ? <Text style={styles.usedReading}>{word.reading}</Text> : null}
                </View>
                {word.meaning ? <Text style={styles.usedMeaning}>{word.meaning}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {similars.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Similar Kanjis</Text>
          <View style={styles.similarRow}>
            {similars.map((similar) => (
              <View key={`${similar.kanji}-${similar.meaning}`} style={styles.similarBox}>
                <Text style={styles.similarGlyph}>{similar.kanji}</Text>
                {similar.meaning ? (
                  <Text style={styles.similarText}>{similar.meaning}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {item?.fallback ? (
        <Text style={styles.fallback}>Full details unavailable for this kanji.</Text>
      ) : null}
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 32,
    flexGrow: 1
  },
  glyphWrapper: {
    alignItems: 'center',
    marginBottom: 20
  },
  glyph: {
    ...FONTS.bold60,
    color: COLORS.textPrimary
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12
  },
  metaBadge: {
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginVertical: 4
  },
  metaBadgeText: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive
  },
  section: {
    marginBottom: 18
  },
  sectionTitle: {
    ...FONTS.bold16,
    color: COLORS.textPrimary,
    marginBottom: 10
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  meaningChip: {
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  meaningChipText: {
    ...FONTS.medium14,
    color: COLORS.textPrimary
  },
  readingChip: {
    backgroundColor: COLORS.interactiveSurfaceActive,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  readingChipText: {
    ...FONTS.bold14,
    color: COLORS.surface
  },
  usedList: {
    marginTop: 4
  },
  usedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12
  },
  usedWordCol: {
    maxWidth: '40%'
  },
  usedWord: {
    ...FONTS.bold18,
    color: COLORS.textPrimary
  },
  usedReading: {
    ...FONTS.medium12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  usedMeaning: {
    ...FONTS.medium14,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: 12
  },
  similarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  similarBox: {
    width: '47%',
    backgroundColor: COLORS.kanjiHighlight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: 'center'
  },
  similarGlyph: {
    ...FONTS.bold24,
    color: COLORS.surface
  },
  similarText: {
    ...FONTS.medium12,
    color: COLORS.surface,
    opacity: 0.85,
    marginTop: 6,
    textAlign: 'center'
  },
  fallback: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    textAlign: 'center'
  }
})

export default KanjiDetailCard
