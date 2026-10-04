import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Sparkles, Calendar, Users, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';
import Stats from './Stats';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Glow Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-blue-500/30 backdrop-blur-md shadow-lg shadow-blue-500/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-zinc-200">
            Thakur College of Engineering & Technology (TCET), Mumbai
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
        >
          <span className="block">S4DS — Society For</span>
          <span className="text-gradient-primary">Data Science</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Empowering Future Data Scientists, AI Engineers and Innovators through practical workshops, flagship hackathons, and cutting-edge research.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <NavLink
            to="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <Calendar className="w-4 h-4" />
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NavLink>

          <NavLink
            to="/team"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Meet the Team</span>
          </NavLink>
        </motion.div>

        {/* Floating Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-mono text-zinc-400"
        >
          <div className="flex items-center gap-2 bg-zinc-900/40 px-3 py-1.5 rounded-full border border-zinc-800/60">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>GenAI & PyTorch Workshops</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/40 px-3 py-1.5 rounded-full border border-zinc-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ANALYTRIX National Hackathon</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/40 px-3 py-1.5 rounded-full border border-zinc-800/60">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>DataSphere Research Publication</span>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-16">
          <Stats />
        </div>
      </div>
    </section>
  );
}
