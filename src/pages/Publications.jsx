import React from 'react';
import { motion } from 'framer-motion';
import { featuredPublication, olderPublications } from '../data/publications';
import PublicationCard from '../components/PublicationCard';
import { BookOpen, Sparkles, Send, FileCheck } from 'lucide-react';

export default function Publications() {
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
          <span>RESEARCH & EDITORIAL JOURNAL</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
        >
          DataSphere <span className="text-gradient-primary">Magazine</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto"
        >
          The official research publication of S4DS TCET highlighting artificial intelligence advancements, machine learning architectures, and student research papers.
        </motion.p>
      </section>

      {/* Featured Publication */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>LATEST FEATURED EDITION</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            Active Issue
          </span>
        </div>

        <PublicationCard pub={featuredPublication} isFeatured={true} />
      </section>

      {/* Older Editions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Archives & Older Editions</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Explore past volumes published by the S4DS editorial team since 2022.
          </p>
        </div>

        <div className="space-y-6">
          {olderPublications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))}
        </div>
      </section>

      {/* Call for Papers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono">
              <FileCheck className="w-3.5 h-3.5" />
              <span>CALL FOR ARTICLES & PAPERS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Want to publish your research in DataSphere Vol 4?
            </h3>
            <p className="text-zinc-400 text-sm max-w-xl">
              We invite TCET students and faculty researchers to submit articles on Deep Learning, MLOps, Data Privacy, or Computer Vision for our upcoming 2025-26 edition.
            </p>
          </div>

          <a
            href="mailto:content.s4ds@tcetmumbai.in?subject=DataSphere%20Paper%20Submission"
            className="shrink-0 px-8 py-4 rounded-full font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>Submit Your Paper Draft</span>
          </a>
        </div>
      </section>
    </div>
  );
}
