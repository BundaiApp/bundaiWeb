import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import COLORS from '../theme/colors'
import { topics, words, kana } from '../util/constants'
import Hiragana from '../util/hiragana.json'
import Katakana from '../util/katakana.json'
import { provideData, provideTopWordsData } from '../util/jlptArray'
import ADD_BULK_FLASHCARD from '../graphql/mutations/addBulkFlashCard.mutation'

export default function LocalQuiz() {
    const navigate = useNavigate()
    const [type, setType] = useState('jlpt')
    const [level, setLevel] = useState(5)
    const [selected, setSelected] = useState([])
    const [quizType, setQuizType] = useState('meaning')
    const [isWritten, setIsWritten] = useState(false)
    const [itemCount, setItemCount] = useState(10)
    const userId = localStorage.getItem("userId") || "defaultUser"

    const [addBulk, { loading }] = useMutation(ADD_BULK_FLASHCARD)

    const addCardsInBulk = async () => {
        const modifiedSelected = selected.map((item) => ({
            kanjiName: item.kanjiName,
            meanings: item.meanings,
            quizAnswers: item.quizAnswers
        }))
        await addBulk({
            variables: {
                userId,
                kanjis: modifiedSelected
            }
        })
    }

    const checkIfSelected = (item) => {
        return selected.includes(item)
            ? setSelected(selected.filter((i) => i !== item))
            : setSelected([...selected, item])
    }

    const selectAll = () => {
        return type === 'jlpt' || type === 'strokes' || type === 'grades'
            ? setSelected([...selected, ...dataTypes[type][level]])
            : setSelected([...selected, ...dataTypes[type]])
    }

    const checkThenNavigate = () => {
        return selected.length === 0
            ? alert('please select some kanji')
            : navigate('/dashboard/quiz-engine', {
                state: { questionsArray: selected, quizType, isWritten }
            })
    }

    const dataTypes = {
        jlpt: provideData('jlpt', level, true),
        strokes: provideData('strokes', level, true),
        grades: provideData('grade', level, true),
        verbs: provideTopWordsData('verbs', `n${level}`, itemCount),
        adjectives: provideTopWordsData('adjectives', `n${level}`, itemCount),
        adverbs: provideTopWordsData('adverbs', `n${level}`, itemCount),
        nouns: provideTopWordsData('nouns', `n${level}`, itemCount),
        hiragana: Hiragana,
        katakana: Katakana
    }

    const ITEM_COUNTS = [10, 20, 50, 100, 'All']

    const currentData = type === 'jlpt' || type === 'strokes' || type === 'grades'
        ? (dataTypes[type][level] || [])
        : (dataTypes[type] || [])

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4" style={{ backgroundColor: COLORS.background }}>
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {[...topics, ...words, ...kana].map((item) => {
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
                            : item.kanji

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
                {/* Top Row: select all, unselect, save all */}
                <div className="grid grid-cols-3 gap-3">
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
                    <button
                        onClick={addCardsInBulk}
                        disabled={loading}
                        className="px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
                        style={{
                            backgroundColor: COLORS.interactiveSurface,
                            color: COLORS.textPrimary,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: COLORS.interactiveBorder
                        }}
                    >
                        {loading ? 'loading...' : 'save all'}
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
