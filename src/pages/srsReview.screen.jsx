import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { RefreshCw, Play, Book, MessageSquare, Volume2 } from "lucide-react"
import COLORS from "../theme/colors"
import { LEVEL_SYSTEM_CONFIG, getLevelContent } from "../util/levelSystem"
import FIND_PENDING_FLASHCARDS from "../graphql/queries/findPendingCards.query"

const KANA_ONLY_REGEX = /^[\u3040-\u309F\u30A0-\u30FFー・\s]+$/

const isKanaOnly = (value) => {
    if (!value || typeof value !== 'string') return false
    const trimmed = value.trim()
    if (!trimmed) return false
    return KANA_ONLY_REGEX.test(trimmed)
}

export default function LocalQuiz() {
    const navigate = useNavigate()
    const [refreshing, setRefreshing] = useState(false)
    const userId = localStorage.getItem("userId") || "defaultUser"

    // Query pending flashcards
    const { data, loading, error, refetch } = useQuery(FIND_PENDING_FLASHCARDS, {
        variables: { userId }
    })

    const pendingCards = data?.getPendingFlashCards ?? []

    // Build learned set
    const learnedSet = useMemo(() => {
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

    // Get level data for level 10 (starting level)
    const currentLevel = 10
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
        navigate('/dashboard/quiz-engine', {
            state: { questionsArray: pendingCards }
        })
    }

    const formatCount = (learned, total) => {
        if (!total) return `${learned}/—`
        return `${learned}/${total}`
    }

    const currentLevelNumber = currentLevelSummary?.level ?? 10
    const currentLevelTotals = currentLevelSummary?.totals ?? { kanji: 0, words: 0, sound: 0, total: 0 }
    const currentLevelLearned = currentLevelSummary?.learned ?? { kanji: 0, words: 0, sound: 0, total: 0 }
    const currentProgressPercent = currentLevelSummary
        ? Math.round(currentLevelSummary.progress * 100)
        : 0
    const currentTotalItemsLabel = currentLevelTotals.total || '—'

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <RefreshCw className="w-12 h-12 animate-spin" style={{ color: COLORS.interactivePrimary }} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: COLORS.background }}>
                <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Unable to load your queue
                </h2>
                <p className="text-sm mb-4" style={{ color: COLORS.interactiveTextInactive }}>
                    Tap below to try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-3 rounded-xl font-bold"
                    style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Level Progress Card */}
            {currentLevelSummary && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                                Level {currentLevelNumber}
                            </h2>
                            <p className="text-sm" style={{ color: COLORS.interactiveTextInactive }}>
                                {currentLevelLearned.total} of {currentTotalItemsLabel} items learned
                            </p>
                        </div>
                        <div className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.interactivePrimary }}>
                            <span className="font-bold text-sm" style={{ color: COLORS.interactiveTextOnPrimary }}>
                                {currentProgressPercent}%
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 rounded-full mb-4" style={{ backgroundColor: COLORS.interactiveSurface }}>
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ backgroundColor: COLORS.interactivePrimary, width: `${currentProgressPercent}%` }}
                        />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase mb-1" style={{ color: COLORS.cardKanji }}>
                                <Book className="inline w-3 h-3 mr-1" />
                                Kanji
                            </p>
                            <p className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                {formatCount(currentLevelLearned.kanji, currentLevelTotals.kanji)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase mb-1" style={{ color: COLORS.cardWord }}>
                                <MessageSquare className="inline w-3 h-3 mr-1" />
                                Words
                            </p>
                            <p className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                {formatCount(currentLevelLearned.words, currentLevelTotals.words)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase mb-1" style={{ color: COLORS.cardSupport }}>
                                <Volume2 className="inline w-3 h-3 mr-1" />
                                Sounds
                            </p>
                            <p className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                {formatCount(currentLevelLearned.sound, currentLevelTotals.sound)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Queue Card */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.interactivePrimary }}>
                <h2 className="text-base font-medium mb-2" style={{ color: COLORS.interactiveTextOnPrimary, opacity: 0.8 }}>
                    Review queue
                </h2>
                <p className="text-5xl font-bold mb-2" style={{ color: COLORS.interactiveTextOnPrimary }}>
                    {pendingCards.length}
                </p>
                <p className="text-lg mb-4" style={{ color: COLORS.interactiveTextOnPrimary }}>
                    {pendingCards.length === 0 ? 'All clear!' : 'Cards ready right now'}
                </p>

                <button
                    onClick={handleStartReview}
                    disabled={pendingCards.length === 0}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.interactivePrimary }}
                >
                    <Play className="w-5 h-5" />
                    {pendingCards.length === 0 ? 'No cards to review' : `Review ${pendingCards.length} cards`}
                </button>
            </div>

            {/* Refresh Button */}
            <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
            >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Queue'}
            </button>
        </div>
    )
}
