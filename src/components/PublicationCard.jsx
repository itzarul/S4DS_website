import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, Eye, FileText, X, Check } from 'lucide-react';

export default function PublicationCard({ pub, isFeatured = false }) {
  const [readingModal, setReadingModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6 }}
        className={`group rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl flex flex-col md:flex-row ${
          isFeatured ? 'p-6 sm:p-8 border-blue-500/30' : 'p-6'
        }`}
      >
        {/* Magazine Cover Preview with 3D Effect */}
        <div className="md:w-1/3 aspect-[3/4] relative rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl shrink-0 group-hover:shadow-blue-500/10 transition-shadow">
          <img
            src={pub.coverImage}
            alt={pub.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-cyan-400 border border-cyan-500/30">
            {pub.edition}
          </div>
        </div>

        {/* Details & Actions */}
        <div className="mt-6 md:mt-0 md:ml-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>{pub.date || 'Annual Edition'}</span>
              <span>•</span>
              <span>{pub.pages || '48 Pages'}</span>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {pub.title}
            </h3>

            <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
              {pub.description}
            </p>

            {pub.highlights && (
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-mono font-semibold text-zinc-300">KEY HIGHLIGHTS:</span>
                <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                  {pub.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setReadingModal(true)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span>Read Online PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">PDF Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* PDF Reader Modal Mock */}
      <AnimatePresence>
        {readingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 h-[85vh] flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setReadingModal(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">{pub.title}</h3>
                  <p className="text-xs font-mono text-zinc-400">{pub.edition} — Official Reader</p>
                </div>
              </div>

              {/* PDF Mock Viewer Area */}
              <div className="flex-1 rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                <div className="w-20 h-28 rounded-lg bg-zinc-900 border border-blue-500/40 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Interactive PDF Reader Active</h4>
                <p className="text-zinc-400 text-sm max-w-md mb-6">
                  {pub.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-zinc-500">Page 1 of {pub.pages || '48'}</span>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Copy</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
