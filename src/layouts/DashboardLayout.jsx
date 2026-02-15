import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { hasAuthToken } from "../lib/auth"
import Sidebar from "../components/Sidebar"
import { Menu } from "lucide-react"
import COLORS from "../theme/colors"

export default function DashboardLayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Check if current page needs full screen (no sidebar)
    const isFullScreenPage = location.pathname.includes('/kanji-template') ||
        location.pathname.includes('/kanji-detail') ||
        location.pathname.includes('/quiz-engine') ||
        location.pathname.includes('/srs-engine') ||
        location.pathname.includes('/similar-detail')

    useEffect(() => {
        // Check if user is authenticated
        if (!hasAuthToken()) {
            navigate("/", { replace: true })
        }
    }, [navigate])

    // Full screen layout for kanji pages
    if (isFullScreenPage) {
        return (
            <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: COLORS.background }}>
                <div className="h-screen overflow-y-auto relative z-10">
                    <main className="min-h-full">
                        {children}
                    </main>
                </div>
            </div>
        )
    }

    // Regular layout with sidebar
    return (
        <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: COLORS.background }}>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="md:ml-64 h-screen overflow-y-auto relative z-10">
                {/* Mobile Header with Hamburger */}
                <div className="md:hidden sticky top-0 z-30 p-4 flex items-center" style={{ backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.divider}` }}>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6" style={{ color: COLORS.textSecondary }} />
                    </button>
                    <span className="ml-3 font-bold text-lg" style={{ color: COLORS.textPrimary }}>Bundai</span>
                </div>

                <main className="p-4 md:p-8 min-h-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
