import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  useWindowDimensions
} from 'react-native'
import { useQuery } from '@apollo/client'
// query
import FIND_PENDING_FLASHCARDS from '../queries/findPendingCards.query'
// util
import { FONTS } from '../components/fonts'
// utils
import AuthContext from '../contexts/authContext'
import COLORS from '../theme/colors'
import { LEVEL_SYSTEM_CONFIG, getLevelContent } from '../util/levelSystem'
import KanjiDetailCard, { ensureArray as ensureArrayValues } from '../components/kanjiDetailCard'
import { provideData } from '../util/jlptArray'

const ONE_MINUTE_MS = 60 * 1000
const ONE_HOUR_MS = 60 * 60 * 1000
const ONE_DAY_MS = 24 * ONE_HOUR_MS

const KANA_ONLY_REGEX = /^[\u3040-\u309F\u30A0-\u30FFー・\s]+$/
const LEVEL_PROGRESS_DOTS = new Array(6).fill(null)
const LONG_WORD_LENGTH_THRESHOLD = 4
const LONG_WORD_FONT_REDUCTION = 3
const SHEET_SIDE_PADDING = 12

const isKanaOnly = (value) => {
  if (!value || typeof value !== 'string') {
    return false
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }
  return KANA_ONLY_REGEX.test(trimmed)
}

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatRelative = (target, now = new Date()) => {
  if (!target) return null
  const diff = target.getTime() - now.getTime()
  const abs = Math.abs(diff)

  if (abs < ONE_MINUTE_MS) {
    return diff >= 0 ? 'in <1m' : '<1m ago'
  }

  if (abs < ONE_HOUR_MS) {
    const minutes = Math.round(abs / ONE_MINUTE_MS)
    return diff >= 0 ? `in ${minutes}m` : `${minutes}m ago`
  }

  if (abs < ONE_DAY_MS) {
    const hours = Math.round(abs / ONE_HOUR_MS)
    return diff >= 0 ? `in ${hours}h` : `${hours}h ago`
  }

  const days = Math.round(abs / ONE_DAY_MS)
  return diff >= 0 ? `in ${days}d` : `${days}d ago`
}

const getDueDescriptor = (nextReview, now = new Date()) => {
  const date = parseDate(nextReview)
  if (!date) {
    return { label: 'Ready now', tone: 'active' }
  }

  const diff = date.getTime() - now.getTime()

  if (diff <= 0) {
    return { label: 'Due now', tone: 'alert' }
  }

  if (diff <= ONE_DAY_MS) {
    const hours = Math.max(1, Math.round(diff / ONE_HOUR_MS))
    return { label: `in ${hours}h`, tone: 'soon' }
  }

  return { label: formatRelative(date, now), tone: 'later' }
}

