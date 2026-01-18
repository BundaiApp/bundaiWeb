import { useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { ArrowLeft, Check, X, RefreshCw } from "lucide-react"
import COLORS from "../theme/colors"
import getAnimeVocab from "../graphql/queries/getAnimeVocab.query"

export default function AnimeDetail() {
    const location = useLocation()
    const navigate = useNavigate()
    const { animeName, title } = location.state || {}

    const [filter, setFilter] = useState('all')

    const { data, loading, error, refetch } = useQuery(getAnimeVocab, {
        variables: { animeName },
        fetchPolicy: 'cache-first'
    })

    const vocab = data?.getAnimeVocab?.words || []

    const filteredVocab = useMemo(() => {
        if (filter === 'new') {
            return vocab.filter((w) => !w.alreadyInApp)
        } else if (filter === 'known') {
            return vocab.filter((w) => w.alreadyInApp)
        }
        return vocab
    }, [vocab, filter])

    const stats = useMemo(() => {
        const total = vocab.length
        const known = vocab.filter((w) => w.alreadyInApp).length
        const newWords = total - known
        return { total, known, newWords }
    }, [vocab])

    const handleRefresh = () => {
        refetch()
    }

    const navigateToKanjiDetail = (word) => {
        navigate('/dashboard/kanji-detail', {
            state: {
                paramsData: {
                    kanji: word.kanji,
                    on: [],
                    kun: [],
                    meanings: [word.meaning],
                    hiragana: word.reading,
                    romaji: word.romaji,
                    isWord: true
                },
                wholeArr: vocab,
                itemIndex: vocab.indexOf(word),
                title: word.kanji
            }
        })
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <RefreshCw className="w-12 h-12 animate-spin mb-4" style={{ color: COLORS.brandPrimary }} />
                <p className="text-lg" style={{ color: COLORS.textSecondary }}>
                    Loading vocabulary...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <X className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.accentError }} />
                    <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        Failed to load vocabulary
                    </h2>
                    <p className="text-lg mb-6" style={{ color: COLORS.textSecondary }}>
                        {error.message || 'Please try again later'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/anime-list')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Anime List
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="sticky top-0 z-20" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard/anime-list')}
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    >
                        <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                    </button>
                    <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                        {title || "Anime Details"}
                    </h1>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    >
                        <RefreshCw className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="max-w-7xl mx-auto px-4 pb-4 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className="flex-1 p-3 rounded-xl transition-all duration-300"
                        style={{
                            backgroundColor: filter === 'all' ? COLORS.brandSecondary : COLORS.interactiveSurface,
                            color: filter === 'all' ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary
                        }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm">Total</div>
                        </div>
                    </button>
                    <button
                        onClick={() => setFilter('new')}
                        className="flex-1 p-3 rounded-xl transition-all duration-300"
                        style={{
                            backgroundColor: filter === 'new' ? COLORS.brandSecondary : COLORS.interactiveSurface,
                            color: filter === 'new' ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary
                        }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold">{stats.newWords}</div>
                            <div className="text-sm">New</div>
                        </div>
                    </button>
                    <button
                        onClick={() => setFilter('known')}
                        className="flex-1 p-3 rounded-xl transition-all duration-300"
                        style={{
                            backgroundColor: filter === 'known' ? COLORS.brandSecondary : COLORS.interactiveSurface,
                            color: filter === 'known' ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary
                        }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold">{stats.known}</div>
                            <div className="text-sm">Known</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Word List */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {filteredVocab.length > 0 ? (
                    <div className="space-y-0">
                        {filteredVocab.map((item, index) => (
                            <div
                                key={`${item.kanji}-${index}`}
                                className="p-4 transition-all duration-300"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderBottom: `1px solid ${COLORS.divider}`
                                }}
                            >
                                <button
                                    onClick={() => navigateToKanjiDetail(item)}
                                    className="w-full flex items-center gap-4 text-left"
                                >
                                    {/* Rank */}
                                    <div
                                        className="w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                                        style={{
                                            backgroundColor: COLORS.interactiveSurface,
                                            color: COLORS.textMuted
                                        }}
                                    >
                                        <span className="font-bold text-sm">{index + 1}</span>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="text-xl font-bold"
                                                style={{ color: COLORS.textPrimary }}
                                            >
                                                {item.kanji}
                                            </span>
                                            {item.alreadyInApp && (
                                                <div
                                                    className="px-2 py-1 rounded-md flex items-center gap-1"
                                                    style={{
                                                        backgroundColor: COLORS.successSoft,
                                                        color: COLORS.successText
                                                    }}
                                                >
                                                    <Check className="w-3 h-3" />
                                                    <span className="text-xs font-bold">Known</span>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="text-base"
                                            style={{ color: COLORS.brandPrimary }}
                                        >
                                            {item.reading}
                                        </div>
                                        {item.romaji && (
                                            <div
                                                className="text-sm"
                                                style={{ color: COLORS.textMuted }}
                                            >
                                                {item.romaji}
                                            </div>
                                        )}
                                        <div
                                            className="text-sm"
                                            style={{ color: COLORS.textSecondary }}
                                        >
                                            {item.meaning}
                                        </div>
                                    </div>

                                    {/* Frequency */}
                                    <div
                                        className="px-3 py-1.5 rounded-lg text-sm font-bold flex-shrink-0"
                                        style={{
                                            backgroundColor: COLORS.interactiveSurface,
                                            color: COLORS.textSecondary
                                        }}
                                    >
                                        {item.frequency}x
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl mb-2" style={{ color: COLORS.textPrimary }}>
                            No words found
                        </p>
                        <p style={{ color: COLORS.textSecondary }}>
                            Try selecting a different filter
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
