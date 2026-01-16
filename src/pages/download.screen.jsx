"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { CheckCircle, Download, Globe, Smartphone, ArrowRight, Home } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import { AndroidWaitlistForm } from "../components/AndroidWaitlistForm"
import { hasAuthToken } from "../lib/auth"

const CHROME_EXTENSION_URL = "https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe"
const IOS_APP_URL = "https://apps.apple.com/gb/app/bundai/id6751961361"

export default function DownloadPage() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(hasAuthToken())
  }, [])

  return (
    <div className="fixed inset-0 flex min-h-screen w-screen items-center justify-center overflow-auto bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-10%] h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/30 blur-3xl" />
        <div className="absolute right-[-20%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-tl from-emerald-400/30 via-cyan-400/20 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/30 to-sky-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-16">
        <GlassCard className="space-y-8 p-8" hover={false}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                <span className="text-base font-bold">文</span>
              </div>
              <div>
                <div className="text-lg font-semibold">Bundai</div>
                <div className="text-xs uppercase tracking-wide text-white/60">Immersive Japanese Learning</div>
              </div>
            </div>
            <Link to="/">
              <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isLoggedIn ? "Welcome to Bundai!" : "Get Started with Bundai"}
            </h1>
            <p className="text-white/70">
              {isLoggedIn
                ? "Your account is ready. Download the app on your preferred platform to start learning Japanese."
                : "Choose your platform to start your Japanese learning journey."}
            </p>
          </div>

          {/* Platform Download Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center text-white/80">Download Bundai</h2>

            <div className="grid gap-4">
              {/* Chrome Extension */}
              <a
                href={CHROME_EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">Available in</div>
                      <div className="text-lg font-semibold text-white">Chrome Web Store</div>
                      <div className="text-xs text-emerald-400">Learn from YouTube with instant translations</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </a>

              {/* iOS App */}
              <a
                href={IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="text-lg font-semibold text-white">App Store</div>
                      <div className="text-xs text-emerald-400">Practice kanji and vocab on the go</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </a>

              {/* Android Waitlist */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">Coming February 2025</div>
                    <div className="text-lg font-semibold text-white mb-2">Google Play</div>
                    <AndroidWaitlistForm compact />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">Pro Tips:</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>Use the Chrome extension while watching Japanese YouTube videos</li>
              <li>Practice with the mobile app during your commute</li>
              <li>Your progress syncs automatically across all platforms</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
