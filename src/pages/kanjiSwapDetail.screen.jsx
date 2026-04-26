import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, BookOpen } from "lucide-react"
import { provideKanjiObject } from "../util/jlptArray.js"
import COLORS from "../theme/colors"

const isKanjiChar = (ch) => {
    const c = ch.charCodeAt(0)
    return (c >= 0x4e00 && c <= 0x9faf) || (c >= 0x3400 && c <= 0x4dbf)
}

const ReferenceModal = ({ visible, onClose, kanji, groups }) => {
    if (!visible) return null

    const WordCard = ({ word }) => (
        <div
            className="rounded-xl p-3 flex flex-col items-center min-w-[90px]"
            style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.divider}`
            }}
        >
            <span className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                {word.kanji}
            </span>
            <span className="text-[11px] mt-0.5" style={{ color: COLORS.textMuted }}>
                {word.reading}
            </span>
            <span className="text-xs mt-1 text-center" style={{ color: COLORS.textSecondary }}>
                {word.meaning}
            </span>
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35" onClick={onClose}>
            <div
                className="w-full max-h-[85%] rounded-t-3xl p-5 overflow-y-auto"
                style={{ backgroundColor: COLORS.background }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                        {kanji} — Reference
                    </span>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.surfaceMuted }}
                    >
                        <span className="text-lg font-semibold" style={{ color: COLORS.textSecondary }}>✕</span>
                    </button>
                </div>

                {groups.single.length > 0 && (
                    <>
                        <span className="text-xs font-bold uppercase tracking-wide block mt-4 mb-2.5" style={{ color: COLORS.textSecondary }}>
                            On its own
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                            {groups.single.map((w, i) => (
                                <WordCard key={`s-${i}`} word={w} />
                            ))}
                        </div>
                    </>
                )}

                {groups.startsWith.length > 0 && (
                    <>
                        <span className="text-xs font-bold uppercase tracking-wide block mt-4 mb-2.5" style={{ color: COLORS.textSecondary }}>
                            Starts with {kanji}
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                            {groups.startsWith.map((w, i) => (
                                <WordCard key={`sw-${i}`} word={w} />
                            ))}
                        </div>
                    </>
                )}

                {groups.contains.length > 0 && (
                    <>
                        <span className="text-xs font-bold uppercase tracking-wide block mt-4 mb-2.5" style={{ color: COLORS.textSecondary }}>
                            Contains {kanji}
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                            {groups.contains.map((w, i) => (
                                <WordCard key={`c-${i}`} word={w} />
                            ))}
                        </div>
                    </>
                )}

                {groups.endsWith.length > 0 && (
                    <>
                        <span className="text-xs font-bold uppercase tracking-wide block mt-4 mb-2.5" style={{ color: COLORS.textSecondary }}>
                            Ends with {kanji}
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                            {groups.endsWith.map((w, i) => (
                                <WordCard key={`ew-${i}`} word={w} />
                            ))}
                        </div>
                    </>
                )}

                <div className="h-10" />
            </div>
        </div>
    )
}

export default function KanjiSwapDetail() {
    const location = useLocation()
    const navigate = useNavigate()
    const { kanji, meaning, furigana, groups } = location.state || {}

    const [builtWords, setBuiltWords] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [showRef, setShowRef] = useState(false)
    const [disabledCards, setDisabledCards] = useState(new Set())
    const [pageIndex, setPageIndex] = useState(0)
    const [selectedJlpt, setSelectedJlpt] = useState(5)
    const [hoverSlot, setHoverSlot] = useState(null)
    const [slotContents, setSlotContents] = useState({ left: null, right: null })

    // Custom drag state
    const [dragging, setDragging] = useState(null)
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
    const dragInfo = useRef(null)
    const leftSlotRef = useRef(null)
    const rightSlotRef = useRef(null)
    const containerRef = useRef(null)

    const kanjiLookup = useMemo(() => provideKanjiObject(), [])

    const isWordAllowed = useCallback((wordItem) => {
        const wordJlpt = wordItem.jlptLevel
        if (wordJlpt) {
            const level = parseInt(wordJlpt.replace('n', ''), 10)
            return level >= selectedJlpt
        }
        const wordKanji = wordItem.kanji || ''
        for (let i = 0; i < wordKanji.length; i++) {
            const ch = wordKanji[i]
            if (!isKanjiChar(ch)) continue
            const info = kanjiLookup[ch]
            if (!info) return false
            if (info.jlpt && info.jlpt < selectedJlpt) return false
        }
        return true
    }, [kanjiLookup, selectedJlpt])

    const gameWords = useMemo(() => {
        if (!groups) return { startsWith: [], endsWith: [] }
        const sw2 = groups.startsWith.filter(
            (w) => w.kanji.length === 2 && isWordAllowed(w)
        )
        const ew2 = groups.endsWith.filter(
            (w) => w.kanji.length === 2 && isWordAllowed(w)
        )
        return { startsWith: sw2, endsWith: ew2 }
    }, [groups, isWordAllowed])

    const leftMap = useMemo(() => {
        const m = {}
        gameWords.endsWith.forEach((w) => {
            const other = w.kanji.replace(kanji, '')
            m[other] = w
        })
        return m
    }, [gameWords.endsWith, kanji])

    const rightMap = useMemo(() => {
        const m = {}
        gameWords.startsWith.forEach((w) => {
            const other = w.kanji.replace(kanji, '')
            m[other] = w
        })
        return m
    }, [gameWords.startsWith, kanji])

    const cards = useMemo(() => {
        const set = new Set()
        ;[...gameWords.startsWith, ...gameWords.endsWith].forEach((w) => {
            w.kanji.split('').forEach((ch) => {
                if (ch !== kanji && isKanjiChar(ch)) {
                    const info = kanjiLookup[ch]
                    if (info && info.jlpt && info.jlpt >= selectedJlpt) {
                        set.add(ch)
                    }
                }
            })
        })
        return Array.from(set).sort(() => Math.random() - 0.5)
    }, [gameWords, kanji, kanjiLookup, selectedJlpt])

    const CARDS_PER_PAGE = 4
    const pages = useMemo(() => {
        const result = []
        for (let i = 0; i < cards.length; i += CARDS_PER_PAGE) {
            result.push(cards.slice(i, i + CARDS_PER_PAGE))
        }
        return result
    }, [cards])

    const totalPages = pages.length

    useEffect(() => {
        if (pageIndex >= totalPages && totalPages > 0) {
            setPageIndex(0)
        }
    }, [totalPages, pageIndex])

    // --- Custom drag via mouse/pointer events ---

    const onDragStart = (e, cardKanji) => {
        e.preventDefault()
        const touch = e.touches?.[0] || e
        dragInfo.current = { kanji: cardKanji, startX: touch.clientX, startY: touch.clientY }
        setDragging(cardKanji)
        setDragPos({ x: touch.clientX, y: touch.clientY })
    }

    const onDragMove = (e) => {
        if (!dragInfo.current) return
        e.preventDefault()
        const touch = e.touches?.[0] || e
        setDragPos({ x: touch.clientX, y: touch.clientY })

        // Check hover over slots
        const leftRect = leftSlotRef.current?.getBoundingClientRect()
        const rightRect = rightSlotRef.current?.getBoundingClientRect()
        const cx = touch.clientX
        const cy = touch.clientY

        if (leftRect && cx >= leftRect.left && cx <= leftRect.right && cy >= leftRect.top && cy <= leftRect.bottom) {
            setHoverSlot('left')
        } else if (rightRect && cx >= rightRect.left && cx <= rightRect.right && cy >= rightRect.top && cy <= rightRect.bottom) {
            setHoverSlot('right')
        } else {
            setHoverSlot(null)
        }
    }

    const onDragEnd = (e) => {
        if (!dragInfo.current) return
        e.preventDefault()

        const touch = e.changedTouches?.[0] || e
        const cx = touch.clientX
        const cy = touch.clientY
        const droppedKanji = dragInfo.current.kanji

        // Determine which slot
        const leftRect = leftSlotRef.current?.getBoundingClientRect()
        const rightRect = rightSlotRef.current?.getBoundingClientRect()

        let side = null
        if (leftRect && cx >= leftRect.left && cx <= leftRect.right && cy >= leftRect.top && cy <= leftRect.bottom) {
            side = 'left'
        } else if (rightRect && cx >= rightRect.left && cx <= rightRect.right && cy >= rightRect.top && cy <= rightRect.bottom) {
            side = 'right'
        }

        if (side) {
            let word = side === 'left' ? leftMap[droppedKanji] : rightMap[droppedKanji]

            if (word) {
                setBuiltWords((prev) => {
                    if (prev.find((w) => w.kanji === word.kanji)) return prev
                    return [...prev, word]
                })
                setFeedback({ type: 'correct', word, side })
                setDisabledCards((prev) => new Set(prev).add(droppedKanji))
                setSlotContents((prev) => ({ ...prev, [side]: droppedKanji }))
                setTimeout(() => setFeedback(null), 2000)
            } else {
                setFeedback({ type: 'wrong', side })
                setTimeout(() => setFeedback(null), 1000)
            }
        }

        setDragging(null)
        setHoverSlot(null)
        dragInfo.current = null
    }

    // Global listeners for move/end
    useEffect(() => {
        if (!dragging) return
        const handleMove = onDragMove
        const handleEnd = onDragEnd
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleEnd)
        window.addEventListener('touchmove', handleMove, { passive: false })
        window.addEventListener('touchend', handleEnd)
        window.addEventListener('touchcancel', handleEnd)
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleEnd)
            window.removeEventListener('touchmove', handleMove)
            window.removeEventListener('touchend', handleEnd)
            window.removeEventListener('touchcancel', handleEnd)
        }
    }, [dragging]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!kanji) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <p className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                        No kanji data available
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/kanji-swap')}
                        className="px-6 py-3 rounded-xl font-bold"
                        style={{ backgroundColor: COLORS.interactivePrimary, color: COLORS.interactiveTextOnPrimary }}
                    >
                        Back to Kanji Swap
                    </button>
                </div>
            </div>
        )
    }

    const getSlotStyle = (side) => {
        const isCorrect = feedback?.type === 'correct' && feedback.side === side
        const isWrong = feedback?.type === 'wrong' && feedback.side === side

        if (isCorrect) return {
            border: `2px solid ${COLORS.accentSuccess}`,
            backgroundColor: COLORS.successSoft,
            transform: 'scale(1.05)',
        }
        if (isWrong) return {
            border: `2px solid ${COLORS.accentDanger}`,
            backgroundColor: '#fde8ea',
        }
        if (hoverSlot === side) return {
            border: `2px solid ${COLORS.brandPrimary}`,
            backgroundColor: `${COLORS.brandPrimary}18`,
            transform: 'scale(1.1)',
        }
        if (slotContents[side]) return {
            border: `1.5px solid ${COLORS.successSoft}`,
            backgroundColor: COLORS.surfaceMuted,
        }
        return {
            border: `2px dashed ${COLORS.brandPrimaryLight}`,
            backgroundColor: COLORS.surfaceMuted,
        }
    }

    return (
        <div className="min-h-screen flex flex-col select-none" style={{ backgroundColor: COLORS.background }} ref={containerRef}>
            {/* Header */}
            <div className="sticky top-0 z-20 p-4 flex items-center" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                >
                    <ArrowLeft className="w-6 h-6" style={{ color: COLORS.textPrimary }} />
                </button>
                <h1 className="text-xl font-bold flex-1" style={{ color: COLORS.brandPrimary }}>
                    Kanji Swap
                </h1>
                <button
                    onClick={() => setShowRef(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                        backgroundColor: COLORS.surface,
                        boxShadow: `0 2px 6px ${COLORS.brandPrimaryDark}14`
                    }}
                >
                    <BookOpen className="w-5 h-5" style={{ color: COLORS.textPrimary }} />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center px-4 pt-4 pb-8 flex-1">
                {/* Hero */}
                <div className="text-center mb-2">
                    <span className="text-5xl font-extrabold" style={{ color: COLORS.textPrimary }}>
                        {kanji}
                    </span>
                    {meaning && (
                        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
                            {meaning}{furigana ? ` (${furigana})` : ''}
                        </p>
                    )}
                </div>

                {/* JLPT Filter */}
                <div className="flex justify-center gap-2 my-3">
                    {[5, 4, 3, 2, 1].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => {
                                setSelectedJlpt(lvl)
                                setBuiltWords([])
                                setDisabledCards(new Set())
                                setPageIndex(0)
                                setSlotContents({ left: null, right: null })
                                setFeedback(null)
                            }}
                            className="w-[52px] h-9 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: selectedJlpt === lvl ? COLORS.brandPrimary : COLORS.surface,
                                color: selectedJlpt === lvl ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary,
                                border: `1.5px solid ${selectedJlpt === lvl ? COLORS.brandPrimary : COLORS.divider}`
                            }}
                        >
                            N{lvl}
                        </button>
                    ))}
                </div>

                {/* Game Area */}
                <div className="flex flex-col items-center my-4">
                    <div className="flex items-center gap-5">
                        {/* Left Slot */}
                        <div
                            ref={leftSlotRef}
                            className={`w-[60px] h-[60px] rounded-xl flex items-center justify-center transition-all duration-200 ${feedback?.type === 'wrong' && feedback.side === 'left' ? 'animate-shake' : ''}`}
                            style={getSlotStyle('left')}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold" style={{
                                    color: feedback?.type === 'correct' && feedback.side === 'left'
                                        ? COLORS.accentSuccess
                                        : slotContents.left
                                            ? COLORS.textPrimary
                                            : hoverSlot === 'left'
                                                ? COLORS.brandPrimary
                                                : COLORS.textMuted
                                }}>
                                    {slotContents.left || (hoverSlot === 'left' ? '↓' : '?')}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Kanji */}
                        <div
                            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
                            style={{
                                backgroundColor: COLORS.surface,
                                border: `2px solid ${COLORS.brandPrimary}`,
                                boxShadow: `0 3px 8px ${COLORS.brandPrimaryDark}1A`
                            }}
                        >
                            <span className="text-4xl font-extrabold" style={{ color: COLORS.brandPrimary }}>
                                {kanji}
                            </span>
                        </div>

                        {/* Right Slot */}
                        <div
                            ref={rightSlotRef}
                            className={`w-[60px] h-[60px] rounded-xl flex items-center justify-center transition-all duration-200 ${feedback?.type === 'wrong' && feedback.side === 'right' ? 'animate-shake' : ''}`}
                            style={getSlotStyle('right')}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold" style={{
                                    color: feedback?.type === 'correct' && feedback.side === 'right'
                                        ? COLORS.accentSuccess
                                        : slotContents.right
                                            ? COLORS.textPrimary
                                            : hoverSlot === 'right'
                                                ? COLORS.brandPrimary
                                                : COLORS.textMuted
                                }}>
                                    {slotContents.right || (hoverSlot === 'right' ? '↓' : '?')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback label */}
                    {feedback?.type === 'correct' && (
                        <div className="mt-2 text-sm font-semibold text-center px-4">
                            <span style={{ color: COLORS.accentSuccess }}>
                                {feedback.word.kanji} — {feedback.word.reading} — {feedback.word.meaning}
                            </span>
                        </div>
                    )}
                    {feedback?.type === 'wrong' && (
                        <div className="mt-2 text-sm font-medium" style={{ color: COLORS.accentDanger }}>
                            Not a valid word — try another!
                        </div>
                    )}
                </div>

                <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                    Drag a kanji to the left or right slot
                </p>

                {/* Built words strip */}
                {builtWords.length > 0 && (
                    <div className="w-full overflow-x-auto mb-4">
                        <div className="flex gap-2 min-w-min px-2 py-1">
                            {builtWords.map((w, i) => (
                                <div
                                    key={`${w.kanji}-${i}`}
                                    className="rounded-xl p-2.5 flex flex-col items-center min-w-[72px] max-w-[100px] h-[52px] justify-center"
                                    style={{
                                        backgroundColor: COLORS.successSoft,
                                        border: `1.5px solid ${COLORS.accentSuccess}`
                                    }}
                                >
                                    <span className="text-base font-bold" style={{ color: COLORS.accentSuccess }}>
                                        {w.kanji}
                                    </span>
                                    <span className="text-[10px] mt-0.5" style={{ color: COLORS.textMuted }}>
                                        {w.reading}
                                    </span>
                                    <span className="text-[9px] mt-0.5 truncate max-w-[86px]" style={{ color: COLORS.textSecondary }}>
                                        {w.meaning}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cards Grid */}
                {pages.length > 0 && (
                    <div className="flex flex-col items-center gap-5 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            {pages[pageIndex]?.map((k) => {
                                const info = kanjiLookup[k]
                                const isDisabled = disabledCards.has(k)

                                if (isDisabled) {
                                    return (
                                        <div
                                            key={`${k}-${selectedJlpt}-${pageIndex}`}
                                            className="rounded-2xl flex flex-col items-center justify-center opacity-30 p-4"
                                            style={{
                                                backgroundColor: COLORS.surface,
                                                border: `1.5px solid ${COLORS.divider}`,
                                                boxShadow: `0 4px 10px ${COLORS.brandPrimaryDark}1A`,
                                                width: 84,
                                                height: 116
                                            }}
                                        >
                                            <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
                                                {k}
                                            </span>
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={`${k}-${selectedJlpt}-${pageIndex}`}
                                        onMouseDown={(e) => onDragStart(e, k)}
                                        onTouchStart={(e) => onDragStart(e, k)}
                                        className="rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 p-4"
                                        style={{
                                            backgroundColor: COLORS.surface,
                                            border: `2px solid ${dragging === k ? COLORS.brandPrimary : COLORS.divider}`,
                                            boxShadow: dragging === k
                                                ? `0 0 0 3px ${COLORS.brandPrimary}30, 0 4px 10px ${COLORS.brandPrimaryDark}1A`
                                                : `0 4px 10px ${COLORS.brandPrimaryDark}1A`,
                                            width: 84,
                                            height: 116,
                                            opacity: dragging === k ? 0.5 : 1,
                                        }}
                                    >
                                        <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
                                            {k}
                                        </span>
                                        {(info?.onyomi || info?.furigana) && (
                                            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                                                {info?.onyomi && (
                                                    <span className="text-[11px] font-semibold" style={{ color: COLORS.brandPrimary }}>
                                                        {info.onyomi}
                                                    </span>
                                                )}
                                                {info?.furigana && (
                                                    <span className="text-[11px]" style={{ color: COLORS.textMuted }}>
                                                        {info.furigana}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {info?.meaning && (
                                            <span className="text-[10px] mt-0.5 text-center px-1 truncate max-w-full" style={{ color: COLORS.textSecondary }}>
                                                {info.meaning}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                                    disabled={pageIndex === 0}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-30 transition-all duration-200"
                                    style={{
                                        backgroundColor: COLORS.surface,
                                        color: COLORS.textPrimary,
                                        border: `1px solid ${COLORS.divider}`
                                    }}
                                >
                                    Prev
                                </button>
                                <div className="flex items-center gap-2">
                                    {pages.map((_, i) => (
                                        <div
                                            key={`dot-${i}`}
                                            className="rounded transition-all duration-300"
                                            style={{
                                                width: i === pageIndex ? 20 : 8,
                                                height: 8,
                                                backgroundColor: i === pageIndex ? COLORS.brandPrimary : COLORS.divider
                                            }}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={pageIndex === totalPages - 1}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-30 transition-all duration-200"
                                    style={{
                                        backgroundColor: COLORS.surface,
                                        color: COLORS.textPrimary,
                                        border: `1px solid ${COLORS.divider}`
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {pages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg" style={{ color: COLORS.textSecondary }}>
                            No 2-character compounds available at this JLPT level
                        </p>
                    </div>
                )}
            </div>

            {/* Dragging ghost */}
            {dragging && (
                <div
                    className="fixed pointer-events-none z-50 transition-none"
                    style={{
                        left: dragPos.x - 42,
                        top: dragPos.y - 58,
                        width: 84,
                        height: 116,
                    }}
                >
                    <div
                        className="rounded-2xl flex flex-col items-center justify-center p-4"
                        style={{
                            backgroundColor: COLORS.surface,
                            border: `2px solid ${COLORS.brandPrimary}`,
                            boxShadow: `0 8px 24px ${COLORS.brandPrimaryDark}30`,
                            width: 84,
                            height: 116,
                            transform: 'scale(1.1)',
                        }}
                    >
                        <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {dragging}
                        </span>
                    </div>
                </div>
            )}

            {/* Reference modal */}
            <ReferenceModal
                visible={showRef}
                onClose={() => setShowRef(false)}
                kanji={kanji}
                groups={groups}
            />

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-6px); }
                    40% { transform: translateX(6px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    )
}
