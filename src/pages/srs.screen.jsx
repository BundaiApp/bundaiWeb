import { useState, useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useNavigate } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import COLORS from "../theme/colors"
import { getLevelContent } from "../util/levelSystem"
import FIND_PENDING_FLASHCARDS from "../graphql/queries/findPendingCards.query"

const ONE_HOUR_MS = 60 * 60 * 1000
const ONE_DAY_MS = 24 * ONE_HOUR_MS
const LEVEL_PROGRESS_DOTS = new Array(6).fill(null)
const CURRENT_LEVEL = 10 // Static for now, will be dynamic later

const KANA_ONLY_REGEX = /^[\u3040-\u309F\u30A0-\u30FFー・\s]+$/

const isKanaOnly = (value) => {
    if (!value || typeof value !== 'string') return false
    const trimmed = value.trim()
    if (!trimmed) return false
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

    if (abs < 60 * 1000) return diff >= 0 ? 'in <1m' : '<1m ago'
    if (abs < ONE_HOUR_MS) {
        const minutes = Math.round(abs / (60 * 1000))
        return diff >= 0 ? `in ${minutes}m` : `${minutes}m ago`
    }
    if (abs < ONE_DAY_MS) {
        const hours = Math.round(abs / ONE_HOUR_MS)
        return diff >= 0 ? `in ${hours}h` : `${hours}h ago`
    }
    const days = Math.round(abs / ONE_DAY_MS)
    return diff >= 0 ? `in ${days}d` : `${days}d ago`
}

