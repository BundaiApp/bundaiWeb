import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import { GlassCard } from "../components/GlassCard"
import { Button } from "../components/Button"
import logInMutation from "../graphql/mutations/logIn.mutation"
import {
  hasAuthToken,
  setAuthData,
  redirectToDashboard,
  shouldSkipAuthRedirects
} from "../lib/auth"
import posthog from "../lib/posthog"
import COLORS from "../theme/colors"

export default function Login() {
  const skipAuthRedirects = shouldSkipAuthRedirects()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [executeLogin, { loading }] = useMutation(logInMutation)

  useEffect(() => {
    const loggedIn = hasAuthToken()
    setIsLoggedIn(loggedIn)
    if (loggedIn && !skipAuthRedirects) {
      redirectToDashboard()
    }
  }, [skipAuthRedirects])

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
        setAuthData(result)
        setEmail(trimmedEmail)
        setPassword("")
        setIsLoggedIn(true)
        posthog.identify({ distinctId: result.user._id, properties: { email: trimmedEmail, name: result.user.name || trimmedEmail.split('@')[0] } })
        posthog.capture({ distinctId: result.user._id, event: 'user logged in', properties: { login_method: 'email' } })
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
      posthog.captureException(error)
      setErrorMessage(error.message || "Something went wrong during login.")
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
              Welcome Back
            </h1>
            <p className="text-sm md:text-base" style={{ color: COLORS.textSecondary }}>
              Log in with your credentials to get back to your personalized Bundai lessons.
            </p>
          </div>

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
                  disabled={loading || isLoggedIn}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: COLORS.brandPrimary }} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.outline,
                    color: COLORS.textPrimary,
                    '--tw-ring-color': COLORS.brandPrimary + '60'
                  }}
                  autoComplete="current-password"
                  disabled={loading || isLoggedIn}
                />
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: COLORS.accentDanger + '40', backgroundColor: COLORS.accentDanger + '10', color: COLORS.accentDanger }}>
                {errorMessage}
              </div>
            ) : null}

            {isLoggedIn ? (
              <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: COLORS.accentSuccess + '40', backgroundColor: COLORS.accentSuccess + '10', color: COLORS.accentSuccess }}>
                You are logged in! Feel free to explore Bundai.
              </div>
            ) : null}

            <Button type="submit" variant="primary" className="w-full" disabled={loading || isLoggedIn}>
              {loading ? "Logging In..." : isLoggedIn ? "Logged In" : "Log In"}
            </Button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm transition-colors hover:underline"
                style={{ color: COLORS.brandPrimary }}
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="space-y-3">
            <Button
              variant="accent"
              className="w-full"
              onClick={() => navigate("/signup")}
              disabled={loading || isLoggedIn}
            >
              Sign Up
            </Button>
            <p className="text-center text-sm" style={{ color: COLORS.textSecondary }}>
              Don't have an account?{" "}
              <Link to="/" style={{ color: COLORS.brandPrimary }} className="hover:underline">
                Explore Bundai
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
