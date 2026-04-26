import { useMemo, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { provideKanjiObject } from "../util/jlptArray.js"
import COLORS from "../theme/colors"

const KanjiTrapCard = ({ kanji, data, onClick }) => {
    return (
        <div
            className="rounded-2xl p-3 flex items-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-3"
            style={{
                backgroundColor: COLORS.surface,
                boxShadow: `0 4px 12px ${COLORS.brandPrimaryDark}14`
            }}
            onClick={onClick}
        >
            {/* Lead Kanji */}
            <div
                className="rounded-xl p-2.5 mr-3 flex flex-col items-center min-w-[80px]"
                style={{
                    backgroundColor: COLORS.interactiveSurface,
                    border: `2px solid ${COLORS.brandPrimary}`,
                    boxShadow: `0 4px 8px ${COLORS.brandPrimaryDark}14`
                }}
            >
                <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
                    {kanji}
                </span>
                {data.furigana && (
                    <span className="text-xs font-medium mt-1" style={{ color: COLORS.textPrimary }}>
                        {data.furigana}
                    </span>
                )}
                {data.meaning && (
                    <span className="text-[10px] mt-0.5" style={{ color: COLORS.textSecondary }}>
                        {data.meaning}
                    </span>
                )}
            </div>

            <span className="text-xl font-bold mr-3" style={{ color: COLORS.textSecondary }} />
            {/* Similar kanji */}
            <div className="flex flex-wrap gap-2 flex-1">
                {(data.related_kanji || []).slice(0, 3).map((similar, index) => (
                    <div
                        key={`${kanji}-${similar.kanji}-${index}`}
                        className="rounded-xl p-2 flex flex-col items-center min-w-[70px]"
                        style={{
                            backgroundColor: COLORS.kanjiHighlight,
                            boxShadow: `0 4px 8px ${COLORS.brandPrimaryDark}14`
                        }}
                    >
                        <span className="text-xl font-bold" style={{ color: COLORS.surface }}>
                            {similar.kanji}
                        </span>
                        {similar.reading && (
                            <span className="text-[10px] mt-0.5 opacity-90" style={{ color: COLORS.surface }}>
                                {similar.reading}
                            </span>
                        )}
                        {similar.meaning && (
                            <span className="text-[9px] mt-0.5 opacity-90" style={{ color: COLORS.surface }}>
                                {similar.meaning}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Similars() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const searchInputRef = useRef(null)

    const SIMILAR_DATA = useMemo(() => provideKanjiObject(), [])

    const filteredData = useMemo(() => {
        if (!search) {
            return Object.entries(SIMILAR_DATA)
        }

        const lowerQuery = search.toLowerCase()

        return Object.entries(SIMILAR_DATA).filter(([kanji, data]) => {
            if (kanji.includes(search)) return true
            if (data.meaning && data.meaning.toLowerCase().includes(lowerQuery)) return true
            if (data.furigana && data.furigana.includes(search)) return true
            if (
                data.related_kanji?.some(
                    (item) =>
                        item.kanji?.includes(search) ||
                        item.meaning?.toLowerCase().includes(lowerQuery) ||
                        item.reading?.includes(search) ||
                        item.furigana?.includes(search)
                )
            ) {
                return true
            }
            return false
        })
    }, [SIMILAR_DATA, search])

    const handleSearch = (text) => {
        setSearch(text)
    }

    const handleKanjiClick = (kanji) => {
        const kanjiData = SIMILAR_DATA[kanji]
        if (!kanjiData) return

        navigate('/dashboard/similar-detail', {
            state: {
                kanji,
                meaning: kanjiData.meaning,
                furigana: kanjiData.furigana,
                kanjiArray: kanjiData.related_kanji,
                usedIn: kanjiData.usedIn
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Kanji Trap
                </h1>
                <p style={{ color: COLORS.textSecondary }}>
                    Spot the differences — learn to tell similar kanji apart
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
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search kanji, meaning, or reading..."
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
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                {filteredData.length} trap sets
            </div>

            {/* Trap Cards */}
            <div>
                {filteredData.map(([kanji, data]) => (
                    <KanjiTrapCard
                        key={kanji}
                        kanji={kanji}
                        data={data}
                        onClick={() => handleKanjiClick(kanji)}
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
