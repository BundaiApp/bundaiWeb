import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@apollo/client/react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, Play, Book, MessageSquare, Volume2, Zap } from "lucide-react"
import COLORS from "../theme/colors"
import { LEVEL_SYSTEM_CONFIG, getLevelContent } from "../util/levelSystem"
import { arr as jlptKanjiData } from "../util/jlptArray"
import FIND_PENDING_FLASHCARDS from "../graphql/queries/findPendingCards.query"
import GET_FLASHCARDS_BY_LEVEL from "../graphql/queries/getFlashCardsByLevel.query"
import ME_QUERY from "../graphql/queries/me.query"

export default function SRS() {
    const navigate = useNavigate()
    const [refreshing, setRefreshing] = useState(false)
    const [currentLevel, setCurrentLevel] = useState(10)
    const userId = localStorage.getItem("userId") || "defaultUser"

    const isGuest = !userId || userId === "defaultUser"

    const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(ME_QUERY, {
        variables: { _id: userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if (userData?.me?.currentLevel) {
            setCurrentLevel(userData.me.currentLevel)
        }
    }, [userData])

    const { data: levelCardsData, loading: levelLoading, refetch: refetchLevelCards } = useQuery(GET_FLASHCARDS_BY_LEVEL, {
        variables: { userId, level: currentLevel },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    const { data: pendingData, refetch: refetchPending } = useQuery(FIND_PENDING_FLASHCARDS, {
        variables: { userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    const kanjiLookup = useMemo(() => {
        const lookup = new Map()
        jlptKanjiData.forEach((item) => {
            if (item?.kanjiName) {
                lookup.set(item.kanjiName, item)
            }
        })
        return lookup
    }, [])

    const jlptDataMap = useMemo(() => {
        const map = { 1: [], 2: [], 3: [], 4: [], 5: [] }
        jlptKanjiData.forEach((item) => {
            if (item?.jlpt && map[item.jlpt]) {
                map[item.jlpt].push(item)
            }
        })
        return map
    }, [])

    const localLevelContent = useMemo(() => {
        try {
            return getLevelContent(currentLevel, jlptDataMap)
        } catch (error) {
            console.error("Error getting local level content:", error)
            return { kanji: [], words: [] }
        }
    }, [currentLevel, jlptDataMap])

    const displayKanji = useMemo(() => {
        if (!levelCardsData?.getFlashCardsByLevel) return []
        return levelCardsData.getFlashCardsByLevel
            .filter((card) => card.kanjiName && card.kanjiName.length === 1)
            .map((card) => {
                const localKanji = kanjiLookup.get(card.kanjiName)

                if (!localKanji) {
                    return card
                }

                return {
                    ...localKanji,
                    ...card,
                    kanji: localKanji.kanjiName,
                    kanjiName: localKanji.kanjiName,
                    meanings: localKanji.meanings || card.meanings || [],
                    quizAnswers: localKanji.quizAnswers || card.quizAnswers || [],
                    on: localKanji.on || [],
                    kun: localKanji.kun || [],
                    usedIn: localKanji.usedIn || [],
                    similars: localKanji.similars || [],
                    jlpt: localKanji.jlptLevel,
                    grade: localKanji.grade,
                    strokes: localKanji.strokes,
                    freq: localKanji.frequency,
                }
            })
    }, [kanjiLookup, levelCardsData])

    const displayWords = useMemo(() => {
        if (!levelCardsData?.getFlashCardsByLevel) return []
        return levelCardsData.getFlashCardsByLevel.filter(
            (card) => card.kanjiName && card.kanjiName.length > 1
        )
    }, [levelCardsData])

    const studyQueueCards = useMemo(() => {
        const allCurrentLevelCards = [...displayKanji, ...displayWords]
        return allCurrentLevelCards.filter((card) => (card.rating || 0) === 0)
    }, [displayKanji, displayWords])

    // Study count: total level content minus cards already saved to backend
    const levelTotal = (localLevelContent.kanji?.length || 0) + (localLevelContent.words?.length || 0)
    const savedCount = displayKanji.length + displayWords.length
    const effectiveStudyCount = studyQueueCards.length > 0
        ? studyQueueCards.length
        : Math.max(0, levelTotal - savedCount)

    const reviewQueueCards = useMemo(() => {
        if (!pendingData?.getPendingFlashCards) return []
        return pendingData.getPendingFlashCards.filter(
            (card) => (card.rating || 0) > 0
        )
    }, [pendingData])

    const studyCount = effectiveStudyCount
    const reviewCount = reviewQueueCards.length

    const levelProgress = useMemo(() => {
        const allCards = [...displayKanji, ...displayWords]
        const totalRating = allCards.reduce((sum, card) => {
            const rating = card.rating || 0
            return sum + rating
        }, 0)

        const maxPossibleRating = allCards.length * 7
        const progressPercentage =
            maxPossibleRating > 0 ? (totalRating / maxPossibleRating) * 100 : 0
        return Math.round(progressPercentage)
    }, [displayKanji, displayWords])

    const handleRefresh = async () => {
        try {
            setRefreshing(true)
            await Promise.all([refetchUser(), refetchLevelCards(), refetchPending()])
        } finally {
            setRefreshing(false)
        }
    }

    const handleStartStudy = () => {
        if (isGuest) {
            alert("Please sign in to use this feature")
            return
        }

        let cards = studyQueueCards
        if (cards.length === 0) {
            // Generate from local level content — cards will be created on server as user studies
            const content = localLevelContent
            if (!content.kanji?.length && !content.words?.length) {
                alert("No content available for this level.")
                return
            }

            // Get already saved kanji and words
            const savedKanjiNames = new Set(displayKanji.map(c => c.kanjiName))
            const savedWordNames = new Set(displayWords.map(c => c.kanjiName))

            const generated = [
                    ...(content.kanji || []).map((k) => ({
                        kanjiName: k.kanji || k.kanjiName,
                        hiragana: k.kun?.[0] || k.reading || "",
                        meanings: k.meanings || [k.meaning || ""],
                        quizAnswers: k.quizAnswers || k.meanings || [k.meaning || ""],
                        kun: k.kun,
                        on: k.on,
                        strokes: k.strokes,
                        kanji: k.kanji || k.kanjiName,
                    })),
                    ...(content.words || []).map((w) => ({
                        kanjiName: w.word || w.kanjiName || "",
                        hiragana: w.reading || "",
                        meanings: [w.meaning || ""],
                        quizAnswers: w.quizAnswers || [w.meaning || ""],
                        reading: w.reading,
                        meaning: w.meaning,
                    }))
                ]
                .filter((c) => c.kanjiName && c.meanings[0])
                .filter((c) => {
                    // Filter out cards that are already saved to server
                    if (c.kanjiName.length === 1) {
                        return !savedKanjiNames.has(c.kanjiName)
                    }
                    return !savedWordNames.has(c.kanjiName)
                })

                if (generated.length === 0) {
                    alert("No new cards to study! All cards in this level have been reviewed.")
                    return
                }
                cards = generated
        }

        navigate("/dashboard/study-engine", { state: { questionsArray: cards } })
    }

    const handleStartReview = () => {
        if (isGuest) {
            alert("Please sign in to use this feature")
            return
        }
        if (reviewQueueCards.length === 0) {
            alert("No cards due for review!")
            return
        }
        navigate("/dashboard/srs-engine", { state: { questionsArray: reviewQueueCards } })
    }

    const handleViewAllLevels = () => {
        navigate("/dashboard/levels")
    }

    const handleKanjiClick = (item, index) => {
        navigate("/dashboard/kanji-detail", {
            state: {
                paramsData: item,
                wholeArr: displayKanji,
                itemIndex: index,
                title: item.kanjiName
            }
        })
    }


    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Level Progress Card */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                            Level {currentLevel}
                        </h2>
                        <p className="text-sm" style={{ color: COLORS.interactiveTextInactive }}>
                            {levelProgress}% complete
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.brandPrimary }}>
                        <span className="font-bold text-sm" style={{ color: COLORS.interactiveTextOnPrimary }}>
                            {levelProgress}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 rounded-full mb-4" style={{ backgroundColor: COLORS.interactiveSurface }}>
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ backgroundColor: COLORS.brandPrimary, width: `${levelProgress}%` }}
                    />
                </div>
            </div>

            {/* Level Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => navigate("/dashboard/level-test")}
                    className="flex-1 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                >
                    <Zap className="w-4 h-4" />
                    Skip Level
                </button>
                <button
                    onClick={handleViewAllLevels}
                    className="flex-1 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: COLORS.cardWord, color: COLORS.surface }}
                >
                    View all levels
                </button>
            </div>

            {isGuest ? (
                <div className="rounded-2xl p-6 text-center shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                    <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        Track Your Progress
                    </h2>
                    <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
                        Sign up to use spaced repetition and master kanji & vocabulary
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Sign Up
                    </button>
                </div>
            ) : (
                <>
                    {/* Queue Cards Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Study Queue */}
                        <div
                            className="rounded-2xl p-6 shadow-lg text-center"
                            style={{ backgroundColor: COLORS.surface, opacity: studyCount === 0 ? 0.9 : 1 }}
                        >
                            <div className="text-5xl font-bold mb-2" style={{ color: COLORS.brandPrimary }}>
                                {studyCount}
                            </div>
                            <div className="text-base font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                                Study queue
                            </div>
                            <button
                                onClick={handleStartStudy}
                                className="w-full py-3 rounded-xl font-bold transition-all duration-300"
                                style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                            >
                                Study
                            </button>
                        </div>

                        {/* Review Queue */}
                        <div className="rounded-2xl p-6 shadow-lg text-center" style={{ backgroundColor: COLORS.surface }}>
                            <div className="text-5xl font-bold mb-2" style={{ color: COLORS.brandPrimary }}>
                                {reviewCount}
                            </div>
                            <div className="text-base font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                                Review queue
                            </div>
                            <button
                                onClick={handleStartReview}
                                className="w-full py-3 rounded-xl font-bold transition-all duration-300"
                                style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                            >
                                Review
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Kanji Section */}
            {displayKanji.length > 0 && (
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                            Kanji
                        </h2>
                        <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                        >
                            {displayKanji.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {displayKanji.map((card, index) => {
                            const rating = card.rating || 0
                            const isBurned = card.burned
                            const activeDots = isBurned ? 7 : rating

                            return (
                                <button
                                    key={`${card.kanjiName}-${index}`}
                                    onClick={() => handleKanjiClick(card, index)}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="aspect-square w-full rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-2 p-2"
                                        style={{
                                            backgroundColor: isBurned ? COLORS.interactiveTextInactive : 'transparent',
                                            border: `2px solid ${COLORS.cardKanji}`,
                                            color: isBurned ? COLORS.surface : COLORS.textPrimary
                                        }}
                                    >
                                        {card.kanjiName}
                                    </div>
                                    {!isBurned && (
                                        <div className="flex space-x-1">
                                            {Array.from({ length: 7 }).map((_, dotIndex) => (
                                                <div
                                                    key={dotIndex}
                                                    className="w-1 h-1 rounded-full"
                                                    style={{
                                                        border: `1px solid ${COLORS.cardKanji}`,
                                                        backgroundColor: dotIndex < activeDots ? COLORS.cardKanji : 'transparent'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Words Section */}
            {displayWords.length > 0 && (
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                            Words
                        </h2>
                        <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                        >
                            {displayWords.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {displayWords.map((card, index) => {
                            const rating = card.rating || 0
                            const isBurned = card.burned
                            const activeDots = isBurned ? 7 : rating
                            const isLongWord = (card.kanjiName?.length ?? 0) > 4

                            return (
                                <button
                                    key={`${card.kanjiName}-${index}`}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="aspect-square w-full rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-2 p-2"
                                        style={{
                                            backgroundColor: isBurned ? COLORS.interactiveTextInactive : 'transparent',
                                            border: `2px solid ${COLORS.cardWord}`,
                                            color: isBurned ? COLORS.surface : COLORS.textPrimary
                                        }}
                                    >
                                        <span className={isLongWord ? 'text-lg md:text-xl' : ''}>
                                            {card.kanjiName}
                                        </span>
                                    </div>
                                    {!isBurned && (
                                        <div className="flex space-x-1">
                                            {Array.from({ length: 7 }).map((_, dotIndex) => (
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
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Refresh Button */}
            {!isGuest && (
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Queue'}
                </button>
            )}
        </div>
    )
}
