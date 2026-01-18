import { useState, useMemo, useEffect } from "react"
import { Search, X } from "lucide-react"
import COLORS from "../theme/colors"
import animeWordsData from "../util/animeWords.json"

export default function AnimeWords() {
    const [searchQuery, setSearchQuery] = useState("")

    const vocab = useMemo(() => {
        return animeWordsData.slice(0, 1000).map((word) => {
            return {
                word: word.word,
                reading: word.reading,
                romaji: word.romaji,
                meaning: word.meaning,
                frequency: word.animeCount
            }
        })
    }, [])

    const filteredVocab = useMemo(() => {
        if (!searchQuery.trim()) {
            return vocab
        }
        const query = searchQuery.toLowerCase()
        return vocab.filter(
            (word) =>
                word.meaning.toLowerCase().includes(query) ||
                word.romaji.toLowerCase().includes(query) ||
                word.reading.toLowerCase().includes(query)
        )
    }, [vocab, searchQuery])

    const filteredCount = filteredVocab.length

    useEffect(() => {
        document.title = "Top 1000 Anime Words"
    }, [])

    return (
        <div className="max-w-5xl mx-auto" style={{ backgroundColor: COLORS.background }}>
            {/* Search Bar */}
            <div className="sticky top-0 z-10 p-4" style={{ backgroundColor: COLORS.background }}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: COLORS.surface }}>
                    <Search className="w-5 h-5" style={{ color: COLORS.interactiveTextInactive }} />
                    <input
                        type="text"
                        placeholder={`Search ${filteredCount} words by meaning or romaji...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-base"
                        style={{ color: COLORS.textPrimary }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                    />
                    {searchQuery.length > 0 && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="p-1 rounded-full transition-all duration-300 hover:scale-110"
                        >
                            <X className="w-5 h-5" style={{ color: COLORS.interactiveTextInactive }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Word List */}
            <div className="pb-8">
                {filteredVocab.length > 0 ? (
                    <div className="space-y-0">
                        {filteredVocab.map((item, index) => (
                            <div
                                key={`${item.word}-${index}`}
                                className="flex items-center px-5 py-3 border-b"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderColor: COLORS.divider
                                }}
                            >
                                <div
                                    className="w-8 text-center text-sm font-medium mr-4"
                                    style={{ color: COLORS.interactiveTextInactive }}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-lg font-bold"
                                            style={{ color: COLORS.textPrimary }}
                                        >
                                            {item.word}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{ color: COLORS.brandPrimary }}
                                        >
                                            {item.reading}
                                        </span>
                                        {item.romaji && (
                                            <span
                                                className="text-xs"
                                                style={{ color: COLORS.interactiveTextInactive }}
                                            >
                                                {item.romaji}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{
                                            color: COLORS.textSecondary,
                                            display: '-webkit-box',
                                            '-webkit-line-clamp': 2,
                                            '-webkit-box-orient': 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {item.meaning}
                                    </p>
                                </div>
                                <div
                                    className="px-2.5 py-1 rounded-lg text-sm font-medium"
                                    style={{ backgroundColor: COLORS.surfaceMuted }}
                                >
                                    <span style={{ color: COLORS.textSecondary }}>{item.frequency}x</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-base" style={{ color: COLORS.interactiveTextInactive }}>
                            {searchQuery ? "No words matching your search" : "No words found"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
