import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, FileText, RefreshCw, Eye, Settings as SettingsIcon, LogOut, X } from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { useState, useEffect } from "react"
import { clearAuthToken } from "../lib/auth"
import logOutMutation from "../graphql/mutations/logOut.mutation"

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [executeLogOut, { loading: logoutLoading }] = useMutation(logOutMutation)
    const [userEmail, setUserEmail] = useState("")
    const [userName, setUserName] = useState("")

    useEffect(() => {
        // Get user info from localStorage or context
        // For now, using placeholder - you can replace with actual user data
        const email = localStorage.getItem("userEmail") || "user@bundai.com"
        const name = localStorage.getItem("userName") || "User"
        setUserEmail(email)
        setUserName(name)
    }, [])

    const handleLogout = async () => {
        try {
            await executeLogOut()
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            clearAuthToken()
            localStorage.removeItem("userId")
            localStorage.removeItem("userEmail")
            localStorage.removeItem("userName")
            navigate("/")
        }
    }

    const navItems = [
        { path: "/dashboard", icon: Home, label: "Dashboard" },
        { path: "/dashboard/quiz", icon: FileText, label: "Local Quiz" },
        { path: "/dashboard/srs", icon: RefreshCw, label: "SRS", badge: 108 },
        { path: "/dashboard/similars", icon: Eye, label: "Similars" },
        { path: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
    ]

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard"
        }
        return location.pathname.startsWith(path)
    }

    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            onClose()
        }
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-screen w-64 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb' }}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Link to="/dashboard" className="flex items-center space-x-3 group" onClick={handleNavClick}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' }}>
                            <span className="text-white font-bold text-xl">文</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold block" style={{ color: '#1f1a3d' }}>
                                Bundai
                            </span>
                            <span className="text-xs" style={{ color: '#8f93a3' }}>Japanese Learning</span>
                        </div>
                    </Link>

                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" style={{ color: '#5b6070' }} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
                                style={{
                                    backgroundColor: active ? '#7f53f5' : 'transparent',
                                    color: active ? '#ffffff' : '#5b6070'
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = '#f1ecff'
                                        e.currentTarget.style.color = '#1f1a3d'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = '#5b6070'
                                    }
                                }}
                            >
                                <div className="flex items-center space-x-3 relative z-10">
                                    <Icon className="w-5 h-5" style={{ color: active ? '#ffffff' : '#8f93a3' }} />
                                    <span className="font-medium">{item.label}</span>
                                </div>

                                {item.badge && (
                                    <span className="text-white text-xs font-bold px-2 py-1 rounded-full min-w-[2rem] text-center" style={{ backgroundColor: '#ee5d67' }}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <div className="rounded-xl p-4" style={{ backgroundColor: '#f7f5ff' }}>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7f53f5 0%, #5632d4 100%)' }}>
                                <span className="text-white font-semibold text-sm">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate" style={{ color: '#1f1a3d' }}>{userName}</div>
                                <div className="text-xs truncate" style={{ color: '#8f93a3' }}>{userEmail}</div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                            style={{
                                backgroundColor: '#dcd5ff',
                                color: '#5632d4'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#8c7bfa'
                                e.currentTarget.style.color = '#ffffff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#dcd5ff'
                                e.currentTarget.style.color = '#5632d4'
                            }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {logoutLoading ? "Logging out..." : "Log Out"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}


