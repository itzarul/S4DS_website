import React from 'react';

export default function S4DSLogo({ className = "w-14 h-14", showText = true, size = "md" }) {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      <div className={`relative shrink-0 ${className} flex items-center justify-center`}>
        {/* Real Logo from public folder */}
        <img
          src="/logo.png"
          alt="S4DS TCET Logo"
          className="relative z-10 w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-wider text-white text-base sm:text-lg">
              S4DS
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
              TCET
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase mt-0.5">
            Society for Data Science
          </span>
        </div>
      )}
    </div>
  );
}
