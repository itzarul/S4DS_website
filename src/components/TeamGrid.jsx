import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import TeamCard from "./TeamCard";

// Deterministic scatter origin per card index — spread across the whole
// screen at varying depth (z), not just 4 corners, and tilted in 3D
// (rotateX/rotateY) rather than flat-rotated. Not random, so it's the
// same intentional layout every load.
function getScatterOrigin(index) {
  const spots = [
    { x: -820, y: -420, z: -700, rotateX: 22, rotateY: -35 },
    { x: 760, y: -480, z: -500, rotateX: -18, rotateY: 30 },
    { x: -900, y: 120, z: -900, rotateX: 10, rotateY: -40 },
    { x: 880, y: 60, z: -350, rotateX: -12, rotateY: 28 },
    { x: -600, y: 480, z: -600, rotateX: -20, rotateY: -22 },
    { x: 650, y: 520, z: -450, rotateX: 18, rotateY: 24 },
    { x: -300, y: -600, z: -800, rotateX: 26, rotateY: -12 },
    { x: 260, y: 600, z: -550, rotateX: -22, rotateY: 14 },
  ];
  const base = spots[index % spots.length];
  const jitter = ((index * 53) % 60) - 30; // -30..30, deterministic
  return {
    x: base.x + jitter,
    y: base.y + jitter / 2,
    z: base.z,
    rotateX: base.rotateX + jitter / 6,
    rotateY: base.rotateY + jitter / 4,
  };
}

function AssembleCard({ member, index, scrollYProgress, reduceMotion }) {
  const origin = useMemo(() => getScatterOrigin(index), [index]);

  // Depth decides pace: far-back cards (more negative z) start later and
  // travel through more of the scroll, so the whole thing reads as a
  // slow drift-in rather than everything snapping at once.
  const depthFactor = (900 - Math.abs(origin.z)) / 900; // 0 (far) .. 1 (near)
  const start = 0.05 + (index % 6) * 0.05 + (1 - depthFactor) * 0.15;
  const end = Math.min(start + 0.55, 0.98);

  const x = useTransform(scrollYProgress, [start, end], [origin.x, 0]);
  const y = useTransform(scrollYProgress, [start, end], [origin.y, 0]);
  const z = useTransform(scrollYProgress, [start, end], [origin.z, 0]);
  const rotateX = useTransform(
    scrollYProgress,
    [start, end],
    [origin.rotateX, 0],
  );
  const rotateY = useTransform(
    scrollYProgress,
    [start, end],
    [origin.rotateY, 0],
  );
  const opacity = useTransform(scrollYProgress, [start, start + 0.15], [0, 1]);
  const blur = useTransform(scrollYProgress, [start, end], [6, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  if (reduceMotion) {
    return (
      <div className="h-full">
        <TeamCard member={member} withEntrance={false} />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateX,
        rotateY,
        opacity,
        filter,
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      <TeamCard member={member} withEntrance={false} />
    </motion.div>
  );
}

export default function TeamGrid({ coreMembers, juniorMembers }) {
  const [filter, setFilter] = useState("all");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const allMembers = [...coreMembers, ...juniorMembers];
  const filteredMembers =
    filter === "all"
      ? allMembers
      : filter === "core"
        ? coreMembers
        : juniorMembers;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Longer pin = slower, more cinematic assemble. Scales with roster size.
  const pinVh = Math.min(420, 220 + allMembers.length * 14);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-8 font-subheading">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 text-xs font-subheading tracking-wider uppercase transition-all cursor-pointer border-2 ${
            filter === "all"
              ? "bg-[#065cc8] border-[#c0efff] text-white shadow-[3px_3px_0px_0px_#000]"
              : "bg-[#05103a] border-[#065cc8] text-[#6dccec] hover:bg-[#065cc8] hover:text-white shadow-[3px_3px_0px_0px_#065cc8]"
          }`}
        >
          All Members ({allMembers.length})
        </button>
        <button
          onClick={() => setFilter("core")}
          className={`px-5 py-2 text-xs font-subheading tracking-wider uppercase transition-all cursor-pointer border-2 ${
            filter === "core"
              ? "bg-[#065cc8] border-[#c0efff] text-white shadow-[3px_3px_0px_0px_#000]"
              : "bg-[#05103a] border-[#065cc8] text-[#6dccec] hover:bg-[#065cc8] hover:text-white shadow-[3px_3px_0px_0px_#065cc8]"
          }`}
        >
          Core Team ({coreMembers.length})
        </button>
        <button
          onClick={() => setFilter("junior")}
          className={`px-5 py-2 text-xs font-subheading tracking-wider uppercase transition-all cursor-pointer border-2 ${
            filter === "junior"
              ? "bg-[#065cc8] border-[#c0efff] text-white shadow-[3px_3px_0px_0px_#000]"
              : "bg-[#05103a] border-[#065cc8] text-[#6dccec] hover:bg-[#065cc8] hover:text-white shadow-[3px_3px_0px_0px_#065cc8]"
          }`}
        >
          Junior Core ({juniorMembers.length})
        </button>
      </div>

      {/* Scroll-pinned assemble grid */}
      <div
        ref={sectionRef}
        style={{ height: reduceMotion ? "auto" : `${pinVh}vh` }}
        className="relative"
      >
        <div
          className="sticky top-0 h-screen flex items-center overflow-hidden"
          style={{ perspective: 1600 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filteredMembers.map((member, index) => (
              <AssembleCard
                key={member.id}
                member={member}
                index={index}
                scrollYProgress={scrollYProgress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
