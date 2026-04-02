import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import PricingPlans from "../components/PricingPlans"
import { Button } from "../components/Button"
import COLORS from "../theme/colors"
import { hasAuthToken } from "../lib/auth"

export default function PricingPage() {
  const isLoggedIn = hasAuthToken()

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary }}>
      <header
        className="sticky top-0 z-20 backdrop-blur-lg"
        style={{
          backgroundColor: `${COLORS.surface}E6`,
          borderBottom: `1px solid ${COLORS.divider}`
        }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)`
              }}>
              <span className="text-white font-bold text-lg">文</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
              Bundai
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="secondary" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            {isLoggedIn ? null : (
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <PricingPlans standalone />
    </div>
  )
}
