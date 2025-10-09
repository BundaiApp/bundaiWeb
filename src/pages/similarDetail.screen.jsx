import { useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import COLORS from "../theme/colors"

const JLPT_LEVELS = ["All", "N5", "N4", "N3", "N2", "N1"]

const LevelFilter = ({ selectedLevel, onLevelChange }) => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
        {JLPT_LEVELS.map((level) => (
            <button
                key={level}
                onClick={() => onLevelChange(level)}
                className="px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                    backgroundColor: selectedLevel === level ? COLORS.brandPrimary : COLORS.interactiveSurface,
                    color: selectedLevel === level ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                    border: `1px solid ${selectedLevel === level ? COLORS.brandPrimary : COLORS.outline}`
                }}
            >
                {level}
            </button>
        ))}
    </div>
)

export default function SimilarDetail() {
    const location = useLocation()
    const navigate = useNavigate()
    const { kanji, meaning, furigana, kanjiArray = [], usedIn = [] } = location.state || {}

    const [selectedLevel, setSelectedLevel] = useState("All")

    // Check if usedIn data has jlptLevel field
    const hasJlptLevel = useMemo(() => {
        return usedIn.length > 0 && usedIn[0].jlptLevel !== undefined
    }, [usedIn])

    // Filter and limit usedIn words based on JLPT level
    const filteredUsedIn = useMemo(() => {
        if (!hasJlptLevel) {
            return usedIn
        }

        const jlptOrder = ["n5", "n4", "n3", "n2", "n1"]

        const filtered = selectedLevel === "All"
            ? usedIn
            : usedIn.filter(word => word.jlptLevel?.toLowerCase() === selectedLevel.toLowerCase())

        return filtered.sort((a, b) => {
            const aIndex = jlptOrder.indexOf(a.jlptLevel?.toLowerCase() || "")
            const bIndex = jlptOrder.indexOf(b.jlptLevel?.toLowerCase() || "")
            return aIndex - bIndex
        })
    }, [usedIn, selectedLevel, hasJlptLevel])

    if (!kanji) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No kanji data available
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/similars')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Similars
                    </button>
                </div>
            </div>
        )
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
                    Similar Kanjis
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
                {/* Main Kanji Display */}
                <div className="text-center mb-12">
                    <div className="text-8xl md:text-9xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        {kanji}
                    </div>
                    <div className="text-2xl md:text-3xl font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                        {meaning}
                    </div>
                    {furigana && (
                        <div className="text-lg md:text-xl" style={{ color: COLORS.textSecondary }}>
                            {furigana}
                        </div>
                    )}
                </div>

                {/* Similar Kanjis Section */}
                {kanjiArray.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
                            Similar Kanjis
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {kanjiArray.map((similar, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                    style={{
                                        backgroundColor: COLORS.surface,
                                        border: `3px solid ${COLORS.brandPrimary}`,
                                        boxShadow: `0 4px 8px ${COLORS.brandPrimaryDark}1A`
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                                            {similar.kanji}
                                        </div>
                                        {similar.meaning && (
                                            <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                                                {similar.meaning}
                                            </div>
                                        )}
                                        {similar.furigana && (
                                            <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                                                {similar.furigana}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Words Made With Section */}
                {usedIn.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                            Words Made With {kanji}
                        </h2>
                        <p className="mb-6" style={{ color: COLORS.textSecondary }}>
                            Common words and phrases that use this kanji
                        </p>

                        {hasJlptLevel && (
                            <LevelFilter selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />
                        )}

                        <div className="space-y-3">
                            {filteredUsedIn.map((word, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 md:p-5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                                    style={{
                                        backgroundColor: COLORS.surface,
                                        border: `2px solid ${COLORS.outline}`,
                                        boxShadow: `0 2px 4px ${COLORS.brandPrimaryDark}0A`
                                    }}
                                >
                                    <div className="mb-2 sm:mb-0 sm:max-w-[30%]">
                                        <div className="text-xl md:text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                                            {word.kanji}
                                        </div>
                                        {word.furigana && (
                                            <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
                                                {word.furigana}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 sm:ml-6">
                                        {word.meaning && (
                                            <div className="text-base md:text-lg" style={{ color: COLORS.textPrimary }}>
                                                {word.meaning || word.meanings}
                                            </div>
                                        )}
                                        {word.jlptLevel && (
                                            <span
                                                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: COLORS.brandPrimary,
                                                    color: COLORS.interactiveTextOnPrimary
                                                }}
                                            >
                                                {word.jlptLevel.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredUsedIn.length === 0 && (
                            <div className="text-center py-12" style={{ color: COLORS.textSecondary }}>
                                No words found for the selected JLPT level
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state */}
                {kanjiArray.length === 0 && usedIn.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl" style={{ color: COLORS.textSecondary }}>
                            No related data available for this kanji
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