export const QuizHome = ({ navigation: { navigate } }) => {
  // context
  const { auth } = useContext(AuthContext)

  const [refreshing, setRefreshing] = useState(false)
  const [sheetConfig, setSheetConfig] = useState(null)
  const [sheetCurrentIndex, setSheetCurrentIndex] = useState(0)
  const sheetListRef = useRef(null)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const sheetPageWidth = Math.max(1, windowWidth - SHEET_SIDE_PADDING * 2)
  const sheetPageHeight = Math.max(260, Math.min(windowHeight * 0.6, windowHeight - 200))
  const kanjiDatasetMap = useMemo(() => {
    try {
      const grouped = provideData('jlpt', 5, true) || {}
      const map = new Map()
      Object.values(grouped).forEach((collection) => {
        if (!Array.isArray(collection)) {
          return
        }
        collection.forEach((entry) => {
          if (entry?.kanjiName && !map.has(entry.kanjiName)) {
            map.set(entry.kanjiName, entry)
          }
        })
      })
      return map
    } catch (datasetError) {
      console.warn('Unable to load JLPT kanji dataset', datasetError)
      return new Map()
    }
  }, [])

  const { data, loading, error, refetch } = useQuery(FIND_PENDING_FLASHCARDS, {
    variables: {
      userId: auth.userId
    }
  })

  const pendingCards = data?.getPendingFlashCards ?? []

  const metrics = useMemo(() => {
    if (!pendingCards.length) {
      return {
        totalPending: 0,
        dueNowCount: 0,
        dueSoonCount: 0,
        averageRating: null,
        ratingCount: 0,
        nextDueDate: null,
        lastReviewDate: null,
        previewCards: []
      }
    }

    const now = new Date()
    let dueNowCount = 0
    let dueSoonCount = 0
    let nextDueDate = null
    let lastReviewDate = null
    let ratingSum = 0
    let ratingCount = 0

    const enrichedCards = pendingCards.map((card) => {
      const nextReviewDate = parseDate(card.nextReview) || now
      const lastSeenDate = parseDate(card.lastSeen)

      if (!card.nextReview || nextReviewDate <= now) {
        dueNowCount += 1
      } else if (nextReviewDate.getTime() - now.getTime() <= ONE_DAY_MS) {
        dueSoonCount += 1
      }

      if (!nextDueDate || nextReviewDate < nextDueDate) {
        nextDueDate = nextReviewDate
      }

      if (lastSeenDate && (!lastReviewDate || lastSeenDate > lastReviewDate)) {
        lastReviewDate = lastSeenDate
      }

      const ratingValue = Number(card.rating)
      if (!Number.isNaN(ratingValue)) {
        ratingSum += ratingValue
        ratingCount += 1
      }

      return { ...card, _nextReviewDate: nextReviewDate }
    })

    const previewCards = enrichedCards
      .sort((a, b) => a._nextReviewDate - b._nextReviewDate)
      .slice(0, 3)
      .map(({ _nextReviewDate, ...rest }) => rest)

    return {
      totalPending: pendingCards.length,
      dueNowCount,
      dueSoonCount,
      averageRating: ratingCount ? ratingSum / ratingCount : null,
      ratingCount,
      nextDueDate,
      lastReviewDate,
      previewCards
    }
  }, [pendingCards])

  const learnedSet = useMemo(() => {
    if (!pendingCards.length) {
      return new Set()
    }

    const collection = new Set()

    pendingCards.forEach((card) => {
      if (!card) {
        return
      }

      if (card.kanjiName) {
        collection.add(card.kanjiName)
      }

      if (Array.isArray(card.hiragana)) {
        card.hiragana.forEach((reading) => {
          if (reading) {
            collection.add(reading)
          }
        })
      } else if (card.hiragana) {
        collection.add(card.hiragana)
      }
    })

    return collection
  }, [pendingCards])

  const { levelSummaries, currentLevelSummary } = useMemo(() => {
    const totalLevels = Math.min(LEVEL_SYSTEM_CONFIG?.totalLevels ?? 6, 6)
    const summaries = []
    let current = null

    for (let index = 0; index < totalLevels; index += 1) {
      const level = index + 10

      try {
        const data = getLevelContent(level)
        const kanjiList = Array.isArray(data?.kanji) ? data.kanji : []
        const rawWordList = Array.isArray(data?.words) ? data.words : []
        const soundList = rawWordList.filter((word) => isKanaOnly(word.word))
        const wordList = rawWordList.filter((word) => !isKanaOnly(word.word))

        const learnedKanji = kanjiList.filter((item) => learnedSet.has(item.kanji)).length
        const learnedWords = wordList.filter((item) => learnedSet.has(item.word)).length
        const learnedSounds = soundList.filter((item) => learnedSet.has(item.word)).length

        const totalKanji = kanjiList.length
        const totalWords = wordList.length
        const totalSound = soundList.length
        const totalItems = totalKanji + totalWords + totalSound
        const learnedItems = learnedKanji + learnedWords + learnedSounds
        const progress = totalItems > 0 ? Math.min(1, learnedItems / totalItems) : 0

        const summary = {
          level,
          progress,
          totals: {
            kanji: totalKanji,
            words: totalWords,
            sound: totalSound,
            total: totalItems
          },
          learned: {
            kanji: learnedKanji,
            words: learnedWords,
            sound: learnedSounds,
            total: learnedItems
          },
          kanjiList,
          wordList,
          soundList,
          allWords: rawWordList
        }

        if (!current && progress < 1) {
          current = summary
        }

        summaries.push(summary)
      } catch (err) {
        console.warn(`Unable to load level ${level} data`, err)
        summaries.push({
          level,
          progress: 0,
          totals: { kanji: 0, words: 0, sound: 0, total: 0 },
          learned: { kanji: 0, words: 0, sound: 0, total: 0 },
          kanjiList: [],
          wordList: [],
          soundList: [],
          allWords: []
        })
      }
    }

    if (!current && summaries.length) {
      current = summaries[summaries.length - 1]
    }

    return { levelSummaries: summaries, currentLevelSummary: current }
  }, [learnedSet])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const handleStartReview = () => {
    if (!pendingCards.length) {
      alert('Nothing to review')
      return
    }

    navigate('SRSEngine', { questionsArray: pendingCards })
  }

  const openSheet = useCallback(
    (type, items, startIndex = 0) => {
      if (!Array.isArray(items) || items.length === 0) {
        return
      }

      let workingItems = items

      if (type === 'kanji') {
        workingItems = items.map((entry) => {
          const kanjiKey = entry?.kanjiName || entry?.kanji
          if (!kanjiKey) {
            return {
              ...entry,
              kanjiName: '',
              meanings: ensureArrayValues(entry?.meanings || entry?.meaning),
              fallback: true
            }
          }

          const datasetEntry = kanjiDatasetMap.get(kanjiKey)
          if (datasetEntry) {
            return datasetEntry
          }

          return {
            ...entry,
            kanjiName: kanjiKey,
            meanings: ensureArrayValues(entry?.meanings || entry?.meaning),
            fallback: true
          }
        })
      }

      const nextIndex = Math.min(Math.max(startIndex, 0), workingItems.length - 1)
      setSheetConfig({ type, items: workingItems })
      setSheetCurrentIndex(nextIndex)
    },
    [kanjiDatasetMap]
  )

  const closeSheet = useCallback(() => {
    setSheetConfig(null)
    setSheetCurrentIndex(0)
  }, [])

  const handleSheetMomentumEnd = useCallback(
    (event) => {
      if (!sheetConfig || sheetPageWidth <= 0) {
        return
      }

      const offsetX = event.nativeEvent.contentOffset.x
      const nextIndex = Math.round(offsetX / sheetPageWidth)
      const clamped = Math.min(Math.max(nextIndex, 0), sheetConfig.items.length - 1)
      setSheetCurrentIndex(clamped)
    },
    [sheetConfig, sheetPageWidth]
  )

  useEffect(() => {
    if (!sheetConfig || sheetPageWidth <= 0) {
      return
    }

    const clampedIndex = Math.min(sheetCurrentIndex, sheetConfig.items.length - 1)
    const frameId = requestAnimationFrame(() => {
      sheetListRef.current?.scrollToOffset({
        offset: clampedIndex * sheetPageWidth,
        animated: false
      })
    })

    return () => cancelAnimationFrame(frameId)
  }, [sheetConfig, sheetCurrentIndex, sheetPageWidth])

  const queueIsEmpty = metrics.totalPending === 0
  let nextDueLabel = 'Ready now'
  if (metrics.nextDueDate) {
    const diff = metrics.nextDueDate.getTime() - Date.now()
    nextDueLabel = diff <= 0 ? 'Due now' : formatRelative(metrics.nextDueDate)
  }
  const lastReviewLabelRaw = metrics.lastReviewDate ? formatRelative(metrics.lastReviewDate) : null
  const lastReviewLabel = lastReviewLabelRaw
    ? lastReviewLabelRaw.replace(/^in\s*/, '').trim()
    : null
  const startButtonLabel = queueIsEmpty
    ? 'No cards to review'
    : metrics.dueNowCount
      ? `Review ${metrics.dueNowCount} due`
      : 'Review queue'

  const stats = [
    {
      key: 'ready',
      label: 'Ready now',
      value: metrics.dueNowCount,
      meta: metrics.dueNowCount ? 'Due immediately' : 'All caught up'
    },
    {
      key: 'soon',
      label: 'Due soon',
      value: metrics.dueSoonCount,
      meta: 'Next 24h'
    },
    {
      key: 'ease',
      label: 'Avg ease',
      value: metrics.ratingCount > 0 ? metrics.averageRating.toFixed(1) : '—',
      meta: metrics.ratingCount > 0 ? `${metrics.ratingCount} rated` : 'No ratings yet'
    }
  ]

  const formatCount = (learned, total) => {
    if (!total) {
      return `${learned}/—`
    }
    return `${learned}/${total}`
  }

  const currentLevelNumber = currentLevelSummary?.level ?? 1
  const currentLevelTotals = currentLevelSummary?.totals ?? {
    kanji: 0,
    words: 0,
    sound: 0,
    total: 0
  }
  const currentLevelLearned = currentLevelSummary?.learned ?? {
    kanji: 0,
    words: 0,
    sound: 0,
    total: 0
  }
  const currentProgressPercent = currentLevelSummary
    ? Math.round(currentLevelSummary.progress * 100)
    : 0
  const currentTotalItemsLabel = currentLevelTotals.total || '—'
  const levelKanji = currentLevelSummary?.kanjiList ?? []
  const levelWordsWithKanji = currentLevelSummary?.wordList ?? []
  const levelSoundWords = currentLevelSummary?.soundList ?? []
  const hasKanjiPreview = levelKanji.length > 0
  const hasWordPreview = levelWordsWithKanji.length > 0
  const hasSoundPreview = levelSoundWords.length > 0

  if (loading) {
    return (
      <View style={styles.containerForLoading}>
        <ActivityIndicator size="large" color={COLORS.interactivePrimary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.containerForLoading}>
        <Text style={styles.errorTitle}>Unable to load your queue</Text>
        <Text style={styles.errorSubtitle}>Tap below to try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.interactivePrimary}
          />
        }>
        {currentLevelSummary ? (
          <View style={styles.levelProgressCard}>
            <View style={styles.levelProgressHeader}>
              <View>
                <Text style={styles.levelProgressTitle}>{`Level ${currentLevelNumber}`}</Text>
                <Text
                  style={
                    styles.levelProgressSubtitle
                  }>{`${currentLevelLearned.total} of ${currentTotalItemsLabel} items learned`}</Text>
              </View>
              <View style={styles.levelProgressBadge}>
                <Text style={styles.levelProgressBadgeText}>{`${currentProgressPercent}%`}</Text>
              </View>
            </View>
            <View style={styles.levelProgressBarTrack}>
              <View
                style={[styles.levelProgressBarFill, { width: `${currentProgressPercent}%` }]}
              />
            </View>
            <View style={styles.levelProgressMetrics}>
              <View style={styles.levelProgressMetric}>
                <Text style={[styles.levelMetricLabel, styles.levelMetricLabelKanji]}>Kanji</Text>
                <Text style={styles.levelMetricValue}>
                  {formatCount(currentLevelLearned.kanji, currentLevelTotals.kanji)}
                </Text>
              </View>
              <View style={styles.levelProgressMetric}>
                <Text style={[styles.levelMetricLabel, styles.levelMetricLabelWords]}>Words</Text>
                <Text style={styles.levelMetricValue}>
                  {formatCount(currentLevelLearned.words, currentLevelTotals.words)}
                </Text>
              </View>
              <View style={[styles.levelProgressMetric, styles.levelProgressMetricLast]}>
                <Text style={[styles.levelMetricLabel, styles.levelMetricLabelSound]}>Sounds</Text>
                <Text style={styles.levelMetricValue}>
                  {formatCount(currentLevelLearned.sound, currentLevelTotals.sound)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.levelDetailsButton}
              onPress={() => navigate('LevelDetails', { level: currentLevelNumber })}
              activeOpacity={0.85}>
              <Text style={styles.levelDetailsButtonText}>Open level details</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Review queue</Text>
          <Text style={styles.heroCount}>{metrics.totalPending}</Text>
          <Text style={styles.heroSubtitle}>
            {queueIsEmpty
              ? 'All clear!'
              : metrics.dueNowCount
                ? 'Cards ready right now'
                : 'Scheduled and waiting'}
          </Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaBadge}>
              <Text style={styles.heroMetaText}>{nextDueLabel}</Text>
            </View>
            {lastReviewLabel ? (
              <Text style={styles.heroMetaPlain}>{`Last session ${lastReviewLabel.trim()}`}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.heroButton, queueIsEmpty && styles.heroButtonDisabled]}
            onPress={handleStartReview}
            disabled={queueIsEmpty}
            activeOpacity={0.85}>
            <Text style={styles.heroButtonText}>{startButtonLabel}</Text>
          </TouchableOpacity>
        </View>

        {currentLevelSummary ? (
          <View>
            {hasKanjiPreview ? (
              <View style={styles.levelSection}>
                <View style={styles.levelSectionHeader}>
                  <View style={styles.levelSectionHeaderLeft}>
                    <Text style={styles.levelSectionTitle}>Kanji</Text>
                    <View style={styles.levelCountBadge}>
                      <Text style={styles.levelCountBadgeText}>{currentLevelTotals.kanji}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.levelSectionLinkButton}
                    onPress={() => navigate('LevelDetails', { level: currentLevelNumber })}>
                    <Text style={styles.levelSectionLink}>Level →</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.levelItemsGrid}>
                  {levelKanji.map((item, index) => {
                    const isLearned = learnedSet.has(item.kanji)
                    const activeDots = isLearned ? LEVEL_PROGRESS_DOTS.length : 0

                    return (
                      <TouchableOpacity
                        key={`${item.kanji}-${index}`}
                        style={styles.levelKanjiColumn}
                        activeOpacity={0.8}
                        onPress={() => openSheet('kanji', levelKanji, index)}>
                        <View style={styles.levelKanjiBox}>
                          <Text style={styles.levelKanjiSymbol}>{item.kanji}</Text>
                        </View>
                        <View style={styles.levelDotsRow}>
                          {LEVEL_PROGRESS_DOTS.map((_, dotIndex) => (
                            <View
                              key={dotIndex}
                              style={[
                                styles.levelDotBase,
                                { borderColor: COLORS.kanjiHighlight },
                                dotIndex < activeDots && { backgroundColor: COLORS.kanjiHighlight }
                              ]}
                            />
                          ))}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}

            {hasWordPreview ? (
              <View style={styles.levelSection}>
                <View style={styles.levelSectionHeader}>
                  <View style={styles.levelSectionHeaderLeft}>
                    <Text style={styles.levelSectionTitle}>Words</Text>
                    <View style={styles.levelCountBadge}>
                      <Text style={styles.levelCountBadgeText}>{levelWordsWithKanji.length}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.levelSectionLinkButton}
                    onPress={() => navigate('LevelDetails', { level: currentLevelNumber })}>
                    <Text style={styles.levelSectionLink}>Level →</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.levelItemsGrid}>
                  {levelWordsWithKanji.map((item, index) => {
                    const isLearned = learnedSet.has(item.word)
                    const activeDots = isLearned ? LEVEL_PROGRESS_DOTS.length : 0
                    const wordDisplayStyles = [styles.levelWordText]
                    if ((item.word?.length ?? 0) > LONG_WORD_LENGTH_THRESHOLD) {
                      wordDisplayStyles.push(styles.levelWordTextCompact)
                    }
                    return (
                      <TouchableOpacity
                        key={`${item.word}-${index}`}
                        style={styles.levelWordColumn}
                        activeOpacity={0.8}
                        onPress={() => openSheet('word', levelWordsWithKanji, index)}>
                        <View style={styles.levelWordBox}>
                          <Text style={wordDisplayStyles}>{item.word}</Text>
                        </View>
                        <View style={styles.levelDotsRow}>
                          {LEVEL_PROGRESS_DOTS.map((_, dotIndex) => (
                            <View
                              key={dotIndex}
                              style={[
                                styles.levelDotBase,
                                { borderColor: COLORS.cardWord },
                                dotIndex < activeDots && { backgroundColor: COLORS.cardWord }
                              ]}
                            />
                          ))}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}

            {hasSoundPreview ? (
              <View style={styles.levelSection}>
                <View style={styles.levelSectionHeader}>
                  <View style={styles.levelSectionHeaderLeft}>
                    <Text style={styles.levelSectionTitle}>Sound-only words</Text>
                    <View style={styles.levelCountBadge}>
                      <Text style={styles.levelCountBadgeText}>{levelSoundWords.length}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.levelSectionLinkButton}
                    onPress={() => navigate('LevelDetails', { level: currentLevelNumber })}>
                    <Text style={styles.levelSectionLink}>Level →</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.levelItemsGrid}>
                  {levelSoundWords.map((item, index) => {
                    const isLearned = learnedSet.has(item.word)
                    const activeDots = isLearned ? LEVEL_PROGRESS_DOTS.length : 0
                    return (
                      <TouchableOpacity
                        key={`${item.word}-${index}`}
                        style={styles.levelSoundColumn}
                        activeOpacity={0.8}
                        onPress={() => openSheet('sound', levelSoundWords, index)}>
                        <View style={styles.levelSoundBox}>
                          <Text style={styles.levelSoundText}>{item.word}</Text>
                        </View>
                        <View style={styles.levelDotsRow}>
                          {LEVEL_PROGRESS_DOTS.map((_, dotIndex) => (
                            <View
                              key={dotIndex}
                              style={[
                                styles.levelDotBase,
                                { borderColor: COLORS.cardSupport },
                                dotIndex < activeDots && { backgroundColor: COLORS.cardSupport }
                              ]}
                            />
                          ))}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {sheetConfig ? (
        <Modal
          transparent
          animationType="slide"
          visible={Boolean(sheetConfig)}
          onRequestClose={closeSheet}>
          <View style={styles.sheetRoot}>
            <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={closeSheet} />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetLabel}>
                  {sheetConfig.type === 'kanji'
                    ? 'Kanji'
                    : sheetConfig.type === 'word'
                      ? 'Word'
                      : 'Sound word'}
                </Text>
                <Text
                  style={
                    styles.sheetCounterText
                  }>{`${sheetCurrentIndex + 1}/${sheetConfig.items.length}`}</Text>
              </View>
              <FlatList
                ref={sheetListRef}
                data={sheetConfig.items}
                keyExtractor={(item, index) => {
                  if (sheetConfig.type === 'kanji') {
                    return `${sheetConfig.type}-${item?.kanjiName || item?.kanji || index}`
                  }
                  const baseKey = item?.word || item?.kanji || item?.kanjiName || index
                  return `${sheetConfig.type}-${baseKey}-${index}`
                }}
                horizontal
                pagingEnabled
                initialScrollIndex={sheetCurrentIndex}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleSheetMomentumEnd}
                renderItem={({ item }) => (
                  <View
                    style={[styles.sheetSlide, { width: sheetPageWidth, height: sheetPageHeight }]}>
                    {sheetConfig.type === 'kanji' ? (
                      <KanjiDetailCard item={item} contentPadding={12} />
                    ) : (
                      <View style={styles.wordSlideContent}>
                        <Text style={styles.sheetTitleText}>{item.word}</Text>
                        {item.reading ? (
                          <Text style={styles.sheetReading}>{item.reading}</Text>
                        ) : null}
                        {item.meaning ? (
                          <Text style={styles.sheetMeaning}>{item.meaning}</Text>
                        ) : null}
                      </View>
                    )}
                  </View>
                )}
                getItemLayout={(_, index) => ({
                  length: sheetPageWidth,
                  offset: sheetPageWidth * index,
                  index
                })}
                style={[styles.sheetPager, { height: sheetPageHeight }]}
                contentContainerStyle={styles.sheetPagerContent}
              />
              <TouchableOpacity
                style={styles.sheetCloseButton}
                onPress={closeSheet}
                activeOpacity={0.85}>
                <Text style={styles.sheetCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
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
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  levelProgressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  levelProgressTitle: {
    ...FONTS.bold18,
    color: COLORS.textPrimary
  },
  levelProgressSubtitle: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    marginTop: 4
  },
  levelProgressBadge: {
    backgroundColor: COLORS.interactivePrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  levelProgressBadgeText: {
    ...FONTS.bold14,
    color: COLORS.interactiveTextOnPrimary
  },
  levelProgressBarTrack: {
    marginTop: 16,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.interactiveSurface
  },
  levelProgressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.interactivePrimary
  },
  levelProgressMetrics: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  levelProgressMetric: {
    flex: 1,
    paddingRight: 12
  },
  levelProgressMetricLast: {
    paddingRight: 0
  },
  levelMetricLabel: {
    ...FONTS.medium12,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  levelMetricLabelKanji: {
    color: COLORS.cardKanji
  },
  levelMetricLabelWords: {
    color: COLORS.cardWord
  },
  levelMetricLabelSound: {
    color: COLORS.cardSupport
  },
  levelMetricValue: {
    ...FONTS.bold16,
    color: COLORS.textPrimary,
    marginTop: 6
  },
  levelDetailsButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.interactiveSurface
  },
  levelDetailsButtonText: {
    ...FONTS.bold14,
    color: COLORS.interactivePrimary
  },
  heroCard: {
    backgroundColor: COLORS.interactivePrimary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  heroTitle: {
    ...FONTS.medium14,
    color: COLORS.interactiveTextOnPrimary,
    opacity: 0.8
  },
  heroCount: {
    ...FONTS.bold36,
    color: COLORS.interactiveTextOnPrimary,
    marginTop: 8
  },
  heroSubtitle: {
    ...FONTS.medium16,
    color: COLORS.interactiveTextOnPrimary,
    marginTop: 8
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap'
  },
  heroMetaBadge: {
    backgroundColor: COLORS.interactivePrimaryPressed,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 8
  },
  heroMetaText: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextOnPrimary
  },
  heroMetaPlain: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextOnPrimary,
    opacity: 0.8,
    marginBottom: 8
  },
  heroButton: {
    marginTop: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center'
  },
  heroButtonDisabled: {
    opacity: 0.5
  },
  heroButtonText: {
    ...FONTS.bold16,
    color: COLORS.interactivePrimary
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 12
  },
  statValue: {
    ...FONTS.bold24,
    color: COLORS.textPrimary
  },
  statLabel: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    marginTop: 6
  },
  statMeta: {
    ...FONTS.medium10,
    color: COLORS.interactiveTextInactive,
    marginTop: 4
  },
  previewSection: {
    marginBottom: 24
  },
  sectionTitle: {
    ...FONTS.bold18,
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  previewKanji: {
    ...FONTS.bold24,
    color: COLORS.textPrimary
  },
  previewKana: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    marginTop: 8
  },
  previewMeaning: {
    ...FONTS.medium14,
    color: COLORS.textPrimary,
    marginTop: 8
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap'
  },
  previewMeta: {
    ...FONTS.medium10,
    color: COLORS.interactiveTextInactive,
    marginRight: 12,
    marginTop: 4
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.interactiveSurface
  },
  badgeActive: {
    backgroundColor: COLORS.interactivePrimary
  },
  badgeSoon: {
    backgroundColor: COLORS.interactiveSurfaceActive
  },
  badgeAlert: {
    backgroundColor: COLORS.accentDanger
  },
  badgeText: {
    ...FONTS.medium10,
    color: COLORS.interactiveTextInactive
  },
  badgeTextOnDark: {
    color: COLORS.surface
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  emptyTitle: {
    ...FONTS.bold18,
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  emptySubtitle: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive
  },
  syncButton: {
    marginTop: 12,
    alignSelf: 'center',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.interactiveBorder,
    backgroundColor: COLORS.surface
  },
  syncButtonText: {
    ...FONTS.bold14,
    color: COLORS.textPrimary
  },
  levelSection: {
    marginBottom: 24,
    marginRight: -8
  },
  levelSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12
  },
  levelSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  levelSectionTitle: {
    ...FONTS.bold18,
    color: COLORS.textPrimary
  },
  levelCountBadge: {
    marginLeft: 10,
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: COLORS.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelCountBadgeText: {
    ...FONTS.bold12,
    color: COLORS.surface
  },
  levelSectionLinkButton: {
    marginLeft: 'auto',
    paddingLeft: 12
  },
  levelSectionLink: {
    ...FONTS.bold12,
    color: COLORS.interactivePrimary
  },
  levelItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -3
  },
  levelKanjiBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.kanjiHighlight,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1
  },
  levelKanjiColumn: {
    flexBasis: '16.66%', // 6 columns: 100% / 6 ≈ 16.66%
    maxWidth: '16.66%',
    marginBottom: 8,
    alignItems: 'center',
    paddingHorizontal: 3
  },
  levelKanjiSymbol: {
    ...FONTS.bold24,
    color: COLORS.surface
  },
  levelDotsRow: {
    flexDirection: 'row',
    marginTop: 6
  },
  levelDotBase: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
    marginHorizontal: 1.5
  },
  levelWordColumn: {
    width: '23%',
    marginRight: '2%',
    marginBottom: 12,
    alignItems: 'center'
  },
  levelWordBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardWord,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1
  },
  levelWordText: {
    ...FONTS.bold18,
    color: COLORS.surface,
    textAlign: 'center'
  },
  levelWordTextCompact: {
    fontSize: Math.max(1, (FONTS.bold18?.fontSize ?? 18) - LONG_WORD_FONT_REDUCTION)
  },
  levelSoundColumn: {
    width: '23%',
    marginRight: '2%',
    marginBottom: 12,
    alignItems: 'center'
  },
  levelSoundBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardSupport,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1
  },
  levelSoundText: {
    ...FONTS.bold16,
    color: COLORS.surface,
    textAlign: 'center'
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SHEET_SIDE_PADDING,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    maxHeight: '85%'
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.interactiveSurface,
    marginBottom: 12
  },
  sheetLabel: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  sheetCounterText: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive
  },
  sheetTitleText: {
    ...FONTS.bold24,
    color: COLORS.textPrimary
  },
  sheetPager: {
    marginTop: 12,
    flexGrow: 0,
    flexShrink: 0
  },
  sheetPagerContent: {
    paddingBottom: 12,
    flexGrow: 1,
    alignItems: 'stretch'
  },
  sheetSlide: {
    flex: 1,
    marginBottom: 12
  },
  sheetReading: {
    ...FONTS.medium14,
    color: COLORS.textSecondary,
    marginTop: 8
  },
  sheetMeaning: {
    ...FONTS.medium16,
    color: COLORS.textPrimary,
    marginTop: 12
  },
  sheetCloseButton: {
    alignSelf: 'flex-end',
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.interactiveSurfaceActive
  },
  sheetCloseButtonText: {
    ...FONTS.bold14,
    color: COLORS.surface
  },
  wordSlideContent: {
    flex: 1,
    justifyContent: 'center'
  },
  levelOverviewSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  },
  levelOverviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  levelOverviewCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.interactiveBorder,
    backgroundColor: COLORS.surfaceMuted,
    padding: 16,
    marginBottom: 12
  },
  levelOverviewCardActive: {
    borderColor: COLORS.interactivePrimary,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  levelOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  levelOverviewTitle: {
    ...FONTS.bold16,
    color: COLORS.textPrimary
  },
  levelOverviewPercent: {
    ...FONTS.bold14,
    color: COLORS.interactivePrimary
  },
  levelOverviewBarTrack: {
    marginTop: 10,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.interactiveSurface
  },
  levelOverviewBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.interactivePrimary
  },
  levelOverviewMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  levelOverviewMeta: {
    ...FONTS.medium10,
    color: COLORS.textSecondary
  },
  metaKanji: {
    color: COLORS.cardKanji
  },
  metaWord: {
    color: COLORS.cardWord
  },
  metaSound: {
    color: COLORS.cardSupport
  },
  errorTitle: {
    ...FONTS.bold18,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center'
  },
  errorSubtitle: {
    ...FONTS.medium12,
    color: COLORS.interactiveTextInactive,
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: COLORS.interactivePrimary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  retryButtonText: {
    ...FONTS.bold14,
    color: COLORS.interactiveTextOnPrimary
  }
})
