import { GlassCard } from "../components/GlassCard"
import { RefreshCw } from "lucide-react"
import { Button } from "../components/Button"

export default function SRS() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Spaced Repetition System</h1>
                <p className="text-gray-300">Review your cards and strengthen your memory</p>
            </div>

            {/* Level Progress Card */}
            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Level 10</h2>
                        <p className="text-gray-300">5 of 68 items learned</p>
                    </div>
                    <div className="bg-purple-500 text-white px-6 py-3 rounded-full text-2xl font-bold">
                        7%
                    </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: "7%" }}></div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-purple-400 text-sm font-medium mb-1">KANJI</div>
                        <div className="text-white text-2xl font-bold">0/28</div>
                    </div>
                    <div className="text-center">
                        <div className="text-purple-400 text-sm font-medium mb-1">WORDS</div>
                        <div className="text-white text-2xl font-bold">5/40</div>
                    </div>
                    <div className="text-center">
                        <div className="text-purple-400 text-sm font-medium mb-1">SOUNDS</div>
                        <div className="text-white text-2xl font-bold">0/—</div>
                    </div>
                </div>

                <Button variant="secondary" className="w-full">
                    Open level details
                </Button>
            </GlassCard>

            {/* Review Queue Card */}
            <GlassCard className="p-8 bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-2 border-purple-500/50">
                <div className="text-center">
                    <div className="text-white/80 text-lg mb-2">Review queue</div>
                    <div className="text-white text-8xl font-bold mb-4">108</div>
                    <div className="text-white text-xl mb-4">Cards ready right now</div>

                    <div className="inline-block bg-purple-700/50 px-4 py-2 rounded-full text-white text-sm mb-8">
                        Due now
                    </div>

                    <Button variant="primary" size="lg" className="w-full max-w-md mx-auto">
                        Review 108 due
                    </Button>
                </div>
            </GlassCard>

            {/* Kanji Preview Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-white">Kanji</h2>
                        <span className="bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">28</span>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        Level →
                    </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                    {["意", "味", "勉", "旅", "員", "動", "悪", "族", "着", "野", "風", "新"].map((kanji, idx) => (
                        <button
                            key={idx}
                            className="aspect-square bg-gradient-to-br from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            {kanji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}


