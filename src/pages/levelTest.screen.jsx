import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import COLORS from "../theme/colors"
import { getLevelContent } from "../util/levelSystem"
import UPDATE_CURRENT_LEVEL from "../graphql/mutations/updateCurrentLevel.mutation"

const PASS_THRESHOLD = 0.7
const TOTAL_QUESTIONS = 20

export default function LevelTest() {
    const navigate = useNavigate()
    const [updateCurrentLevel] = useMutation(UPDATE_CURRENT_LEVEL)

    const userId = localStorage.getItem("userId") || ""
    const isGuest = !userId

    const [selectedLevel, setSelectedLevel] = useState(null)
    const [testState, setTestState] = useState("select") // select | loading | test | result
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [customLevel, setCustomLevel] = useState("")

    const currentQuestion = questions[currentIndex]
    const score = answers.filter((a) => a.correct).length
    const scorePercent = questions.length > 0 ? (score / questions.length) * 100 : 0
    const passed = scorePercent >= PASS_THRESHOLD * 100

    const generateQuestions = useCallback(async (targetLevel) => {
        if (isGuest) {
            navigate("/signup")
            return
        }
        try {
            setTestState("loading")
            const levelData = await getLevelContent(targetLevel)

            const allKanji = levelData.kanji || []
            const allWords = levelData.words || []

            const shuffledKanji = [...allKanji].sort(() => Math.random() - 0.5)
            const shuffledWords = [...allWords].sort(() => Math.random() - 0.5)
            const usedKanji = new Set()
            const usedWord = new Set()
            const generatedQuestions = []

            const getWrongAnswers = (correct, pool, maxWrong = 3) => {
                return pool
                    .filter((item) => item !== correct)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, maxWrong)
            }

            for (let i = 0; i < TOTAL_QUESTIONS; i++) {
                let item, type

                if (i < 12) {
                    item = shuffledKanji[i % shuffledKanji.length]
                    if (!item || usedKanji.has(item.kanji || item.kanjiName)) continue
                    usedKanji.add(item.kanji || item.kanjiName)
                    type = i % 2 === 0 ? "meaning" : "kun"
                } else {
                    item = shuffledWords[(i - 12) % shuffledWords.length]
                    if (!item || usedWord.has(item.word || item.kanjiName)) continue
                    usedWord.add(item.word || item.kanjiName)
                    type = "word"
                }

                if (!item) continue

                let question
                const kanjiChar = item.kanji || item.kanjiName

                if (type === "meaning") {
                    const meanings = item.meanings || (item.meaning ? [item.meaning] : [])
                    if (!meanings[0]) continue
                    const correctAnswer = meanings[0]
                    const wrongPool = allKanji
                        .filter((k) => {
                            const m = k.meanings || (k.meaning ? [k.meaning] : [])
                            return m[0] && m[0] !== correctAnswer && !usedKanji.has(k.kanji || k.kanjiName)
                        })
                        .map((k) => {
                            const m = k.meanings || (k.meaning ? [k.meaning] : [])
                            return m[0]
                        })
                    const wrongAnswers = getWrongAnswers(correctAnswer, wrongPool, 3)
                    if (wrongAnswers.length >= 3) {
                        question = {
                            type: "meaning",
                            prompt: kanjiChar,
                            correct: correctAnswer,
                            options: [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
                        }
                    }
                } else if (type === "kun") {
                    const kun = item.kun?.[0]
                    if (!kun) continue
                    const correctAnswer = kun
                    const wrongPool = allKanji
                        .filter((k) => k?.kun?.[0] && k.kun[0] !== correctAnswer && !usedKanji.has(k.kanji || k.kanjiName))
                        .map((k) => k.kun[0])
                    const wrongAnswers = getWrongAnswers(correctAnswer, wrongPool, 3)
                    if (wrongAnswers.length >= 3) {
                        question = {
                            type: "kun",
                            prompt: kanjiChar,
                            correct: correctAnswer,
                            options: [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
                        }
                    }
                } else if (type === "word") {
                    const wordText = item.word || item.kanjiName || ""
                    const wordMeaning = item.meaning || (item.meanings?.[0]) || ""
                    if (!wordMeaning || !wordText) continue
                    const correctAnswer = wordText
                    const wrongPool = allWords
                        .filter((w) => {
                            const wm = w.meaning || (w.meanings?.[0]) || ""
                            const wt = w.word || w.kanjiName || ""
                            return wt && wm && wt !== wordText && !usedWord.has(wt)
                        })
                        .map((w) => w.word || w.kanjiName || "")
                    const wrongAnswers = getWrongAnswers(correctAnswer, wrongPool, 3)
                    if (wrongAnswers.length >= 3) {
                        question = {
                            type: "word",
                            prompt: wordMeaning,
                            correct: correctAnswer,
                            options: [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
                        }
                    }
                }

                if (question) {
                    generatedQuestions.push(question)
                }
            }

            generatedQuestions.sort(() => Math.random() - 0.5)

            setQuestions(generatedQuestions.slice(0, TOTAL_QUESTIONS))
            setCurrentIndex(0)
            setAnswers([])
            setTestState("test")
        } catch (error) {
            console.error("Error loading level content:", error)
            alert("Failed to load level content. Please try another level.")
            setTestState("select")
        }
    }, [isGuest, navigate])

    const handleLevelSelect = (level) => {
        setSelectedLevel(level)
        generateQuestions(level)
    }

    const handleAnswer = (answer) => {
        if (!currentQuestion) return
        setSelectedAnswer(answer)
        const isCorrect = answer === currentQuestion.correct

        setTimeout(() => {
            const newAnswers = [
                ...answers,
                { question: currentQuestion, answer, correct: isCorrect }
            ]
            setAnswers(newAnswers)
            setSelectedAnswer(null)

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1)
            } else {
                setTestState("result")
            }
        }, 400)
    }

    const handlePass = async () => {
        if (!selectedLevel || !userId) return
        try {
            await updateCurrentLevel({
                variables: { userId, currentLevel: selectedLevel }
            })
            localStorage.setItem("currentLevel", String(selectedLevel))

            // Seed the new level's study queue
            const levelData = await getLevelContent(selectedLevel)
            const allItems = [
                ...(levelData.kanji || []).map((k) => ({
                    kanjiName: k.kanji || k.kanjiName,
                    hiragana: k.kun?.[0] || k.reading || "",
                    meanings: k.meanings || [k.meaning || ""],
                    quizAnswers: k.quizAnswers || k.meanings || [k.meaning || ""]
                })),
                ...(levelData.words || []).map((w) => ({
                    kanjiName: w.word || w.kanjiName || "",
                    hiragana: w.reading || "",
                    meanings: [w.meaning || ""],
                    quizAnswers: w.quizAnswers || [w.meaning || ""]
                }))
            ].filter((item) => item.kanjiName && item.meanings[0])

            // Seed in batches to avoid overwhelming the server
            const batchSize = 10
            for (let i = 0; i < allItems.length; i += batchSize) {
                const batch = allItems.slice(i, i + batchSize)
                await Promise.all(batch.map((item) =>
                    addFlashCard({
                        variables: {
                            userId,
                            kanjiName: item.kanjiName,
                            hiragana: item.hiragana,
                            meanings: item.meanings,
                            quizAnswers: item.quizAnswers,
                            level: selectedLevel,
                            source: "level"
                        }
                    }).catch(() => null)
                ))
            }

            navigate("/dashboard/srs", { replace: true })
        } catch (error) {
            console.error("Error updating level:", error)
            alert("Failed to update level. Please try again.")
        }
    }

    const handleRetryLower = () => {
        const newLevel = Math.max(1, selectedLevel - 5)
        setSelectedLevel(newLevel)
        generateQuestions(newLevel)
    }

    const handleGoBack = () => {
        setTestState("select")
        setSelectedLevel(null)
        setQuestions([])
        setAnswers([])
    }

    const handleCustomLevelSubmit = (e) => {
        e.preventDefault()
        const level = parseInt(customLevel, 10)
        if (level >= 1 && level <= 50) {
            setCustomLevel("")
            setSelectedLevel(level)
            generateQuestions(level)
        } else {
            alert("Please enter a level between 1 and 50")
        }
    }

    if (testState === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 mx-auto mb-4 animate-spin"
                        style={{ borderColor: COLORS.brandPrimary, borderTopColor: 'transparent' }} />
                    <p className="text-base" style={{ color: COLORS.textSecondary }}>Loading questions...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="sticky top-0 z-20 p-4 flex items-center" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <button
                    onClick={() => testState === "result" || testState === "select" ? navigate(-1) : handleGoBack()}
                    className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: COLORS.textSecondary }}
                >
                    ← Back
                </button>
                <h1 className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.brandPrimary }}>
                    {testState === "select" ? "Level Test" : `Level ${selectedLevel} Test`}
                </h1>
                <div className="w-16" />
            </div>

            {/* Select Screen */}
            {testState === "select" && (
                <div className="max-w-lg mx-auto p-6 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                            Take Level Test
                        </h2>
                        <p style={{ color: COLORS.textSecondary }}>
                            Test your Japanese level to skip ahead
                        </p>
                    </div>

                    {isGuest ? (
                        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: COLORS.surface }}>
                            <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                                Sign up to take level tests
                            </h3>
                            <p className="mb-5" style={{ color: COLORS.textSecondary }}>
                                Create a free account to save your progress and skip ahead.
                            </p>
                            <button
                                onClick={() => navigate("/signup")}
                                className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                                style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                            >
                                Sign Up
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.surface }}>
                                <h3 className="text-base font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                                    How it works
                                </h3>
                                <p style={{ color: COLORS.textSecondary, lineHeight: 1.6 }}>
                                    Answer {TOTAL_QUESTIONS} questions about a level.<br />
                                    Score {Math.round(PASS_THRESHOLD * 100)}% or higher to unlock that level.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                                    Select target level
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => handleLevelSelect(level)}
                                            className="aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-105"
                                            style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>
                                    Or enter a level (1-50)
                                </p>
                                <form onSubmit={handleCustomLevelSubmit} className="flex gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={customLevel}
                                        onChange={(e) => setCustomLevel(e.target.value)}
                                        placeholder="e.g. 7"
                                        className="flex-1 rounded-xl px-4 py-3 text-lg font-bold outline-none"
                                        style={{
                                            backgroundColor: COLORS.surface,
                                            color: COLORS.textPrimary,
                                            border: `1px solid ${COLORS.cardKanji}`
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 rounded-xl text-lg font-bold transition-all duration-200 hover:scale-105"
                                        style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                                    >
                                        Go
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Test Screen */}
            {testState === "test" && (
                <div className="flex flex-col h-[calc(100vh-64px)]">
                    {/* Progress Bar */}
                    <div className="h-1" style={{ backgroundColor: COLORS.interactiveSurface }}>
                        <div
                            className="h-full transition-all duration-300"
                            style={{
                                backgroundColor: COLORS.brandPrimary,
                                width: `${((currentIndex + 1) / questions.length) * 100}%`
                            }}
                        />
                    </div>

                    <div className="flex justify-between px-6 py-3">
                        <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                            Score: {answers.filter((a) => a.correct).length}/{currentIndex}
                        </span>
                    </div>

                    {/* Question */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>
                            {currentQuestion?.type === "meaning" && "What does this mean?"}
                            {currentQuestion?.type === "kun" && "Kun'yomi (Japanese reading)"}
                            {currentQuestion?.type === "word" && "Which word matches this meaning?"}
                        </p>
                        <p className="text-6xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {currentQuestion?.prompt}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="px-6 pb-8 space-y-3">
                        {currentQuestion?.options?.map((option, index) => {
                            const isSelected = selectedAnswer === option
                            const isCorrectOption = option === currentQuestion.correct

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!selectedAnswer}
                                    className="w-full rounded-2xl p-4 text-center text-base font-bold transition-all duration-200"
                                    style={{
                                        backgroundColor: isSelected
                                            ? (isCorrectOption ? COLORS.accentSuccess : COLORS.accentDanger)
                                            : COLORS.surface,
                                        color: isSelected ? COLORS.surface : COLORS.textPrimary,
                                        opacity: selectedAnswer && !isSelected ? 0.5 : 1,
                                        cursor: selectedAnswer ? 'default' : 'pointer'
                                    }}
                                >
                                    {option}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Result Screen */}
            {testState === "result" && (
                <div className="flex flex-col items-center justify-center px-8 h-[calc(100vh-64px)] text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        {passed ? "Level Unlocked!" : "Try Again"}
                    </h2>

                    <p className="text-7xl font-bold mb-4" style={{ color: COLORS.brandPrimary }}>
                        {Math.round(scorePercent)}%
                    </p>

                    <p className="text-sm mb-8" style={{ color: COLORS.textSecondary, lineHeight: 1.8 }}>
                        {score} correct out of {questions.length} questions<br />
                        {passed
                            ? `You've unlocked Level ${selectedLevel}!`
                            : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass.`}
                    </p>

                    {passed ? (
                        <button
                            onClick={handlePass}
                            className="w-full max-w-sm py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                        >
                            Start at Level {selectedLevel}
                        </button>
                    ) : (
                        <div className="w-full max-w-sm space-y-3">
                            <button
                                onClick={handleRetryLower}
                                className="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    color: COLORS.cardKanji,
                                    border: `1px solid ${COLORS.cardKanji}`
                                }}
                            >
                                Try Level {Math.max(1, selectedLevel - 5)}
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105"
                                style={{ backgroundColor: COLORS.cardKanji, color: COLORS.surface }}
                            >
                                Back to Levels
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
