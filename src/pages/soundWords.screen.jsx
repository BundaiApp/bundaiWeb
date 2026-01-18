import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { RefreshCw, BookOpen } from "lucide-react"
import COLORS from "../theme/colors"
import wordCategories from "../util/wordCategories.json"
import GET_PENDING_SOUND_FLASHCARDS from "../graphql/queries/getPendingSoundFlashCards.query"

export default function SoundWords() {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId") || ""
    const isGuest = !userId

    const { data: pendingData, loading, refetch } = useQuery(GET_PENDING_SOUND_FLASHCARDS, {
        variables: { userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    const pendingCount = pendingData?.getPendingSoundFlashCards?.length || 0

    const handleCategoryClick = (categoryId) => {
        navigate('/dashboard/word-category', { state: { categoryId, categoryName: wordCategories[categoryId].name } })
    }

    const handleRefresh = () => {
        if (!isGuest) {
            refetch()
        }
    }

    const categories = Object.entries(wordCategories).map(([id, category]) => ({
        id,
        ...category
    }))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <RefreshCw className="w-12 h-12 animate-spin" style={{ color: COLORS.brandPrimary }} />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        Words
                    </h1>
                    <p style={{ color: COLORS.textSecondary }}>
                        Learn Japanese vocabulary with images
                    </p>
                </div>
                {!isGuest && (
                    <button
                        onClick={handleRefresh}
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: COLORS.interactiveSurface }}
                    >
                        <RefreshCw className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                    </button>
                )}
            </div>

            {/* Pending Review Count */}
            {!isGuest && (
                <div
                    className="p-6 rounded-2xl text-center"
                    style={{ backgroundColor: COLORS.brandPrimary }}
                >
                    <div className="text-6xl md:text-7xl font-bold mb-2" style={{ color: COLORS.interactiveTextOnPrimary }}>
                        {pendingCount}
                    </div>
                    <div className="text-lg" style={{ color: COLORS.interactiveTextOnPrimary }}>
                        {pendingCount === 0 ? 'All caught up!' : 'Words due for review'}
                    </div>
                </div>
            )}

            {/* Guest Prompt */}
            {isGuest && (
                <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: COLORS.surface }}>
                    <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        Track Your Progress
                    </h2>
                    <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
                        Sign up to use spaced repetition and master vocabulary
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Sign Up
                    </button>
                </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] text-left"
                        style={{
                            backgroundColor: COLORS.surface,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{category.icon}</span>
                            <div className="flex-1">
                                <div className="text-xl md:text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                                    {category.name}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                            {category.wordCount} words
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
