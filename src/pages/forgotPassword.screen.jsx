"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import forgetPasswordMutation from "../graphql/mutations/forgetPassword.mutation"

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [executeForgetPassword, { loading }] = useMutation(forgetPasswordMutation)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        if (!email) {
            setErrorMessage("Please enter your email address.")
            return
        }

        try {
            const trimmedEmail = email.trim()
            const { data: resetData } = await executeForgetPassword({
                variables: { email: trimmedEmail },
            })

            const result = resetData?.forgetPassword
            if (result?.errorMessage) {
                setErrorMessage(result.errorMessage)
            } else {
                setSuccessMessage(
                    "Password reset instructions have been sent to your email. Please check your inbox."
                )
                setEmail("")
            }
        } catch (error) {
            console.error("Password reset failed", error)
            setErrorMessage(error.message || "Something went wrong. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 flex min-h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-[-10%] h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/30 blur-3xl" />
                <div className="absolute right-[-20%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-tl from-emerald-400/30 via-cyan-400/20 to-transparent blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/30 to-sky-400/20 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-16">
                <GlassCard className="space-y-8 p-8" hover={false}>
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
                        <h1 className="text-3xl font-bold leading-tight md:text-4xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Forgot Password?
                        </h1>
                        <p className="text-sm text-white/70 md:text-base">
                            No worries! Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {successMessage ? (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-emerald-200">
                                    {successMessage}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => navigate("/login")}
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => {
                                        setSuccessMessage("")
                                        setErrorMessage("")
                                    }}
                                >
                                    Send Another Email
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                                        autoComplete="email"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {errorMessage ? (
                                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {errorMessage}
                                </div>
                            ) : null}

                            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Instructions"}
                            </Button>
                        </form>
                    )}

                    <p className="text-center text-sm text-white/60">
                        Remember your password?{" "}
                        <Link to="/login" className="text-emerald-300 hover:text-emerald-200">
                            Back to Login
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </div>
    )
}


