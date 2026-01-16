import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LEVEL_SYSTEM_CONFIG } from "../util/levelSystem"
import COLORS from "../theme/colors"

const SECTIONS = [
    { title: 'Levels 1-10', startLevel: 1, endLevel: 10 },
    { title: 'Levels 11-20', startLevel: 11, endLevel: 20 },
    { title: 'Levels 21-30', startLevel: 21, endLevel: 30 },
    { title: 'Levels 31-40', startLevel: 31, endLevel: 40 },
    { title: 'Levels 41-50', startLevel: 41, endLevel: 50 }
]

export default function Levels() {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId") || "defaultUser"
    const isGuest = !userId || userId === "defaultUser"
    const [currentLevel, setCurrentLevel] = useState(10)

    useEffect(() => {
        const fetchCurrentLevel = async () => {
            try {
                const response = await fetch('https://bundaibackend-production.up.railway.app/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query me($_id: String!) {
                                me(_id: $_id) {
                                    _id
                                    currentLevel
                                }
                            }
                        `,
                        variables: { _id: userId }
                    })
                })

                const data = await response.json()
                if (data?.data?.me?.currentLevel) {
                    setCurrentLevel(data.data.me.currentLevel)
                }
            } catch (error) {
                console.error("Error fetching current level:", error)
            }
        }

        if (!isGuest) {
            fetchCurrentLevel()
        }
    }, [userId, isGuest])

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
            <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
                    All Levels
                </h1>
                <p style={{ color: COLORS.textSecondary }}>
                    {currentLevel} of {LEVEL_SYSTEM_CONFIG.totalLevels} levels unlocked
                </p>
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
