import COLORS from "../theme/colors"

export const GlassCard = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`backdrop-blur-lg rounded-2xl shadow-xl ${
        hover ? "transition-all duration-300 hover:scale-105" : ""
      } ${className}`}
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.divider}`,
      }}
    >
      {children}
    </div>
  )
}