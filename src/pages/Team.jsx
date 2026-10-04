import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  hodData,
  facultyInchargeData,
  coreTeams,
  coreTeam2026_2027,
  coreTeam2025_2026,
} from "../data/team";
import {
  Linkedin,
  Github,
  Mail,
  Search,
  X,
  Terminal,
  Cpu,
  Shield,
  Award,
  Sparkles,
  Globe,
  ArrowUpRight,
  ChevronDown,
  Check,
  Calendar,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CornerBrackets({
  className = "border-[#3585f6]",
  size = "w-3.5 h-3.5",
}) {
  return (
    <>
      <span
        className={`absolute -top-1 -left-1 border-t-4 border-l-4 ${className} ${size}`}
      />
      <span
        className={`absolute -top-1 -right-1 border-t-4 border-r-4 ${className} ${size}`}
      />
      <span
        className={`absolute -bottom-1 -left-1 border-b-4 border-l-4 ${className} ${size}`}
      />
      <span
        className={`absolute -bottom-1 -right-1 border-b-4 border-r-4 ${className} ${size}`}
      />
    </>
  );
}

/* ---------------- Motion variants ---------------- */
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

const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/* Masked line reveal for headings */
const maskedLine = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ---------------- Animated count-up stat ---------------- */
function AnimatedCounter({ to }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(count, to, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [to]);
  return <motion.span>{rounded}</motion.span>;
}

/* ---------------- Member Card Animation Variants ---------------- */
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

/* ---------------- Reusable Member Profile Card ---------------- */
const MemberCard = React.memo(function MemberCard({ member, isMatch, yearDigits }) {
  const nameParts = member.name ? member.name.split(" ") : [];

  return (
    <motion.div
      key={member.id}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`relative w-full max-w-lg mx-auto group ${
        !isMatch ? "opacity-25 blur-[1px]" : "opacity-100"
      }`}
    >
      {/* Scroll-reveal shell: GSAP animates this element's transform, so the hover
          scale is kept on the box below and the two can never overwrite each other. */}
      <div className="team-card relative h-full bg-[#000000] border border-[#012f7c] p-3 sm:p-4 team-primary text-white overflow-hidden hover:border-[#3585f6] hover:shadow-[0_0_20px_rgba(53,133,246,0.5),inset_0_0_20px_rgba(53,133,246,0.2)]">
        {/* Outer Border accents */}
        <div className="absolute inset-1 border-[0.5px] border-[#3585f6]/20 pointer-events-none group-hover:border-[#3585f6]/50 transition-colors" />

        {/* Top Bar */}
        <div className="flex justify-between items-start border-b border-[#012f7c] pb-2 mb-4 relative z-10">
          <span className="text-[9px] sm:text-[10px] text-[#3585f6] tracking-widest uppercase font-semibold">
            S4DS.EXE // MEMBER_PROFILE
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
              <div>{yearDigits || "26"}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 relative z-10 h-[180px] sm:h-[200px]">
          {/* Left Column (Text & Actions) */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Audio Waveform */}
              <motion.div variants={detailVariants} className="flex items-end gap-[2px] h-6 mb-3 opacity-80 card-detail">
                {[
                  4, 8, 6, 12, 16, 10, 14, 24, 18, 12, 8, 14, 10, 6, 4,
                ].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#3585f6]"
                    style={{ height: `${h}px` }}
                  />
                ))}
                <span className="text-[#3585f6] text-[8px] tracking-widest ml-1 hidden sm:inline-block">
                  .....
                </span>
              </motion.div>

              {/* Name */}
              <h2
                className="text-2xl sm:text-3xl font-black uppercase leading-[1.1] tracking-tight text-white mb-2 team-display group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                style={{ wordBreak: "break-word" }}
              >
                {nameParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i !== nameParts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>

              {/* Role & Bio */}
              <motion.div variants={detailVariants} className="flex items-center gap-2 mb-1 border-t border-[#012f7c] pt-2 card-detail">
                <span className="text-[9px] sm:text-[10px] text-[#3585f6] group-hover:drop-shadow-[0_0_5px_rgba(53,133,246,0.8)] transition-all duration-300 uppercase tracking-widest">
                  {member.role}
                </span>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="LinkedIn profile"
                    aria-label={`${member.name} on LinkedIn`}
                    className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 border border-[#012f7c] hover:border-[#3585f6] hover:bg-[#3585f6]/10 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3585f6]" />
                  </a>
                )}
              </motion.div>
              <motion.div variants={detailVariants} className="text-[7px] sm:text-[8px] text-zinc-400 uppercase tracking-widest card-detail">
                PEOPLE // PROGRESS // PURPOSE
              </motion.div>

              {/* Cyber line graphic */}
              <motion.div variants={detailVariants} className="flex items-center gap-1 my-3 card-detail hidden sm:flex">
                <div className="w-3 h-[2px] bg-[#3585f6] skew-x-[-30deg]"></div>
                <div className="w-6 h-[2px] bg-[#3585f6] skew-x-[-30deg]"></div>
                <div className="w-1.5 h-[2px] bg-[#3585f6] skew-x-[-30deg]"></div>
                <div className="flex-1 h-[1px] bg-[#012f7c] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#3585f6]"></div>
                </div>
              </motion.div>
            </div>

            {/* Social Buttons */}
            <motion.div variants={detailVariants} className="flex gap-2 mt-auto card-detail">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-11 h-9 sm:w-14 sm:h-11 border border-[#012f7c] hover:border-[#3585f6] hover:bg-[#3585f6]/10 flex items-center justify-center pr-2.5 pb-2 sm:pr-4 sm:pb-3 transition-colors group/btn shrink-0"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#3585f6]" />
                  <ArrowUpRight className="absolute bottom-1 right-1 w-2.5 h-2.5 text-[#3585f6] opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                </a>
              )}
            </motion.div>
          </div>

          {/* Right Column (Image) */}
          <div className="w-[100px] sm:w-[140px] border border-[#012f7c] p-1 flex flex-col relative shrink-0">
            {/* Image Header */}
            <div className="flex justify-between items-center text-[7px] sm:text-[8px] text-[#3585f6] mb-1 px-0.5 uppercase tracking-widest font-bold">
              <span>////L</span>
              <span>// ONLINE</span>
            </div>
            <div className="relative w-full flex-1 overflow-hidden bg-[#000000] border border-[#012f7c]">
              <img
                src={member.image}
                className="w-full h-full object-cover object-center filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                alt={member.name}
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-[#012f7c]/10 mix-blend-overlay pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div variants={detailVariants} className="mt-3 sm:mt-4 pt-2 border-t border-[#012f7c] flex justify-between items-center text-[7px] sm:text-[8px] text-[#3585f6] uppercase tracking-widest font-bold relative z-10 card-detail">
          <span>A BRIGHTER TOMORROW, TOGETHER.</span>
          <Globe className="w-3 h-3 opacity-80" />
        </motion.div>
      </div>
    </motion.div>
  );
});

