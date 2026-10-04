import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, Github, Youtube, ArrowUpRight } from 'lucide-react';
import S4DSLogo from './S4DSLogo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    // Subtle curtain-flip reveal for the footer content
    gsap.fromTo(
      ".footer-flip-content",
      { rotateX: -25, opacity: 0, yPercent: 15 },
      {
        rotateX: 0,
        opacity: 1,
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%", // Start when footer top enters the screen
          end: "bottom bottom", // Finish when footer is fully visible
          scrub: true,
        }
      }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative z-10 bg-zinc-950 border-t border-zinc-800/80 pt-16 pb-12 overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Background glow and ambient particles behind footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Subtle ambient drifting particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute top-[20%] left-[15%] animate-pulse" style={{ animationDuration: '3s' }}></div>
         <div className="w-1 h-1 bg-cyan-400 rounded-full absolute top-[60%] left-[75%] animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
         <div className="w-2 h-2 bg-blue-600 rounded-full absolute bottom-[30%] left-[25%] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
         <div className="w-1 h-1 bg-blue-300 rounded-full absolute top-[70%] left-[50%] animate-pulse" style={{ animationDuration: '2.5s' }}></div>
      </div>

      <div className="footer-flip-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ transformOrigin: 'bottom center' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <S4DSLogo className="w-10 h-10" />
            </Link>
            
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Society for Data Science (S4DS) — TCET Chapter is an autonomous student organization dedicated to artificial intelligence, machine learning, data engineering, and interdisciplinary research.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                NAAC A+ Accredited
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Autonomous College
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-blue-400 transition-colors">
                  Leadership Board
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-blue-400 transition-colors">
                  Analytrix & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-blue-400 transition-colors">
                  DataSphere Magazine
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-blue-400 transition-colors">
                  Event Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Department
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Dept. of Data Science, A-Block 4th Floor, TCET, Kandivali East, Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:s4ds@tcetmumbai.in" className="hover:text-white transition-colors">
                  s4ds@tcetmumbai.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Official Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Social Presence
            </h4>
            <p className="text-xs text-zinc-400">
              Follow our official handles for live event announcements and workshop registrations.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-400 hover:border-pink-500/40 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <a
              href="https://www.tcetmumbai.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors pt-2"
            >
              <span>Official TCET Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} S4DS TCET Chapter. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed & Engineered for</span>
            <span className="text-zinc-300 font-semibold">TCET Mumbai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
