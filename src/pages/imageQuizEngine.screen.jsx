import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import { Volume2, VolumeX } from "lucide-react"
import COLORS from "../theme/colors"
import CALCULATE_SOUND_NEXT_REVIEW_DATE from "../graphql/mutations/calculateSoundNextReviewDate.mutation.js"

export default function ImageQuizEngine() {
    const location = useLocation()
    const navigate = useNavigate()
    const { word, categoryName, allWords = [] } = location.state || {}
    const userId = localStorage.getItem("userId") || ""
    const isGuest = !userId

    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAns, setSelectedAns] = useState(null)
    const [answerState, setAnswerState] = useState(null)

    const [calculateSoundNextReviewDate] = useMutation(CALCULATE_SOUND_NEXT_REVIEW_DATE)

    if (!word || !word.kanji) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No word available
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

    const currentQuestion = word

    const moveToNextQuestion = (answer) => {
        setSelectedAns(answer)
        const isCorrect = answer.kanji === currentQuestion.kanji

        if (isCorrect) {
            setAnswerState('correct')
        } else {
            setAnswerState('wrong')
        }

        if (!isGuest) {
            const rating = Number(currentQuestion.rating || 0)
            const newRating = isCorrect ? Math.min(7, rating + 1) : Math.max(0, rating - 1)

            try {
                calculateSoundNextReviewDate({
                    variables: {
                        userId: userId,
                        id: currentQuestion._id,
                        rating: newRating
                    }
                })
            } catch (error) {
                console.error("Error updating review date:", error)
            }
        }

        setTimeout(() => {
            if (currentIndex < allWords.length - 1) {
                setCurrentIndex(currentIndex + 1)
                const nextWord = allWords[currentIndex + 1]
                navigate('/dashboard/image-quiz-engine', {
                    state: {
                        word: nextWord,
                        categoryName,
                        allWords
                    }
                })
            } else {
                navigate('/dashboard/word-category', {
                    state: {
                        categoryId: word.categoryId,
                        categoryName
                    }
                })
            }
        }, 1500)
    }

    const playAudio = () => {
        const audioPath = `/audio/words/word_${currentQuestion.reading}.mp3`
        console.log("Playing audio:", audioPath)

        const audio = new Audio(audioPath)
        audio.play().catch(error => {
            console.error("Failed to play audio:", error)
        })
    }

    const getButtonColor = (answer) => {
        if (!selectedAns) return COLORS.surface

        if (selectedAns === answer) {
            return answer.kanji === currentQuestion.kanji
                ? COLORS.accentSuccess
                : COLORS.accentDanger
        }

        return COLORS.surface
    }

    const getButtonTextColor = (answer) => {
        if (!selectedAns) return COLORS.textPrimary

        if (selectedAns === answer) {
            return answer.kanji === currentQuestion.kanji
                ? COLORS.surface
                : COLORS.surface
        }

        return COLORS.textPrimary
    }

    return (
        <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: COLORS.background }}>
            {/* Progress Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div
                    className="text-lg font-medium px-4 py-2 rounded-full"
                    style={{
                        backgroundColor: COLORS.surface,
                        color: COLORS.textPrimary
                    }}
                >
                    {currentIndex + 1} / {allWords.length}
                </div>
            </div>

            {/* Top Section - Image */}
            <div className="flex-[3] flex items-center justify-center pb-8">
                <div className="text-center w-full max-w-lg">
                    {/* Image */}
                    <div className="mb-6">
                        <img
                            src={`/images/${currentQuestion.image}.png`}
                            alt={currentQuestion.meaning}
                            className="w-full max-w-sm mx-auto aspect-square object-contain rounded-2xl"
                            style={{ backgroundColor: COLORS.surface }}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = `/images/${currentQuestion.image.toLowerCase()}.png`
                            }}
                        />
                    </div>

                    {/* Word Info */}
                    {answerState && (
                        <div className="mb-6">
                            {answerState === 'correct' ? (
                                <div
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl"
                                    style={{ backgroundColor: COLORS.accentSuccess }}
                                >
                                    <div className="text-4xl font-bold" style={{ color: COLORS.surface }}>
                                        {currentQuestion.kanji}
                                    </div>
                                    <div className="text-xl" style={{ color: COLORS.surface }}>
                                        {currentQuestion.reading}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div
                                        className="text-4xl font-bold mb-4"
                                        style={{ color: COLORS.textPrimary }}
                                    >
                                        {currentQuestion.kanji}
                                    </div>
                                    <div
                                        className="text-xl mb-4"
                                        style={{ color: COLORS.brandPrimary }}
                                    >
                                        {currentQuestion.reading}
                                    </div>
                                    <div
                                        className="text-xl font-bold"
                                        style={{ color: COLORS.accentSuccess }}
                                    >
                                        {currentQuestion.quizAnswers.find(a => a.kanji === currentQuestion.kanji)?.romaji}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section - Answer Options */}
            <div className="flex-[2] flex items-start justify-center px-4 md:px-8 pb-8">
                <div className="w-full max-w-3xl space-y-4">
                    {/* Audio Button */}
                    <button
                        onClick={playAudio}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            backgroundColor: COLORS.brandPrimary,
                            color: COLORS.interactiveTextOnPrimary
                        }}
                    >
                        <Volume2 className="w-6 h-6" />
                        <span>Play Audio</span>
                    </button>

                    {/* Quiz Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {currentQuestion.quizAnswers?.length > 0 ? (
                            currentQuestion.quizAnswers.map((answer, index) => (
                                <button
                                    key={index}
                                    onClick={() => !selectedAns && moveToNextQuestion(answer)}
                                    disabled={selectedAns !== null}
                                    className="aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: getButtonColor(answer),
                                        color: getButtonTextColor(answer),
                                        boxShadow: selectedAns ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold mb-1">
                                            {answer.kanji}
                                        </div>
                                        <div className="text-sm md:text-base">
                                            {answer.reading}
                                        </div>
                                        <div className="text-xs md:text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                                            {answer.romaji}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8" style={{ color: COLORS.textSecondary }}>
                                No quiz answers available for this item
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
