import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toHiragana } from "wanakana"
import { X } from "lucide-react"
import COLORS from "../theme/colors"

export default function QuizEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionsArray = [], quizType = 'meaning', isWritten = false } = location.state || {}

    const [number, setNumber] = useState(0)
    const [selectedAns, setSelectedAns] = useState(null)
    const [textInput, setTextInput] = useState("")
    const [answerState, setAnswerState] = useState("static")
    const [answers, setAnswers] = useState([])
    const [showResult, setShowResult] = useState(false)
    const inputRef = useRef(null)

    const totalQuestions = questionsArray.length
    const score = answers.filter((a) => a.correct).length
    const scorePercent = answers.length > 0 ? (score / answers.length) * 100 : 0

    const currentQuestion = questionsArray[number]
    const currentPrompt = currentQuestion?.kanjiName || currentQuestion?.kanji || ''

    const typeLabel =
        quizType === "meaning"
            ? "What does this mean?"
            : quizType === "part"
                ? "On'yomi (Chinese reading)"
                : "Kun'yomi (Japanese reading)"

    const checkMcqAnswer = (answer) => {
        if (quizType === "meaning") {
            return currentQuestion?.meanings?.includes(answer)
        } else if (quizType === "part") {
            return currentQuestion?.on?.includes(answer)
        } else {
            return currentQuestion?.kun?.includes(answer)
        }
    }

    const mcqOptions =
        quizType === "meaning"
            ? currentQuestion?.quizAnswers
            : quizType === "part"
                ? currentQuestion?.quizAnswersOn
                : currentQuestion?.quizAnswersKun

    const moveToNextQuestion = (answer) => {
        setSelectedAns(answer)
        const isCorrect = checkMcqAnswer(answer)
        const newAnswers = [...answers, { answer, correct: isCorrect }]
        setAnswers(newAnswers)

        setTimeout(() => {
            if (number < totalQuestions - 1) {
                setNumber(number + 1)
                setSelectedAns(null)
            } else {
                setAnswers(newAnswers)
                setShowResult(true)
            }
        }, 400)
    }

    const checkWrittenAnswer = () => {
        if (quizType === "part") {
            if (currentQuestion?.on && currentQuestion.on.includes(textInput)) {
                setAnswerState("right")
                return true
            }
            setAnswerState("wrong")
            return false
        }
        if (quizType === "full") {
            if (currentQuestion?.kun && currentQuestion.kun.includes(textInput)) {
                setAnswerState("right")
                return true
            }
            setAnswerState("wrong")
            return false
        }
        if (quizType === "meaning") {
            const capitalizedInput = textInput.charAt(0).toUpperCase() + textInput.slice(1)
            if (currentQuestion?.meanings && currentQuestion.meanings.includes(capitalizedInput)) {
                setAnswerState("right")
                return true
            }
            setAnswerState("wrong")
            return false
        }
        return false
    }

    const writeToNextQuestion = () => {
        const isCorrect = checkWrittenAnswer()
        const newAnswers = [...answers, { answer: textInput, correct: isCorrect }]

        setTimeout(() => {
            if (number < totalQuestions - 1) {
                setNumber(number + 1)
                setTextInput("")
                setAnswerState("static")
            } else {
                setAnswers(newAnswers)
                setShowResult(true)
            }
        }, 400)
    }

    const handleTextChange = (text) => {
        if (quizType === "part" || quizType === "full") {
            setTextInput(toHiragana(text, { IMEMode: true }))
        } else {
            setTextInput(text)
        }
    }

    const handleSubmit = (e) => {
        e?.preventDefault()
        writeToNextQuestion()
    }

    const handleRestart = () => {
        navigate('/dashboard/quiz')
    }

    if (!questionsArray.length) {
        return (
            <div className="flex items-center justify-center min-h-screen relative" style={{ backgroundColor: COLORS.background }}>
                <button
                    onClick={() => navigate('/dashboard/quiz')}
                    className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
                >
                    <X size={24} />
                </button>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No questions available
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/quiz')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Quiz
                    </button>
                </div>
            </div>
        )
    }

    // Result screen
    if (showResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center relative" style={{ backgroundColor: COLORS.background }}>
                <button
                    onClick={handleRestart}
                    className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                    Quiz Complete
                </h2>
                <p className="text-7xl font-bold mb-4" style={{ color: COLORS.brandPrimary }}>
                    {Math.round(scorePercent)}%
                </p>
                <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>
                    {score} correct out of {totalQuestions} questions
                </p>
                <button
                    onClick={handleRestart}
                    className="w-full max-w-sm py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                >
                    Done
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: COLORS.background }}>
            {/* Close Button */}
            <button
                onClick={handleRestart}
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}
            >
                <X size={24} />
            </button>

            {/* Progress Bar */}
            <div className="h-1" style={{ backgroundColor: COLORS.interactiveSurface }}>
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        backgroundColor: COLORS.brandPrimary,
                        width: `${((number + 1) / totalQuestions) * 100}%`
                    }}
                />
            </div>

            <div className="flex justify-between px-6 py-3">
                <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                    {number + 1} of {totalQuestions}
                </span>
                <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                    Score: {score}/{number}
                </span>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>
                    {typeLabel}
                </p>
                <p className={`font-bold text-center ${currentPrompt.length > 4 ? 'text-5xl' : 'text-7xl'}`}
                    style={{ color: COLORS.textPrimary }}>
                    {currentPrompt}
                </p>
            </div>

            {/* Answer Section */}
            <div className="px-6 pb-8">
                {isWritten ? (
                    <div className="flex flex-col items-center gap-4">
                        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                            <input
                                ref={inputRef}
                                type="text"
                                value={textInput}
                                onChange={(e) => handleTextChange(e.target.value)}
                                placeholder="Write your answer here"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoFocus
                                className="w-full text-xl text-center pb-3 bg-transparent outline-none"
                                style={{
                                    color: COLORS.textPrimary,
                                    borderBottom: `2px solid ${COLORS.outline}`
                                }}
                            />
                        </form>
                        <button
                            onClick={handleSubmit}
                            className="w-full max-w-2xl py-4 rounded-2xl font-bold text-lg transition-all duration-200"
                            style={{
                                backgroundColor: answerState === "right"
                                    ? COLORS.accentSuccess
                                    : answerState === "wrong"
                                        ? COLORS.accentDanger
                                        : COLORS.brandPrimary,
                                color: COLORS.surface
                            }}
                        >
                            Answer
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-2xl mx-auto">
                        {mcqOptions?.length > 0 ? (
                            mcqOptions.slice(0, 4).map((option, index) => {
                                const isSelected = selectedAns === option
                                const isCorrectOption = isSelected && checkMcqAnswer(option)

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !selectedAns && moveToNextQuestion(option)}
                                        disabled={!!selectedAns}
                                        className="w-full rounded-2xl p-4 text-center text-base font-bold transition-all duration-200"
                                        style={{
                                            backgroundColor: isSelected
                                                ? (isCorrectOption ? COLORS.accentSuccess : COLORS.accentDanger)
                                                : COLORS.surface,
                                            color: isSelected ? COLORS.surface : COLORS.textPrimary,
                                            opacity: selectedAns && !isSelected ? 0.5 : 1,
                                            cursor: selectedAns ? 'default' : 'pointer'
                                        }}
                                    >
                                        {option}
                                    </button>
                                )
                            })
                        ) : (
                            <div className="text-center py-8" style={{ color: COLORS.textSecondary }}>
                                No quiz answers available for this item
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
