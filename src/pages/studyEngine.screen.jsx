import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import COLORS from "../theme/colors"
import { getLevelContent } from "../util/levelSystem"
import ADD_FLASH_CARD from "../graphql/mutations/addFlashCard.mutation"
import CALCULATE_NEXT_REVIEW_DATE from "../graphql/mutations/calculateNextReviewDate.mutation"
import ME_QUERY from "../graphql/queries/me.query"

export default function StudyEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionsArray = [] } = location.state || {}

    const userId = localStorage.getItem("userId") || ""

    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [serverCards, setServerCards] = useState(questionsArray)

    const [addFlashCard] = useMutation(ADD_FLASH_CARD)
    const [calculateNextReviewDate] = useMutation(CALCULATE_NEXT_REVIEW_DATE)

    const { data: userData, loading: userLoading } = useQuery(ME_QUERY, {
        variables: { _id: userId },
        skip: !userId,
        fetchPolicy: "network-only"
    })

    const currentLevel = userData?.me?.currentLevel || 10

    const levelContent = useMemo(() => {
        try {
            return getLevelContent(currentLevel)
        } catch (error) {
            console.error("Error getting level content:", error)
            return { kanji: [], words: [] }
        }
    }, [currentLevel])

    const getKanjiDetails = (kanjiName) => {
        return levelContent.kanji.find(k => k.kanjiName === kanjiName)
    }

    const currentCard = serverCards[currentIndex]
    const isKanji = currentCard?.kanjiName?.length === 1
    const kanjiDetails = isKanji ? getKanjiDetails(currentCard?.kanjiName) : null

    // Create the flashcard on server when first viewed (if it doesn't have an _id)
    useEffect(() => {
        const createCard = async () => {
            if (!currentCard || !userId || userLoading) return

            // Card already exists on server — just update rating
            if (currentCard._id) {
                if ((currentCard.rating || 0) === 0) {
                    setLoading(true)
                    try {
                        await calculateNextReviewDate({
                            variables: {
                                userId,
                                id: currentCard._id,
                                rating: 1
                            }
                        })
                        const updated = [...serverCards]
                        updated[currentIndex] = { ...updated[currentIndex], rating: 1 }
                        setServerCards(updated)
                    } catch (error) {
                        console.error("Error updating card rating:", error)
                    } finally {
                        setLoading(false)
                    }
                }
                return
            }

            // Local card — create on server via addFlashCard
            setLoading(true)
            try {
                const hiragana = currentCard.hiragana || currentCard.kun?.[0] || currentCard.reading || ""
                const meanings = currentCard.meanings || (currentCard.meaning ? [currentCard.meaning] : [])
                const quizAnswers = currentCard.quizAnswers || meanings
                const kanjiName = currentCard.kanjiName || currentCard.kanji || ""

                const result = await addFlashCard({
                    variables: {
                        userId,
                        kanjiName,
                        hiragana: Array.isArray(hiragana) ? "" : hiragana,
                        meanings,
                        quizAnswers,
                        level: currentLevel,
                        source: "level"
                    }
                })

                const created = result?.data?.addFlashCard
                const newCardId = created?._id

                // Update rating to 1 so card moves to review queue
                if (newCardId) {
                    try {
                        await calculateNextReviewDate({
                            variables: {
                                userId,
                                id: newCardId,
                                rating: 1
                            }
                        })
                    } catch (error) {
                        console.error("Error updating card rating:", error)
                    }
                }

                const updated = [...serverCards]
                updated[currentIndex] = {
                    ...updated[currentIndex],
                    _id: newCardId,
                    rating: 1
                }
                setServerCards(updated)
            } catch (error) {
                console.error("Error creating flashcard:", error)
            } finally {
                setLoading(false)
            }
        }

        createCard()
    }, [currentIndex, currentCard?.kanjiName, userId, userLoading]) // eslint-disable-line

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < serverCards.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            navigate('/dashboard/srs')
        }
    }

    if (!currentCard) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No cards to study
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/srs')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="flex items-center justify-center gap-4 py-4 px-4" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.interactiveBorder}` }}>
                <div className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                    {currentIndex + 1} / {serverCards.length}
                </div>
                {loading && (
                    <div className="w-5 h-5 rounded-full border-2 border-t-2"
                        style={{
                            borderColor: COLORS.brandPrimary,
                            borderTopColor: 'transparent',
                            animation: 'spin 1s linear infinite'
                        }}
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {isKanji && kanjiDetails ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            className="text-8xl font-bold mb-4 p-6 rounded-2xl"
                            style={{ color: COLORS.textPrimary }}
                        >
                            {kanjiDetails.kanji}
                        </div>

                        {kanjiDetails.on && (
                            <div className="text-center">
                                <div className="text-xs uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Onyomi
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {kanjiDetails.on.join(', ')}
                                </div>
                            </div>
                        )}

                        {kanjiDetails.kun && (
                            <div className="text-center">
                                <div className="text-xs uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Kunyomi
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {kanjiDetails.kun.join(', ')}
                                </div>
                            </div>
                        )}

                        {kanjiDetails.meanings && kanjiDetails.meanings.length > 0 && (
                            <div className="text-center">
                                <div className="text-xs uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Meaning
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {kanjiDetails.meanings.join(', ')}
                                </div>
                            </div>
                        )}

                        {kanjiDetails.strokes && (
                            <div className="text-center">
                                <div className="text-xs uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Strokes
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {kanjiDetails.strokes}
                                </div>
                            </div>
                        )}

                        {kanjiDetails.radical && (
                            <div className="text-center">
                                <div className="text-xs uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Radical
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {kanjiDetails.radical}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div
                            className="text-5xl font-bold mb-4 p-6 rounded-2xl text-center"
                            style={{ color: COLORS.textPrimary }}
                        >
                            {currentCard.kanjiName}
                        </div>
                        {(currentCard.hiragana || currentCard.reading) && (
                            <div className="text-center">
                                <div className="text-sm uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Reading
                                </div>
                                <div className="text-2xl" style={{ color: COLORS.textPrimary }}>
                                    {currentCard.hiragana || currentCard.reading}
                                </div>
                            </div>
                        )}
                        {(currentCard.meanings?.length > 0 || currentCard.meaning) && (
                            <div className="text-center">
                                <div className="text-sm uppercase mb-1" style={{ color: COLORS.textSecondary }}>
                                    Meaning
                                </div>
                                <div className="text-xl" style={{ color: COLORS.textPrimary }}>
                                    {currentCard.meanings?.[0] || currentCard.meaning}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Button Container */}
            <div className="px-4 py-4" style={{ backgroundColor: COLORS.surface, borderTop: `1px solid ${COLORS.interactiveBorder}` }}>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: currentIndex === 0 ? COLORS.interactiveSurface : COLORS.brandPrimary,
                            color: currentIndex === 0 ? COLORS.interactiveTextInactive : COLORS.surface
                        }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.surface }}
                    >
                        {currentIndex === serverCards.length - 1 ? 'Finish' : (
                            <>
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
