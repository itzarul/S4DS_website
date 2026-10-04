import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Clock } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      id: 1,
      label: "Active Members",
      value: "500+",
      sub: "Tech Enthusiasts",
      icon: Users,
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      label: "Events Conducted",
      value: "25+",
      sub: "Hackathons & Expos",
      icon: Calendar,
      color: "from-cyan-400 to-blue-600"
    },
    {
      id: 3,
      label: "Workshops Held",
      value: "15+",
      sub: "Hands-on AI & ML",
      icon: Award,
      color: "from-blue-600 to-indigo-500"
    },
    {
      id: 4,
      label: "Years Active",
      value: "4+",
      sub: "Legacy of Innovation",
      icon: Clock,
      color: "from-indigo-400 to-cyan-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, borderColor: 'rgba(25, 98, 255, 0.4)' }}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <IconComponent className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-white mt-1">
              {stat.label}
            </div>
            <div className="text-xs text-zinc-500 font-mono mt-0.5">
              {stat.sub}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
