import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GlassCard } from "../components/GlassCard"
import { topics, words as wordsConstants } from "../util/constants"

export default function Dashboard() {
    const [selectedTopic, setSelectedTopic] = useState("jlpt")
    const navigate = useNavigate()

    const kanjiCategories = [
        { id: "jlpt", label: "JLPT", subtitle: "N1-N5", primary: true },
        { id: "strokes", label: "Stroke", subtitle: "1-24", primary: false },
        { id: "grades", label: "Grade", subtitle: "1-9", primary: false },
    ]

    const wordCategories = wordsConstants

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
                        style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#8c7bfa'
                            e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dcd5ff'
                            e.currentTarget.style.color = '#5632d4'
                        }}
                    >
                        N{level}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/dashboard/all-kanji', {
                        state: {
                            type: 'jlpt',
                            jlpt: true,
                            title: 'All Kanji'
                        }
                    })}
                    className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                    style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#8c7bfa'
                        e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dcd5ff'
                        e.currentTarget.style.color = '#5632d4'
                    }}
                >
                    All
                </button>
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
                        style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#8c7bfa'
                            e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dcd5ff'
                            e.currentTarget.style.color = '#5632d4'
                        }}
                    >
                        {stroke}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/dashboard/all-kanji', {
                        state: {
                            type: 'strokes',
                            strokes: true,
                            title: 'All Kanji'
                        }
                    })}
                    className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                    style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#8c7bfa'
                        e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dcd5ff'
                        e.currentTarget.style.color = '#5632d4'
                    }}
                >
                    All
                </button>
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
                        style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#8c7bfa'
                            e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dcd5ff'
                            e.currentTarget.style.color = '#5632d4'
                        }}
                    >
                        {grade}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/dashboard/all-kanji', {
                        state: {
                            type: 'grades',
                            grades: true,
                            title: 'All Kanji'
                        }
                    })}
                    className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                    style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#8c7bfa'
                        e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dcd5ff'
                        e.currentTarget.style.color = '#5632d4'
                    }}
                >
                    All
                </button>
            </>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 break-words" style={{ color: '#1f1a3d' }}>Dashboard</h1>
                <p className="break-words text-sm md:text-base" style={{ color: '#5b6070' }}>Welcome back! Continue your Japanese learning journey.</p>
            </div>

            {/* Kanji Section */}
            <section>
                <div className="p-4 md:p-8 rounded-2xl shadow-md" style={{ backgroundColor: '#ffffff' }}>
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 break-words" style={{ color: '#1f1a3d' }}>Kanji</h2>
                        <p className="text-sm md:text-base break-words" style={{ color: '#5b6070' }}>Japanese characters</p>
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
                                        ? 'linear-gradient(135deg, #7f53f5 0%, #5632d4 100%)'
                                        : '#dcd5ff',
                                    color: selectedTopic === category.id ? '#ffffff' : '#1f1a3d',
                                    boxShadow: selectedTopic === category.id ? '0 10px 20px rgba(127, 83, 245, 0.3)' : 'none'
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

            {/* Words Section */}
            <section>
                <div className="p-4 md:p-8 rounded-2xl shadow-md" style={{ backgroundColor: '#ffffff' }}>
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 break-words" style={{ color: '#1f1a3d' }}>
                            Words <span className="text-xl md:text-2xl">文甫</span>
                        </h2>
                        <p className="text-sm md:text-base break-words" style={{ color: '#5b6070' }}>Words with Hiragana</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {wordCategories.map((category) => (
                            <button
                                key={category.topicName}
                                onClick={() => console.log(`Navigate to ${category.topicName}`)}
                                className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 text-center"
                                style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#8c7bfa'
                                    e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dcd5ff'
                                    e.currentTarget.style.color = '#5632d4'
                                }}
                            >
                                <div className="text-xl font-bold mb-2">{category.header}</div>
                                <div className="text-sm opacity-70">{category.subtitle}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hiragana & Katakana Section */}
            <section>
                <div className="p-4 md:p-8 rounded-2xl shadow-md" style={{ backgroundColor: '#ffffff' }}>
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 break-words" style={{ color: '#1f1a3d' }}>Hiragana & Katakana</h2>
                        <p className="text-sm md:text-base break-words" style={{ color: '#5b6070' }}>Letters of Japanese Language</p>
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
                                style={{ backgroundColor: '#dcd5ff', color: '#5632d4' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#8c7bfa'
                                    e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dcd5ff'
                                    e.currentTarget.style.color = '#5632d4'
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


