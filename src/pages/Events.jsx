import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { featuredEvent, eventsList } from '../data/events';
import EventCard from '../components/EventCard';
import Timeline from '../components/Timeline';
import { Trophy, Calendar, Sparkles, Star, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');
  const [registered, setRegistered] = useState(false);

  const handleAnalytrixRegister = () => {
    setRegistered(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const filteredEvents = activeTab === 'all'
    ? eventsList
    : eventsList.filter(e => e.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="pt-28 pb-20 relative z-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>HACKATHONS, WORKSHOPS & EXPOS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
        >
          Events & <span className="text-gradient-primary">Hackathons</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Discover flagship national hackathons, high-impact machine learning bootcamps, and technical ideathons hosted at TCET Mumbai.
        </motion.p>
      </section>

      {/* FEATURED EVENT: ANALYTRIX 2025-26 Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center justify-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>NATIONAL FLAGSHIP EVENT SPOTLIGHT</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-zinc-900/80 border border-blue-500/40 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-blue-500/10 p-6 sm:p-10"
        >
          {/* Banner Hero */}
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 group">
            <img
              src={featuredEvent.banner}
              alt={featuredEvent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                🏆 Prize Pool: {featuredEvent.prizePool}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-md">
                {featuredEvent.mode}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {featuredEvent.title}
              </h2>
              <p className="text-blue-300 font-mono text-sm sm:text-base mt-1">
                {featuredEvent.tagline}
              </p>
            </div>
          </div>

          {/* Grid info & details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>About ANALYTRIX</span>
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {featuredEvent.description}
              </p>

              {/* Highlights list */}
              <div className="mt-6 p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase mb-3">
                  EVENT HIGHLIGHTS & PERKS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-zinc-300">
                  {featuredEvent.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Meta Box */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase">
                  EVENT LOGISTICS
                </h3>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block">DATES</span>
                  <span className="text-white font-semibold text-sm">{featuredEvent.date}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block">VENUE</span>
                  <span className="text-white font-semibold text-sm">{featuredEvent.venue}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block">PRIZE POOL</span>
                  <span className="text-amber-400 font-extrabold text-lg">{featuredEvent.prizePool}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800">
                <button
                  onClick={handleAnalytrixRegister}
                  disabled={registered}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 ${
                    registered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:scale-105 shadow-blue-500/25'
                  }`}
                >
                  {registered ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Slot Reserved for Analytrix!</span>
                    </>
                  ) : (
                    <>
                      <span>Register for ANALYTRIX 2025</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Winners Podium Showcase */}
          <div className="mt-10 pt-8 border-t border-zinc-800/80">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
              <Award className="w-5 h-5 text-amber-400" />
              <span>PREVIOUS ANALYTRIX WINNERS SHOWCASE</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredEvent.winners.map((win, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {win.position}
                    </span>
                    <h4 className="text-base font-bold text-white mt-3">{win.team}</h4>
                    <p className="text-xs text-zinc-400 font-mono">{win.college}</p>
                    <p className="text-xs text-zinc-300 mt-2 line-clamp-2 italic">
                      "{win.project}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-900 text-xs font-mono font-semibold text-emerald-400">
                    Prize: {win.prize}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <span>2025-26 ACADEMIC CALENDAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Events Timeline Roadmap
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Chronological breakdown of hackathons, ideathons, workshops, and exhibitions.
          </p>
        </div>

        <Timeline events={eventsList} />
      </section>

      {/* Other Events Grid with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">All Chapter Events</h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('ideathon')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeTab === 'ideathon'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}
            >
              Ideathons
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeTab === 'workshop'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}
            >
              Workshops
            </button>
            <button
              onClick={() => setActiveTab('webinar')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeTab === 'webinar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}
            >
              Webinars
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev, index) => (
            <EventCard key={ev.id} event={ev} delay={index * 0.08} />
          ))}
        </div>
      </section>
    </div>
  );
}
