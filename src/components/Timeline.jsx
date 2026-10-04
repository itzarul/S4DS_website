import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Timeline({ events }) {
  return (
    <div className="relative max-w-4xl mx-auto py-8">
      {/* Vertical Glowing Line */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600 shadow-[0_0_12px_#3585f6] -translate-x-1/2" />

      <div className="space-y-12">
        {events.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col sm:flex-row items-center ${
                isEven ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Node */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              </div>

              {/* Card Container */}
              <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl hover:border-blue-500/40 transition-all shadow-xl group">
                  <div className={`flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 ${isEven ? 'sm:justify-end' : ''}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{item.category}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {item.shortDescription || item.description}
                  </p>

                  <div className={`mt-4 flex items-center gap-2 text-xs font-mono text-blue-400 ${isEven ? 'sm:justify-end' : ''}`}>
                    <span>Venue: {item.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
