import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Globe,
  ArrowUpRight,
  BookOpen,
  FileCheck,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import ThreeDLogo from "../components/ThreeDLogo";

// Corner brackets component from Team.jsx
function CornerBrackets({
  className = "border-[#3585f6]",
  size = "w-3.5 h-3.5",
}) {
  return (
    <>
      <span className={`absolute -top-1 -left-1 border-t-4 border-l-4 ${className} ${size}`} />
      <span className={`absolute -top-1 -right-1 border-t-4 border-r-4 ${className} ${size}`} />
      <span className={`absolute -bottom-1 -left-1 border-b-4 border-l-4 ${className} ${size}`} />
      <span className={`absolute -bottom-1 -right-1 border-b-4 border-r-4 ${className} ${size}`} />
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1];
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const detailVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Data extracted from the PDF bulletin
const bulletinSections = [
  {
    id: "event-highlights",
    title: "Event Highlights",
    author: "Odd Semester",
    role: "Recap",
    images: [
      "/bulletin_images/img_6_54.png", 
      "/bulletin_images/img_6_55.png", 
      "/bulletin_images/img_6_56.png", 
      "/bulletin_images/img_6_64.png",
      "/bulletin_images/img_6_65.png"
    ],
    excerpt: "A spectacular showcase of the Odd Semester events that bridged technical skills with real-world networking. Highlights include 'Alumni Connect' where past graduates shared industry journeys, the vibrant 'Zephyr' data science expo, a strategic 'FinTech Webinar' merging finance with machine learning, and the intense 'Mind Benders - Nexus Ideathon' challenging students to build scalable and visionary AI models within tight deadlines.",
  },
  {
    id: "analytrix",
    title: "Analytrix 2026",
    author: "Flagship Event",
    role: "Hackathon",
    images: [
      "/bulletin_images/img_7_67.jpeg", 
      "/bulletin_images/img_7_68.jpeg", 
      "/bulletin_images/img_7_69.jpeg", 
      "/bulletin_images/img_7_70.jpeg", 
      "/bulletin_images/img_7_71.jpeg", 
      "/bulletin_images/img_7_72.png"
    ],
    excerpt: "Analytrix 2026 served as a premier platform for students to transition from theoretical modeling to practical, high-stakes problem solving. The event kicked off with a high-intensity Datathon, a grueling seven-hour data-oriented hackathon that saw over 20 teams and 80 participants battling to solve complex datasets. This was followed by the Data Conclave, an immersive session dedicated to the latest advancements in Data Analytics where industry experts provided invaluable career guidance on domain-specific feature engineering.",
  },
  {
    id: "outreach",
    title: "Outreach Event",
    author: "RBK School",
    role: "Initiative",
    images: [
      "/bulletin_images/img_8_76.jpeg", 
      "/bulletin_images/img_8_77.jpeg", 
      "/bulletin_images/img_8_80.jpeg"
    ],
    excerpt: "Designed to demystify complex technological shifts, the outreach initiative 'Beyond ChatGPT: Exploring the Future of AI & Data Science' was conducted for 12th-standard students at RBK School. The session encouraged students to become future AI producers rather than just consumers by converting difficult technology changes into understandable, powerful ideas, turning early tech hesitation into true academic confidence.",
  },
  {
    id: "local-iv",
    title: "Local IV",
    author: "Industrial Visit",
    role: "Experience",
    images: [
      "/bulletin_images/img_9_84.jpeg", 
      "/bulletin_images/img_9_85.jpeg", 
      "/bulletin_images/img_9_86.jpeg"
    ],
    excerpt: "The Local Industrial Visit provides an immersive experience acting as a crucial link between academic learning and practical industrial practices. Third-year AI&DS students visited Reliance Corporate Park gaining firsthand exposure to large-scale infrastructure. This was followed by an insightful visit to Vervali Systems Pvt. Ltd., venturing beyond traditional textbooks into vibrant business settings where creativity and software engineering flourish across the whole lifecycle of product development.",
  },
  {
    id: "technical-seminar",
    title: "Technical Seminar",
    author: "Mind Benders",
    role: "Seminar",
    images: [
      "/bulletin_images/img_10_90.png", 
      "/bulletin_images/img_10_91.png", 
      "/bulletin_images/img_10_92.png"
    ],
    excerpt: "The AI Club–Mind Benders, in collaboration with IIC-TCET, organized a pivotal technical seminar themed 'Human Capital Enhancement for an AI-Ready Workforce'. Led by industry expert Mr. Dishant Gandhi, the session immersed participants in the practicalities of the modern tech landscape, providing a deep dive into Generative AI and Conversational AI to align student competencies with the national vision of Atmanirbhar Bharat.",
  }
];

const ArticleCard = React.memo(function ArticleCard({ article, onImageClick }) {
  const titleParts = article.title.split(" ");
  const [localIndex, setLocalIndex] = useState(0);

  useEffect(() => {
    if (!article.images || article.images.length <= 1) return;
    const interval = setInterval(() => {
      setLocalIndex((prev) => (prev + 1) % article.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [article.images]);
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative w-full max-w-full lg:max-w-[95%] mx-auto group opacity-100 h-full"
    >
      <div className="relative h-full bg-[#020817]/70 backdrop-blur-md border border-t-[#3585f6]/30 border-l-[#3585f6]/20 border-b-[#012f7c]/40 border-r-[#012f7c]/40 p-6 sm:p-8 text-slate-200 overflow-hidden hover:bg-[#040f29]/80 flex flex-col transition-all duration-500 rounded-2xl group-hover:shadow-[0_15px_40px_-10px_rgba(53,133,246,0.25)]">
        
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#3585f6 1px, transparent 1px), linear-gradient(90deg, #3585f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        {/* Animated Cyber Glow Background on Hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(53,133,246,0.12),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Laser Scanning Line on Hover */}
        <motion.div 
           className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3585f6]/50 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-20"
           initial={{ top: "0%" }}
           whileHover={{ top: "100%" }}
           transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
        />

        {/* Outer Border accents */}
        <div className="absolute inset-[2px] border-[0.5px] border-[#3585f6]/10 pointer-events-none group-hover:border-[#3585f6]/30 transition-colors duration-500" />

        {/* Top Bar - Professional Style */}
        <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
          <div className="flex items-center gap-4">
             <span className="px-4 py-1.5 rounded-full bg-[#3585f6] text-[10px] sm:text-[11px] text-white tracking-[0.2em] uppercase font-bold shadow-[0_4px_14px_0_rgba(53,133,246,0.39)]">
               PUBLICATION
             </span>
             <span className="text-[11px] text-zinc-400 font-semibold tracking-widest uppercase border-l border-zinc-700 pl-4">{article.role || "Research"}</span>
          </div>
          <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#3585f6] transition-colors duration-300 delay-75 shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_#3585f6]" />
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#3585f6] transition-colors duration-300 delay-150 shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_#3585f6]" />
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#3585f6] transition-colors duration-300 delay-200 shadow-[0_0_5px_transparent] group-hover:shadow-[0_0_8px_#3585f6]" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 flex-1">
          {/* Left Column (Text) */}
          <div className="flex-1 flex flex-col justify-center">
            <div>
              {/* Removed volume bars as per request */}

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-blackletter font-normal capitalize leading-[1.1] tracking-wide text-white mb-4 group-hover:text-blue-50 transition-colors duration-500 drop-shadow-md">
                {titleParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part.toLowerCase()}{" "}
                  </React.Fragment>
                ))}
              </h2>

              <motion.div variants={detailVariants} className="flex items-center mb-4 pt-1 card-detail">
                <span className="text-[12px] sm:text-[13px] text-zinc-400 font-medium tracking-wide">
                  By <span className="text-white font-bold">{article.author}</span>
                </span>
              </motion.div>

              <motion.div variants={detailVariants} className="text-[13px] sm:text-[14px] md:text-[15px] text-zinc-300 leading-relaxed mt-4 pb-2 pr-0 sm:pr-4">
                {article.excerpt}
              </motion.div>
            </div>
          </div>

          {/* Right Column (Image) */}
          <div className="w-full sm:w-[200px] md:w-[260px] bg-gradient-to-b from-[#010a1c]/80 to-[#000000]/90 border border-[#3585f6]/10 group-hover:border-[#3585f6]/40 transition-all duration-500 p-2 rounded-xl flex flex-col relative shrink-0 h-fit mt-4 sm:mt-0 sm:ml-4 shadow-inner group-hover:shadow-[0_0_25px_rgba(53,133,246,0.15)]">
            <div 
              className="relative w-full h-[220px] sm:h-[200px] md:h-[260px] overflow-hidden bg-[#000000] border border-[#012f7c]/30 rounded-lg cursor-pointer group/img transition-colors duration-500 group-hover:border-[#3585f6]/60"
              onClick={() => onImageClick(article.images, localIndex)}
            >
              <AnimatePresence>
                <motion.img
                  key={localIndex}
                  src={article.images[localIndex]}
                  alt={article.title}
                  initial={{ opacity: 0, filter: "brightness(0.8) contrast(1.2)" }}
                  animate={{ opacity: 1, filter: "brightness(1) contrast(1.1)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-[3000ms] ease-out"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-[#012f7c]/10 mix-blend-overlay pointer-events-none group-hover/img:bg-transparent transition-colors duration-700"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Professional Footer */}
        <motion.div variants={detailVariants} className="mt-6 pt-5 border-t border-zinc-800/80 flex justify-between items-center relative z-10 card-detail shrink-0">
          <div className="flex items-center text-[10px] sm:text-[11px] text-zinc-400 font-semibold tracking-widest uppercase">
            <span>2025–26 ACADEMIC YEAR</span>
          </div>
          <div className="flex items-center gap-2 group/btn cursor-pointer">
            <span className="text-[10px] sm:text-[11px] text-white font-bold uppercase tracking-widest group-hover:text-[#3585f6] transition-colors duration-300">READ PUBLICATION</span>
            <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[#3585f6] transition-colors duration-300" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default function Publications() {
  const [selectedImages, setSelectedImages] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const openCarousel = (images, startIndex = 0) => {
    if (images && images.length > 0) {
      setSelectedImages(images);
      setCurrentImgIndex(startIndex);
    }
  };
  const closeCarousel = () => setSelectedImages(null);
  const nextImg = (e) => { e.stopPropagation(); setCurrentImgIndex((i) => (i + 1) % selectedImages.length); };
  const prevImg = (e) => { e.stopPropagation(); setCurrentImgIndex((i) => (i - 1 + selectedImages.length) % selectedImages.length); };

  useEffect(() => {
    let interval;
    if (selectedImages && selectedImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % selectedImages.length);
      }, 15000); // 15 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedImages, currentImgIndex]);

  useEffect(() => {
    if (selectedImages) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImages]);

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 pt-24 pb-24 px-4 sm:px-6 lg:px-8 team-primary font-light selection:bg-[#012f7c] selection:text-white relative overflow-hidden">
      {/* Background and Overlays */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-85" style={{ backgroundImage: "url('/team/background.jpeg')" }} />
      <div className="fixed inset-0 bg-[#000000]/50 pointer-events-none z-0" />
      <ThreeDLogo className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[1] opacity-50 mix-blend-screen pointer-events-none overflow-hidden" />
      <div className="team-scanlines fixed inset-0 opacity-25 pointer-events-none z-30" />
      <div className="team-vignette fixed inset-0 z-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Harsh Hero Banner */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto mb-8 px-4">
            <div className="flex-1 flex items-center justify-end relative h-4">
              <div className="h-[1px] bg-[#3585f6] w-full relative">
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
              </div>
            </div>

            <div className="relative px-5 py-2 bg-[#000000] border border-[#3585f6] shadow-[0_0_15px_rgba(53,133,246,0.35)] shrink-0">
              <CornerBrackets />
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6] inline-block" />
                <span className="text-white font-semibold">HARSH_SYS // COMMAND_DIRECTIVE</span>
                <span className="w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6] inline-block" />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-start relative h-4">
              <div className="h-[1px] bg-[#3585f6] w-full relative">
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="my-6">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl team-display font-black text-white tracking-tight uppercase drop-shadow-[0_5px_0px_#002a76] filter drop-shadow-[0_0_30px_rgba(53,133,246,0.35)]">
              PUBLICATIONS
            </motion.h1>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4">
              <div className="flex items-center gap-2.5 flex-1 justify-end max-w-[120px] sm:max-w-[220px]">
                <div className="h-[1.5px] bg-[#3585f6] flex-1 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                </div>
                <div className="flex gap-1 text-[#3585f6] text-xs sm:text-base font-black italic tracking-tighter select-none font-mono">
                  <span>\</span><span>\</span><span>\</span>
                </div>
              </div>

              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#3585f6] tracking-tight drop-shadow-[0_0_25px_rgba(53,133,246,0.65)] font-mono">
                2025-26
              </span>

              <div className="flex items-center gap-2.5 flex-1 justify-start max-w-[120px] sm:max-w-[220px]">
                <div className="flex gap-1 text-[#3585f6] text-xs sm:text-base font-black italic tracking-tighter select-none font-mono">
                  <span>/</span><span>/</span><span>/</span>
                </div>
                <div className="h-[1.5px] bg-[#3585f6] flex-1 relative">
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }} className="relative max-w-4xl mx-auto mt-8 sm:mt-10 px-4">
            <div className="absolute -top-1 left-6 sm:left-12 w-6 h-[2px] bg-[#3585f6] shadow-[0_0_8px_#3585f6] z-20 pointer-events-none" />
            <div className="absolute -top-1 right-6 sm:right-12 w-6 h-[2px] bg-[#3585f6] shadow-[0_0_8px_#3585f6] z-20 pointer-events-none" />

            <div className="relative p-[1.5px] shadow-[0_0_25px_rgba(53,133,246,0.35)]" style={{ clipPath: "polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)", background: "#3585f6" }}>
              <div className="relative bg-[#000000] px-6 py-5 sm:px-12 sm:py-6 text-center" style={{ clipPath: "polygon(21px 0, calc(100% - 21px) 0, 100% 21px, 100% calc(100% - 21px), calc(100% - 21px) 100%, 21px 100%, 0 calc(100% - 21px), 0 21px)" }}>
                
                <p className="team-body font-light text-xs sm:text-sm text-slate-200 uppercase tracking-widest leading-relaxed">
                  OFFICIAL RESEARCH &amp; EDITORIAL JOURNAL OF S4DS TCET.
                  <br />
                  BULLETIN EVEN SEMESTER RELEASED.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level 1: Articles */}
        <section className="my-20">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="flex items-center gap-4 mb-10">
            <motion.div variants={scaleIn} className="h-3.5 w-3.5 bg-[#3585f6] shadow-[0_0_8px_#3585f6]" />
            <motion.h2 variants={slideInLeft} className="team-display text-lg sm:text-xl font-bold text-white uppercase tracking-widest px-6 py-2 bg-[#000000] border-2 border-[#3585f6] shadow-[0_0_20px_rgba(53,133,246,0.3)]">
              [ LEVEL 1 // BULLETIN ARTICLES ]
            </motion.h2>
            <motion.div variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } } }} style={{ originX: 0 }} className="flex-1 h-1 bg-[repeating-linear-gradient(90deg,#012f7c,#012f7c_8px,transparent_8px,transparent_16px)]" />
          </motion.div>

          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto items-stretch">
            {bulletinSections.map(article => (
              <ArticleCard key={article.id} article={article} onImageClick={openCarousel} />
            ))}
          </div>
        </section>

      </div>

      {/* Carousel Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedImages && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#010612]/90 p-4 sm:p-8 overflow-y-auto" 
              onClick={closeCarousel}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-6xl flex flex-col items-center justify-center bg-[#030917]/80 backdrop-blur-xl border border-[#3585f6]/20 rounded-3xl shadow-[0_20px_60px_-15px_rgba(53,133,246,0.4)] my-auto overflow-hidden group/modal" 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="w-full flex justify-between items-center px-6 py-4 border-b border-[#3585f6]/10 bg-[#000000]/40 relative z-10 shrink-0">
                   <div className="flex items-center gap-3">
                     <span className="w-2 h-2 rounded-full bg-[#3585f6] animate-pulse shadow-[0_0_10px_#3585f6]" />
                     <span className="text-[11px] sm:text-xs text-white font-bold tracking-widest uppercase">VISUAL PREVIEW</span>
                   </div>
                   <button 
                     onClick={closeCarousel} 
                     className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
                     aria-label="Close Preview"
                   >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                   </button>
                </div>

                {/* Image Area */}
                <div className="relative w-full p-4 sm:p-12 flex items-center justify-center min-h-[50vh]">
                  
                  {selectedImages.length > 1 && (
                    <button 
                      onClick={prevImg} 
                      className="absolute left-2 sm:left-6 p-3 bg-[#020817]/60 hover:bg-[#3585f6] backdrop-blur-md text-white border border-white/10 hover:border-transparent rounded-full z-[60] transition-all duration-300 transform sm:-translate-x-4 sm:opacity-0 sm:group-hover/modal:translate-x-0 sm:group-hover/modal:opacity-100 shadow-xl"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImgIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      src={selectedImages[currentImgIndex]} 
                      alt="Publication detail view" 
                      className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl" 
                    />
                  </AnimatePresence>

                  {selectedImages.length > 1 && (
                    <button 
                      onClick={nextImg} 
                      className="absolute right-2 sm:right-6 p-3 bg-[#020817]/60 hover:bg-[#3585f6] backdrop-blur-md text-white border border-white/10 hover:border-transparent rounded-full z-[60] transition-all duration-300 transform sm:translate-x-4 sm:opacity-0 sm:group-hover/modal:translate-x-0 sm:group-hover/modal:opacity-100 shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  )}
                </div>
                
                {/* Dots Footer */}
                {selectedImages.length > 1 && (
                  <div className="w-full flex justify-center items-center py-6 gap-2 sm:gap-3 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 z-10 pointer-events-none">
                    {selectedImages.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i); }}
                        className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
                          i === currentImgIndex 
                            ? 'w-8 sm:w-10 bg-[#3585f6] shadow-[0_0_12px_#3585f6]' 
                            : 'w-2.5 sm:w-3 bg-zinc-600 hover:bg-zinc-400'
                        }`} 
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
