import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useLocation, useNavigate } from "react-router-dom"
import COLORS from "../theme/colors"
import CALCULATE_NEXT_REVIEW_DATE from "../graphql/mutations/calculateNextReviewDate.mutation"

export default function SRSEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionsArray = [] } = location.state || {}

    const userId = localStorage.getItem("userId") || "defaultUser"
    const [number, setNumber] = useState(0)
    const [selectedAns, setSelectedAns] = useState(null)

    const [calculateNextReviewDate] = useMutation(CALCULATE_NEXT_REVIEW_DATE)

    if (!questionsArray.length) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No questions available
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/srs')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to SRS
                    </button>
                </div>
            </div>
        )
    }

    const currentQuestion = questionsArray[number]
    const meanings = Array.isArray(currentQuestion?.meanings)
        ? currentQuestion.meanings
        : [currentQuestion?.meanings].filter(Boolean)

    const moveToNextQuestion = async (answer) => {
        setSelectedAns(answer)

        const rating = Number(currentQuestion.rating) || 0
        const isCorrect = meanings.includes(answer)
        const nextRating = Math.max(
            1,
            Math.min(8, isCorrect ? rating + 1 : rating - 1),
        )

        try {
            await calculateNextReviewDate({
                variables: {
                    userId: userId,
                    id: currentQuestion._id,
                    rating: nextRating
                }
            })
        } catch (error) {
            console.error("Error updating review date:", error)
        }

        setTimeout(() => {
            if (number !== questionsArray.length - 1) {
                setNumber(number + 1)
                setSelectedAns(null)
            } else {
                navigate('/dashboard/srs')
            }
        }, 500)
    }

    const getButtonColor = (answer) => {
        if (!selectedAns) return COLORS.surface

        if (selectedAns === answer) {
            return meanings.includes(answer)
                ? COLORS.accentSuccess
                : COLORS.accentDanger
        }

        return COLORS.surface
    }

    return (
        <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: COLORS.background }}>
            {/* Progress indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="text-lg font-medium px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}>
                    {number + 1} / {questionsArray.length}
                </div>
            </div>

            {/* Top Section - Kanji Display */}
            <div className="flex-[3] flex items-center justify-center pb-8">
                <div className="text-center">
                    <div className="text-8xl md:text-[10rem] font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        {currentQuestion?.kanjiName}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Answer Options */}
            <div className="flex-[2] flex items-start justify-center px-4 md:px-8 pb-8">
                <div className="grid grid-cols-2 gap-3 w-full max-w-3xl">
                    {currentQuestion?.quizAnswers?.length > 0 ? (
                        currentQuestion.quizAnswers.slice(0, 4).map((answer, index) => (
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
            </div>
        </div>
    )
}
