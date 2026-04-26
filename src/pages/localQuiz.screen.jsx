import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import COLORS from '../theme/colors'
import { topics, kana } from '../util/constants'
import Hiragana from '../util/hiragana.json'
import Katakana from '../util/katakana.json'
import { provideData, provideTopWordsData } from '../util/jlptArray'
import { X } from 'lucide-react'

export default function LocalQuiz() {
    const navigate = useNavigate()
    const [type, setType] = useState('jlpt')
    const [level, setLevel] = useState(5)
    const [selected, setSelected] = useState([])
    const [quizType, setQuizType] = useState('meaning')
    const [isWritten, setIsWritten] = useState(false)
    const [itemCount, setItemCount] = useState(10)

    const count = itemCount === "All" ? 1000 : itemCount

    const currentData = useMemo(() => {
        if (type === 'jlpt') return provideData('jlpt', level) || []
        if (type === 'strokes') return provideData('strokes', level) || []
        if (type === 'grades') return provideData('grade', level) || []
        if (type === 'verbs') return provideTopWordsData('verbs', `n${level}`, count) || []
        if (type === 'nouns') return provideTopWordsData('nouns', `n${level}`, count) || []
        if (type === 'adjectives') return provideTopWordsData('adjectives', `n${level}`, count) || []
        if (type === 'adverbs') return provideTopWordsData('adverbs', `n${level}`, count) || []
        if (type === 'hiragana') return Hiragana
        if (type === 'katakana') return Katakana
        return []
    }, [count, level, type])

    useEffect(() => {
        setSelected([])
    }, [type, level, itemCount])

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

    const ITEM_COUNTS = [10, 20, 50, 100, 'All']

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

            {/* Level Selection */}
            <div className="flex flex-wrap gap-2">
                {(type === 'jlpt' || type === 'verbs' || type === 'adjectives' || type === 'adverbs' || type === 'nouns') &&
                    [5, 4, 3, 2, 1].map((value) => {
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

                {type === 'grades' &&
                    Array.from({ length: 9 }, (_, i) => i + 1).map((value) => {
                        const isActive = value === level
                        return (
                            <button
                                key={`grade${value}`}
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
                                {value}
                            </button>
                        )
                    })}

                {type === 'strokes' &&
                    Array.from({ length: 24 }, (_, i) => i + 1).map((value) => {
                        const isActive = value === level
                        return (
                            <button
                                key={`stroke${value}`}
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
                                {value}
                            </button>
                        )
                    })}
            </div>

            {/* Item Count Filter for Words */}
            {(type === 'verbs' || type === 'adjectives' || type === 'adverbs' || type === 'nouns') && (
                <div className="flex flex-wrap gap-2">
                    {ITEM_COUNTS.map((count) => {
                        const isActive = itemCount === count
                        return (
                            <button
                                key={count}
                                onClick={() => setItemCount(count)}
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveSurface,
                                    color: isActive ? COLORS.interactiveTextOnPrimary : COLORS.interactiveTextInactive,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: isActive ? COLORS.interactivePrimary : COLORS.interactiveBorder
                                }}
                            >
                                {count}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Kanji Grid */}
            <div className="rounded-2xl p-4 shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                <div className={`grid gap-2 ${type === 'jlpt' || type === 'strokes' || type === 'grades'
                        ? 'grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'
                        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                    }`}>
                    {currentData.map((item, index) => {
                        const isActive = selected.includes(item)
                        const displayText = (type === 'jlpt' || type === 'strokes' || type === 'grades' || type === 'hiragana' || type === 'katakana')
                            ? item.kanjiName
                            : item.kanji || item.kanjiName

                        return (
                            <button
                                key={`${displayText}-${index}`}
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
                                {displayText}
                            </button>
                        )
                    })}
                </div>
            </div>

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
