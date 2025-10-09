import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import COLORS from "../theme/colors"

export default function QuizEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionsArray = [] } = location.state || {}

    const [number, setNumber] = useState(0)
    const [selectedAns, setSelectedAns] = useState(null)

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

    const getButtonColor = (answer) => {
        if (!selectedAns) return COLORS.surface

        if (selectedAns === answer) {
            return currentQuestion.meanings.includes(answer)
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

            {/* Bottom Section - Answer Options */}
            <div className="flex-[2] flex items-start justify-center px-4 md:px-8 pb-8">
                <div className="grid grid-cols-2 gap-3 w-full max-w-3xl">
                    {currentQuestion.quizAnswers.map((answer, index) => (
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
                    ))}
                </div>
            </div>
        </div>
    )
}

