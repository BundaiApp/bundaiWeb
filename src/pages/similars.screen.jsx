import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { Search } from "lucide-react"
import COLORS from "../theme/colors"
import getAllKanji from "../graphql/queries/getAllKanji.query"

export default function Similars() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    const { data: allKanjiData, loading, error } = useQuery(getAllKanji)

    const SIMILAR_DATA = useMemo(() => {
        if (loading) {
            console.log('Still loading...')
            return {}
        }

        if (!allKanjiData?.getAllKanji || allKanjiData.getAllKanji.length === 0) {
            console.log('No kanji data available')
            return {}
        }

        console.log('Total kanji received:', allKanjiData.getAllKanji.length)

        const result = allKanjiData.getAllKanji.reduce((acc, kanji) => {
            acc[kanji.kanjiName] = {
                kanji: kanji.kanjiName,
                meaning: kanji.meanings?.[0] || "",
                furigana: kanji.kun?.[0] || "",
                related_kanji: kanji.similars?.map(s => ({
                    kanji: s.kanji,
                    meaning: s.meaning,
                    furigana: s.reading
                })) || [],
                usedIn: kanji.usedIn?.map(u => ({
                    kanji: u.kanji,
                    furigana: u.reading,
                    meaning: u.meaning
                })) || []
            }
            return acc
        }, {})

        console.log('Similar data processed, kanji count:', Object.keys(result).length)
        return result
    }, [allKanjiData, loading])

    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        setFilteredData(Object.keys(SIMILAR_DATA))
    }, [SIMILAR_DATA])

    const searchKanji = (query) => {
        if (!query) return Object.keys(SIMILAR_DATA)

        return Object.entries(SIMILAR_DATA).filter(([kanji, data]) => {
            const lowerQuery = query.toLowerCase()

            // Check kanji
            if (kanji.includes(query)) return true

            // Check meaning
            if (data.meaning && data.meaning.toLowerCase().includes(lowerQuery)) return true

            // Check furigana/readings
            if (data.furigana && data.furigana.includes(query)) return true

            return false
        }).map(([kanji]) => kanji)
    }

    const handleSearch = (text) => {
        setSearch(text)
        const results = searchKanji(text)
        setFilteredData(results)
    }

    const handleKanjiClick = (kanji) => {
        const kanjiData = SIMILAR_DATA[kanji]
        navigate('/dashboard/similar-detail', {
            state: {
                kanji: kanji,
                meaning: kanjiData.meaning,
                furigana: kanjiData.furigana,
                kanjiArray: kanjiData.related_kanji,
                usedIn: kanjiData.usedIn
            }
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    Similar Kanjis
                </h1>
                <p style={{ color: COLORS.textSecondary }}>
                    Find and compare similar-looking kanji characters
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <p style={{ color: COLORS.textSecondary }}>Loading similar kanji...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-center py-12">
                    <p className="text-xl mb-2" style={{ color: COLORS.textPrimary }}>
                        Error loading data
                    </p>
                    <p style={{ color: COLORS.textSecondary }}>
                        {error.message || 'Please try again later'}
                    </p>
                </div>
            )}

            {/* Content */}
            {!loading && !error && (
                <>
            {/* Search Bar */}
            <div className="rounded-2xl p-4 shadow-md" style={{ backgroundColor: COLORS.surface }}>
                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                        style={{ color: COLORS.textMuted }}
                    />
                    <input
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
                Showing {filteredData.length} kanji
            </div>

            {/* Kanji Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {filteredData.map((kanji) => (
                        <button
                            key={kanji}
                            onClick={() => handleKanjiClick(kanji)}
                            className="aspect-square rounded-xl flex items-center justify-center text-3xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor: COLORS.surface,
                                color: COLORS.textPrimary,
                                border: `3px solid ${COLORS.brandPrimary}`,
                                boxShadow: `0 4px 8px ${COLORS.brandPrimaryDark}1A`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = COLORS.brandPrimaryDark
                                e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = COLORS.brandPrimary
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            {kanji}
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl mb-2" style={{ color: COLORS.textPrimary }}>
                        No kanji found
                    </p>
                    <p style={{ color: COLORS.textSecondary }}>
                        Try searching with different keywords
                    </p>
                </div>
            )}
            </>
            )}
        </div>
    )
}
