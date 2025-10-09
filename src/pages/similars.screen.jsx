import { GlassCard } from "../components/GlassCard"
import { Search } from "lucide-react"
import { useState } from "react"

export default function Similars() {
    const [searchTerm, setSearchTerm] = useState("")

    const similarKanjis = [
        "一", "二", "九", "七", "人",
        "入", "八", "十", "三", "上",
        "下", "大", "女", "山", "川",
        "土", "千", "子", "小", "中",
        "五", "六", "円", "天", "日",
        "月", "木", "水", "火", "出",
        "右", "四", "左", "本", "白",
        "万", "今", "午", "友", "父",
        "北", "半", "外", "母", "休",
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Similar Kanjis</h1>
                <p className="text-gray-300">Find and compare similar-looking kanji characters</p>
            </div>

            {/* Search Bar */}
            <GlassCard className="p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search here..."
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    />
                </div>
            </GlassCard>

            {/* Kanji Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {similarKanjis.map((kanji, idx) => (
                    <button
                        key={idx}
                        className="aspect-square bg-white/5 hover:bg-white/10 border-2 border-purple-500/30 hover:border-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 hover:scale-105"
                    >
                        {kanji}
                    </button>
                ))}
            </div>
        </div>
    )
}


