import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { provideData, provideTopWordsData } from "../util/jlptArray"
import Hiragana from "../util/hiragana.json"
import Katakana from "../util/katakana.json"
import COLORS from "../theme/colors"
import { ArrowLeft } from "lucide-react"

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"]
const ITEM_COUNTS = [20, 50, 100, 200, 300, "All"]

export default function KanjiTemplate() {
    const location = useLocation()
    const navigate = useNavigate()
    const params = location.state || {}

    const {
        jlptLevel,
        strokes,
        grades,
        isWord,
        nouns,
        verbs,
        adjectives,
        adverbs,
        katakana,
        hiragana,
        title
    } = params

    const [arr, setArr] = useState([])
    const [selectedLevel, setSelectedLevel] = useState("N5")
    const [itemCount, setItemCount] = useState(20)

    const navigateToDetailScreen = (item, index) => {
        navigate("/dashboard/kanji-detail", {
            state: {
                paramsData: item,
                wholeArr: arr,
                itemIndex: index,
                isWord,
                isKana: hiragana || katakana,
                title: item.kanjiName || item.kanji,
            }
        })
    }

    useEffect(() => {
        loadData()
    }, [selectedLevel, itemCount, jlptLevel, strokes, grades])

    const loadData = () => {
        const count = itemCount === "All" ? 1000 : itemCount
        if (jlptLevel) setArr(provideData("jlpt", jlptLevel))
        if (strokes) setArr(provideData("strokes", strokes))
        if (grades) setArr(provideData("grade", grades))
        if (verbs) setArr(provideTopWordsData("verbs", selectedLevel.toLowerCase(), count))
        if (nouns) setArr(provideTopWordsData("nouns", selectedLevel.toLowerCase(), count))
        if (adjectives) setArr(provideTopWordsData("adjectives", selectedLevel.toLowerCase(), count))
        if (adverbs) setArr(provideTopWordsData("adverbs", selectedLevel.toLowerCase(), count))
        if (hiragana) setArr(Hiragana)
        if (katakana) setArr(Katakana)
    }

    const renderJLPTFilter = () => (
        <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
            {JLPT_LEVELS.map((level) => (
                <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className="px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                        backgroundColor: selectedLevel === level ? COLORS.brandPrimary : COLORS.surface,
                        color: selectedLevel === level ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                        border: `1px solid ${COLORS.outline}`
                    }}
                >
                    {level}
                </button>
            ))}
        </div>
    )

    const renderItemCountFilter = () => (
        <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
            {ITEM_COUNTS.map((count) => (
                <button
                    key={count}
                    onClick={() => setItemCount(count)}
                    className="px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                        backgroundColor: itemCount === count ? COLORS.brandPrimary : COLORS.surface,
                        color: itemCount === count ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                        border: `1px solid ${COLORS.outline}`
                    }}
                >
                    {count}
                </button>
            ))}
        </div>
    )

    const toRomaji = (text) => {
        // Simple placeholder - in production use wanakana library
        return text
    }

    const getFontSize = (text) => {
        if (!text) return '10px'
        if (text.length <= 5) return '10px'
        else if (text.length <= 8) return '8px'
        else return '6px'
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="sticky top-0 z-20 p-4 flex items-center" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                >
                    <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                </button>
                <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                    {title || "Kanji"}
                </h1>
            </div>

            {/* Filters */}
            <div className="pt-4">
                {(nouns || verbs || adjectives || adverbs) && (
                    <>
                        {renderJLPTFilter()}
                        {renderItemCountFilter()}
                    </>
                )}
            </div>

            {/* Kanji Grid */}
            <div className="p-4">
                <div className={`grid gap-3 ${isWord ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'}`}>
                    {arr.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigateToDetailScreen(item, index)}
                            className="p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center"
                            style={{
                                backgroundColor: COLORS.surface,
                                border: `3px solid ${COLORS.brandPrimary}`,
                                boxShadow: `0 4px 8px ${COLORS.brandPrimaryDark}1A`
                            }}
                        >
                            <div className="text-3xl font-medium mb-1" style={{ color: COLORS.textPrimary }}>
                                {isWord ? item.kanji : item.kanjiName}
                            </div>
                            {item.meanings && (
                                <div
                                    className="text-center"
                                    style={{
                                        color: COLORS.textSecondary,
                                        fontSize: getFontSize(item.meanings[0])
                                    }}
                                >
                                    {item.meanings[0]}
                                </div>
                            )}
                            {item.kun && (
                                <div
                                    className="text-center mt-1"
                                    style={{
                                        color: COLORS.textPrimary,
                                        fontSize: getFontSize(toRomaji(item.kun[0]))
                                    }}
                                >
                                    {toRomaji(item.kun[0])}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

