import { GlassCard } from "../components/GlassCard"
import { User, Award, Shield, Bell, Mail, Moon } from "lucide-react"
import { useState, useEffect } from "react"

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
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-300">Manage your account and preferences</p>
            </div>

            {/* Profile Card */}
            <GlassCard className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-4xl">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
                    <p className="text-gray-400">{userEmail}</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300">
                        <User className="w-5 h-5" />
                        <span>Edit Profile</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300">
                        <Award className="w-5 h-5" />
                        <span>Achievements</span>
                    </button>
                </div>
            </GlassCard>

            {/* Preferences Section */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-4">Preferences</h3>
                <GlassCard className="divide-y divide-white/10">
                    {/* Study Reminders */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Bell className="w-6 h-6 text-purple-400" />
                            <div>
                                <div className="text-white font-medium text-lg">Study reminders</div>
                                <div className="text-gray-400 text-sm">Daily push to keep you practicing</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("studyReminders")}
                            className={`
                relative w-14 h-8 rounded-full transition-colors duration-300
                ${settings.studyReminders ? "bg-purple-600" : "bg-gray-600"}
              `}
                        >
                            <div
                                className={`
                  absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                  ${settings.studyReminders ? "translate-x-6" : "translate-x-0"}
                `}
                            />
                        </button>
                    </div>

                    {/* Email Updates */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Mail className="w-6 h-6 text-purple-400" />
                            <div>
                                <div className="text-white font-medium text-lg">Email updates</div>
                                <div className="text-gray-400 text-sm">Monthly round-up of new kanji content</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("emailUpdates")}
                            className={`
                relative w-14 h-8 rounded-full transition-colors duration-300
                ${settings.emailUpdates ? "bg-purple-600" : "bg-gray-600"}
              `}
                        >
                            <div
                                className={`
                  absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                  ${settings.emailUpdates ? "translate-x-6" : "translate-x-0"}
                `}
                            />
                        </button>
                    </div>

                    {/* Dark Mode */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Moon className="w-6 h-6 text-purple-400" />
                            <div>
                                <div className="text-white font-medium text-lg">Dark mode</div>
                                <div className="text-gray-400 text-sm">Match bun.dai to the night shift</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting("darkMode")}
                            className={`
                relative w-14 h-8 rounded-full transition-colors duration-300
                ${settings.darkMode ? "bg-purple-600" : "bg-gray-600"}
              `}
                        >
                            <div
                                className={`
                  absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                  ${settings.darkMode ? "translate-x-6" : "translate-x-0"}
                `}
                            />
                        </button>
                    </div>
                </GlassCard>
            </section>

            {/* Account Section */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-4">Account</h3>
                <GlassCard className="divide-y divide-white/10">
                    <button className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center space-x-4">
                            <User className="w-6 h-6 text-purple-400" />
                            <div className="text-left">
                                <div className="text-white font-medium text-lg">Account details</div>
                                <div className="text-gray-400 text-sm">Update your name and learning goal</div>
                            </div>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center space-x-4">
                            <Shield className="w-6 h-6 text-purple-400" />
                            <div className="text-left">
                                <div className="text-white font-medium text-lg">Privacy & security</div>
                                <div className="text-gray-400 text-sm">Manage your data and privacy settings</div>
                            </div>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </GlassCard>
            </section>
        </div>
    )
}


