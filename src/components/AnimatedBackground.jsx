export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--app-grid) 1px, transparent 1px), linear-gradient(90deg, var(--app-grid) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      {/* Floating Japanese characters */}
      <div className="absolute top-20 left-10 text-6xl animate-float-slow" style={{ color: "rgba(127, 83, 245, 0.08)" }}>漢</div>
      <div className="absolute top-40 right-16 text-7xl animate-float-slow" style={{ color: "rgba(86, 50, 212, 0.08)" }}>字</div>
      <div className="absolute bottom-40 left-16 text-5xl animate-float-slow" style={{ color: "rgba(183, 156, 255, 0.12)" }}>本</div>
      <div className="absolute bottom-60 right-10 text-6xl animate-float-slow" style={{ color: "rgba(238, 93, 103, 0.08)" }}>語</div>

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(127, 83, 245, 0.18), transparent 60%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[22rem] h-[22rem] rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(255, 176, 32, 0.18), transparent 65%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(183, 156, 255, 0.16), transparent 60%)" }}
      />
    </div>
  );
};
