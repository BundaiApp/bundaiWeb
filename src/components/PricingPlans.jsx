import { Button } from "./Button"
import COLORS from "../theme/colors"

const APP_STORE_URL = 'https://apps.apple.com/gb/app/bundai/id6751961361'

const PRODUCT_SURFACES = [
  {
    title: "Mobile app",
    description: "Study saved words, anime vocabulary, kanji, and pronunciation on your phone.",
    imageSrc: "/page-full.png",
    imageAlt: "Bundai mobile app feature preview",
    fit: "cover"
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
  onClick
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
        onClick={onClick}>
        {ctaLabel}
      </Button>
    </div>
  )
}

export default function PricingPlans({ id, standalone = false }) {
  const goToAppStore = () => {
    window.open(APP_STORE_URL, "_blank", "noopener,noreferrer")
  }

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
            Pick monthly or yearly, right inside the iOS app. Same access either way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="Monthly"
            price="$8.99"
            cadence="per month"
            savings="Cancel anytime"
            ctaLabel="Get the App"
            onClick={goToAppStore}
          />
          <PricingCard
            title="Yearly"
            originalPrice="$110"
            price="$29.99"
            cadence="per year"
            savings="Save $80 per year"
            featured
            ctaLabel="Get the App"
            onClick={goToAppStore}
          />
        </div>

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
              Everything Bundai offers, on your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto place-items-center">
            {PRODUCT_SURFACES.map((surface) => (
              <div
                key={surface.title}
                className="rounded-[1.75rem] p-4 sm:p-5 w-full max-w-sm md:col-span-3"
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
                    className="w-full aspect-[4/3] rounded-2xl object-cover object-top"
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
