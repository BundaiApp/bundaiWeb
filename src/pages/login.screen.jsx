"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import logInMutation from "../graphql/mutations/logIn.mutation"
import { hasAuthToken, setAuthData, redirectToDashboard } from "../lib/auth"

export default function Login() {
  const isDevMode = Boolean(import.meta?.env?.DEV)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [executeLogin, { loading }] = useMutation(logInMutation)

  useEffect(() => {
    const loggedIn = hasAuthToken()
    setIsLoggedIn(loggedIn)
    if (loggedIn && !isDevMode) {
      redirectToDashboard()
    }
  }, [isDevMode])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage("")

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.")
      return
    }

    try {
      const trimmedEmail = email.trim()
      const { data: loginData } = await executeLogin({
        variables: { email: trimmedEmail, password },
      })

      const result = loginData?.logIn
      if (result?.token) {
        // Store all auth data using centralized helper
        setAuthData(result)
        setEmail(trimmedEmail)
        setPassword("")
        setIsLoggedIn(true)
        // Redirect to dashboard
        setTimeout(() => {
          if (!redirectToDashboard()) {
            navigate("/dashboard")
          }
        }, 500)
      } else {
        setErrorMessage(result?.errorMessage || "Unable to log in. Please try again.")
      }
    } catch (error) {
      console.error("Log in failed", error)
      setErrorMessage(error.message || "Something went wrong during login.")
    }
  }

  return (
    <div className="fixed inset-0 flex min-h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-10%] h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/30 blur-3xl" />
        <div className="absolute right-[-20%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-tl from-emerald-400/30 via-cyan-400/20 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/30 to-sky-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-16">
        <GlassCard className="space-y-8 p-8 text-slate-900" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                <span className="text-base font-bold">文</span>
              </div>
              <div>
                <div className="text-lg font-semibold">Bundai</div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Immersive Japanese Learning</div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl text-slate-900">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              Log in with your credentials to get back to your personalized Bundai lessons.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-white border border-slate-300 py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400"
                  autoComplete="email"
                  disabled={loading || isLoggedIn}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-white border border-slate-300 py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400"
                  autoComplete="current-password"
                  disabled={loading || isLoggedIn}
                />
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {isLoggedIn ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                You are logged in! Feel free to explore Bundai.
              </div>
            ) : null}

            <Button type="submit" variant="primary" className="w-full" disabled={loading || isLoggedIn}>
              {loading ? "Logging In..." : isLoggedIn ? "Logged In" : "Log In"}
            </Button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-violet-700 hover:text-violet-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/" className="text-violet-700 hover:text-violet-800">
              Explore Bundai
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
