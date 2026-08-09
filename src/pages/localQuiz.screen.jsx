import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import COLORS from '../theme/colors'
import { topics, kana } from '../util/constants'
import Hiragana from '../util/hiragana.json'
import Katakana from '../util/katakana.json'
import { loadLevel } from '../util/jlpt'
import { X } from 'lucide-react'

export default function LocalQuiz() {
    const navigate = useNavigate()
    const [type, setType] = useState('jlpt')
    const [level, setLevel] = useState(5)
    const [selected, setSelected] = useState([])
    const [quizType, setQuizType] = useState('meaning')
    const [isWritten, setIsWritten] = useState(false)
    const [currentData, setCurrentData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        if (type === 'hiragana') {
            setCurrentData(Hiragana)
            setLoading(false)
        } else if (type === 'katakana') {
            setCurrentData(Katakana)
            setLoading(false)
        } else if (type === 'jlpt') {
            loadLevel(level).then((data) => {
                if (!cancelled) {
                    setCurrentData(data)
                    setLoading(false)
                }
            })
        } else {
            setCurrentData([])
            setLoading(false)
        }

        return () => { cancelled = true }
    }, [type, level])

    useEffect(() => {
        setSelected([])
    }, [type, level])

    const checkIfSelected = (item) => {
        return selected.includes(item)
            ? setSelected(selected.filter((i) => i !== item))
            : setSelected([...selected, item])
    }

    const selectAll = () => {
        setSelected(currentData)
    }

    const checkThenNavigate = () => {
        return selected.length === 0
            ? alert('please select some kanji')
            : navigate('/dashboard/quiz-engine', {
                state: { questionsArray: selected, quizType, isWritten }
            })
    }

    const displayData = currentData

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4" style={{ backgroundColor: COLORS.background }}>
            {/* Close Button */}
            <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
            >
                <X size={24} />
            </button>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {[...topics, ...kana].map((item) => {
                    const isActive = type === item.topicName
                    return (
                        <button
                            key={item.header}
                            onClick={() => setType(item.topicName)}
                            className="px-4 py-2 rounded-xl font-medium transition-all duration-300"
                            style={{
                                backgroundColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                                color: isActive ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveBorder
                            }}
                        >
                            {item.header}
                        </button>
                    )
                })}
            </div>

            {/* Level Selection (JLPT only) */}
            {type === 'jlpt' && (
                <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((value) => {
                        const isActive = value === level
                        return (
                            <button
                                key={`jlpt${value}`}
                                onClick={() => setLevel(value)}
                                className="px-6 py-2 rounded-full font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                                    color: isActive ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveBorder
                                }}
                            >
                                N{value}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-4 border-t-4 animate-spin" style={{ borderColor: COLORS.brandPrimary, borderTopColor: 'transparent' }} />
                </div>
            )}

            {/* Kanji Grid */}
            {!loading && displayData.length > 0 && (
                <div className="rounded-2xl p-4 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                    <div className="grid gap-2 grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                        {displayData.map((item, index) => {
                            const isActive = selected.includes(item)
                            return (
                                <button
                                    key={`${item.kanjiName}-${index}`}
                                    onClick={() => checkIfSelected(item)}
                                    className="p-3 rounded-xl font-medium text-xl transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                                        color: isActive ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveBorder
                                    }}
                                >
                                    {item.kanjiName}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Selection Controls */}
            <div className="space-y-3">
                {/* Top Row: select all, unselect */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={selectAll}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: COLORS.interactiveSurface,
                            color: COLORS.textPrimary,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: COLORS.interactiveBorder
                        }}
                    >
                        select all
                    </button>
                    <button
                        onClick={() => setSelected([])}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: COLORS.interactiveSurface,
                            color: COLORS.textPrimary,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: COLORS.interactiveBorder
                        }}
                    >
                        unselect
                    </button>
                </div>

                {/* Written/MCQ Toggle */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsWritten(true)}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: isWritten ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                            color: isWritten ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: isWritten ? COLORS.interactivePrimary : COLORS.interactiveBorder
                        }}
                    >
                        Written
                    </button>
                    <button
                        onClick={() => setIsWritten(false)}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: !isWritten ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                            color: !isWritten ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: !isWritten ? COLORS.interactivePrimary : COLORS.interactiveBorder
                        }}
                    >
                        MCQ
                    </button>
                </div>

                {/* Quiz Type Selection */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setQuizType('meaning')}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: quizType === 'meaning' ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                            color: quizType === 'meaning' ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: quizType === 'meaning' ? COLORS.interactivePrimary : COLORS.interactiveBorder
                        }}
                    >
                        meaning
                    </button>
                    <button
                        onClick={() => setQuizType('part')}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: quizType === 'part' ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                            color: quizType === 'part' ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: quizType === 'part' ? COLORS.interactivePrimary : COLORS.interactiveBorder
                        }}
                    >
                        on
                    </button>
                    <button
                        onClick={() => setQuizType('full')}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300"
                        style={{
                            backgroundColor: quizType === 'full' ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                            color: quizType === 'full' ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: quizType === 'full' ? COLORS.interactivePrimary : COLORS.interactiveBorder
                        }}
                    >
                        kun
                    </button>
                </div>
            </div>

            {/* Start Quiz Button */}
            <button
                onClick={checkThenNavigate}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
                style={{
                    backgroundColor: COLORS.interactivePrimary,
                    color: COLORS.interactiveTextOnPrimary
                }}
            >
                Start Quiz
            </button>
        </div>
    )
}
