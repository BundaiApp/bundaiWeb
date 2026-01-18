import { useState } from "react"
import { useNavigate } from "react-router-dom"
import COLORS from "../theme/colors"

export default function Dashboard() {
    const [selectedTopic, setSelectedTopic] = useState("jlpt")
    const navigate = useNavigate()

    const kanjiCategories = [
        { id: "jlpt", label: "JLPT", subtitle: "N1-N5", primary: true },
        { id: "strokes", label: "Stroke", subtitle: "1-24", primary: false },
        { id: "grades", label: "Grade", subtitle: "1-9", primary: false },
    ]

    const kanaCategories = [
        { id: "hiragana", label: "Hiragana", subtitle: "Japanese letters" },
        { id: "katakana", label: "Katakana", subtitle: "Foreign sound Letters" },
    ]

    const renderJLPTLevels = () => {
        return (
            <>
                {[5, 4, 3, 2, 1].map((level) => (
                    <button
                        key={level}
                        onClick={() => navigate('/dashboard/kanji-template', {
                            state: {
                                jlptLevel: level,
                                title: `JLPT Level ${level}`
                            }
                        })}
                        className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                        style={{ backgroundColor: COLORS.interactiveSurface, color: COLORS.textPrimary }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.brandPrimary
                            e.currentTarget.style.color = COLORS.interactiveTextOnPrimary
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.interactiveSurface
                            e.currentTarget.style.color = COLORS.textPrimary
                        }}
                    >
                        N{level}
                    </button>
                ))}
            </>
        )
    }

    const renderStrokeLevels = () => {
        return (
            <>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((stroke) => (
                    <button
                        key={stroke}
                        onClick={() => navigate('/dashboard/kanji-template', {
                            state: {
                                strokes: stroke,
                                title: `${stroke} Stroke Kanji`
                            }
                        })}
                        className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                        style={{ backgroundColor: COLORS.interactiveSurface, color: COLORS.textPrimary }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.brandPrimary
                            e.currentTarget.style.color = COLORS.interactiveTextOnPrimary
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.interactiveSurface
                            e.currentTarget.style.color = COLORS.textPrimary
                        }}
                    >
                        {stroke}
                    </button>
                ))}
            </>
        )
    }

    const renderGradeLevels = () => {
        return (
            <>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((grade) => (
                    <button
                        key={grade}
                        onClick={() => navigate('/dashboard/kanji-template', {
                            state: {
                                grades: grade,
                                title: `Grade ${grade}`
                            }
                        })}
                        className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                        style={{ backgroundColor: COLORS.interactiveSurface, color: COLORS.textPrimary }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.brandPrimary
                            e.currentTarget.style.color = COLORS.interactiveTextOnPrimary
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.interactiveSurface
                            e.currentTarget.style.color = COLORS.textPrimary
                        }}
                    >
                        {grade}
                    </button>
                ))}
            </>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Dashboard
                </h1>
                <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                    Welcome back! Continue your Japanese learning journey.
                </p>
            </div>

            {/* Kanji Section */}
            <section>
                <div className="p-4 md:p-8 rounded-2xl shadow-md" style={{ backgroundColor: COLORS.surface }}>
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Kanji
                        </h2>
                        <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                            Japanese characters
                        </p>
                    </div>

                    {/* Main Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {kanjiCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedTopic(category.id)}
                                className="p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105"
                                style={{
                                    background: selectedTopic === category.id
                                        ? `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)`
                                        : COLORS.interactiveSurface,
                                    color: selectedTopic === category.id ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                                    boxShadow: selectedTopic === category.id ? `0 10px 20px ${COLORS.brandPrimary}30` : 'none'
                                }}
                            >
                                <div className="text-2xl font-bold mb-1">{category.label}</div>
                                <div className="text-sm opacity-80">{category.subtitle}</div>
                            </button>
                        ))}
                    </div>

                    {/* Level Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {selectedTopic === "jlpt" && renderJLPTLevels()}
                        {selectedTopic === "strokes" && renderStrokeLevels()}
                        {selectedTopic === "grades" && renderGradeLevels()}
                    </div>
                </div>
            </section>

            {/* Anime Words Section */}
            <section className="space-y-4">
                <button
                    onClick={() => navigate('/dashboard/anime-list')}
                    className="w-full p-6 md:p-8 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: COLORS.surface }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = `0 10px 20px ${COLORS.brandPrimary}20`
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Anime Words
                        </h2>
                        <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                            Browse anime vocabulary by show
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/dashboard/anime-words')}
                    className="w-full p-6 md:p-8 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{ backgroundColor: COLORS.surface }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = `0 10px 20px ${COLORS.brandPrimary}20`
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Top 1000 Anime Words
                        </h2>
                        <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                            Most common anime vocabulary
                        </p>
                    </div>
                </button>
            </section>

            {/* Hiragana & Katakana Section */}
            <section>
                <div className="p-4 md:p-8 rounded-2xl shadow-md" style={{ backgroundColor: COLORS.surface }}>
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Hiragana & Katakana
                        </h2>
                        <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                            Letters of Japanese Language
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {kanaCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => navigate('/dashboard/kanji-template', {
                                    state: {
                                        [category.id]: true,
                                        title: category.label
                                    }
                                })}
                                className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 text-center"
                                style={{ backgroundColor: COLORS.interactiveSurface, color: COLORS.textPrimary }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.brandPrimary
                                    e.currentTarget.style.color = COLORS.interactiveTextOnPrimary
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.interactiveSurface
                                    e.currentTarget.style.color = COLORS.textPrimary
                                }}
                            >
                                <div className="text-2xl font-bold mb-2">{category.label}</div>
                                <div className="text-sm opacity-70">{category.subtitle}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
