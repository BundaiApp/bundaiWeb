import { useMemo, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { provideKanjiObject } from "../util/jlptArray.js"
import COLORS from "../theme/colors"

const categorizeWords = (kanji, usedIn) => {
    const single = []
    const startsWith = []
    const contains = []
    const endsWith = []

    ;(usedIn || []).forEach((word) => {
        const w = word.kanji || ""
        if (w === kanji) {
            single.push(word)
        } else if (w.startsWith(kanji)) {
            startsWith.push(word)
        } else if (w.endsWith(kanji)) {
            endsWith.push(word)
        } else if (w.includes(kanji)) {
            contains.push(word)
        }
    })

    return { single, startsWith, contains, endsWith }
}

const KanjiBuilderCard = ({ kanji, data, groups, onClick }) => {
    const compounds = [...groups.startsWith, ...groups.contains, ...groups.endsWith]
    const total = compounds.length + groups.single.length
    const preview = compounds.slice(0, 2)

    return (
        <div
            className="rounded-2xl p-4 flex items-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-3"
            style={{
                backgroundColor: COLORS.surface,
                boxShadow: `0 4px 12px ${COLORS.brandPrimaryDark}14`
            }}
            onClick={onClick}
        >
            {/* Lead Kanji */}
            <div className="flex flex-col items-center justify-center mr-3 min-w-[64px]">
                <span className="text-4xl font-bold" style={{ color: COLORS.textPrimary }}>
                    {kanji}
                </span>
                {data.meaning && (
                    <span
                        className="text-xs mt-1 text-center max-w-[80px] truncate"
                        style={{ color: COLORS.textSecondary }}
                    >
                        {data.meaning}
                    </span>
                )}
            </div>

            {/* Preview words */}
            <div className="flex items-center justify-center gap-2 flex-1">
                {preview.map((word, idx) => (
                    <div
                        key={`${word.kanji}-${idx}`}
                        className="rounded-xl py-2 px-3 flex flex-col items-center min-w-[72px]"
                        style={{ backgroundColor: COLORS.surfaceMuted }}
                    >
                        <span className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                            {word.kanji}
                        </span>
                        <span className="text-[11px] mt-0.5" style={{ color: COLORS.textMuted }}>
                            {word.reading}
                        </span>
                    </div>
                ))}
                {preview.length === 0 && groups.single.length > 0 && (
                    <div
                        className="rounded-xl py-2 px-3 flex flex-col items-center min-w-[72px]"
                        style={{ backgroundColor: COLORS.surfaceMuted }}
                    >
                        <span className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                            {groups.single[0].kanji}
                        </span>
                        <span className="text-[11px] mt-0.5" style={{ color: COLORS.textMuted }}>
                            {groups.single[0].reading}
                        </span>
                    </div>
                )}
                {preview.length === 0 && groups.single.length === 0 && (
                    <span className="text-sm italic" style={{ color: COLORS.textMuted }}>
                        No words
                    </span>
                )}
            </div>

            {/* Count badge */}
            <div
                className="ml-2.5 rounded-lg px-2 py-1"
                style={{ backgroundColor: COLORS.brandPrimaryLight }}
            >
                <span className="text-[11px] font-semibold" style={{ color: COLORS.brandPrimaryDark }}>
                    {total} word{total !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    )
}

export default function KanjiSwap() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const searchInputRef = useRef(null)

    const KANJI_DATA = useMemo(() => provideKanjiObject(), [])

    const BUILDER_DATA = useMemo(() => {
        const entries = Object.entries(KANJI_DATA)
        return entries
            .map(([kanji, data]) => {
                const groups = categorizeWords(kanji, data.usedIn)
                const compoundCount =
                    groups.startsWith.length +
                    groups.contains.length +
                    groups.endsWith.length
                if (compoundCount < 2 && compoundCount + groups.single.length < 2) {
                    return null
                }
                return [kanji, data, groups]
            })
            .filter(Boolean)
    }, [KANJI_DATA])

    const filteredData = useMemo(() => {
        if (!search) return BUILDER_DATA
        const lowerQuery = search.toLowerCase()
        return BUILDER_DATA.filter(([kanji, data, groups]) => {
            if (kanji.includes(search)) return true
            if (data.meaning?.toLowerCase().includes(lowerQuery)) return true
            if (data.furigana?.includes(search)) return true
            const allWords = [
                ...groups.single,
                ...groups.startsWith,
                ...groups.contains,
                ...groups.endsWith
            ]
            return allWords.some(
                (w) =>
                    w.kanji?.includes(search) ||
                    w.meaning?.toLowerCase().includes(lowerQuery) ||
                    w.reading?.includes(search)
            )
        })
    }, [BUILDER_DATA, search])

    const handlePress = (kanji, data, groups) => {
        navigate('/dashboard/kanji-swap-detail', {
            state: {
                kanji,
                meaning: data.meaning,
                furigana: data.furigana,
                groups
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Kanji Swap
                </h1>
                <p style={{ color: COLORS.textSecondary }}>
                    Build compound words by combining kanji characters
                </p>
            </div>

            {/* Search Bar */}
            <div className="rounded-2xl p-4 shadow-md" style={{ backgroundColor: COLORS.surface }}>
                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                        style={{ color: COLORS.textMuted }}
                    />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search kanji, words, or readings..."
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
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-right" style={{ color: COLORS.textMuted }}>
                {filteredData.length} builder sets
            </div>

            {/* Builder Cards */}
            <div>
                {filteredData.map(([kanji, data, groups]) => (
                    <KanjiBuilderCard
                        key={kanji}
                        kanji={kanji}
                        data={data}
                        groups={groups}
                        onClick={() => handlePress(kanji, data, groups)}
                    />
                ))}
            </div>

            {/* No Results */}
            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl mb-2" style={{ color: COLORS.textPrimary }}>
                        No kanji found
                    </p>
                    <p style={{ color: COLORS.textSecondary }}>
                        Try searching with different keywords
                    </p>
                </div>
            )}
        </div>
    )
}
