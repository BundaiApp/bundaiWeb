import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toHiragana } from "wanakana"
import COLORS from "../theme/colors"

export default function QuizEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionsArray = [], quizType = 'meaning', isWritten = false } = location.state || {}

    const [number, setNumber] = useState(0)
    const [selectedAns, setSelectedAns] = useState(null)
    const [textInput, setTextInput] = useState("")
    const [answerState, setAnswerState] = useState("static") // "static", "right", "wrong"
    const inputRef = useRef(null)

    if (!questionsArray.length) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
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

    const currentQuestion = questionsArray[number]

    // Get the correct answers and options based on quiz type
    const getQuizData = () => {
        switch (quizType) {
            case 'meaning':
                return {
                    answers: currentQuestion?.quizAnswers || [],
                    correctAnswers: currentQuestion?.meanings || []
                }
            case 'part': // onyomi
                return {
                    answers: currentQuestion?.quizAnswersOn || currentQuestion?.on || [],
                    correctAnswers: currentQuestion?.on || []
                }
            case 'full': // kunyomi
                return {
                    answers: currentQuestion?.quizAnswersKun || currentQuestion?.kun || [],
                    correctAnswers: currentQuestion?.kun || []
                }
            default:
                return {
                    answers: currentQuestion?.quizAnswers || [],
                    correctAnswers: currentQuestion?.meanings || []
                }
        }
    }

    const quizData = getQuizData()

    // Reset text input and state when question changes
    useEffect(() => {
        setTextInput("")
        setAnswerState("static")
        if (isWritten && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [number, isWritten])

    const moveToNextQuestion = (answer) => {
        setSelectedAns(answer)

        // Local quiz - no backend calls, just practice
        // Move to next question after delay
        setTimeout(() => {
            if (number < questionsArray.length - 1) {
                setNumber(number + 1)
                setSelectedAns(null)
            } else {
                // Quiz completed
                navigate('/dashboard/quiz')
            }
        }, 500)
    }

    const checkAnswer = () => {
        const currentQuestion = questionsArray[number]

        if (quizType === "part") {
            // Check onyomi (on reading)
            if (currentQuestion?.on && currentQuestion.on.includes(textInput)) {
                setAnswerState("right")
            } else {
                setAnswerState("wrong")
            }
        } else if (quizType === "full") {
            // Check kunyomi (kun reading)
            if (currentQuestion?.kun && currentQuestion.kun.includes(textInput)) {
                setAnswerState("right")
            } else {
                setAnswerState("wrong")
            }
        } else if (quizType === "meaning") {
            // Check meaning (capitalize first letter)
            const capitalizedInput = textInput.charAt(0).toUpperCase() + textInput.slice(1)
            if (currentQuestion?.meanings && currentQuestion.meanings.includes(capitalizedInput)) {
                setAnswerState("right")
            } else {
                setAnswerState("wrong")
            }
        }
    }

    const writeToNextQuestion = () => {
        setTimeout(() => {
            if (number < questionsArray.length - 1) {
                setNumber(number + 1)
                setTextInput("")
                setAnswerState("static")
            } else {
                // Quiz completed
                navigate('/dashboard/quiz')
            }
        }, 500)
    }

    const handleTextChange = (text) => {
        if (quizType === "part" || quizType === "full") {
            // Convert to hiragana for readings
            setTextInput(toHiragana(text))
        } else {
            // Keep as is for meanings
            setTextInput(text)
        }
    }

    const handleSubmit = (e) => {
        e?.preventDefault()
        checkAnswer()
        writeToNextQuestion()
    }

    const getButtonColor = (answer) => {
        if (!selectedAns) return COLORS.surface

        if (selectedAns === answer) {
            return quizData.correctAnswers.includes(answer)
                ? COLORS.accentSuccess
                : COLORS.accentDanger
        }

        return COLORS.surface
    }

    return (
        <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: COLORS.background }}>
            {/* Top Section - Kanji Display */}
            <div className="flex-[3] flex items-center justify-center pb-8">
                <div className="text-center">
                    <div className="text-8xl md:text-9xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        {currentQuestion.kanjiName}
                    </div>
                    <div className="text-lg" style={{ color: COLORS.textSecondary }}>
                        Question {number + 1} of {questionsArray.length}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Answer Input/Options */}
            <div className="flex-[2] flex items-start justify-center px-4 md:px-8 pb-8">
                {isWritten ? (
                    // Written mode - Text input
                    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                        <form onSubmit={handleSubmit} className="w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                value={textInput}
                                onChange={(e) => handleTextChange(e.target.value)}
                                placeholder="write your answer here"
                                autoCapitalize="none"
                                autoComplete="off"
                                className="w-full text-2xl md:text-3xl text-center pb-3 bg-transparent outline-none"
                                style={{
                                    color: COLORS.textPrimary,
                                    borderBottom: `2px solid ${COLORS.outline}`
                                }}
                            />
                        </form>
                        <button
                            onClick={handleSubmit}
                            className="w-4/5 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105"
                            style={{
                                backgroundColor: answerState === "right"
                                    ? COLORS.accentSuccess
                                    : answerState === "wrong"
                                        ? COLORS.accentDanger
                                        : COLORS.brandSecondary,
                                color: COLORS.textPrimary,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            answer
                        </button>
                    </div>
                ) : (
                    // MCQ mode - Multiple choice buttons
                    <div className="grid grid-cols-2 gap-3 w-full max-w-3xl">
                        {quizData.answers.length > 0 ? (
                            quizData.answers.slice(0, 4).map((answer, index) => (
                                <button
                                    key={index}
                                    onClick={() => !selectedAns && moveToNextQuestion(answer)}
                                    disabled={selectedAns !== null}
                                    className="aspect-square rounded-2xl flex items-center justify-center text-xl md:text-2xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: getButtonColor(answer),
                                        color: COLORS.textPrimary,
                                        boxShadow: selectedAns ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {answer}
                                </button>
                            ))
                        ) : (
                            <div className="col-span-2 text-center" style={{ color: COLORS.textSecondary }}>
                                No quiz answers available for this item
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

