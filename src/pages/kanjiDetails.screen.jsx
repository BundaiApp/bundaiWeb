import { useState, useEffect, useCallback, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import COLORS from "../theme/colors"
import ADD_FLASHCARD from "../graphql/mutations/addFlashCard.mutation"

const ensureArray = (value) => {
    if (!value) return []
    return Array.isArray(value) ? value.filter(Boolean) : [value]
}

const formatMetaLabel = (label, value) => {
    if (!value && value !== 0) return null
    return `${label} ${value}`
}

const Chip = ({ label, variant = "default" }) => {
    if (!label) return null

    const styles = {
        default: {
            backgroundColor: COLORS.interactiveSurface,
            color: COLORS.textPrimary
        },
        primary: {
            backgroundColor: COLORS.kanjiHighlight,
            color: COLORS.surface
        },
        reading: {
            backgroundColor: COLORS.interactiveSurfaceActive,
            color: COLORS.surface
        }
    }

    const style = styles[variant] || styles.default

    return (
        <span
            className="inline-block px-3 py-1.5 rounded-xl mr-2 mb-2 font-medium text-sm"
            style={style}
        >
            {label}
        </span>
    )
}

export default function KanjiDetails() {
    const location = useLocation()
    const navigate = useNavigate()
    const params = location.state || {}

    const { wholeArr = [], itemIndex = 0, isWord, isKana } = params
    const [currentIndex, setCurrentIndex] = useState(itemIndex)
    const item = wholeArr[currentIndex] || {}

    // Get userId from localStorage
    const userId = localStorage.getItem("userId") || ""

    // Track which indices have been added to prevent duplicates
    const addedIndices = useRef(new Set())

    // Mutation
    const [addFlashCard] = useMutation(ADD_FLASHCARD)

    // Add flashcard function
    const addCard = useCallback(
        async (cardItem, index) => {
            if (!userId || !cardItem || addedIndices.current.has(index)) return

            // Mark this index as added
            addedIndices.current.add(index)

            try {
                await addFlashCard({
                    variables: {
                        userId,
                        kanjiName: isWord ? cardItem.kanji : cardItem.kanjiName,
                        hiragana: isKana ? '' : isWord ? cardItem.hiragana : cardItem.on?.[0] || '',
                        meanings: isWord ? ensureArray(cardItem.meaning || cardItem.meanings) : ensureArray(cardItem.meanings),
                        quizAnswers: cardItem.quizAnswers || []
                    }
                })
            } catch (error) {
                console.error("Failed to add flashcard:", error)
            }
        },
        [addFlashCard, userId, isWord, isKana]
    )

    useEffect(() => {
        setCurrentIndex(itemIndex)
    }, [itemIndex])

    // Add flashcard only when currentIndex changes
    useEffect(() => {
        const currentItem = wholeArr[currentIndex]
        if (currentItem && userId) {
            addCard(currentItem, currentIndex)
        }
    }, [currentIndex, wholeArr, userId, addCard])

    const glyph = item?.kanjiName || item?.kanji || ''
    const meanings = ensureArray(item?.meanings || item?.meaning).slice(0, 8)
    const onyomi = ensureArray(item?.on).slice(0, 6)
    const kunyomi = ensureArray(item?.kun).slice(0, 6)
    const similars = Array.isArray(item?.similars) ? item.similars.slice(0, 4) : []
    const usedIn = Array.isArray(item?.usedIn) ? item.usedIn.slice(0, 6) : []

    const jlptLabel = item?.jlpt ? `JLPT N${item.jlpt}` : null
    const gradeLabel = formatMetaLabel('Grade', item?.grade)
    const strokesLabel = formatMetaLabel('Strokes', item?.strokes)
    const frequencyLabel = item?.freq ? `Freq ${item.freq}` : null

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < wholeArr.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="sticky top-0 z-20 p-4 flex items-center justify-between" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                    >
                        <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                    </button>
                    <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                        {glyph}
                    </h1>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                        <ChevronLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                    </button>
                    <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                        {currentIndex + 1} / {wholeArr.length}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === wholeArr.length - 1}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                        <ChevronRight className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6 pb-24">
                {/* Kanji Glyph */}
                <div className="text-center mb-8">
                    <div className="text-8xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        {glyph}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[jlptLabel, gradeLabel, strokesLabel, frequencyLabel]
                            .filter(Boolean)
                            .map((label) => (
                                <span
                                    key={label}
                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: COLORS.interactiveSurface,
                                        color: COLORS.interactiveTextInactive
                                    }}
                                >
                                    {label}
                                </span>
                            ))}
                    </div>
                </div>

                {/* Meanings */}
                {meanings.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                            Meanings
                        </h2>
                        <div className="flex flex-wrap">
                            {meanings.map((meaning) => (
                                <Chip key={`meaning-${meaning}`} label={meaning} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Onyomi */}
                {onyomi.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                            Onyomi
                        </h2>
                        <div className="flex flex-wrap">
                            {onyomi.map((reading) => (
                                <Chip key={`onyomi-${reading}`} label={reading} variant="reading" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Kunyomi */}
                {kunyomi.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                            Kunyomi
                        </h2>
                        <div className="flex flex-wrap">
                            {kunyomi.map((reading) => (
                                <Chip key={`kunyomi-${reading}`} label={reading} variant="reading" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Used In */}
                {usedIn.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                            Used In
                        </h2>
                        <div className="space-y-3">
                            {usedIn.map((word, index) => (
                                <div
                                    key={`${word.kanji || word.word || index}`}
                                    className="flex justify-between items-start p-4 rounded-xl"
                                    style={{ backgroundColor: COLORS.interactiveSurface }}
                                >
                                    <div className="max-w-[40%]">
                                        <div className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                            {word.kanji || word.word}
                                        </div>
                                        {word.reading && (
                                            <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
                                                {word.reading}
                                            </div>
                                        )}
                                    </div>
                                    {word.meaning && (
                                        <div className="flex-1 ml-4 text-sm" style={{ color: COLORS.textPrimary }}>
                                            {word.meaning}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Kanjis */}
                {similars.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                            Similar Kanjis
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {similars.map((similar) => (
                                <div
                                    key={`${similar.kanji}-${similar.meaning}`}
                                    className="p-4 rounded-xl text-center"
                                    style={{ backgroundColor: COLORS.kanjiHighlight }}
                                >
                                    <div className="text-2xl font-bold mb-2" style={{ color: COLORS.surface }}>
                                        {similar.kanji}
                                    </div>
                                    {similar.meaning && (
                                        <div className="text-xs opacity-85" style={{ color: COLORS.surface }}>
                                            {similar.meaning}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {item?.fallback && (
                    <p className="text-center text-xs" style={{ color: COLORS.interactiveTextInactive }}>
                        Full details unavailable for this kanji.
                    </p>
                )}
            </div>
        </div>
    )
}

