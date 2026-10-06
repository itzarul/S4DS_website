import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import S4DSLogo from './S4DSLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'Publications', path: '/publications' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-500 top-0 left-0 w-full sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%] max-w-7xl ${
          isScrolled
            ? 'bg-[#ffffff]/[0.02] backdrop-blur-[50px] border-b sm:border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] sm:rounded-full py-3 px-4 sm:px-8'
            : 'bg-transparent py-5 px-4 sm:px-8'
        }`}
      >
        <div className="w-full mx-auto flex items-center justify-between">
          {/* S4DS Brand Logo */}
          <Link to="/" className="outline-none" onClick={() => setMobileMenuOpen(false)}>
            <S4DSLogo className="w-14 h-14" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2 p-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg shadow-blue-600/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/contact"
              className="relative group px-6 py-2.5 rounded-full font-bold text-xs text-white bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse relative z-10" />
              <span className="relative z-10 tracking-widest uppercase">Join S4DS</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-black/80 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6"
          >
            <div className="space-y-3">
              <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase mb-4">
                TCET S4DS NAVIGATION
              </div>

              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl border text-base font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-5 h-5 opacity-60" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-center flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Apply for Membership</span>
              </Link>
              <div className="text-center font-mono text-[11px] text-zinc-500">
                Thakur College of Engineering & Technology, Mumbai
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
