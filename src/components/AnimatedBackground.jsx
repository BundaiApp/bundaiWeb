export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Floating Japanese characters */}
      <div className="absolute top-20 left-10 text-6xl text-white/5 animate-bounce">漢</div>
      <div className="absolute top-40 right-20 text-8xl text-white/5 animate-pulse">字</div>
      <div className="absolute bottom-40 left-20 text-5xl text-white/5 animate-bounce delay-500">本</div>
      <div className="absolute bottom-60 right-10 text-7xl text-white/5 animate-pulse delay-1000">語</div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
  );
};