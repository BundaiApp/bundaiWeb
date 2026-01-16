import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { LEVEL_SYSTEM_CONFIG } from "../util/levelSystem"
import { RefreshCw } from "lucide-react"
import COLORS from "../theme/colors"
import ME_QUERY from "../graphql/queries/me.query"

const SECTIONS = [
    { title: 'Levels 1-10', startLevel: 1, endLevel: 10 },
    { title: 'Levels 11-20', startLevel: 11, endLevel: 20 },
    { title: 'Levels 21-30', startLevel: 21, endLevel: 30 },
    { title: 'Levels 31-40', startLevel: 31, endLevel: 40 },
    { title: 'Levels 41-50', startLevel: 41, endLevel: 50 }
]

export default function Levels() {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId") || ""
    const isGuest = !userId
    const [currentLevel, setCurrentLevel] = useState(1)

    const { data: userData, loading: loadingData, refetch } = useQuery(ME_QUERY, {
        variables: { _id: userId },
        skip: isGuest,
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if (userData?.me?.currentLevel) {
            setCurrentLevel(userData.me.currentLevel)
        }
    }, [userData])

    const handleRefresh = () => {
        if (!isGuest) {
            refetch()
        }
    }

    const handleLevelPress = (level) => {
        if (level > currentLevel) {
            alert(`Level ${level} is locked. Complete more levels to unlock it.`)
            return
        }
        navigate('/dashboard/level-details', { state: { level } })
    }

    const renderLevelCard = (level) => {
        const isUnlocked = level <= currentLevel

        return (
            <button
                key={level}
                onClick={() => handleLevelPress(level)}
                className="aspect-square w-full rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105"
                style={{
                    backgroundColor: isUnlocked ? COLORS.cardKanji : 'transparent',
                    border: isUnlocked ? 'none' : `2px dashed ${COLORS.interactiveSurface}`,
                    color: isUnlocked ? COLORS.surface : COLORS.interactiveTextInactive,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed'
                }}
            >
                {level}
            </button>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-8" style={{ backgroundColor: COLORS.background }}>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                        All Levels
                    </h1>
                    <p style={{ color: COLORS.textSecondary }}>
                        {currentLevel} of {LEVEL_SYSTEM_CONFIG.totalLevels} levels unlocked
                    </p>
                </div>
                {!isGuest && (
                    <button
                        onClick={handleRefresh}
                        disabled={loadingData}
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: COLORS.interactiveSurface }}
                    >
                        <RefreshCw
                            className={`w-6 h-6 ${loadingData ? 'animate-spin' : ''}`}
                            style={{ color: COLORS.brandPrimary }}
                        />
                    </button>
                )}
            </div>

            {SECTIONS.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                            {section.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {Array.from(
                            { length: section.endLevel - section.startLevel + 1 },
                            (_, index) => section.startLevel + index
                        ).map((level) => renderLevelCard(level))}
                    </div>
                </div>
            ))}
        </div>
    )
}
