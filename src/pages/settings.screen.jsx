import { User, Award, Shield, Bell, Mail, Moon, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import COLORS from "../theme/colors"

export default function Settings() {
    const [userEmail, setUserEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [settings, setSettings] = useState({
        studyReminders: true,
        emailUpdates: false,
        darkMode: false,
    })

    useEffect(() => {
        const email = localStorage.getItem("userEmail") || "user@bundai.com"
        const name = localStorage.getItem("userName") || "User"
        setUserEmail(email)
        setUserName(name)
    }, [])

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Settings</h1>
                <p style={{ color: COLORS.textSecondary }}>Manage your account and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="p-8 rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
                <div className="flex flex-col items-center text-center mb-6">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                        style={{ background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)` }}
                    >
                        <span className="font-bold text-4xl" style={{ color: COLORS.surface }}>
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{userName}</h2>
                    <p style={{ color: COLORS.textMuted }}>{userEmail}</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: COLORS.brandPrimary, color: COLORS.surface }}
                    >
                        <User className="w-5 h-5" />
                        <span>Edit Profile</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: COLORS.surfaceMuted, color: COLORS.textPrimary }}
                    >
                        <Award className="w-5 h-5" />
                        <span>Achievements</span>
                    </button>
                </div>
            </div>

            {/* Preferences Section */}
            <section>
                <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>Preferences</h3>
                <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.surface }}>
                    {/* Study Reminders */}
                    <div
                        className="p-6 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${COLORS.divider}` }}
                    >
                        <div className="flex items-center space-x-4">
                            <Bell className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                            <div>
                                <div className="font-medium text-lg" style={{ color: COLORS.textPrimary }}>Study reminders</div>
                                <div className="text-sm" style={{ color: COLORS.textMuted }}>Daily push to keep you practicing</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("studyReminders")}
                            className="relative w-14 h-8 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: settings.studyReminders ? COLORS.brandPrimary : COLORS.outline }}
                        >
                            <div
                                className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    transform: settings.studyReminders ? 'translateX(1.5rem)' : 'translateX(0)'
                                }}
                            />
                        </button>
                    </div>

                    {/* Email Updates */}
                    <div
                        className="p-6 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${COLORS.divider}` }}
                    >
                        <div className="flex items-center space-x-4">
                            <Mail className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                            <div>
                                <div className="font-medium text-lg" style={{ color: COLORS.textPrimary }}>Email updates</div>
                                <div className="text-sm" style={{ color: COLORS.textMuted }}>Monthly round-up of new kanji content</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("emailUpdates")}
                            className="relative w-14 h-8 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: settings.emailUpdates ? COLORS.brandPrimary : COLORS.outline }}
                        >
                            <div
                                className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    transform: settings.emailUpdates ? 'translateX(1.5rem)' : 'translateX(0)'
                                }}
                            />
                        </button>
                    </div>

                    {/* Dark Mode */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Moon className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                            <div>
                                <div className="font-medium text-lg" style={{ color: COLORS.textPrimary }}>Dark mode</div>
                                <div className="text-sm" style={{ color: COLORS.textMuted }}>Match bun.dai to the night shift</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("darkMode")}
                            className="relative w-14 h-8 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: settings.darkMode ? COLORS.brandPrimary : COLORS.outline }}
                        >
                            <div
                                className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    transform: settings.darkMode ? 'translateX(1.5rem)' : 'translateX(0)'
                                }}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section>
                <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>Account</h3>
                <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.surface }}>
                    <button
                        className="w-full p-6 flex items-center justify-between transition-colors"
                        style={{ borderBottom: `1px solid ${COLORS.divider}` }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.surfaceMuted}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div className="flex items-center space-x-4">
                            <User className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                            <div className="text-left">
                                <div className="font-medium text-lg" style={{ color: COLORS.textPrimary }}>Account details</div>
                                <div className="text-sm" style={{ color: COLORS.textMuted }}>Update your name and learning goal</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6" style={{ color: COLORS.textMuted }} />
                    </button>

                    <button
                        className="w-full p-6 flex items-center justify-between transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.surfaceMuted}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div className="flex items-center space-x-4">
                            <Shield className="w-6 h-6" style={{ color: COLORS.brandPrimary }} />
                            <div className="text-left">
                                <div className="font-medium text-lg" style={{ color: COLORS.textPrimary }}>Privacy & security</div>
                                <div className="text-sm" style={{ color: COLORS.textMuted }}>Manage your data and privacy settings</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6" style={{ color: COLORS.textMuted }} />
                    </button>
                </div>
            </section>
        </div>
    )
}


