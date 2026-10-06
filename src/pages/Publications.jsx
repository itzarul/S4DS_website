import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Globe,
  ArrowUpRight,
  BookOpen,
  FileCheck,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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
      className="relative w-full max-w-full lg:max-w-[95%] mx-auto group opacity-100 h-full"
    >
      <div className="team-card relative h-full bg-[#000000] border border-[#012f7c] p-4 sm:p-6 team-primary text-white overflow-hidden hover:border-[#3585f6] hover:shadow-[0_0_20px_rgba(53,133,246,0.5),inset_0_0_20px_rgba(53,133,246,0.2)] flex flex-col">
        {/* Outer Border accents */}
        <div className="absolute inset-1 border-[0.5px] border-[#3585f6]/20 pointer-events-none group-hover:border-[#3585f6]/50 transition-colors" />

        {/* Top Bar */}
        <div className="flex justify-between items-start border-b border-[#012f7c] pb-2 mb-4 relative z-10 shrink-0">
          <span className="text-[9px] sm:text-[10px] text-[#3585f6] tracking-widest uppercase font-semibold">
            S4DS.EXE // BULLETIN_ARTICLE
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-[2px] opacity-60">
              <div className="w-[2px] h-5 bg-[#3585f6]"></div>
              <div className="w-[2px] h-5 bg-[#3585f6]"></div>
              <div className="w-[2px] h-3 bg-[#3585f6] mt-2"></div>
              <div className="w-[2px] h-5 bg-[#3585f6]"></div>
            </div>
            <div className="text-[8px] text-[#3585f6] leading-[1] font-bold text-right">
              <div>20</div>
              <div>26</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 flex-1">
          {/* Left Column (Text) */}
          <div className="flex-1 flex flex-col justify-center">
            <div>
              <motion.div variants={detailVariants} className="flex items-end gap-[2px] h-6 mb-3 opacity-80 card-detail">
                {[
                  4, 8, 6, 12, 16, 10, 14, 24, 18, 12, 8, 14, 10, 6, 4,
                ].map((h, i) => (
                  <div key={i} className="w-1 bg-[#3585f6]" style={{ height: `${h}px` }} />
                ))}
              </motion.div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase leading-[1.1] tracking-tight text-white mb-3 team-display group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
                {titleParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part}{" "}
                  </React.Fragment>
                ))}
              </h2>

              <motion.div variants={detailVariants} className="flex items-center gap-2 mb-2 border-t border-[#012f7c] pt-3 card-detail">
                <span className="text-[10px] sm:text-[11px] text-[#3585f6] uppercase tracking-widest font-semibold">
                  AUTHOR: {article.author}
                </span>
              </motion.div>

              <motion.div variants={detailVariants} className="text-[13px] sm:text-[14px] md:text-[15px] text-zinc-300 leading-relaxed mt-4 pb-2 pr-0 sm:pr-4">
                {article.excerpt}
              </motion.div>
            </div>
          </div>

          {/* Right Column (Image) */}
          <div className="w-full sm:w-[200px] md:w-[260px] border border-[#012f7c] p-1.5 flex flex-col relative shrink-0 h-fit mt-4 sm:mt-0 sm:ml-4">
            <div className="flex justify-between items-center text-[7px] sm:text-[8px] text-[#3585f6] mb-1.5 px-0.5 uppercase tracking-widest font-bold">
              <span>////L</span>
              <span>// VISUAL_DATA</span>
            </div>
            <div 
              className="relative w-full h-[220px] sm:h-[200px] md:h-[260px] overflow-hidden bg-[#000000] border border-[#012f7c] cursor-pointer group/img"
              onClick={() => onImageClick(article.images, localIndex)}
            >
              <img
                src={article.images[localIndex]}
                className="w-full h-full object-cover object-center filter contrast-110 group-hover/img:scale-105 transition-transform duration-500"
                alt={article.title}
              />
              <div className="absolute inset-0 bg-[#012f7c]/20 mix-blend-overlay pointer-events-none group-hover/img:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div variants={detailVariants} className="mt-6 pt-4 border-t border-[#012f7c] flex justify-between items-center text-[9px] sm:text-[10px] text-[#3585f6] uppercase tracking-widest font-bold relative z-10 card-detail shrink-0">
          <span>{article.role.toUpperCase()}</span>
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
      <div className="fixed inset-0 bg-[#000000]/40 pointer-events-none z-0" />
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

      {/* Carousel Modal via Portal to escape all z-index stacking contexts */}
      {selectedImages && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto" onClick={closeCarousel}>
          <div className="relative w-full max-w-7xl flex items-center justify-center border border-[#3585f6] bg-[#000000] p-1 sm:p-4 shadow-[0_0_30px_rgba(53,133,246,0.3)] my-auto" onClick={(e) => e.stopPropagation()}>
            <CornerBrackets size="w-4 h-4 sm:w-6 sm:h-6" />
            
            <button onClick={closeCarousel} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-[#3585f6] z-[100] p-1.5 sm:p-2 bg-black/80 border border-[#012f7c] hover:border-[#3585f6] hover:bg-[#3585f6]/10 transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {selectedImages.length > 1 && (
              <button onClick={prevImg} className="absolute left-1 sm:left-4 p-1.5 sm:p-3 bg-black/80 text-white hover:text-[#3585f6] border border-[#012f7c] hover:border-[#3585f6] z-[60] transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            )}
            
            <img 
              src={selectedImages[currentImgIndex]} 
              alt="Event showcase" 
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain filter contrast-110" 
            />
            
            {selectedImages.length > 1 && (
              <button onClick={nextImg} className="absolute right-1 sm:right-4 p-1.5 sm:p-3 bg-black/80 text-white hover:text-[#3585f6] border border-[#012f7c] hover:border-[#3585f6] z-[60] transition-colors">
                <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            )}
            
            {selectedImages.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
                {selectedImages.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i); }}
                    className={`h-1.5 transition-all duration-300 ${i === currentImgIndex ? 'w-6 sm:w-8 bg-[#3585f6] shadow-[0_0_8px_#3585f6]' : 'w-2 sm:w-3 bg-[#012f7c] hover:bg-[#3585f6]/50'}`} 
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
