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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 py-3 shadow-2xl shadow-blue-500/5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* S4DS Brand Logo */}
          <Link to="/" className="outline-none" onClick={() => setMobileMenuOpen(false)}>
            <S4DSLogo className="w-9 h-9" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80 backdrop-blur-lg">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
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
              className="relative group px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 transition-transform hover:scale-105 shadow-xl shadow-blue-600/25 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>Join S4DS</span>
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
