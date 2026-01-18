import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Hiragana from "../util/hiragana.json"
import Katakana from "../util/katakana.json"
import COLORS from "../theme/colors"
import getKanjiByJLPT from "../graphql/queries/getKanjiByJLPT.query"
import getKanjiByStrokes from "../graphql/queries/getKanjiByStrokes.query"
import getKanjiByGrade from "../graphql/queries/getKanjiByGrade.query"
import getTopWordsByType from "../graphql/queries/getTopWordsByType.query"

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

    const [selectedLevel, setSelectedLevel] = useState("N5")
    const [itemCount, setItemCount] = useState(20)

    const jlptLevelNum = parseInt(jlptLevel) || 0
    const strokesNum = parseInt(strokes) || 0
    const gradesNum = parseInt(grades) || 0

    const { data: jlptData, loading: loadingJLPT } = useQuery(getKanjiByJLPT, {
        variables: { level: jlptLevelNum },
        skip: !jlptLevel
    })

    const { data: strokesData, loading: loadingStrokes } = useQuery(getKanjiByStrokes, {
        variables: { strokes: strokesNum },
        skip: !strokes
    })

    const { data: gradesData, loading: loadingGrades } = useQuery(getKanjiByGrade, {
        variables: { grade: gradesNum },
        skip: !grades
    })

    const count = itemCount === "All" ? 1000 : itemCount
    const jlptLevelStr = selectedLevel.toLowerCase()

    const { data: verbsData, loading: loadingVerbs } = useQuery(getTopWordsByType, {
        variables: { type: "verbs", jlptLevel: jlptLevelStr, count },
        skip: !verbs
    })

    const { data: nounsData, loading: loadingNouns } = useQuery(getTopWordsByType, {
        variables: { type: "nouns", jlptLevel: jlptLevelStr, count },
        skip: !nouns
    })

    const { data: adjectivesData, loading: loadingAdjectives } = useQuery(getTopWordsByType, {
        variables: { type: "adjectives", jlptLevel: jlptLevelStr, count },
        skip: !adjectives
    })

    const { data: adverbsData, loading: loadingAdverbs } = useQuery(getTopWordsByType, {
        variables: { type: "adverbs", jlptLevel: jlptLevelStr, count },
        skip: !adverbs
    })

    const arr = jlptLevel ? jlptData?.getKanjiByJLPT || [] :
        strokes ? strokesData?.getKanjiByStrokes || [] :
        grades ? gradesData?.getKanjiByGrade || [] :
        verbs ? verbsData?.getTopWordsByType || [] :
        nouns ? nounsData?.getTopWordsByType || [] :
        adjectives ? adjectivesData?.getTopWordsByType || [] :
        adverbs ? adverbsData?.getTopWordsByType || [] :
        hiragana ? Hiragana :
        katakana ? Katakana : []

    const isLoading = loadingJLPT || loadingStrokes || loadingGrades ||
        loadingVerbs || loadingNouns || loadingAdjectives || loadingAdverbs

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

    const renderJLPTFilter = () => (
        <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
            {JLPT_LEVELS.map((level) => (
                <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className="px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                        backgroundColor: COLORS.interactiveSurface,
                        color: COLORS.textPrimary,
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
                        backgroundColor: COLORS.interactiveSurface,
                        color: COLORS.textPrimary,
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

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <RefreshCw className="w-12 h-12 animate-spin" style={{ color: COLORS.brandPrimary }} />
                    <p className="mt-4" style={{ color: COLORS.textSecondary }}>
                        Loading...
                    </p>
                </div>
            )}

            {/* Filters */}
            {!isLoading && (
                <div className="pt-4">
                    {(nouns || verbs || adjectives || adverbs) && (
                        <>
                            {renderJLPTFilter()}
                            {renderItemCountFilter()}
                        </>
                    )}
                </div>
            )}

            {/* Kanji Grid */}
            {!isLoading && (
                <div className="p-4">
                    <div className={`grid gap-3 ${isWord ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
                        (hiragana || katakana) ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10' :
                        'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                    }`}>
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
                                {(item.meanings || item.meaning) && (
                                    <div
                                        className="text-center"
                                        style={{
                                            color: COLORS.textSecondary,
                                            fontSize: getFontSize(item.meanings ? item.meanings[0] : item.meaning)
                                        }}
                                    >
                                        {item.meanings ? item.meanings[0] : item.meaning}
                                    </div>
                                )}
                                {item.kun && !hiragana && !katakana && !isWord && (
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
            )}
        </div>
    )
}

