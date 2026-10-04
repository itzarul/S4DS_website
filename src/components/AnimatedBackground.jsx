import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark Base Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15" />

      {/* Ambient Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-40 left-1/3 w-[35rem] h-[35rem] bg-blue-700/10 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Radial vignette mask for depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#09090B]/60 to-[#09090B]" />
    </div>
  );
}
