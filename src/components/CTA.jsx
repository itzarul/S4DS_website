import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Sparkles, ArrowRight, Instagram, Linkedin, Mail, MessageSquare } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/80 p-8 sm:p-14 overflow-hidden shadow-2xl shadow-black/80 text-center flex flex-col items-center"
        >
          {/* Radiant Glow Mesh */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-blue-600/30 via-cyan-500/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BECOME A PART OF TCET'S PREMIER TECH CLUB</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl">
            Ready to shape the future of <span className="text-gradient-primary">AI & Data Science?</span>
          </h2>

          <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Join 500+ student developers, data engineers, and researchers at TCET. Elevate your portfolio through flagship hackathons, PyTorch bootcamps, and research publications.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Contact S4DS</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 hover:text-white transition-all hover:scale-105"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 hover:text-white transition-all hover:scale-105"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
