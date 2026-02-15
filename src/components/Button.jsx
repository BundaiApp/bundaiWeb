export const Button = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  className = "",
  style = {},
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0";
  
  const sizeClasses = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl",
  };

  const variantClasses = {
    primary: "text-white shadow-lg hover:shadow-xl",
    secondary:
      "text-[#1f1a3d] border border-[#d7d7e5] backdrop-blur-md shadow-md hover:shadow-lg",
    accent: "text-white shadow-lg hover:shadow-xl",
    success: "text-white shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-[#7f53f5]/50 text-[#7f53f5] backdrop-blur-sm hover:border-[#7f53f5] hover:bg-[#7f53f5]/10 shadow-md hover:shadow-lg",
  };
  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, #7f53f5 0%, #5632d4 100%)",
      boxShadow: "0 14px 30px rgba(127, 83, 245, 0.25)",
    },
    secondary: {
      background: "rgba(255, 255, 255, 0.7)",
    },
    accent: {
      background: "linear-gradient(135deg, #ffb020 0%, #ee5d67 100%)",
      boxShadow: "0 14px 30px rgba(238, 93, 103, 0.25)",
    },
    success: {
      background: "linear-gradient(135deg, #43b581 0%, #7f53f5 100%)",
      boxShadow: "0 14px 30px rgba(67, 181, 129, 0.25)",
    },
    outline: {
      background: "transparent",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
