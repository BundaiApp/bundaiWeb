import { useState, useEffect, useMemo, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { X } from "lucide-react"
import COLORS from "../theme/colors"
import { getLevelContent } from "../util/levelSystem"
import GET_FLASHCARDS_BY_LEVEL from "../graphql/queries/getFlashCardsByLevel.query"
import getKanjiByJLPT from "../graphql/queries/getKanjiByJLPT.query"

const LONG_WORD_LENGTH_THRESHOLD = 4

export default function LevelDetails() {
    const location = useLocation()
    const navigate = useNavigate()
    const { level } = location.state || {}

    const userId = localStorage.getItem("userId") || "defaultUser"
    const isGuest = !userId || userId === "defaultUser"
    const [currentLevel, setCurrentLevel] = useState(10)

    const [localLevelData, setLocalLevelData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sheetConfig, setSheetConfig] = useState(null)
    const [sheetCurrentIndex, setSheetCurrentIndex] = useState(0)

    const isLevelUnlocked = !isGuest && level <= currentLevel

    const { data: progressData } = useQuery(GET_FLASHCARDS_BY_LEVEL, {
        variables: { userId, level },
        skip: isGuest || !isLevelUnlocked,
        fetchPolicy: "network-only"
    })

    const { data: n5Data, loading: loadingN5 } = useQuery(getKanjiByJLPT, { variables: { level: 5 }, skip: false })
    const { data: n4Data, loading: loadingN4 } = useQuery(getKanjiByJLPT, { variables: { level: 4 }, skip: false })
    const { data: n3Data, loading: loadingN3 } = useQuery(getKanjiByJLPT, { variables: { level: 3 }, skip: false })
    const { data: n2Data, loading: loadingN2 } = useQuery(getKanjiByJLPT, { variables: { level: 2 }, skip: false })
    const { data: n1Data, loading: loadingN1 } = useQuery(getKanjiByJLPT, { variables: { level: 1 }, skip: false })

    const jlptDataMap = useMemo(() => ({
        1: n1Data?.getKanjiByJLPT || [],
        2: n2Data?.getKanjiByJLPT || [],
        3: n3Data?.getKanjiByJLPT || [],
        4: n4Data?.getKanjiByJLPT || [],
        5: n5Data?.getKanjiByJLPT || []
    }), [n1Data, n2Data, n3Data, n4Data, n5Data])

    const jlptLoading = loadingN1 || loadingN2 || loadingN3 || loadingN4 || loadingN5

    useEffect(() => {
        const fetchUserLevel = async () => {
            if (isGuest) return
            try {
                const response = await fetch('https://bundaibackend-production.up.railway.app/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query me($_id: String!) {
                                me(_id: $_id) {
                                    _id
                                    currentLevel
                                }
                            }
                        `,
                        variables: { _id: userId }
                    })
                })
                const data = await response.json()
                if (data?.data?.me?.currentLevel) {
                    setCurrentLevel(data.data.me.currentLevel)
                }
            } catch (error) {
                console.error("Error fetching current level:", error)
            }
        }
        fetchUserLevel()
    }, [userId, isGuest])

    useEffect(() => {
        const fetchLocalData = async () => {
            try {
                setLoading(true)

                if (jlptLoading) {
                    setLoading(false)
                    return
                }

                const hasJLPTData = Object.values(jlptDataMap).every(data => Array.isArray(data) && data.length > 0)

                if (!hasJLPTData) {
                    setLoading(false)
                    return
                }

                const data = getLevelContent(level, jlptDataMap)

                const kanjiSet = new Set(data.kanji.map(k => k.kanji))
                const wordsByKanji = {}

                data.kanji.forEach(kanjiItem => {
                    wordsByKanji[kanjiItem.kanji] = []
                })

                data.words.forEach(word => {
                    const wordKanji = [...word.word].filter(char => kanjiSet.has(char))
                    if (wordKanji.length > 0) {
                        wordsByKanji[wordKanji[0]].push(word)
                    }
                })

                setLocalLevelData({ ...data, wordsByKanji })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchLocalData()
    }, [level, jlptDataMap, jlptLoading])

    const levelData = useMemo(() => {
        if (!localLevelData) return null

        if (!isLevelUnlocked) {
            return localLevelData
        }

        if (!progressData?.getFlashCardsByLevel) {
            return localLevelData
        }

        const progressMap = new Map()
        progressData.getFlashCardsByLevel.forEach(card => {
            progressMap.set(card.kanjiName, {
                rating: card.rating,
                burned: card.burned,
                nextReview: card.nextReview,
                lastSeen: card.lastSeen,
                _id: card._id
            })
        })

        const kanji = localLevelData.kanji.map(kanjiItem => {
            const progress = progressMap.get(kanjiItem.kanji)
            if (progress) {
                return {
                    ...kanjiItem,
                    kanjiName: kanjiItem.kanji,
                    rating: progress.rating,
                    burned: progress.burned,
                    nextReview: progress.nextReview,
                    lastSeen: progress.lastSeen,
                    _id: progress._id
                }
            }
            return kanjiItem
        })

        const words = localLevelData.words.map(wordItem => {
            const progress = progressMap.get(wordItem.word)
            if (progress) {
                return {
                    ...wordItem,
                    kanjiName: wordItem.word,
                    hiragana: wordItem.reading,
                    rating: progress.rating,
                    burned: progress.burned,
                    nextReview: progress.nextReview,
                    lastSeen: progress.lastSeen,
                    _id: progress._id
                }
            }
            return wordItem
        })

        const kanjiSet = new Set(kanji.map(k => k.kanji))
        const wordsByKanji = {}

        kanji.forEach(kanjiItem => {
            wordsByKanji[kanjiItem.kanji] = []
        })

        words.forEach(word => {
            const wordKanji = [...word.word].filter(char => kanjiSet.has(char))
            if (wordKanji.length > 0) {
                wordsByKanji[wordKanji[0]].push(word)
            }
        })

        return { kanji, words, wordsByKanji }
    }, [localLevelData, isLevelUnlocked, progressData])

    const levelProgress = useMemo(() => {
        if (!levelData?.kanji || !levelData?.words) return 0

        const allItems = [...levelData.kanji, ...levelData.words]
        const totalRating = allItems.reduce((sum, item) => {
            const rating = item.rating || 0
            return sum + rating
        }, 0)

        const maxPossibleRating = allItems.length * 7
        const progressPercentage = maxPossibleRating > 0
            ? (totalRating / maxPossibleRating) * 100
            : 0
        return Math.round(progressPercentage)
    }, [levelData])

    const openSheet = useCallback((type, items, startIndex = 0) => {
        if (!Array.isArray(items) || items.length === 0) {
            return
        }
        const nextIndex = Math.min(Math.max(startIndex, 0), items.length - 1)
        setSheetConfig({ type, items })
        setSheetCurrentIndex(nextIndex)
    }, [])

    const closeSheet = useCallback(() => {
        setSheetConfig(null)
        setSheetCurrentIndex(0)
    }, [])

    const getKanjiDetails = useCallback((kanjiChar) => {
        if (!localLevelData?.kanji) return null
        return localLevelData.kanji.find(k => k.kanji === kanjiChar)
    }, [localLevelData])

    const handleSheetScroll = (e) => {
        if (!sheetConfig) return
        const scrollLeft = e.target.scrollLeft
        const slideWidth = e.target.clientWidth
        const newIndex = Math.round(scrollLeft / slideWidth)
        setSheetCurrentIndex(Math.min(Math.max(newIndex, 0), sheetConfig.items.length - 1))
    }

    useEffect(() => {
        if (!sheetConfig) return
        const container = document.querySelector('.sheet-pager')
        if (container) {
            const targetOffset = sheetCurrentIndex * container.clientWidth
            container.scrollTo({ left: targetOffset, behavior: 'smooth' })
        }
    }, [sheetConfig, sheetCurrentIndex])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="w-12 h-12 rounded-full border-4 border-t-4 animate-spin" 
                    style={{ 
                        borderColor: COLORS.brandPrimary,
                        borderTopColor: 'transparent'
                    }} 
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl mb-4" style={{ color: COLORS.accentDanger }}>
                        Error: {error}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.surface }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
                {/* Level Progress Card */}
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                                Level {level}
                            </h2>
                            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                                {levelProgress}% complete
                            </p>
                        </div>
                        <div className="px-4 py-3 rounded-full" style={{ backgroundColor: COLORS.accentDanger }}>
                            <span className="text-xl font-bold" style={{ color: COLORS.surface }}>
                                {levelProgress}%
                            </span>
                        </div>
                    </div>

                    <div className="h-2 rounded-full" style={{ backgroundColor: COLORS.interactiveSurface }}>
                        <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ backgroundColor: COLORS.brandPrimary, width: `${levelProgress}%` }}
                        />
                    </div>
                </div>

                {/* Kanji Section */}
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                            Kanji
                        </h2>
                        <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.surface }}
                        >
                            {levelData?.kanji?.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {levelData?.kanji?.map((kanjiItem, index) => {
                            const kanjiChar = isLevelUnlocked ? kanjiItem.kanjiName : kanjiItem.kanji
                            const isBurned = isLevelUnlocked && kanjiItem.burned
                            const rating = isLevelUnlocked ? (kanjiItem.rating || 0) : 0

                            return (
                                <button
                                    key={index}
                                    onClick={() => openSheet('kanji', levelData.kanji, index)}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="aspect-square w-full rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-2"
                                        style={{
                                            backgroundColor: isBurned ? COLORS.interactiveTextInactive : (isLevelUnlocked ? COLORS.cardKanji : 'transparent'),
                                            border: isLevelUnlocked ? 'none' : `2px dashed ${COLORS.interactiveSurface}`,
                                            color: isBurned ? COLORS.surface : (isLevelUnlocked ? COLORS.surface : COLORS.interactiveTextInactive)
                                        }}
                                    >
                                        {kanjiChar}
                                    </div>
                                    {isLevelUnlocked && !isBurned && (
                                        <div className="flex space-x-1">
                                            {Array.from({ length: 7 }).map((_, dotIndex) => (
                                                <div
                                                    key={dotIndex}
                                                    className="w-1 h-1 rounded-full"
                                                    style={{
                                                        border: `1px solid ${COLORS.cardKanji}`,
                                                        backgroundColor: dotIndex < rating ? COLORS.cardKanji : 'transparent'
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

                {/* Words Section */}
                {levelData?.kanji?.map((kanjiItem) => {
                    const kanjiChar = isLevelUnlocked ? kanjiItem.kanjiName : kanjiItem.kanji
                    const words = levelData.wordsByKanji?.[kanjiChar] || []
                    if (words.length === 0) return null

                    return (
                        <div key={kanjiChar} className="mb-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                                    style={{
                                        backgroundColor: isLevelUnlocked ? COLORS.cardKanji : 'transparent',
                                        border: isLevelUnlocked ? 'none' : `1.5px dashed ${COLORS.interactiveSurface}`,
                                        color: isLevelUnlocked ? COLORS.surface : COLORS.interactiveTextInactive
                                    }}
                                >
                                    {kanjiChar}
                                </div>
                                <span
                                    className="px-2 py-1 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: COLORS.interactiveSurface, color: COLORS.textSecondary }}
                                >
                                    {words.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {words.map((wordItem, index) => {
                                    const wordText = isLevelUnlocked ? wordItem.kanjiName : wordItem.word
                                    const wordReading = isLevelUnlocked ? wordItem.hiragana : wordItem.reading
                                    const wordMeaning = isLevelUnlocked
                                        ? (wordItem.meanings && wordItem.meanings[0])
                                        : wordItem.meaning
                                    const isBurned = isLevelUnlocked && wordItem.burned
                                    const rating = isLevelUnlocked ? (wordItem.rating || 0) : 0
                                    const isLongWord = (wordItem.word?.length ?? 0) > LONG_WORD_LENGTH_THRESHOLD

                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl px-4 py-3.5 flex justify-between items-start"
                                            style={{
                                                backgroundColor: isBurned ? COLORS.interactiveTextInactive : (isLevelUnlocked ? COLORS.interactiveSurface : 'transparent'),
                                                border: isLevelUnlocked ? 'none' : `2px dashed ${COLORS.interactiveSurface}`
                                            }}
                                        >
                                            <div className="flex-1">
                                                <div
                                                    className={`font-bold text-xl ${isLongWord ? 'text-lg' : ''}`}
                                                    style={{ 
                                                        color: isBurned ? COLORS.surface : (isLevelUnlocked ? COLORS.textPrimary : COLORS.interactiveTextInactive)
                                                    }}
                                                >
                                                    {wordText}
                                                </div>
                                                {wordReading && (
                                                    <div
                                                        className="text-xs mt-1"
                                                        style={{ 
                                                            color: isBurned ? `${COLORS.surface}CC` : (isLevelUnlocked ? COLORS.textSecondary : COLORS.interactiveTextInactive)
                                                        }}
                                                    >
                                                        {wordReading}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col items-end ml-3">
                                                {wordMeaning && (
                                                    <div
                                                        className="text-sm font-medium text-right"
                                                        style={{ 
                                                            color: isBurned ? COLORS.surface : (isLevelUnlocked ? COLORS.textPrimary : COLORS.interactiveTextInactive)
                                                        }}
                                                    >
                                                        {wordMeaning}
                                                    </div>
                                                )}
                                                {isLevelUnlocked && !isBurned && (
                                                    <div className="flex space-x-1 mt-1.5">
                                                        {Array.from({ length: 7 }).map((_, dotIndex) => (
                                                            <div
                                                                key={dotIndex}
                                                                className="w-1 h-1 rounded-full"
                                                                style={{
                                                                    border: `1px solid ${COLORS.cardWord}`,
                                                                    backgroundColor: dotIndex < rating ? COLORS.cardWord : 'transparent'
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal/Bottom Sheet */}
            {sheetConfig && (
                <div 
                    className="fixed inset-0 flex items-end justify-center z-50"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    onClick={closeSheet}
                >
                    <div 
                        className="w-full max-w-5xl rounded-t-3xl shadow-2xl"
                        style={{ 
                            backgroundColor: COLORS.surface,
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            maxHeight: '85vh',
                            paddingBottom: '32px',
                            paddingTop: '12px',
                            paddingLeft: '16px',
                            paddingRight: '16px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="w-12 h-1 rounded-full mx-auto mb-3"
                            style={{ backgroundColor: COLORS.interactiveSurface }}
                        />
                        
                        <div className="flex justify-between items-center mb-2">
                            <span
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: COLORS.interactiveTextInactive }}
                            >
                                Kanji
                            </span>
                            <span
                                className="text-xs font-medium"
                                style={{ color: COLORS.interactiveTextInactive }}
                            >
                                {sheetCurrentIndex + 1}/{sheetConfig.items.length}
                            </span>
                        </div>

                        <div 
                            className="sheet-pager flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                            onScroll={handleSheetScroll}
                            style={{ minHeight: '400px' }}
                        >
                            {sheetConfig.items.map((item, index) => {
                                const kanjiChar = item.kanjiName || item.kanji
                                const kanjiDetails = getKanjiDetails(kanjiChar)
                                
                                return (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-full snap-center flex items-center justify-center"
                                        style={{ height: '70vh' }}
                                    >
                                        {kanjiDetails ? (
                                            <div className="w-full max-w-md p-6 rounded-2xl" style={{ backgroundColor: COLORS.interactiveSurface }}>
                                                <div 
                                                    className="text-8xl font-bold text-center mb-6"
                                                    style={{ color: COLORS.textPrimary }}
                                                >
                                                    {kanjiDetails.kanji}
                                                </div>
                                                
                                                {kanjiDetails.on && (
                                                    <div className="mb-4">
                                                        <div
                                                            className="text-xs uppercase mb-1"
                                                            style={{ color: COLORS.textSecondary }}
                                                        >
                                                            Onyomi
                                                        </div>
                                                        <div
                                                            className="text-xl"
                                                            style={{ color: COLORS.textPrimary }}
                                                        >
                                                            {kanjiDetails.on.join(', ')}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {kanjiDetails.kun && (
                                                    <div className="mb-4">
                                                        <div
                                                            className="text-xs uppercase mb-1"
                                                            style={{ color: COLORS.textSecondary }}
                                                        >
                                                            Kunyomi
                                                        </div>
                                                        <div
                                                            className="text-xl"
                                                            style={{ color: COLORS.textPrimary }}
                                                        >
                                                            {kanjiDetails.kun.join(', ')}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {kanjiDetails.meanings && kanjiDetails.meanings.length > 0 && (
                                                    <div className="mb-4">
                                                        <div
                                                            className="text-xs uppercase mb-1"
                                                            style={{ color: COLORS.textSecondary }}
                                                        >
                                                            Meaning
                                                        </div>
                                                        <div
                                                            className="text-xl"
                                                            style={{ color: COLORS.textPrimary }}
                                                        >
                                                            {kanjiDetails.meanings.join(', ')}
                                                        </div>
                                                    </div>
                                                )}

                                                {kanjiDetails.strokes && (
                                                    <div className="mb-4">
                                                        <div
                                                            className="text-xs uppercase mb-1"
                                                            style={{ color: COLORS.textSecondary }}
                                                        >
                                                            Strokes
                                                        </div>
                                                        <div
                                                            className="text-xl"
                                                            style={{ color: COLORS.textPrimary }}
                                                        >
                                                            {kanjiDetails.strokes}
                                                        </div>
                                                    </div>
                                                )}

                                                {kanjiDetails.radical && (
                                                    <div className="mb-4">
                                                        <div
                                                            className="text-xs uppercase mb-1"
                                                            style={{ color: COLORS.textSecondary }}
                                                        >
                                                            Radical
                                                        </div>
                                                        <div
                                                            className="text-xl"
                                                            style={{ color: COLORS.textPrimary }}
                                                        >
                                                            {kanjiDetails.radical}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div
                                                    className="text-6xl font-bold"
                                                    style={{ color: COLORS.textPrimary }}
                                                >
                                                    {kanjiChar}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <button
                            onClick={closeSheet}
                            className="mt-5 px-6 py-2.5 rounded-full font-bold mx-auto"
                            style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
