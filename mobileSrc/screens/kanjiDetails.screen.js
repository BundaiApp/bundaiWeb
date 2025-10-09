import { useMutation } from '@apollo/client'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { debounce } from 'lodash'
import { toRomaji } from 'wanakana'
// utils
import AuthContext from '../contexts/authContext'
// graphQL
import ADD_FLASHCARD from '../mutations/addFlashCard.mutation'
import Images from '../util/image_imports'
import COLORS from '../theme/colors'
import { FONTS } from '../components/fonts'
import KanjiDetailCard, { ensureArray } from '../components/kanjiDetailCard'

const windowWidth = Dimensions.get('window').width
const WORD_IMAGE_HEIGHT = 320

const transformVerbMeaning = (rawMeaning) => {
  if (!rawMeaning || typeof rawMeaning !== 'string') {
    return ''
  }

  return rawMeaning
    .toLowerCase()
    .replace(/^to\s+/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\//g, '')
    .replace(/\s+/g, '')
}

const normalizeLabel = (value) => {
  if (!value && value !== 0) {
    return ''
  }
  return String(value).replace(/_/g, ' ').trim()
}

const Chip = React.memo(({ label, variant = 'default' }) => {
  if (!label) {
    return null
  }

  const containerStyles = [styles.chip]
  const textStyles = [styles.chipText]

  if (variant === 'primary') {
    containerStyles.push(styles.chipPrimary)
    textStyles.push(styles.chipTextPrimary)
  } else if (variant === 'outline') {
    containerStyles.push(styles.chipOutline)
  }

  return (
    <View style={containerStyles}>
      <Text style={textStyles}>{label}</Text>
    </View>
  )
})

const WordDetailPage = React.memo(({ item }) => {
  const meaningSubjects = useMemo(
    () =>
      ensureArray(item?.meanings || item?.meaning)
        .map(normalizeLabel)
        .filter(Boolean),
    [item?.meanings, item?.meaning]
  )
  const typeSubjects = useMemo(() => {
    if (Array.isArray(item?.type)) {
      return item.type.slice(0, 6).map(normalizeLabel).filter(Boolean)
    }
    if (item?.easyType) {
      return ensureArray(item.easyType).map(normalizeLabel).filter(Boolean)
    }
    return []
  }, [item?.type, item?.easyType])

  const romajiReading = useMemo(
    () => (item?.reading ? toRomaji(item.reading) : ''),
    [item?.reading]
  )

  const imageKey = useMemo(() => {
    const primaryMeaning = meaningSubjects[0] ?? ''
    return transformVerbMeaning(primaryMeaning)
  }, [meaningSubjects])
  const imageSource = imageKey ? Images[imageKey] : null

  const metaLabels = useMemo(() => {
    const labels = []
    if (item?.frequency) {
      labels.push(`Freq ${normalizeLabel(item.frequency)}`)
    }
    if (item?.jlptLevel) {
      labels.push(normalizeLabel(item.jlptLevel).toUpperCase())
    }
    if (item?.level) {
      labels.push(`Level ${normalizeLabel(item.level)}`)
    }
    return labels
  }, [item?.frequency, item?.jlptLevel, item?.level])

  return (
    <ScrollView style={styles.wordScroll} contentContainerStyle={styles.wordContentContainer}>
      <View style={styles.wordHero}>
        <Text style={styles.wordGlyph}>{item?.kanji || item?.word || ''}</Text>
        {item?.reading ? <Text style={styles.wordReading}>{item.reading}</Text> : null}
        {romajiReading ? <Chip label={romajiReading} variant="primary" /> : null}
      </View>

      {imageSource ? (
        <Image style={styles.wordImage} source={imageSource} resizeMode="contain" />
      ) : null}

      {meaningSubjects.length ? (
        <View style={styles.wordSection}>
          <Text style={styles.sectionTitle}>Meanings</Text>
          <View style={styles.chipRow}>
            {meaningSubjects.map((subject) => (
              <Chip key={`meaning-${subject}`} label={subject} />
            ))}
          </View>
        </View>
      ) : null}

      {typeSubjects.length ? (
        <View style={styles.wordSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.chipRow}>
            {typeSubjects.map((subject) => (
              <Chip key={`type-${subject}`} label={subject} variant="outline" />
            ))}
          </View>
        </View>
      ) : null}

      {metaLabels.length ? (
        <View style={styles.wordMetaRow}>
          {metaLabels.map((label) => (
            <View key={label} style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
})

const KanjiDetailPage = React.memo(({ item }) => (
  <View style={styles.kanjiPageContainer}>
    <KanjiDetailCard item={item} contentPadding={20} />
  </View>
))

export default function KanjiDetail({ route }) {
  const { wholeArr, itemIndex, isWord, isKana } = route.params
  // context
  const { auth } = useContext(AuthContext)
  // mutation
  const [addFlashCard] = useMutation(ADD_FLASHCARD)
  const addCard = useCallback(
    async ({ kanjiName, kanji, hiragana, on, meanings, meaning, quizAnswers }) => {
      await addFlashCard({
        variables: {
          userId: auth.userId,
          kanjiName: isWord ? kanji : kanjiName,
          hiragana: isKana ? '' : isWord ? hiragana : on?.[0] || '',
          meanings: isWord ? ensureArray(meaning || meanings) : meanings,
          quizAnswers
        }
      })
    },
    [addFlashCard, auth.userId, isKana, isWord]
  )

  const debouncedAddCard = useMemo(() => debounce(addCard, 500), [addCard])

  useEffect(() => {
    return () => {
      debouncedAddCard.cancel()
    }
  }, [debouncedAddCard])

  useEffect(() => {
    if (wholeArr[itemIndex]) {
      addCard(wholeArr[itemIndex])
    }
  }, [addCard, itemIndex, wholeArr])

  const handleMomentumScrollEnd = useCallback(
    (event) => {
      const { nativeEvent } = event
      const contentOffsetX = nativeEvent.contentOffset?.x || nativeEvent.targetContentOffset?.x || 0
      const currentIndex = Math.floor(contentOffsetX / windowWidth)

      const nextCard = wholeArr[currentIndex + 1]
      if (nextCard) {
        debouncedAddCard(nextCard)
      }
    },
    [debouncedAddCard, wholeArr]
  )

  const renderPage = useCallback(
    ({ item }) => (isWord ? <WordDetailPage item={item} /> : <KanjiDetailPage item={item} />),
    [isWord]
  )

  const keyExtractor = useCallback(
    (item, index) => `${item?.kanjiName || item?.kanji || index}`,
    []
  )

  return (
    <FlatList
      horizontal
      style={styles.container}
      pagingEnabled
      data={wholeArr}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      windowSize={1}
      initialScrollIndex={itemIndex}
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      getItemLayout={(_, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index
      })}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      renderItem={renderPage}
      removeClippedSubviews
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  wordScroll: {
    width: windowWidth,
    backgroundColor: COLORS.background
  },
  wordContentContainer: {
    width: windowWidth,
    paddingHorizontal: 24,
    paddingBottom: 48
  },
  wordHero: {
    alignItems: 'center',
    marginBottom: 24
  },
  wordGlyph: {
    ...FONTS.bold46,
    color: COLORS.textPrimary,
    fontSize: 56
  },
  wordReading: {
    ...FONTS.medium16,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 12
  },
  wordImage: {
    alignSelf: 'center',
    height: WORD_IMAGE_HEIGHT,
    width: WORD_IMAGE_HEIGHT,
    marginBottom: 24
  },
  wordSection: {
    marginBottom: 24
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
  chip: {
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  chipPrimary: {
    backgroundColor: COLORS.kanjiHighlight
  },
  chipOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.interactiveSurfaceActive
  },
  chipText: {
    ...FONTS.medium14,
    color: COLORS.textPrimary
  },
  chipTextPrimary: {
    color: COLORS.surface
  },
  wordMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  metaBadge: {
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  metaBadgeText: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive
  },
  kanjiPageContainer: {
    flex: 1,
    width: windowWidth,
    backgroundColor: COLORS.background,
    paddingTop: 12
  }
})
