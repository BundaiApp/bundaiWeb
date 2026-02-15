"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, User, ArrowLeft } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import signUpMutation from "../graphql/mutations/signUp.mutation"
import { hasAuthToken, setAuthData, redirectToDashboard } from "../lib/auth"

export default function SignUp() {
    const isDevMode = Boolean(import.meta?.env?.DEV)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [executeSignUp, { loading }] = useMutation(signUpMutation)

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

        if (!username || !email || !password) {
            setErrorMessage("Please fill in all fields.")
            return
        }

        // Email validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRegex.test(email.toLowerCase())) {
            setErrorMessage("Please enter a valid email address.")
            return
        }

        try {
            const trimmedEmail = email.trim()
            const { data: signUpData } = await executeSignUp({
                variables: { email: trimmedEmail, password, username: username.trim() },
            })

            const result = signUpData?.signUp
            if (result?.token) {
                // Store all auth data using centralized helper
                setAuthData(result)
                setEmail(trimmedEmail)
                setPassword("")
                setUsername("")
                setIsLoggedIn(true)
                // Redirect to dashboard
                setTimeout(() => {
                    if (!redirectToDashboard()) {
                        navigate("/dashboard")
                    }
                }, 500)
            } else {
                setErrorMessage(result?.errorMessage || "Unable to sign up. Please try again.")
            }
        } catch (error) {
            console.error("Sign up failed", error)
            setErrorMessage(error.message || "Something went wrong during sign up.")
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
                            Join Bundai
                        </h1>
                        <p className="text-sm text-slate-600 md:text-base">
                            Create your account and start your journey to mastering Japanese.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-700">
                                Username
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-500" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="Choose a username"
                                    className="w-full rounded-xl bg-white border border-slate-300 py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400"
                                    autoComplete="username"
                                    disabled={loading || isLoggedIn}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    className="w-full rounded-xl bg-white border border-slate-300 py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400"
                                    autoComplete="new-password"
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
                                You are logged in! Redirecting to dashboard...
                            </div>
                        ) : null}

                        <Button type="submit" variant="primary" className="w-full" disabled={loading || isLoggedIn}>
                            {loading ? "Creating Account..." : isLoggedIn ? "Success!" : "Sign Up"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-violet-700 hover:text-violet-800">
                            Log in
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </div>
    )
}
