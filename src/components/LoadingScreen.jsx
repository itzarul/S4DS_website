import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import S4DSLogo from './S4DSLogo';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 20;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-4"
        >
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <S4DSLogo className="w-16 h-16" showText={false} />
          </motion.div>

          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-extrabold text-white tracking-widest font-mono"
          >
            S4DS <span className="text-cyan-400">TCET</span>
          </motion.h1>

          <p className="text-xs font-mono text-zinc-400 mt-2">
            INITIALIZING DATA NODE & CLUSTER
          </p>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-zinc-900 rounded-full mt-6 overflow-hidden border border-zinc-800 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          <span className="text-[10px] font-mono text-zinc-500 mt-2">
            {progress}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
