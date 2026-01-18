import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, ChevronRight, Tv } from "lucide-react"
import COLORS from "../theme/colors"
import animeList from "../util/animeList.json"

export default function AnimeList() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredList = useMemo(() => {
        if (!searchQuery.trim()) {
            return animeList
        }
        const query = searchQuery.toLowerCase()
        return animeList.filter(
            (anime) =>
                anime.name.toLowerCase().includes(query) ||
                anime.id.toLowerCase().includes(query),
        )
    }, [searchQuery])

    const handleAnimeClick = (anime) => {
        navigate('/dashboard/anime-detail', {
            state: {
                animeName: anime.id,
                title: anime.name
            }
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Anime Vocabulary
                </h1>
                <p className="text-lg" style={{ color: COLORS.textSecondary }}>
                    {animeList.length.toLocaleString()} anime available
                </p>
            </div>

            {/* Search Bar */}
            <div className="rounded-2xl p-4 shadow-md mb-6" style={{ backgroundColor: COLORS.surface }}>
                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                        style={{ color: COLORS.textMuted }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search anime..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300"
                        style={{
                            backgroundColor: COLORS.interactiveSurface,
                            color: COLORS.textPrimary,
                            border: `1px solid ${COLORS.interactiveBorder}`
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = COLORS.interactivePrimary
                            e.target.style.boxShadow = `0 0 0 3px ${COLORS.interactivePrimary}20`
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = COLORS.interactiveBorder
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-300 hover:scale-110"
                        >
                            <X className="w-5 h-5" style={{ color: COLORS.textMuted }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Anime List */}
            {filteredList.length > 0 ? (
                <div className="space-y-0">
                    {filteredList.map((anime) => (
                        <button
                            key={anime.id}
                            onClick={() => handleAnimeClick(anime)}
                            className="w-full flex items-center px-6 py-4 transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                backgroundColor: COLORS.surface,
                                borderBottom: `1px solid ${COLORS.divider}`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.interactiveSurface
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.surface
                            }}
                        >
                            <Tv
                                className="w-6 h-6 mr-4"
                                style={{ color: COLORS.brandPrimary }}
                            />
                            <div className="flex-1 text-left">
                                <div
                                    className="text-lg font-medium"
                                    style={{ color: COLORS.textPrimary }}
                                >
                                    {anime.name}
                                </div>
                            </div>
                            <ChevronRight
                                className="w-5 h-5"
                                style={{ color: COLORS.textMuted }}
                            />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl mb-2" style={{ color: COLORS.textPrimary }}>
                        No anime found
                    </p>
                    <p style={{ color: COLORS.textSecondary }}>
                        Try searching with different keywords
                    </p>
                </div>
            )}
        </div>
    )
}
