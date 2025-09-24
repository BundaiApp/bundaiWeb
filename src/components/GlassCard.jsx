// Glass card component
export const GlassCard = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl ${
        hover ? "hover:bg-white/20 transition-all duration-300 hover:scale-105" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}