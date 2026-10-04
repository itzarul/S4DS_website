import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Cpu, Flag, ArrowRight } from 'lucide-react';

export default function About() {
  const cards = [
    {
      id: "mission",
      title: "Our Mission",
      icon: Target,
      iconBg: "from-blue-600/20 to-blue-500/10 text-blue-400 border-blue-500/30",
      description: "To create an empowering ecosystem at TCET that equips engineering students with industry-relevant skills in Data Engineering, Machine Learning, Deep Learning, and Artificial Intelligence."
    },
    {
      id: "vision",
      title: "Our Vision",
      icon: Compass,
      iconBg: "from-cyan-600/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30",
      description: "To emerge as a premier university technical chapter recognized nationally for producing top-tier AI researchers, Kaggle grandmasters, and data-driven startup founders."
    },
    {
      id: "what-we-do",
      title: "What We Do",
      icon: Cpu,
      iconBg: "from-indigo-600/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30",
      description: "We organize national hackathons, technical ideathons, annual research publications (DataSphere), hands-on PyTorch workshops, and exclusive industry mentorship sessions."
    },
    {
      id: "our-goals",
      title: "Our Goals",
      icon: Flag,
      iconBg: "from-blue-500/20 to-cyan-400/10 text-blue-300 border-blue-400/30",
      description: "To bridge the gap between academic theory and real-world deployment, foster cross-disciplinary research collaborations, and establish strong corporate sponsorship networks."
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
          >
            <span>ABOUT S4DS TCET</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Driving the Future of <span className="text-gradient-primary">Data & AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-zinc-400 text-base sm:text-lg leading-relaxed"
          >
            Established under the Department of Data Science at Thakur College of Engineering & Technology, S4DS acts as a catalyst for technical learning, peer networking, and research excellence.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-xl hover:border-blue-500/40 hover:bg-zinc-900/80 transition-all shadow-xl shadow-black/40 group relative overflow-hidden"
              >
                {/* Top Corner Glow */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.iconBg} border flex items-center justify-center mb-6 shadow-inner`}>
                  <IconComp className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more about S4DS initiatives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
