import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EventCard({ event, delay = 0 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e) => {
    e.stopPropagation();
    setRegistered(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -6 }}
        className="group rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl shadow-black/50 flex flex-col justify-between"
      >
        {/* Event Banner */}
        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
          <img
            src={event.image || event.banner}
            alt={event.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-950/80 border border-blue-500/30 text-blue-400 backdrop-blur-md">
              {event.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold backdrop-blur-md border ${
              event.status?.includes('Upcoming') || event.status?.includes('Featured')
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
            }`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {event.title}
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{event.venue}</span>
              </div>
            </div>

            <p className="mt-3 text-zinc-400 text-sm leading-relaxed line-clamp-2">
              {event.shortDescription || event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRegister}
              disabled={registered}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                registered
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20'
              }`}
            >
              {registered ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Registered!</span>
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
                <span>{event.category}</span>
                <span>•</span>
                <span>{event.mode || 'In-Person'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {event.title}
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-6">
                <div>
                  <span className="text-zinc-500 block">DATE</span>
                  <span className="text-zinc-200 font-semibold">{event.date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">TIME</span>
                  <span className="text-zinc-200 font-semibold">{event.time || "10:00 AM - 05:00 PM"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">VENUE</span>
                  <span className="text-zinc-200 font-semibold">{event.venue}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">STATUS</span>
                  <span className="text-emerald-400 font-semibold">{event.status}</span>
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {event.description || event.shortDescription}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleRegister}
                  disabled={registered}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20"
                >
                  {registered ? "Slot Confirmed" : "Confirm Registration"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
