import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import forgetPasswordMutation from "../graphql/mutations/forgetPassword.mutation"
import COLORS from "../theme/colors"

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
        <div className="fixed inset-0 flex min-h-screen w-screen items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.background }}>
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-[-10%] h-80 w-80 rounded-full blur-3xl" style={{ background: `linear-gradient(135deg, ${COLORS.brandPrimary}60, ${COLORS.brandSecondary}40)` }} />
                <div className="absolute right-[-20%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: `linear-gradient(135deg, ${COLORS.accentSuccess}40, ${COLORS.brandPrimaryLight}20, transparent)` }} />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: `linear-gradient(135deg, ${COLORS.brandPrimaryLight}50, ${COLORS.brandPrimary}30)` }} />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-16">
                <GlassCard className="space-y-8 p-8" style={{ backgroundColor: COLORS.surface }} hover={false}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.accentWarning}, ${COLORS.accentDanger})` }}>
                                <span className="text-base font-bold" style={{ color: COLORS.surface }}>文</span>
                            </div>
                            <div>
                                <div className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>Bundai</div>
                                <div className="text-xs uppercase tracking-wide" style={{ color: COLORS.textMuted }}>Immersive Japanese Learning</div>
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
                        <h1 className="text-3xl font-bold leading-tight md:text-4xl" style={{ color: COLORS.textPrimary }}>
                            Forgot Password?
                        </h1>
                        <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
                            No worries! Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {successMessage ? (
                        <div className="space-y-6">
                            <div className="rounded-xl border px-4 py-4 flex items-start gap-3" style={{ borderColor: COLORS.accentSuccess + '40', backgroundColor: COLORS.accentSuccess + '10' }}>
                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: COLORS.accentSuccess }} />
                                <div className="text-sm" style={{ color: COLORS.accentSuccess }}>
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
                                <label htmlFor="email" className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: COLORS.brandPrimary }} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2"
                                        style={{
                                            backgroundColor: COLORS.surface,
                                            borderColor: COLORS.outline,
                                            color: COLORS.textPrimary,
                                            '--tw-ring-color': COLORS.brandPrimary + '60'
                                        }}
                                        autoComplete="email"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {errorMessage ? (
                                <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: COLORS.accentDanger + '40', backgroundColor: COLORS.accentDanger + '10', color: COLORS.accentDanger }}>
                                    {errorMessage}
                                </div>
                            ) : null}

                            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Instructions"}
                            </Button>
                        </form>
                    )}

                    <p className="text-center text-sm" style={{ color: COLORS.textSecondary }}>
                        Remember your password?{" "}
                        <Link to="/login" className="hover:underline" style={{ color: COLORS.accentSuccess }}>
                            Back to Login
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </div>
    )
}
