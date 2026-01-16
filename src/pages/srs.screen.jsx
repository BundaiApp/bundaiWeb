import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@apollo/client/react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, Play, Book, MessageSquare, Volume2 } from "lucide-react"
import COLORS from "../theme/colors"
import { LEVEL_SYSTEM_CONFIG } from "../util/levelSystem"
import FIND_PENDING_FLASHCARDS from "../graphql/queries/findPendingCards.query"
import GET_FLASHCARDS_BY_LEVEL from "../graphql/queries/getFlashCardsByLevel.query"
import ME_QUERY from "../graphql/queries/me.query"

export default function SRS() {
    const navigate = useNavigate()
    const [refreshing, setRefreshing] = useState(false)
    const [currentLevel, setCurrentLevel] = useState(10)
    const userId = localStorage.getItem("userId") || "defaultUser"

    const isGuest = !userId || userId === "defaultUser"

    const { data: userData, refetch: refetchUser } = useQuery(ME_QUERY, {
        variables: { _id: userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if (userData?.me?.currentLevel) {
            setCurrentLevel(userData.me.currentLevel)
        }
    }, [userData])

    const { data: pendingData, loading: pendingLoading, error: pendingError, refetch: refetchPending } = useQuery(FIND_PENDING_FLASHCARDS, {
        variables: { userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    const { data: levelCardsData, loading: levelLoading, refetch: refetchLevelCards } = useQuery(GET_FLASHCARDS_BY_LEVEL, {
        variables: { userId, level: currentLevel },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    const displayKanji = useMemo(() => {
        if (!levelCardsData?.getFlashCardsByLevel) return []
        return levelCardsData.getFlashCardsByLevel.filter(
            (card) => card.kanjiName && card.kanjiName.length === 1
        )
    }, [levelCardsData])

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

    const reviewQueueCards = useMemo(() => {
        if (!pendingData?.getPendingFlashCards) return []
        return pendingData.getPendingFlashCards.filter(
            (card) => (card.rating || 0) > 0
        )
    }, [pendingData])

    const studyCount = studyQueueCards.length
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
            await Promise.all([refetchUser(), refetchPending(), refetchLevelCards()])
        } finally {
            setRefreshing(false)
        }
    }

    const handleStartStudy = () => {
        if (isGuest) {
            alert("Please sign in to use this feature")
            return
        }
        if (studyQueueCards.length === 0) {
            alert("No cards to study!")
            return
        }
        navigate("/dashboard/study-engine", { state: { questionsArray: studyQueueCards } })
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

    const loading = pendingLoading || levelLoading
    const error = pendingError

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
                    onClick={() => refetchPending()}
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

            {/* View All Levels Button */}
            <button
                onClick={handleViewAllLevels}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300"
                style={{ backgroundColor: COLORS.cardWord, color: COLORS.surface }}
            >
                View all levels
            </button>

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
