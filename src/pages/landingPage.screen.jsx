"use client"

import { useEffect, useState } from "react"
import {
  Menu,
  X,
  Languages,
  BookOpen,
  Brain,
  Eye,
  MonitorSmartphone,
  Monitor,
  Globe,
  Smartphone,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Download,
} from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { AnimatedBackground } from "../components/AnimatedBackground"
import { Button } from "../components/Button"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import { hasAuthToken, clearAuthToken } from "../lib/auth"
import logOutMutation from "../graphql/mutations/logOut.mutation"
import COLORS from "../theme/colors"




export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const [executeLogOut, { loading: logoutLoading }] = useMutation(logOutMutation)

  useEffect(() => {
    const syncAuthState = () => setIsLoggedIn(hasAuthToken())

    syncAuthState()
    window.addEventListener("storage", syncAuthState)
    window.addEventListener("bundai:auth-change", syncAuthState)

    return () => {
      window.removeEventListener("storage", syncAuthState)
      window.removeEventListener("bundai:auth-change", syncAuthState)
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login")
    }
  }

  const handleSignUpClick = () => {
    if (!isLoggedIn) {
      navigate("/signup")
    }
  }

  const handleLogout = async () => {
    try {
      // Call the backend logout mutation
      await executeLogOut()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local token regardless of backend response
      clearAuthToken()
      setIsLoggedIn(false)
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}>
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg" style={{ backgroundColor: COLORS.surface + 'F0', borderBottom: `1px solid ${COLORS.divider}` }}>
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.brandPrimary }}>
                <span className="text-white font-bold text-lg">文</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                Bundai
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => scrollToSection("home")}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
              >
                Home
              </a>
              <a
                onClick={() => scrollToSection("pricing")}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
              >
                Pricing
              </a>
              <a
                onClick={() => scrollToSection("features")}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
              >
                Features
              </a>
              <a
                onClick={() => scrollToSection("demo")}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
              >
                Demo
              </a>
              {isLoggedIn ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  {logoutLoading ? "Logging Out..." : "Log Out"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ backgroundColor: COLORS.surfaceMuted, color: COLORS.textPrimary }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-6 border-t" style={{ borderColor: COLORS.divider }}>
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  onClick={() => scrollToSection("home")}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
                >
                  Home
                </a>
                <a
                  onClick={() => scrollToSection("pricing")}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
                >
                  Pricing
                </a>
                <a
                  onClick={() => scrollToSection("features")}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
                >
                  Features
                </a>
                <a
                  onClick={() => scrollToSection("demo")}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.brandPrimary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.textSecondary}
                >
                  Demo
                </a>
                {isLoggedIn ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-fit"
                  >
                    {logoutLoading ? "Logging Out..." : "Log Out"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLoginClick}
                    className="w-fit"
                  >
                    Log In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20" style={{ backgroundColor: COLORS.background }}>
        <div className="w-full mx-auto">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8" style={{ backgroundColor: COLORS.surfaceHighlight, borderColor: COLORS.brandPrimaryLight }}>
              <span className="text-xs sm:text-sm font-medium" style={{ color: COLORS.textPrimary }}>Master Japanese in 90 Days</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight max-w-5xl mx-auto px-2" style={{ color: COLORS.textPrimary }}>
              Start Watching{" "}
              <span style={{ color: COLORS.brandPrimary }}>YouTube</span>
              <br />
              in{" "}
              <span style={{ color: COLORS.brandSecondary }}>
                Japanese
              </span>{" "}
              in{" "}
              <span style={{ color: COLORS.accentSuccess }}>
                3 Months
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4" style={{ color: COLORS.textSecondary }}>
              Stop struggling with boring textbooks and ineffective apps.
              <span style={{ color: COLORS.brandPrimary, fontWeight: 600 }}> Bundai </span>
              uses immersive learning with real Japanese content to get you fluent fast.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
              <Button size="lg" className="w-full sm:w-auto" variant="primary" onClick={handleSignUpClick}>
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection("demo")}
                variant="secondary"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center p-4 sm:p-6 rounded-2xl" style={{ backgroundColor: COLORS.surfaceElevated }}>
                <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.accentSuccess }}>2000+</div>
                <div className="text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>Kanji Characters</div>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-2xl" style={{ backgroundColor: COLORS.surfaceElevated }}>
                <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.brandPrimary }}>10,000+</div>
                <div className="text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>Happy Learners</div>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-2xl" style={{ backgroundColor: COLORS.surfaceElevated }}>
                <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.brandPrimaryDark }}>90 Days</div>
                <div className="text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>Average to Fluency</div>
              </div>
            </div>
          </div>

          <div className="absolute top-20 right-4 lg:right-10 hidden xl:block opacity-60 hover:opacity-100 transition-opacity">
            <div className="relative animate-float">
              <div className="w-48 h-80 rounded-3xl border-2 shadow-2xl" style={{ backgroundColor: COLORS.surfaceMuted, borderColor: COLORS.divider }}>
                <div className="p-3 h-full rounded-3xl flex items-center justify-center" style={{ backgroundColor: COLORS.surfaceElevated }}>
                  <div className="text-center">
                    <Languages className="w-8 h-8 mx-auto mb-3" style={{ color: COLORS.brandPrimary }} />
                    <div className="text-xs" style={{ color: COLORS.textPrimary }}>Learning Japanese</div>
                    <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>漢字 Practice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: COLORS.surfaceMuted }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8" style={{ backgroundColor: COLORS.successSoft, border: `1px solid ${COLORS.accentSuccess}` }}>
              <span className="text-sm sm:text-base font-semibold" style={{ color: COLORS.accentSuccess }}>
                🔥 Lifetime free for first 100 users
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2" style={{ color: COLORS.textPrimary }}>
              Choose Your
              <span style={{ color: COLORS.brandPrimary }}>
                {" "}
                Learning Path
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: COLORS.textSecondary }}>
              Start free and upgrade when you're ready to accelerate your Japanese mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
            {/* Weekly Plan */}
            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Weekly</h3>
                <div className="text-3xl sm:text-4xl font-black mb-2" style={{ color: COLORS.textPrimary }}>$2.99</div>
                <div style={{ color: COLORS.textMuted }}>per week</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm sm:text-base">
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>All 2000 Kanji characters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Complete vocabulary (10,000+ words)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>YouTube extension</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>AI-powered SRS system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Progress analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Unlimited practice sessions</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={handleLoginClick} style={{ backgroundColor: 'transparent' }}>
                Start Weekly
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="p-6 sm:p-8 text-center relative md:scale-105 rounded-2xl shadow-xl" style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.brandPrimary}` }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-white" style={{ backgroundColor: COLORS.brandPrimary }}>
                Best Value
              </div>
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Yearly</h3>
                <div className="text-3xl sm:text-4xl font-black mb-2" style={{ color: COLORS.textPrimary }}>$29.99</div>
                <div style={{ color: COLORS.textMuted }}>per year</div>
                <div className="text-sm mt-1" style={{ color: COLORS.accentSuccess }}>Save $125!</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm sm:text-base">
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>All 2000 Kanji characters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Complete vocabulary (10,000+ words)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>YouTube extension</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>AI-powered SRS system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Progress analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Unlimited practice sessions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0" style={{ color: COLORS.accentSuccess }} />
                  <span style={{ color: COLORS.textSecondary }}>Exclusive features</span>
                </li>
              </ul>
              <Button variant="primary" className="w-full" onClick={handleLoginClick}>
                Start Yearly
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <p className="mb-4 text-sm sm:text-base" style={{ color: COLORS.textMuted }}>
              🎯 30-day money-back guarantee • 🔒 Secure payment • 📱 Instant access
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: COLORS.background }}>
        <div className="mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2" style={{ color: COLORS.textPrimary }}>
              Revolutionary Learning
              <span style={{ color: COLORS.brandPrimary }}>
                {" "}
                Features
              </span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: COLORS.textSecondary }}>
              Powered by AI and designed for real-world fluency, not just test scores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 px-4">
            {/* Highlighted (most important) card */}
            <div className="p-6 sm:p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl rounded-2xl sm:col-span-2 lg:col-span-1" style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.brandPrimary}` }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.brandPrimary }}>
                <MonitorSmartphone className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>Cross-Platform Sync</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Learn seamlessly across desktop, mobile, and browser extension. Your progress syncs everywhere
                instantly.
              </p>
            </div>

            {/* Other cards */}
            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.accentDanger }}>
                <Languages className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>2000 Essential Kanji</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Master every kanji you need with our scientifically-ordered curriculum and visual memory techniques.
              </p>
            </div>

            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.accentSuccess }}>
                <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>AI-Powered SRS</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Our intelligent spaced repetition adapts to your learning speed and optimizes retention automatically.
              </p>
            </div>

            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.brandSecondary }}>
                <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>YouTube Integration</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Learn from real Japanese content. Our extension provides instant translations and vocabulary building.
              </p>
            </div>

            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.accentWarning }}>
                <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>1000 Core Words</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Immersive vocabulary learning with audio-first approach and contextual understanding.
              </p>
            </div>

            <div className="p-6 sm:p-8 text-center rounded-2xl shadow-lg" style={{ backgroundColor: COLORS.surface }}>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: COLORS.brandPrimaryLight }}>
                <Eye className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.textPrimary }}>Similar Kanji Training</h3>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLORS.textSecondary }}>
                Never confuse similar-looking characters again with our specialized recognition training system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: COLORS.surfaceMuted }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 px-2" style={{ color: COLORS.textPrimary }}>
            See Bundai in
            <span style={{ color: COLORS.accentSuccess }}> Action</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto px-4" style={{ color: COLORS.textSecondary }}>
            Watch how our revolutionary approach transforms Japanese learning from boring to brilliant.
          </p>

          {/* Video player mockup */}
          <div className="relative mx-auto max-w-2xl px-4">
            <div className="aspect-video rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: COLORS.surfaceMuted }}>
              <div className="relative h-full flex items-center justify-center" style={{ backgroundColor: COLORS.surfaceElevated }}>
                <Button size="md" className="sm:size-lg" variant="accent">
                  <Play className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Watch Demo Video</span>
                </Button>

                {/* Floating UI elements */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm" style={{ backgroundColor: COLORS.surface, color: COLORS.textPrimary }}>
                  🎌 Learning Japanese
                </div>
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white font-medium" style={{ backgroundColor: COLORS.accentSuccess }}>
                  Progress: 67%
                </div>
              </div>
            </div>

            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center animate-bounce delay-300" style={{ backgroundColor: COLORS.accentWarning }}>
              <Languages className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: COLORS.brandSecondary }}>
              <Brain className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
            </div>
          </div>

          {/* Platform showcase */}
          <section id="platforms" className="mt-8 sm:mt-12">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-2" style={{ color: COLORS.textPrimary }}>Learn Anywhere, Anytime</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center px-4">
              {/* Desktop mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="relative mx-auto w-full max-w-md sm:max-w-lg" style={{ aspectRatio: "5/3" }}>
                  <div className="absolute inset-0 rounded-2xl shadow-2xl" style={{ backgroundColor: COLORS.surfaceMuted, border: `1px solid ${COLORS.divider}` }}>
                    <div className="p-4 sm:p-6 h-full">
                      <div className="h-full rounded-xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: COLORS.surfaceElevated }}>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex space-x-1 sm:space-x-2">
                          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: COLORS.accentDanger }}></div>
                          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: COLORS.accentWarning }}></div>
                          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: COLORS.accentSuccess }}></div>
                        </div>
                        <div className="text-center">
                          <Monitor className="w-8 sm:w-16 h-8 sm:h-16 mx-auto mb-2 sm:mb-4" style={{ color: COLORS.brandPrimary }} />
                          <div className="font-semibold text-sm sm:text-base" style={{ color: COLORS.textPrimary }}>Chrome Extension Active</div>
                          <div className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: COLORS.textSecondary }}>Learning from YouTube</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center animate-bounce" style={{ backgroundColor: COLORS.accentSuccess }}>
                  <Globe className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                </div>
              </div>

              {/* Mobile mockups */}
              <div className="flex justify-center space-x-4 sm:space-x-8 order-1 lg:order-2">
                <div className="relative">
                  <div className="w-32 sm:w-48 h-56 sm:h-96 rounded-2xl sm:rounded-3xl border-2 sm:border-4 shadow-2xl" style={{ backgroundColor: COLORS.surfaceMuted, borderColor: COLORS.divider }}>
                    <div className="p-2 sm:p-4 h-full">
                      <div className="h-full rounded-xl sm:rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.surfaceElevated }}>
                        <div className="text-center">
                          <Smartphone className="w-6 sm:w-12 h-6 sm:h-12 mx-auto mb-2 sm:mb-4" style={{ color: COLORS.accentDanger }} />
                          <div className="text-xs sm:text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Quiz Mode</div>
                          <div className="text-xs mt-1 sm:mt-2" style={{ color: COLORS.textSecondary }}>漢字: 学習</div>
                          <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                            <div className="w-12 sm:w-20 h-1 sm:h-2 rounded mx-auto" style={{ backgroundColor: COLORS.surfaceMuted }}></div>
                            <div className="w-10 sm:w-16 h-1 sm:h-2 rounded mx-auto" style={{ backgroundColor: COLORS.surfaceMuted }}></div>
                            <div className="w-14 sm:w-24 h-1 sm:h-2 rounded mx-auto" style={{ backgroundColor: COLORS.accentDanger }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: COLORS.brandSecondary }}>
                    <Star className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
              <a
                href="https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-2 sm:p-3 hover:scale-105 transition-transform cursor-pointer w-full sm:w-auto"
                style={{ backgroundColor: COLORS.textPrimary }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                  <Globe className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: COLORS.surface }} />
                  <div className="text-left">
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>Available in</div>
                    <div className="text-sm sm:text-lg font-semibold" style={{ color: COLORS.surface }}>Chrome Web Store</div>
                  </div>
                </div>
              </a>

              <a
                href="https://apps.apple.com/gb/app/bundai/id6751961361"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-2 sm:p-3 hover:scale-105 transition-transform cursor-pointer w-full sm:w-auto"
                style={{ backgroundColor: COLORS.textPrimary }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                  <Download className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: COLORS.surface }} />
                  <div className="text-left">
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>Download on the</div>
                    <div className="text-sm sm:text-lg font-semibold" style={{ color: COLORS.surface }}>App Store</div>
                  </div>
                </div>
              </a>

              <div className="rounded-2xl p-2 sm:p-3 w-full sm:w-auto opacity-70 cursor-not-allowed" style={{ backgroundColor: COLORS.surfaceElevated }}>
                <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                  <Download className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: COLORS.textMuted }} />
                  <div className="text-left">
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>Get it on</div>
                    <div className="text-sm sm:text-lg font-semibold" style={{ color: COLORS.textMuted }}>Google Play</div>
                    <div className="text-xs font-semibold" style={{ color: COLORS.brandPrimary }}>Coming Soon!</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t py-8 sm:py-12 px-4 sm:px-6" style={{ borderColor: COLORS.divider, backgroundColor: COLORS.surfaceMuted }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Logo and description */}
            <div className="sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.brandPrimary }}>
                  <span className="text-white font-bold text-base sm:text-lg">文</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                  Bundai
                </span>
              </div>
              <p className="max-w-md leading-relaxed text-sm sm:text-base mx-auto sm:mx-0" style={{ color: COLORS.textSecondary }}>
                The fastest way to learn Japanese through immersive, real-world content. Join thousands of learners
                mastering Japanese in record time.
              </p>
              <div className="flex justify-center sm:justify-start space-x-4 mt-4 sm:mt-6">
                {/* Social media icons */}
                <a
                  href="https://x.com/bundaiapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center hover:transition-colors"
                  style={{ backgroundColor: COLORS.surfaceElevated, color: COLORS.brandPrimary }}
                >
                  <span className="text-sm sm:text-base">𝕏</span>
                </a>
                <a
                  href="https://www.youtube.com/channel/UChZ7BBgEhuDs7PhcxcwMYcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center hover:transition-colors"
                  style={{ backgroundColor: COLORS.surfaceElevated, color: COLORS.accentDanger }}
                >
                  <span className="text-sm sm:text-base">▶</span>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: COLORS.textPrimary }}>Product</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <a href="#features" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="https://apps.apple.com/gb/app/bundai/id6751961361" target="_blank" rel="noopener noreferrer" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>
                    iOS App
                  </a>
                </li>
                <li>
                  <a href="https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en" target="_blank" rel="noopener noreferrer" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>
                    Chrome Extension
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Support</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>Help Center</Link></li>
                <li><Link to="#" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:transition-colors" style={{ color: COLORS.textSecondary }}>Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left" style={{ borderColor: COLORS.divider }}>
            <p className="text-xs sm:text-sm mb-4 md:mb-0" style={{ color: COLORS.textMuted }}>
              © 2025 Bundai. All rights reserved. Made with ❤️ for Japanese learners worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>🌟 4.9/5 rating</span>
              <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>📱 10k+ downloads</span>
              <span className="text-xs sm:text-sm" style={{ color: COLORS.textMuted }}>🎯 90-day guarantee</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f7f5ff;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #7f53f5, #5632d4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #5632d4, #7f53f5);
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
          .text-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
 }
      `}</style>
    </div>
  )
}
