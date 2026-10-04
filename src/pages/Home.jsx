import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import EventCard from '../components/EventCard';
import PublicationCard from '../components/PublicationCard';
import TeamCard from '../components/TeamCard';
import CTA from '../components/CTA';

import { featuredEvent, eventsList } from '../data/events';
import { featuredPublication } from '../data/publications';
import { coreTeam } from '../data/team';
import { Users, Network, Code2, Trophy, Lightbulb, UserCheck, Briefcase, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function Home() {
  const whyJoinCards = [
    {
      id: "networking",
      title: "Networking",
      icon: Network,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      description: "Connect with like-minded student developers, alumni working at Fortune 500 tech firms, and industry mentors."
    },
    {
      id: "projects",
      title: "Real-world Projects",
      icon: Code2,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      description: "Collaborate on end-to-end Machine Learning pipelines, Generative AI models, and open-source data products."
    },
    {
      id: "hackathons",
      title: "Hackathons",
      icon: Trophy,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
      description: "Compete in ANALYTRIX and inter-collegiate hackathons with cash prize pools exceeding ₹1.5 Lakhs."
    },
    {
      id: "competitions",
      title: "Kaggle & Competitions",
      icon: Lightbulb,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      description: "Participate in structured data science leagues, model benchmarking, and algorithmic coding sprints."
    },
    {
      id: "mentorship",
      title: "1-on-1 Mentorship",
      icon: UserCheck,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description: "Direct guidance from senior core members and department faculty on research papers and resume building."
    },
    {
      id: "exposure",
      title: "Industry Exposure",
      icon: Briefcase,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      description: "Exclusive keynotes, MLOps tech talks, corporate cloud credits, and direct internship referral leads."
    }
  ];

  // Preview core members (first 4)
  const previewTeam = coreTeam.slice(0, 4);

  // Preview events (first 3)
  const previewEvents = eventsList.slice(0, 3);

  const sponsors = [
    { name: "Google Cloud", tier: "Title Sponsor" },
    { name: "AWS Educate", tier: "Cloud Partner" },
    { name: "Postman", tier: "API Partner" },
    { name: "GitHub Education", tier: "Ecosystem Partner" },
    { name: "Polygon", tier: "Track Sponsor" }
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About S4DS */}
      <About />

      {/* 3. Why Join S4DS */}
      <section className="py-20 relative z-10 bg-zinc-950/40 border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4"
            >
              <span>BENEFITS & OPPORTUNITIES</span>
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Why Join <span className="text-gradient-primary">S4DS TCET?</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-base sm:text-lg">
              Empowering students to step into high-growth tech roles with practical experience and leadership confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyJoinCards.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl hover:border-blue-500/40 transition-all shadow-xl group"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 shadow-inner ${item.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Events Preview */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
                <span>FLAGSHIP & UPCOMING EVENTS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Featured <span className="text-gradient-primary">Events Spotlight</span>
              </h2>
            </div>

            <NavLink
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-white transition-all hover:scale-105"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </NavLink>
          </div>

          {/* Flagship Event Spotlight */}
          <div className="mb-12">
            <EventCard event={featuredEvent} />
          </div>

          {/* Other Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewEvents.map((ev, idx) => (
              <EventCard key={ev.id} event={ev} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Publications Preview */}
      <section className="py-20 relative z-10 bg-zinc-950/60 border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
              <span>RESEARCH & PUBLICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DataSphere <span className="text-gradient-primary">Magazine</span>
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              Annual research compilation showcasing cutting-edge AI insights and student paper publications.
            </p>
          </div>

          <PublicationCard pub={featuredPublication} isFeatured={true} />

          <div className="mt-8 text-center">
            <NavLink
              to="/publications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explore All Magazine Editions & Technical Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 6. Meet Our Team Preview */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
              <span>LEADERSHIP EXCELLENCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Meet Our <span className="text-gradient-primary">Core Leadership</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-base">
              The driven student leaders behind S4DS TCET's hackathons, technical research, and community growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewTeam.map((member, idx) => (
              <TeamCard key={member.id} member={member} delay={idx * 0.1} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <NavLink
              to="/team"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-semibold text-white bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-all hover:scale-105 shadow-lg"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Meet Complete Team (14+ Core Roles)</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 7. Sponsors / Partners Wall */}
      <section className="py-16 relative z-10 border-t border-zinc-800/80 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mb-8">
            TRUSTED BY INDUSTRY & ECOSYSTEM PARTNERS
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75">
            {sponsors.map((sp, i) => (
              <div
                key={i}
                className="px-6 py-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md flex flex-col items-center justify-center hover:border-blue-500/40 hover:opacity-100 transition-all cursor-pointer group"
              >
                <Building2 className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 mb-1 transition-colors" />
                <span className="text-sm font-bold text-zinc-200">{sp.name}</span>
                <span className="text-[10px] font-mono text-zinc-500">{sp.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact CTA */}
      <CTA />
    </div>
  );
}