/* ---------------- Precomputed Core Teams ---------------- */
const executiveCoreMembers2026 = coreTeams["2026-2027"].map((member, idx) => ({
  ...member,
  codeName: `CORE_CMD_26_${String(idx + 1).padStart(2, "0")}`,
  nodeId: `ID: CR26-${String(idx + 1).padStart(2, "0")}`,
  accessLevel: idx < 2 ? "Root Level" : "Department Lead",
  status: "ACTIVE",
}));

const executiveCoreMembers2025 = coreTeams["2025-2026"].map((member, idx) => ({
  ...member,
  codeName: `CORE_CMD_25_${String(idx + 1).padStart(2, "0")}`,
  nodeId: `ID: CR25-${String(idx + 1).padStart(2, "0")}`,
  accessLevel: idx < 2 ? "Root Level" : "Department Lead",
  status: "ALUMNI_CORE",
}));

const CoreTeamGrid = React.memo(function CoreTeamGrid({ members, className, searchQuery, yearDigits }) {
  return (
    <div
      className={`team-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto ${className}`}
    >
      {members.map((member) => {
        // Search filter helper function for individual members
        const matchesSearch = () => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            (member.name && member.name.toLowerCase().includes(query)) ||
            (member.codeName && member.codeName.toLowerCase().includes(query)) ||
            (member.role && member.role.toLowerCase().includes(query)) ||
            (member.designation && member.designation.toLowerCase().includes(query)) ||
            (member.nodeId && member.nodeId.toLowerCase().includes(query)) ||
            (member.bio && member.bio.toLowerCase().includes(query))
          );
        };

        return (
          <MemberCard
            key={member.id}
            member={member}
            isMatch={matchesSearch()}
            yearDigits={yearDigits}
          />
        );
      })}
    </div>
  );
});

