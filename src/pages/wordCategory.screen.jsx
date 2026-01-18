import { useLocation, useNavigate } from "react-router-dom"
import { BookOpen, Volume2 } from "lucide-react"
import COLORS from "../theme/colors"
import wordCategories from "../util/wordCategories.json"

const LONG_WORD_LENGTH_THRESHOLD = 4

export default function WordCategory() {
    const location = useLocation()
    const navigate = useNavigate()
    const { categoryId, categoryName } = location.state || {}

    const categoryData = wordCategories[categoryId]

    const handleWordClick = (word) => {
        navigate('/dashboard/kanji-detail', {
            state: {
                paramsData: {
                    kanji: word.kanji,
                    on: [],
                    kun: [],
                    meanings: [word.meaning],
                    hiragana: word.reading,
                    romaji: word.romaji,
                    image: word.image,
                    isWord: true
                },
                wholeArr: [word],
                itemIndex: 0,
                title: word.kanji,
                isWord: true
            }
        })
    }

    if (!categoryData) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        Category not found
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/sound-words')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Words
                    </button>
                </div>
            </div>
        )
    }

    const words = categoryData.words

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard/sound-words')}
                    className="text-sm mb-4"
                    style={{ color: COLORS.interactivePrimary }}
                >
                    ← Back to Words
                </button>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    {categoryName}
                </h1>
                <p style={{ color: COLORS.textSecondary }}>
                    {words.length} words
                </p>
            </div>

            {/* Word Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {words.map((word, index) => {
                    const isLongWord = (word.kanji?.length ?? 0) > LONG_WORD_LENGTH_THRESHOLD

                    return (
                        <button
                            key={`${word.kanji}-${index}`}
                            onClick={() => handleWordClick(word)}
                            className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 text-left"
                            style={{
                                backgroundColor: COLORS.surface,
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {/* Word Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div
                                        className={`text-3xl md:text-4xl font-bold mb-1 ${isLongWord ? 'text-2xl md:text-3xl' : ''}`}
                                        style={{ color: COLORS.textPrimary }}
                                    >
                                        {word.kanji}
                                    </div>
                                    <div className="text-lg" style={{ color: COLORS.brandPrimary }}>
                                        {word.reading}
                                    </div>
                                </div>
                                {word.jlptLevel && (
                                    <div
                                        className="px-2 py-1 rounded-lg text-xs font-bold uppercase"
                                        style={{ backgroundColor: COLORS.brandSecondary, color: COLORS.interactiveTextOnPrimary }}
                                    >
                                        {word.jlptLevel}
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            <div className="w-full aspect-square flex items-center justify-center mb-3 rounded-xl overflow-hidden">
                                <img
                                    src={`/images/${word.image}.png`}
                                    alt={word.meaning}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        const fallbackPaths = [word.image.toLowerCase(), word.image]
                                        const firstSuccess = fallbackPaths.find(path => e.target.src.includes(path))
                                        if (!firstSuccess) {
                                            e.target.src = `/images/${fallbackPaths[0].toLowerCase()}.png`
                                        }
                                    }}
                                />
                            </div>

                            {/* Meaning */}
                            <div className="space-y-2">
                                <div>
                                    <p
                                        className="text-sm font-medium uppercase mb-1"
                                        style={{ color: COLORS.textSecondary }}
                                    >
                                        Meaning
                                    </p>
                                    <p className="text-lg" style={{ color: COLORS.textPrimary }}>
                                        {word.meaning}
                                    </p>
                                </div>

                                {word.romaji && (
                                    <div>
                                        <p
                                            className="text-sm font-medium uppercase mb-1"
                                            style={{ color: COLORS.textSecondary }}
                                        >
                                            Romaji
                                        </p>
                                        <p className="text-lg" style={{ color: COLORS.textPrimary }}>
                                            {word.romaji}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Stats */}
                            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: COLORS.interactiveSurface }}>
                                {word.variationCount && word.variationCount > 0 && (
                                    <div className="flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-sm">
                                            {word.variationCount} variation{word.variationCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-sm">Audio</span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