export default function SRS() {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId") || "defaultUser"
    const [refreshing, setRefreshing] = useState(false)

    const { data, loading, error, refetch } = useQuery(FIND_PENDING_FLASHCARDS, {
        variables: { userId }
    })

    const pendingCards = data?.getPendingFlashCards ?? []

    // Calculate metrics from pending cards
    const metrics = useMemo(() => {
        if (!pendingCards.length) {
            return {
                totalPending: 0,
                dueNowCount: 0,
                dueSoonCount: 0,
                nextDueDate: null,
                lastReviewDate: null
            }
        }

        const now = new Date()
        let dueNowCount = 0
        let dueSoonCount = 0
        let nextDueDate = null
        let lastReviewDate = null

        pendingCards.forEach((card) => {
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
        })

        return {
            totalPending: pendingCards.length,
            dueNowCount,
            dueSoonCount,
            nextDueDate,
            lastReviewDate
        }
    }, [pendingCards])

    // Get learned set
    const learnedSet = useMemo(() => {
        if (!pendingCards.length) return new Set()

        const collection = new Set()
        pendingCards.forEach((card) => {
            if (card?.kanjiName) collection.add(card.kanjiName)
            if (Array.isArray(card?.hiragana)) {
                card.hiragana.forEach((reading) => {
                    if (reading) collection.add(reading)
                })
            } else if (card?.hiragana) {
                collection.add(card.hiragana)
            }
        })
        return collection
    }, [pendingCards])

    // Get level content
    const levelData = useMemo(() => {
        try {
            const data = getLevelContent(CURRENT_LEVEL)
            const kanjiList = Array.isArray(data?.kanji) ? data.kanji : []
            const rawWordList = Array.isArray(data?.words) ? data.words : []
            const soundList = rawWordList.filter((word) => isKanaOnly(word.word))
            const wordList = rawWordList.filter((word) => !isKanaOnly(word.word))

            const learnedKanji = kanjiList.filter((item) => learnedSet.has(item.kanji)).length
            const learnedWords = wordList.filter((item) => learnedSet.has(item.word)).length
            const learnedSounds = soundList.filter((item) => learnedSet.has(item.word)).length

            const totalItems = kanjiList.length + wordList.length + soundList.length
            const learnedItems = learnedKanji + learnedWords + learnedSounds
            const progress = totalItems > 0 ? Math.min(1, learnedItems / totalItems) : 0

            return {
                progress,
                totals: {
                    kanji: kanjiList.length,
                    words: wordList.length,
                    sound: soundList.length,
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
                soundList
            }
        } catch (err) {
            console.warn(`Unable to load level ${CURRENT_LEVEL} data`, err)
            return {
                progress: 0,
                totals: { kanji: 0, words: 0, sound: 0, total: 0 },
                learned: { kanji: 0, words: 0, sound: 0, total: 0 },
                kanjiList: [],
                wordList: [],
                soundList: []
            }
        }
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
        if (!pendingCards.length || metrics.dueNowCount === 0) {
            alert('No cards to review right now')
            return
        }
        // Filter only cards that are due now
        const dueCards = pendingCards.filter(card => {
            const nextReviewDate = parseDate(card.nextReview)
            return !card.nextReview || !nextReviewDate || nextReviewDate <= new Date()
        })
        navigate('/dashboard/srs-engine', { state: { questionsArray: dueCards } })
    }

    const handleKanjiClick = (item, index) => {
        navigate('/dashboard/kanji-detail', {
            state: {
                paramsData: item,
                wholeArr: levelData.kanjiList,
                itemIndex: index,
                title: item.kanji
            }
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: COLORS.brandPrimary }} />
                    <p style={{ color: COLORS.textPrimary }}>Loading your review queue...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        Unable to load your queue
                    </p>
                    <p className="mb-4" style={{ color: COLORS.textSecondary }}>
                        Tap below to try again.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const queueIsEmpty = metrics.totalPending === 0
    const nextDueLabel = metrics.nextDueDate
        ? (metrics.nextDueDate.getTime() - Date.now() <= 0 ? 'Due now' : formatRelative(metrics.nextDueDate))
        : 'Ready now'

    const lastReviewLabel = metrics.lastReviewDate ? formatRelative(metrics.lastReviewDate)?.replace(/^in\s*/, '').trim() : null

    const startButtonLabel = queueIsEmpty
        ? 'No cards to review'
        : metrics.dueNowCount
            ? `Review ${metrics.dueNowCount} due`
            : 'Review queue'

    const progressPercent = Math.round(levelData.progress * 100)

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header with refresh */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        SRS Review
                    </h1>
                    <p style={{ color: COLORS.textSecondary }}>
                        Spaced repetition system for long-term retention
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: COLORS.interactiveSurface }}
                >
                    <RefreshCw
                        className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`}
                        style={{ color: COLORS.brandPrimary }}
                    />
                </button>
            </div>

            {/* Level Progress Card */}
            <div className="p-6 md:p-8 rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Level {CURRENT_LEVEL}
                        </h2>
                        <p style={{ color: COLORS.textSecondary }}>
                            {levelData.learned.total} of {levelData.totals.total} items learned
                        </p>
                    </div>
                    <div
                        className="px-6 py-3 rounded-full text-2xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        {progressPercent}%
                    </div>
                </div>

                <div className="w-full rounded-full h-3 mb-6" style={{ backgroundColor: COLORS.interactiveSurface }}>
                    <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercent}%`,
                            background: `linear-gradient(90deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandSecondary} 100%)`
                        }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-sm font-medium mb-1" style={{ color: COLORS.kanjiHighlight }}>
                            KANJI
                        </div>
                        <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {levelData.learned.kanji}/{levelData.totals.kanji}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium mb-1" style={{ color: COLORS.cardWord }}>
                            WORDS
                        </div>
                        <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {levelData.learned.words}/{levelData.totals.words}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium mb-1" style={{ color: COLORS.cardSupport }}>
                            SOUNDS
                        </div>
                        <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {levelData.learned.sound}/{levelData.totals.sound || '—'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Queue Card */}
            <div
                className="p-6 md:p-8 rounded-2xl shadow-lg text-center"
                style={{
                    backgroundColor: COLORS.brandPrimary,
                    border: `2px solid ${COLORS.brandPrimaryDark}`
                }}
            >
                <div className="text-lg mb-2" style={{ color: COLORS.interactiveTextOnPrimary, opacity: 0.9 }}>
                    Review queue
                </div>
                <div className="text-7xl md:text-8xl font-bold mb-4" style={{ color: COLORS.interactiveTextOnPrimary }}>
                    {metrics.totalPending}
                </div>
                <div className="text-xl mb-4" style={{ color: COLORS.interactiveTextOnPrimary }}>
                    {queueIsEmpty ? 'All clear!' : metrics.dueNowCount ? 'Cards ready right now' : 'Scheduled and waiting'}
                </div>

                <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                    <div
                        className="px-4 py-2 rounded-full text-sm"
                        style={{ backgroundColor: COLORS.brandPrimaryDark, color: COLORS.interactiveTextOnPrimary }}
                    >
                        {nextDueLabel}
                    </div>
                    {lastReviewLabel && (
                        <div className="text-sm" style={{ color: COLORS.interactiveTextOnPrimary, opacity: 0.8 }}>
                            Last session {lastReviewLabel}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleStartReview}
                    disabled={queueIsEmpty || metrics.dueNowCount === 0}
                    className="w-full max-w-md mx-auto py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: COLORS.surface,
                        color: COLORS.brandPrimary
                    }}
                >
                    {startButtonLabel}
                </button>
            </div>

            {/* Kanji Preview Section */}
            {levelData.kanjiList.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                                Kanji
                            </h2>
                            <span
                                className="text-sm font-bold px-3 py-1 rounded-full"
                                style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                            >
                                {levelData.totals.kanji}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {levelData.kanjiList.map((item, index) => {
                            const isLearned = learnedSet.has(item.kanji)
                            const activeDots = isLearned ? LEVEL_PROGRESS_DOTS.length : 0

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleKanjiClick(item, index)}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="aspect-square w-full rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-2 p-2"
                                        style={{
                                            backgroundColor: COLORS.kanjiHighlight,
                                            color: COLORS.surface
                                        }}
                                    >
                                        {item.kanji}
                                    </div>
                                    <div className="flex space-x-1">
                                        {LEVEL_PROGRESS_DOTS.map((_, dotIndex) => (
                                            <div
                                                key={dotIndex}
                                                className="w-1 h-1 rounded-full"
                                                style={{
                                                    border: `1px solid ${COLORS.kanjiHighlight}`,
                                                    backgroundColor: dotIndex < activeDots ? COLORS.kanjiHighlight : 'transparent'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Words Preview Section */}
            {levelData.wordList.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                                Words
                            </h2>
                            <span
                                className="text-sm font-bold px-3 py-1 rounded-full"
                                style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                            >
                                {levelData.totals.words}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {levelData.wordList.map((item, index) => {
                            const isLearned = learnedSet.has(item.word)
                            const activeDots = isLearned ? LEVEL_PROGRESS_DOTS.length : 0

                            return (
                                <button
                                    key={index}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="aspect-square w-full rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-2 p-2"
                                        style={{
                                            backgroundColor: COLORS.cardWord,
                                            color: COLORS.surface
                                        }}
                                    >
                                        <span className={item.word.length > 3 ? 'text-lg md:text-xl' : ''}>
                                            {item.word}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1">
                                        {LEVEL_PROGRESS_DOTS.map((_, dotIndex) => (
                                            <div
                                                key={dotIndex}
                                                className="w-1 h-1 rounded-full"
                                                style={{
                                                    border: `1px solid ${COLORS.cardWord}`,
                                                    backgroundColor: dotIndex < activeDots ? COLORS.cardWord : 'transparent'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
