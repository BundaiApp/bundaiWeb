import { useState, useEffect, useCallback, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Volume2, Image as ImageIcon } from "lucide-react"
import { toRomaji } from "wanakana"
import COLORS from "../theme/colors"
import ADD_FLASHCARD from "../graphql/mutations/addFlashCard.mutation"

const ensureArray = (value) => {
    if (!value) return []
    return Array.isArray(value) ? value.filter(Boolean) : [value]
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
    const [showAllMeanings, setShowAllMeanings] = useState(false)

    const userId = localStorage.getItem("userId") || ""

    const [addFlashCard] = useMutation(ADD_FLASHCARD)

    const addedIndices = useRef(new Set())

    const playAudio = useCallback((text) => {
        if (!text) return
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
    }, [])

    const addCard = useCallback(
        async (cardItem, index) => {
            if (!userId || !cardItem || addedIndices.current.has(index)) return

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

    useEffect(() => {
        const currentItem = wholeArr[currentIndex]
        if (currentItem && userId) {
            addCard(currentItem, currentIndex)
        }
    }, [currentIndex, wholeArr, userId, addCard])

    const glyph = item?.kanjiName || item?.kanji || ''
    const meanings = ensureArray(item?.meanings || item?.meaning).slice(0, 8)
    const onyomi = ensureArray(item?.on || item?.onyomi).slice(0, 6)
    const kunyomi = ensureArray(item?.kun || item?.kunyomi).slice(0, 6)
    const hiragana = item?.reading || item?.hiragana || onyomi[0] || kunyomi[0] || ''
    const similars = Array.isArray(item?.similars) ? item.similars.slice(0, 4) : []
    const usedIn = Array.isArray(item?.usedIn) ? item.usedIn.slice(0, 6) : []

    const formatMetaLabel = (label, value) => {
        if (!value && value !== 0) return null
        return `${label} ${value}`
    }

    const jlptLabel = item?.jlpt ? `JLPT N${item.jlpt}` : null
    const gradeLabel = formatMetaLabel('Grade', item?.grade)
    const strokesLabel = formatMetaLabel('Strokes', item?.strokes)
    const frequencyLabel = item?.freq ? `Freq ${item.freq}` : null
    const romaji = item?.romaji || (hiragana ? toRomaji(hiragana) : null)

    const displayMeanings = showAllMeanings ? meanings : meanings.slice(0, 4)
    const displayOnyomi = onyomi.length > 3 ? onyomi.slice(0, 3) : onyomi
    const displayKunyomi = kunyomi.length > 3 ? kunyomi.slice(0, 3) : kunyomi
    const displayUsedIn = usedIn.length > 4 ? usedIn.slice(0, 4) : usedIn
    const displaySimilars = similars.length > 4 ? similars.slice(0, 4) : similars

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
            <div className="sticky top-0 z-20 p-4 flex items-center justify-between" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                >
                    <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                </button>
                <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                    {glyph}
                </h1>
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

            <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24 space-y-4">
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="text-9xl md:text-[10rem] font-bold text-center" style={{ color: COLORS.textPrimary }}>
                                    {glyph}
                                </div>
                                {glyph && (
                                    <button
                                        onClick={() => playAudio(glyph)}
                                        className="p-3 rounded-xl hover:bg-black/10 transition-colors"
                                        style={{ color: COLORS.textSecondary }}
                                    >
                                        <Volume2 className="w-8 h-8" />
                                    </button>
                                )}
                            </div>
                            {(hiragana || romaji) && (
                                <div className="flex items-center gap-3 mb-4">
                                    {hiragana && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => playAudio(hiragana)}
                                                className="p-1 rounded-lg hover:bg-black/10 transition-colors"
                                                style={{ color: COLORS.textSecondary }}
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                            <span className="text-2xl font-medium" style={{ color: COLORS.textPrimary }}>
                                                {hiragana}
                                            </span>
                                        </div>
                                    )}
                                    {romaji && hiragana && (
                                        <span style={{ color: COLORS.divider }}>•</span>
                                    )}
                                    {romaji && (
                                        <span className="text-xl" style={{ color: COLORS.textSecondary }}>
                                            {romaji}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center gap-2">
                                {[jlptLabel, gradeLabel, strokesLabel, frequencyLabel]
                                    .filter(Boolean)
                                    .map((label) => (
                                        <span
                                            key={label}
                                            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
                                            style={{
                                                backgroundColor: COLORS.interactiveSurface,
                                                color: COLORS.interactiveTextInactive
                                            }}
                                        >
                                            {label}
                                        </span>
                                    ))}
                            </div>
                            {userId && !isKana && (
                                <button
                                    className="mt-4 px-4 py-2 rounded-xl font-bold transition-all duration-300"
                                    style={{
                                        backgroundColor: COLORS.brandPrimary,
                                        color: COLORS.interactiveTextOnPrimary
                                    }}
                                    onClick={() => addCard(item, currentIndex)}
                                >
                                    Add to Flashcards
                                </button>
                            )}
                        </div>
                        {item?.image && (
                            <div className="w-full md:w-48 aspect-square flex items-center justify-center rounded-xl overflow-hidden" style={{ backgroundColor: COLORS.interactiveSurface }}>
                                <img
                                    src={`/images/${item.image}.png`}
                                    alt={glyph}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        const fallbackPaths = [item.image.toLowerCase()]
                                        e.target.src = `/images/${fallbackPaths[0].toLowerCase()}.png`
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {(onyomi.length > 0 || kunyomi.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {onyomi.length > 0 && (
                                <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.interactiveSurface }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-bold uppercase" style={{ color: COLORS.textSecondary }}>
                                            Onyomi
                                        </div>
                                        <button
                                            onClick={() => playAudio(onyomi[0])}
                                            className="p-1 rounded hover:bg-black/10 transition-colors"
                                            style={{ color: COLORS.textSecondary }}
                                        >
                                            <Volume2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayOnyomi.map((reading) => (
                                            <Chip key={`onyomi-${reading}`} label={reading} variant="reading" />
                                        ))}
                                    </div>
                                    {onyomi.length > 3 && (
                                        <button
                                            onClick={() => setShowAllMeanings(prev => !prev)}
                                            className="text-xs mt-2 underline"
                                            style={{ color: COLORS.interactivePrimary }}
                                        >
                                            Show {showAllMeanings ? 'less' : 'all'}
                                        </button>
                                    )}
                                </div>
                            )}
                            {kunyomi.length > 0 && (
                                <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.interactiveSurface }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-bold uppercase" style={{ color: COLORS.textSecondary }}>
                                            Kunyomi
                                        </div>
                                        <button
                                            onClick={() => playAudio(kunyomi[0])}
                                            className="p-1 rounded hover:bg-black/10 transition-colors"
                                            style={{ color: COLORS.textSecondary }}
                                        >
                                            <Volume2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayKunyomi.map((reading) => (
                                            <Chip key={`kunyomi-${reading}`} label={reading} variant="reading" />
                                        ))}
                                    </div>
                                    {kunyomi.length > 3 && (
                                        <button
                                            onClick={() => setShowAllMeanings(prev => !prev)}
                                            className="text-xs mt-2 underline"
                                            style={{ color: COLORS.interactivePrimary }}
                                        >
                                            Show {showAllMeanings ? 'less' : 'all'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {meanings.length > 0 && (
                        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: COLORS.interactiveSurface }}>
                            <div className="text-xs font-bold uppercase mb-3" style={{ color: COLORS.textSecondary }}>
                                Meanings
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {displayMeanings.map((meaning) => (
                                    <Chip key={`meaning-${meaning}`} label={meaning} variant="primary" />
                                ))}
                            </div>
                            {meanings.length > 4 && (
                                <button
                                    onClick={() => setShowAllMeanings(prev => !prev)}
                                    className="text-xs mt-2 underline"
                                    style={{ color: COLORS.interactivePrimary }}
                                >
                                    Show {showAllMeanings ? 'less' : `all (${meanings.length} total)`}
                                </button>
                            )}
                        </div>
                    )}

                    {usedIn.length > 0 && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-5 h-5" style={{ color: COLORS.textPrimary }} />
                                <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                    Used In Words
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {displayUsedIn.map((word, index) => (
                                    <div
                                        key={`${word.kanji || word.word || index}`}
                                        className="rounded-xl p-3 flex items-center justify-between"
                                        style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.divider}` }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="text-lg font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                                                {word.kanji || word.word}
                                            </div>
                                            {word.reading && (
                                                <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                                                    {word.reading}
                                                </div>
                                            )}
                                        </div>
                                        {word.meaning && (
                                            <div className="text-sm" style={{ color: COLORS.textPrimary }}>
                                                {word.meaning}
                                            </div>
                                        )}
                                        {word.hiragana && (
                                            <button
                                                onClick={() => playAudio(word.hiragana)}
                                                className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
                                                style={{ color: COLORS.textSecondary }}
                                            >
                                                <Volume2 className="w-3 h-3" />
                                                <span>{word.hiragana}</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {usedIn.length > 4 && (
                                <button
                                    onClick={() => setShowAllMeanings(prev => !prev)}
                                    className="text-sm underline"
                                    style={{ color: COLORS.interactivePrimary }}
                                >
                                    Show all {usedIn.length} words
                                </button>
                            )}
                        </div>
                    )}

                    {similars.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <ImageIcon className="w-5 h-5" style={{ color: COLORS.textPrimary }} />
                                <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                                    Similar Kanjis
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {displaySimilars.map((similar) => (
                                    <div
                                        key={`${similar.kanji}-${similar.meaning}`}
                                        className="rounded-xl p-4 text-center"
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
                            {similars.length > 4 && (
                                <button
                                    onClick={() => setShowAllMeanings(prev => !prev)}
                                    className="text-sm underline"
                                    style={{ color: COLORS.interactivePrimary }}
                                >
                                    Show all {similars.length} similar kanjis
                                </button>
                            )}
                        </div>
                    )}

                    {item?.fallback && (
                        <p className="text-center text-xs" style={{ color: COLORS.interactiveTextInactive }}>
                            Full details unavailable for this kanji.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
