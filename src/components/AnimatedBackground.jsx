export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Floating Japanese characters */}
      <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ color: 'rgba(127, 83, 245, 0.05)' }}>漢</div>
      <div className="absolute top-40 right-20 text-8xl animate-pulse" style={{ color: 'rgba(127, 83, 245, 0.05)' }}>字</div>
      <div className="absolute bottom-40 left-20 text-5xl animate-bounce delay-500" style={{ color: 'rgba(127, 83, 245, 0.05)' }}>本</div>
      <div className="absolute bottom-60 right-10 text-7xl animate-pulse delay-1000" style={{ color: 'rgba(127, 83, 245, 0.05)' }}>語</div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'linear-gradient(to right, rgba(127, 83, 245, 0.15), rgba(214, 187, 251, 0.15))' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000" style={{ background: 'linear-gradient(to right, rgba(255, 176, 32, 0.1), rgba(238, 93, 103, 0.1))' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-pulse delay-500" style={{ background: 'linear-gradient(to right, rgba(67, 181, 129, 0.15), rgba(127, 83, 245, 0.15))' }}></div>
    </div>
  );
};