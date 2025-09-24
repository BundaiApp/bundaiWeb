export const Button = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95";
  
  const sizeClasses = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500",
  
    secondary:
      "bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-100 font-semibold border border-blue-500/20 backdrop-blur-md hover:from-blue-800/50 hover:to-purple-800/50 hover:border-blue-400/30 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60",
  
    accent:
      "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500",
  
    success:
      "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-emerald-500",
  
    outline:
      "border-2 border-blue-500/50 bg-white/5 text-blue-400 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-300",
  };
  

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
