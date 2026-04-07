import { useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { useNavigate } from "react-router-dom"
import { Button } from "./Button"
import COLORS from "../theme/colors"
import meQuery from "../graphql/queries/me.query"
import { getAuthData } from "../lib/auth"
import {
  getCheckoutPriceId,
  getPaddleConfig,
  getPaddleInstance,
  isPaddleConfigured
} from "../lib/paddle"
import posthog from "../lib/posthog"

const PRODUCT_SURFACES = [
  {
    title: "YouTube extension",
    description: "Dual subtitles, word capture, and in-video learning.",
    imageSrc: "/dual-subtitle-loader-capture.png",
    imageAlt: "Bundai YouTube extension screenshot",
    fit: "contain"
  },
  {
    title: "Mobile app",
    description: "Study saved words, anime vocabulary, and kanji on your phone.",
    imageSrc: "/page-full.png",
    imageAlt: "Bundai mobile app feature preview",
    fit: "cover"
  },
  {
    title: "Desktop and web",
    description: "Pick up your reviews and progress from a larger screen.",
    imageSrc: "/desktop.png",
    imageAlt: "Bundai desktop and web study screenshot",
    fit: "contain"
  }
]

function PricingCard({
  title,
  originalPrice,
  price,
  cadence,
  savings,
  featured = false,
  ctaLabel,
  onClick,
  disabled = false,
  loading = false
}) {
  return (
    <div
      className="rounded-[2rem] p-7 sm:p-8 shadow-lg relative flex flex-col"
      style={{
        backgroundColor: COLORS.surface,
        border: featured
          ? `2px solid ${COLORS.brandPrimary}`
          : `1px solid ${COLORS.outline}`,
        boxShadow: featured
          ? "0 30px 70px rgba(127, 83, 245, 0.18)"
          : "0 20px 50px rgba(31, 26, 61, 0.08)"
      }}>
      {featured ? (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: COLORS.brandPrimary }}>
          Best value
        </div>
      ) : null}

      <div className="mb-8 text-center flex-1">
        <h3
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: COLORS.textPrimary }}>
          {title}
        </h3>
        <div
          className="mt-5 text-2xl sm:text-3xl font-black"
          style={{
            color: COLORS.textMuted,
            textDecoration: originalPrice ? "line-through" : "none",
            textDecorationThickness: "3px",
            visibility: originalPrice ? "visible" : "hidden"
          }}>
          {originalPrice || "$110"}
        </div>
        <div
          className="mt-1 text-5xl sm:text-6xl font-black tracking-tight"
          style={{ color: COLORS.textPrimary }}>
          {price}
        </div>
        <div
          className="mt-2 text-base sm:text-lg"
          style={{ color: COLORS.textMuted }}>
          {cadence}
        </div>
        <div
          className="mt-4 text-base sm:text-lg font-semibold"
          style={{ color: COLORS.accentSuccess }}>
          {savings}
        </div>
      </div>

      <Button
        variant={featured ? "primary" : "outline"}
        className="w-full"
        onClick={onClick}
        disabled={disabled || loading}>
        {loading ? "Opening checkout..." : ctaLabel}
      </Button>
    </div>
  )
}

