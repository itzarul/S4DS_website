import React from 'react';

export default function S4DSLogo({ className = "w-10 h-10", showText = true, size = "md" }) {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      <div className={`relative shrink-0 ${className} flex items-center justify-center`}>
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* SVG Logo mark */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-md"
        >
          {/* Outer Hexagon / Shield */}
          <path
            d="M50 5 L88 27 V73 L50 95 L12 73 V27 Z"
            fill="#090D16"
            stroke="url(#logo-grad-1)"
            strokeWidth="4"
          />
          
          {/* Inner Data Node Network */}
          <path
            d="M30 40 L50 25 L70 40 L50 58 Z"
            fill="url(#logo-grad-2)"
            fillOpacity="0.8"
          />
          <path
            d="M50 58 L70 75 L30 75 Z"
            fill="url(#logo-grad-1)"
            fillOpacity="0.6"
          />
          
          {/* Connected Nodes */}
          <circle cx="50" cy="25" r="5" fill="#3585f6" />
          <circle cx="30" cy="40" r="5" fill="#3585f6" />
          <circle cx="70" cy="40" r="5" fill="#3585f6" />
          <circle cx="50" cy="58" r="6" fill="#012f7c" />
          <circle cx="30" cy="75" r="4" fill="#3585f6" />
          <circle cx="70" cy="75" r="4" fill="#3585f6" />
          
          {/* Connecting Neural Network Lines */}
          <line x1="50" y1="25" x2="30" y2="40" stroke="#3585f6" strokeWidth="2.5" strokeDasharray="2 2" />
          <line x1="50" y1="25" x2="70" y2="40" stroke="#3585f6" strokeWidth="2.5" strokeDasharray="2 2" />
          <line x1="30" y1="40" x2="50" y2="58" stroke="#012f7c" strokeWidth="2.5" />
          <line x1="70" y1="40" x2="50" y2="58" stroke="#012f7c" strokeWidth="2.5" />
          <line x1="50" y1="58" x2="30" y2="75" stroke="#3585f6" strokeWidth="2" />
          <line x1="50" y1="58" x2="70" y2="75" stroke="#3585f6" strokeWidth="2" />

          {/* S4DS S-Curve Center */}
          <path
            d="M44 38 C 44 32, 56 32, 56 38 C 56 46, 44 46, 44 54 C 44 60, 56 60, 56 54"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="logo-grad-1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3585f6" />
              <stop offset="1" stopColor="#012f7c" />
            </linearGradient>
            <linearGradient id="logo-grad-2" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#012f7c" />
              <stop offset="1" stopColor="#3585f6" />
            </linearGradient>
          </defs>
        </svg>
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