// Dropdown options
const yearOptions = [
  {
    id: "2026-2027",
    label: "2026-2027 Core",
    tag: "CURRENT ACTIVE TENURE",
    count: coreTeam2026_2027.length,
    status: "ACTIVE",
  },
  {
    id: "2025-2026",
    label: "2025-2026 Core",
    tag: "PREVIOUS TENURE",
    count: coreTeam2025_2026.length,
    status: "ARCHIVE",
  },
];

// Level 1: Faculties (Remains identical for both years)
const facultyMembers = [
  {
    id: "fac-hod",
    name: hodData.name,
    codeName: "FAC_DIRECTOR_01",
    role: "Head of Department",
    designation: hodData.designation,
    department: hodData.department,
    image: hodData.image.startsWith("../../public")
      ? hodData.image.replace("../../public", "")
      : hodData.image,
    bio: hodData.message,
    linkedin: hodData.linkedin,
    email: hodData.email,
    nodeId: "ID: HOD-DS",
    accessLevel: "Executive Oversight",
    status: "ACTIVE",
  },
  {
    id: "fac-incharge",
    name: facultyInchargeData.name,
    codeName: "FAC_MENTOR_02",
    role: "Faculty Incharge",
    designation: facultyInchargeData.designation,
    department: facultyInchargeData.department,
    image: facultyInchargeData.image.startsWith("../../public")
      ? facultyInchargeData.image.replace("../../public", "")
      : facultyInchargeData.image,
    bio: facultyInchargeData.message,
    linkedin: facultyInchargeData.linkedin,
    email: facultyInchargeData.email,
    nodeId: "ID: FIC-DS",
    accessLevel: "Chief Advisory",
    status: "ACTIVE",
  },
];

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026-2027");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalNodes =
    facultyMembers.length +
    (selectedYear === "2026-2027"
      ? executiveCoreMembers2026.length
      : executiveCoreMembers2025.length);

  // Search filter helper function
  const matchesSearch = (item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.codeName && item.codeName.toLowerCase().includes(query)) ||
      (item.role && item.role.toLowerCase().includes(query)) ||
      (item.designation && item.designation.toLowerCase().includes(query)) ||
      (item.nodeId && item.nodeId.toLowerCase().includes(query)) ||
      (item.bio && item.bio.toLowerCase().includes(query))
    );
  };

  const containerRef = useRef(null);



  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#000000] text-slate-100 pt-24 pb-24 px-4 sm:px-6 lg:px-8 team-primary font-light selection:bg-[#012f7c] selection:text-white relative overflow-hidden"
    >
      {/* Background Image and Overlays */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-85"
        style={{ backgroundImage: "url('/team/background.jpeg')" }}
      />
      <div className="fixed inset-0 bg-[#000000]/40 pointer-events-none z-0" />
      <div className="team-scanlines fixed inset-0 opacity-25 pointer-events-none z-30" />
      <div className="team-vignette fixed inset-0 z-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Harsh Hero Banner */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Top Pill with Cyber Horizontal Wings */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto mb-8 px-4"
          >
            {/* Left cyber guide line with terminal dot */}
            <div className="flex-1 flex items-center justify-end relative h-4">
              <div className="h-[1px] bg-[#3585f6] w-full relative">
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                <span className="absolute right-3 -top-2 w-8 h-[1px] bg-[#3585f6]/70 hidden sm:block" />
              </div>
            </div>

            {/* Center Pill Box */}
            <div className="relative px-5 py-2 bg-[#000000] border border-[#3585f6] shadow-[0_0_15px_rgba(53,133,246,0.35)] shrink-0">
              {/* Outer L-shaped corner brackets */}
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#3585f6]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#3585f6]" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#3585f6]" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#3585f6]" />

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6] inline-block" />
                <span className="text-white font-semibold">HARSH_SYS // COMMAND_DIRECTIVE</span>
                <span className="w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6] inline-block" />
              </div>
            </div>

            {/* Right cyber guide line with terminal dot */}
            <div className="flex-1 flex items-center justify-start relative h-4">
              <div className="h-[1px] bg-[#3585f6] w-full relative">
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                <span className="absolute left-3 -top-2 w-8 h-[1px] bg-[#3585f6]/70 hidden sm:block" />
              </div>
            </div>
          </motion.div>

          {/* Heading: ORGANISING COMMITTEE & Year */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="my-6"
          >
            {/* Primary Heading: Solid White with Deep Navy Bevel Shadow */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl team-display font-black text-white tracking-tight uppercase drop-shadow-[0_5px_0px_#002a76] filter drop-shadow-[0_0_30px_rgba(53,133,246,0.35)]"
            >
              ORGANISING COMMITTEE
            </motion.h1>

            {/* Year Sub-header in Electric Blue with Cyber Wings */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4"
            >
              {/* Left guide line + angled ticks */}
              <div className="flex items-center gap-2.5 flex-1 justify-end max-w-[120px] sm:max-w-[220px]">
                <div className="h-[1.5px] bg-[#3585f6] flex-1 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                </div>
                <div className="flex gap-1 text-[#3585f6] text-xs sm:text-base font-black italic tracking-tighter select-none font-mono">
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                </div>
              </div>

              {/* Year in Vibrant Electric Blue */}
              <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#3585f6] tracking-tight drop-shadow-[0_0_25px_rgba(53,133,246,0.65)] font-mono">
                {selectedYear === "2026-2027" ? "2026-27" : "2025-26"}
              </span>

              {/* Right guide line + angled ticks */}
              <div className="flex items-center gap-2.5 flex-1 justify-start max-w-[120px] sm:max-w-[220px]">
                <div className="flex gap-1 text-[#3585f6] text-xs sm:text-base font-black italic tracking-tighter select-none font-mono">
                  <span>/</span>
                  <span>/</span>
                  <span>/</span>
                </div>
                <div className="h-[1.5px] bg-[#3585f6] flex-1 relative">
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3585f6] shadow-[0_0_6px_#3585f6]" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Subtitle Directive HUD Box */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.35 }}
            className="relative max-w-4xl mx-auto mt-8 sm:mt-10 px-4"
          >
            {/* Top Outer Bracket Tabs */}
            <div className="absolute -top-1 left-6 sm:left-12 w-6 h-[2px] bg-[#3585f6] shadow-[0_0_8px_#3585f6] z-20 pointer-events-none" />
            <div className="absolute -top-1 right-6 sm:right-12 w-6 h-[2px] bg-[#3585f6] shadow-[0_0_8px_#3585f6] z-20 pointer-events-none" />

            {/* Chamfered HUD Outer Border */}
            <div
              className="relative p-[1.5px] shadow-[0_0_25px_rgba(53,133,246,0.35)]"
              style={{
                clipPath:
                  "polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)",
                background: "#3585f6",
              }}
            >
              {/* Chamfered Inner Black Container */}
              <div
                className="relative bg-[#000000] px-6 py-5 sm:px-12 sm:py-6 text-center"
                style={{
                  clipPath:
                    "polygon(21px 0, calc(100% - 21px) 0, 100% 21px, 100% calc(100% - 21px), calc(100% - 21px) 100%, 21px 100%, 0 calc(100% - 21px), 0 21px)",
                }}
              >
                {/* Accent ticks inside bottom-left chamfer */}
                <div className="absolute bottom-1.5 left-2 sm:left-3 flex gap-0.5 select-none pointer-events-none opacity-90 text-[#3585f6] text-[10px] font-black font-mono">
                  <span>/</span>
                  <span>/</span>
                  <span>/</span>
                </div>

                {/* Accent ticks along bottom center-left */}
                <div className="absolute bottom-1 left-1/4 sm:left-1/3 flex gap-0.5 select-none pointer-events-none opacity-80 text-[#3585f6] text-[10px] font-black font-mono hidden sm:flex">
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                </div>

                {/* Accent ticks along bottom center-right */}
                <div className="absolute bottom-1 right-1/4 sm:right-1/3 flex gap-0.5 select-none pointer-events-none opacity-80 text-[#3585f6] text-[10px] font-black font-mono hidden sm:flex">
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                </div>

                {/* Accent ticks inside bottom-right chamfer */}
                <div className="absolute bottom-1.5 right-2 sm:right-3 flex gap-0.5 select-none pointer-events-none opacity-90 text-[#3585f6] text-[10px] font-black font-mono">
                  <span>\</span>
                  <span>\</span>
                  <span>\</span>
                </div>

                {/* Accent meter dashes on right edge */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 select-none pointer-events-none opacity-70">
                  <span className="w-1 h-[2px] bg-[#3585f6]"></span>
                  <span className="w-1 h-[2px] bg-[#3585f6]"></span>
                  <span className="w-1 h-[2px] bg-[#3585f6]"></span>
                  <span className="w-1 h-[2px] bg-[#3585f6]"></span>
                </div>

                {/* Directive Text in Crisp White */}
                <p className="team-body font-light text-xs sm:text-sm text-slate-200 uppercase tracking-widest leading-relaxed">
                  OFFICIAL DIRECTORY OF FACULTY LEADERSHIP &amp; EXECUTIVE CORE COMMAND.
                  <br />
                  STRUCTURAL ISOLATION COMPLETE. {totalNodes} VERIFIED COMMAND NODES.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= LEVEL 1: FACULTIES ================= */}
        <section className="my-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex items-center gap-4 mb-10"
          >
            <motion.div
              variants={scaleIn}
              className="h-3.5 w-3.5 bg-[#3585f6] shadow-[0_0_8px_#3585f6]"
            />
            <motion.h2
              variants={slideInLeft}
              className="team-display text-lg sm:text-xl font-bold text-white uppercase tracking-widest px-6 py-2 bg-[#000000] border-2 border-[#3585f6] shadow-[0_0_20px_rgba(53,133,246,0.3)]"
            >
              [ LEVEL 1 // FACULTIES ]
            </motion.h2>
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
              }}
              style={{ originX: 0 }}
              className="flex-1 h-1 bg-[repeating-linear-gradient(90deg,#012f7c,#012f7c_8px,transparent_8px,transparent_16px)]"
            />
          </motion.div>

          <motion.div className="team-card-grid grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {facultyMembers.map((member) => {
              const isMatch = matchesSearch(member);
              return (
                <MemberCard
                  key={member.id}
                  member={member}
                  isMatch={isMatch}
                  yearDigits={selectedYear.startsWith("2026") ? "26" : "25"}
                />
              );
            })}
          </motion.div>
        </section>

        {/* Industrial Cyber Interstitial Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ originX: 0 }}
          className="w-full h-1 bg-[repeating-linear-gradient(90deg,#3585f6,#3585f6_8px,transparent_8px,transparent_16px)] my-16 shadow-[0_0_12px_rgba(53,133,246,0.3)] opacity-80"
        />

        {/* ================= LEVEL 2: CORE ================= */}
        <section className="my-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="flex items-center gap-4"
            >
              <motion.div
                variants={scaleIn}
                className="h-3.5 w-3.5 bg-[#3585f6] shadow-[0_0_8px_#3585f6]"
              />
              <motion.h2
                variants={slideInLeft}
                className="team-display text-lg sm:text-xl font-bold text-white uppercase tracking-widest px-6 py-2 bg-[#000000] border-2 border-[#3585f6] shadow-[0_0_20px_rgba(53,133,246,0.3)]"
              >
                [ LEVEL 2 // EXECUTIVE CORE : {selectedYear === "2026-2027" ? "2026-27" : "2025-26"} ]
              </motion.h2>
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
                }}
                style={{ originX: 0 }}
                className="hidden xl:block w-16 h-1 bg-[repeating-linear-gradient(90deg,#012f7c,#012f7c_8px,transparent_8px,transparent_16px)]"
              />
            </motion.div>

            {/* Controls: Dropdown + Quick Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Switcher Pills */}
              <div className="hidden sm:flex items-center bg-[#000000] border border-[#3585f6] p-1 shadow-[0_0_15px_rgba(53,133,246,0.25)]">
                <button
                  type="button"
                  onClick={() => setSelectedYear("2026-2027")}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    selectedYear === "2026-2027"
                      ? "bg-[#3585f6] text-black shadow-[0_0_12px_rgba(53,133,246,0.6)]"
                      : "text-zinc-400 hover:text-white hover:bg-[#012f7c]/40 border border-transparent"
                  }`}
                >
                  2026-2027 CORE
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear("2025-2026")}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    selectedYear === "2025-2026"
                      ? "bg-[#3585f6] text-black shadow-[0_0_12px_rgba(53,133,246,0.6)]"
                      : "text-zinc-400 hover:text-white hover:bg-[#012f7c]/40 border border-transparent"
                  }`}
                >
                  2025-2026 CORE
                </button>
              </div>

              {/* Cyber Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="relative flex items-center justify-between gap-3 px-4 py-2.5 bg-[#000000] border border-[#3585f6] hover:shadow-[0_0_15px_rgba(53,133,246,0.4)] text-white text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_10px_rgba(53,133,246,0.2)] cursor-pointer group"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <CornerBrackets className="border-[#3585f6] opacity-0 group-hover:opacity-100 transition-opacity" size="w-2.5 h-2.5" />
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedYear === "2026-2027" ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-[#3585f6] shadow-[0_0_8px_#3585f6]"}`} />
                    <span className="team-display text-xs text-white">
                      {selectedYear === "2026-2027" ? "2026-2027 CORE" : "2025-2026 CORE"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#3585f6] transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#000000] border-2 border-[#3585f6] shadow-[0_0_25px_rgba(53,133,246,0.35)] z-50 p-2"
                    role="listbox"
                  >
                    <CornerBrackets className="border-[#3585f6]" size="w-3 h-3" />
                    <div className="px-3 py-1.5 border-b border-[#012f7c] text-[8px] text-[#3585f6] tracking-widest uppercase mb-1 font-mono flex justify-between items-center">
                      <span>SYS // SELECT CORE TENURE</span>
                      <span>2 EDITIONS</span>
                    </div>
                    {yearOptions.map((opt) => {
                      const isSelected = selectedYear === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedYear(opt.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 my-1 transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? "bg-[#012f7c]/60 border-[#3585f6] text-white shadow-[0_0_12px_rgba(53,133,246,0.3)]"
                              : "border-transparent hover:border-[#012f7c] hover:bg-[#012f7c]/20 text-zinc-300"
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? "bg-[#3585f6]" : "bg-zinc-600"
                                }`}
                              />
                              <span className="team-display text-xs font-bold tracking-wide uppercase">
                                {opt.label}
                              </span>
                            </div>
                            <div className="text-[9px] text-[#bfdbfe]/70 tracking-widest uppercase mt-0.5 ml-3.5 font-mono">
                              {opt.tag} // {opt.count} NODES
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#3585f6] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full">
            {/* Render 2026-2027 Core */}
            <CoreTeamGrid
              members={executiveCoreMembers2026}
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                selectedYear === "2026-2027"
                  ? "opacity-100 visible translate-y-0 relative z-10"
                  : "opacity-0 invisible absolute top-0 left-0 right-0 -translate-y-4 pointer-events-none z-0"
              }`}
              searchQuery={searchQuery}
              yearDigits="26"
            />

            {/* Render 2025-2026 Core */}
            <CoreTeamGrid
              members={executiveCoreMembers2025}
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                selectedYear === "2025-2026"
                  ? "opacity-100 visible translate-y-0 relative z-10"
                  : "opacity-0 invisible absolute top-0 left-0 right-0 translate-y-4 pointer-events-none z-0"
              }`}
              searchQuery={searchQuery}
              yearDigits="25"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
