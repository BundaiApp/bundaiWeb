import { GlassCard } from "../components/GlassCard"
import { FileText } from "lucide-react"

export default function LocalQuiz() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
                <GlassCard className="p-12 max-w-2xl mx-auto">
                    <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-white mb-4">Local Quiz</h1>
                    <p className="text-gray-300 text-lg mb-8">
                        Quiz builder with customizable filters coming soon!
                    </p>
                    <div className="text-gray-400 text-sm">
                        Create custom quizzes by selecting JLPT levels, stroke counts, word types, and more.
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}