export default function PricingPlans({ id, standalone = false }) {
  const navigate = useNavigate()
  const authData = useMemo(() => getAuthData(), [])
  const [activePlan, setActivePlan] = useState(null)
  const [checkoutError, setCheckoutError] = useState("")
  const [checkoutSuccess, setCheckoutSuccess] = useState("")
  const paddleConfigured = isPaddleConfigured()
  const paddleConfig = getPaddleConfig()

  const { data, loading: meLoading, refetch } = useQuery(meQuery, {
    variables: { _id: authData?.userId || "" },
    skip: !authData?.userId,
    fetchPolicy: "network-only"
  })

  const me = data?.me
  const hasPaid =
    me?.hasPaid === true || String(me?.hasPaid).toLowerCase() === "true"
  const isLoggedIn = Boolean(authData?.token && authData?.userId)

  const handlePlanClick = async (plan) => {
    setCheckoutError("")
    setCheckoutSuccess("")

    if (!isLoggedIn) {
      navigate("/signup")
      return
    }

    if (hasPaid) {
      navigate("/dashboard/settings")
      return
    }

    if (!paddleConfigured) {
      setCheckoutError(
        "Paddle sandbox is not configured yet. Add the Vite Paddle env vars first."
      )
      return
    }

    const priceId = getCheckoutPriceId(plan)
    if (!priceId) {
      setCheckoutError("Missing Paddle price ID for this plan.")
      return
    }

    try {
      setActivePlan(plan)
      const paddle = await getPaddleInstance(async (event) => {
        if (event?.name === "checkout.completed") {
          setCheckoutSuccess("Checkout completed. Refreshing your account…")
          try {
            await refetch()
          } catch {
            // Ignore refetch errors and still move user forward.
          }
          navigate("/dashboard")
        }
      })

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en"
        },
        customer: me?.email
          ? {
              email: me.email
            }
          : undefined
      })
    } catch (error) {
      console.error("Failed to open Paddle checkout", error)
      posthog.captureException(error, authData?.userId)
      setCheckoutError(
        error?.message || "Unable to start Paddle checkout."
      )
    } finally {
      setActivePlan(null)
    }
  }

  const monthlyLabel = hasPaid ? "Manage Subscription" : "Start Monthly"
  const yearlyLabel = hasPaid ? "Manage Subscription" : "Start Yearly"

  return (
    <section
      id={id}
      className={`relative px-4 sm:px-6 ${standalone ? "py-20 sm:py-24" : "py-16 sm:py-20"}`}
      style={{
        background: standalone
          ? `radial-gradient(circle at top, ${COLORS.surfaceMuted} 0%, ${COLORS.background} 55%, #efe8ff 100%)`
          : `linear-gradient(180deg, ${COLORS.surfaceMuted} 0%, ${COLORS.background} 100%)`
      }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <div
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold mb-6"
            style={{
              backgroundColor: COLORS.warningSoft,
              border: `1px solid ${COLORS.accentWarning}`,
              color: COLORS.textPrimary
            }}>
            Save 72% with yearly
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: COLORS.textPrimary }}>
            Bundai pricing
          </h2>
          <p
            className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: COLORS.textSecondary }}>
            Pick monthly or yearly. Same access either way.
          </p>
          {paddleConfig.environment === "sandbox" ? (
            <p
              className="mt-3 text-sm font-semibold"
              style={{ color: COLORS.brandPrimary }}>
              Sandbox mode is enabled for checkout testing.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="Monthly"
            price="$8.99"
            cadence="per month"
            savings="Cancel anytime"
            ctaLabel={monthlyLabel}
            onClick={() => handlePlanClick("monthly")}
            disabled={meLoading}
            loading={activePlan === "monthly"}
          />
          <PricingCard
            title="Yearly"
            originalPrice="$110"
            price="$29.99"
            cadence="per year"
            savings="Save $80 per year"
            featured
            ctaLabel={yearlyLabel}
            onClick={() => handlePlanClick("yearly")}
            disabled={meLoading}
            loading={activePlan === "yearly"}
          />
        </div>

        {checkoutError ? (
          <div
            className="max-w-3xl mx-auto mt-6 rounded-2xl px-4 py-3 text-center"
            style={{
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c"
            }}>
            {checkoutError}
          </div>
        ) : null}

        {checkoutSuccess ? (
          <div
            className="max-w-3xl mx-auto mt-6 rounded-2xl px-4 py-3 text-center"
            style={{
              backgroundColor: COLORS.successSoft,
              border: `1px solid ${COLORS.accentSuccess}`,
              color: COLORS.accentSuccess
            }}>
            {checkoutSuccess}
          </div>
        ) : null}

        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-10">
            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: COLORS.textPrimary }}>
              What you get
            </h3>
            <p
              className="mt-3 text-base sm:text-lg"
              style={{ color: COLORS.textSecondary }}>
              One subscription across the whole Bundai stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto place-items-center">
            {PRODUCT_SURFACES.map((surface) => (
              <div
                key={surface.title}
                className="rounded-[1.75rem] p-4 sm:p-5 w-full max-w-sm"
                style={{
                  backgroundColor: COLORS.surface,
                  border: `1px solid ${COLORS.outline}`,
                  boxShadow: "0 18px 45px rgba(31, 26, 61, 0.08)"
                }}>
                <div
                  className="rounded-[1.25rem] p-3"
                  style={{
                    backgroundColor: COLORS.surfaceMuted,
                    border: `1px solid ${COLORS.outline}`
                  }}>
                  <img
                    src={surface.imageSrc}
                    alt={surface.imageAlt}
                    className={`w-full aspect-[4/3] rounded-2xl ${
                      surface.fit === "contain"
                        ? "object-contain bg-white"
                        : "object-cover object-top"
                    }`}
                    loading="lazy"
                  />
                </div>
                <div className="pt-4 text-center">
                  <h4
                    className="text-xl font-bold"
                    style={{ color: COLORS.textPrimary }}>
                    {surface.title}
                  </h4>
                  <p
                    className="mt-2 text-sm sm:text-base leading-relaxed"
                    style={{ color: COLORS.textSecondary }}>
                    {surface.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
