export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div
        className={`border-blue-500 border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`}
      />
      {text && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  )
}
