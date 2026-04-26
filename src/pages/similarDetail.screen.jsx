import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Share2 } from "lucide-react"
import COLORS from "../theme/colors"

const KanjiCard = ({ item, type }) => {
    const isMain = type === "main"
    return (
        <div
            className="rounded-2xl p-5 flex flex-col items-center flex-1 max-w-[140px]"
            style={{
                backgroundColor: isMain ? COLORS.successSoft : "#fde8ea",
                border: `2px solid ${isMain ? COLORS.accentSuccess : COLORS.accentDanger}`,
                boxShadow: `0 4px 12px ${COLORS.brandPrimaryDark}0F`
            }}
        >
            <span
                className="text-5xl font-bold mb-1"
                style={{ color: isMain ? COLORS.accentSuccess : COLORS.accentDanger }}
            >
                {item.kanji}
            </span>
            <span className="text-lg font-medium" style={{ color: COLORS.textSecondary }}>
                {item.meaning}
            </span>
            {(item.furigana || item.reading) && (
                <span className="text-sm" style={{ color: COLORS.textMuted }}>
                    {item.furigana || item.reading}
                </span>
            )}
        </div>
    )
}

const TrapPair = ({ main, confused }) => (
    <div className="flex items-center justify-center gap-3 mb-4">
        <KanjiCard item={main} type="main" />
        <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-lg font-bold" style={{ color: COLORS.textMuted }}>vs</span>
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: COLORS.divider }} />
        </div>
        <KanjiCard item={confused} type="confused" />
    </div>
)

export default function SimilarDetail() {
    const location = useLocation()
    const navigate = useNavigate()
    const { kanji, meaning, furigana, kanjiArray = [] } = location.state || {}

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/dashboard/similar-detail?kanji=${kanji}`
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Kanji Trap: ${kanji}`,
                    text: `Kanji Trap: ${kanji} — Learn Japanese Kanji the smart way at www.bundai.app`,
                    url: shareUrl
                })
            } else {
                await navigator.clipboard.writeText(shareUrl)
                alert("Link copied to clipboard!")
            }
        } catch (err) {
            console.error("Share failed:", err)
        }
    }

    if (!kanji) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No kanji data available
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/similars')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Kanji Trap
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <div className="sticky top-0 z-20 p-4 flex items-center" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                >
                    <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                </button>
                <h1 className="text-xl font-bold" style={{ color: COLORS.brandPrimary }}>
                    Kanji Trap
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="text-8xl md:text-9xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        {kanji}
                    </div>
                    <div className="text-2xl md:text-3xl font-medium mb-1" style={{ color: COLORS.textPrimary }}>
                        {meaning}
                    </div>
                    {furigana && (
                        <div className="text-lg md:text-xl" style={{ color: COLORS.textSecondary }}>
                            {furigana}
                        </div>
                    )}
                </div>

                {/* Trap Pairs Section */}
                {kanjiArray.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: COLORS.textPrimary }}>
                            Don't Confuse With
                        </h2>
                        <div className="max-w-2xl mx-auto">
                            {kanjiArray.map((item, index) => (
                                <TrapPair
                                    key={`${item.kanji}-${index}`}
                                    main={{ kanji, meaning, furigana }}
                                    confused={item}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: COLORS.brandPrimary,
                            color: COLORS.interactiveTextOnPrimary
                        }}
                    >
                        <Share2 className="w-5 h-5" />
                        Share this trap
                    </button>
                </div>

                {/* Empty state */}
                {kanjiArray.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl" style={{ color: COLORS.textSecondary }}>
                            No trap pairs available for this kanji
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
