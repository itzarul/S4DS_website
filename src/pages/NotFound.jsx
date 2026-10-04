import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] pt-36 pb-20 flex items-center justify-center relative z-10 px-4">
      <div className="text-center max-w-xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ERROR 404: VECTOR NODE NOT FOUND</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 font-mono tracking-tighter"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-300 font-semibold"
        >
          The requested data dimensions could not be reduced or located in the S4DS cluster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-400 text-left space-y-1 shadow-xl"
        >
          <div className="flex items-center gap-2 text-red-400 border-b border-zinc-900 pb-2 mb-2">
            <Terminal className="w-4 h-4" />
            <span>Trace Log: Exception in thread "http-router"</span>
          </div>
          <p className="text-zinc-500">&gt; Target URI route not registered in react-router-dom</p>
          <p className="text-zinc-500">&gt; Status: 404_NOT_FOUND</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:scale-105 transition-transform shadow-xl shadow-blue-500/25"
          >
            <Home className="w-4 h-4" />
            <span>Return to S4DS HQ Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
