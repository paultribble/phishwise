/**
 * Ambient floating orbs + dot-grid overlay used throughout the landing page.
 * Positioned absolute, pointer-events-none — drop inside any relative section.
 */
export function AmbientBackground({ variant = "default" }: { variant?: "default" | "violet" | "subtle" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100" />

      {/* Orb 1 — large blue blob top-left */}
      <div
        className="anim-float-a absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.12) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 2 — medium navy bottom-right */}
      <div
        className="anim-float-b absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(30,58,138,0.35) 0%, rgba(30,58,138,0.12) 50%, transparent 70%)",
          filter: "blur(50px)",
          animationDelay: "3s",
        }}
      />

      {/* Orb 3 — small blue accent center-right */}
      {variant !== "subtle" && (
        <div
          className="anim-float-c absolute top-1/2 right-1/4 w-[240px] h-[240px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(59,130,246,0.25) 0%, transparent 70%)",
            filter: "blur(30px)",
            animationDelay: "1.5s",
          }}
        />
      )}

      {/* Scanline sweep — subtle horizontal line */}
      <div
        className="anim-scanline absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.3) 30%, rgba(59,130,246,0.45) 50%, rgba(37,99,235,0.3) 70%, transparent 100%)",
          animationDuration: "12s",
        }}
      />
    </div>
  );
}

/** Minimal line-grid variant for dashboard-like sections */
export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 line-grid" />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 60%, rgba(15,15,26,0.95) 100%)",
        }}
      />
    </div>
  );
}
