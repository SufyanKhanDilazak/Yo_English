"use client";

import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";
import { motion, MotionConfig, useInView, type Variants } from "framer-motion";
import {
  Compass,
  GraduationCap,
  Globe2,
  Languages,
  Layers,
  Users,
  type LucideIcon,
} from "lucide-react";
import StrokeText from "../../components/Text";
import TextLoop from "../../components/Marquee";

const BG = "#D3EADA";
const ACCENT = "#D2C7E5";
const INK = "#2A2A2E";
const EASE = [0.16, 1, 0.3, 1] as const;

type Word = { text: string; highlight?: boolean };
type Feature = { parts: Word[]; description: string; icon: LucideIcon };

const FEATURES: Feature[] = [
  {
    parts: [{ text: "Unique", highlight: true }, { text: "Method" }],
    description: "We use a unique 16 step system, learn more about our method here.",
    icon: Compass,
  },
  {
    parts: [{ text: "Make" }, { text: "Friends", highlight: true }],
    description:
      "Meet like-minded students from all over the world, all motivated to learn and succeed. Be prepared to have fun and socialise!",
    icon: Users,
  },
  {
    parts: [{ text: "Class Size" }, { text: "Small", highlight: true }],
    description:
      "A maximum class size of 8 students, so we can spend time making sure we are helping you with any weaknesses.",
    icon: Layers,
  },
  {
    parts: [{ text: "Learn From" }, { text: "Anywhere", highlight: true }],
    description: "Learn remotely from the comfort and convenience of your home or wherever you so choose.",
    icon: Globe2,
  },
  {
    parts: [{ text: "Native Tutors" }, { text: "Expert", highlight: true }],
    description:
      "Optimise your learning with experts who have experience teaching English all over the world. Get used to different accents with our diverse team.",
    icon: GraduationCap,
  },
  {
    parts: [{ text: "Learning" }, { text: "languages", highlight: true }],
    description:
      "Learning language takes dedication and time. Our lessons are longer because we know this is how long you need to make a real progression. You choose how much time to commit.",
    icon: Languages,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: EASE },
  }),
};

function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="spot-glow pointer-events-none absolute inset-0 z-0 rounded-[31px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(460px circle at var(--x, 50%) var(--y, 50%), ${ACCENT}55, transparent 65%)`,
        }}
      />
      {children}
      <style jsx>{`
        @media (hover: none) {
          .spot-glow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function RevealCard({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      whileHover={{ y: -10, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative rounded-[32px]"
    >
      {children}
    </motion.div>
  );
}

// StrokeText's `trigger="mount"` fires the moment it's mounted, not when it
// scrolls into the viewport. This wrapper delays mounting StrokeText until
// its own container crosses into view, so `trigger="mount"` effectively
// becomes "mount on scroll-into-view".
//
// The CSS filter that used to live here (saturate/contrast/drop-shadow) has
// been removed. contrast() pushes values away from mid-gray — since ACCENT
// is already a light color, that filter was pushing it toward white, which
// is what was washing the heading out. Rendering the pure hex with no
// filter is the fix.
function InViewHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4, margin: "0px 0px -80px 0px" });

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-4" style={{ minHeight: 92 }}>
      {isInView && (
        <>
          <StrokeText
            text="WHY"
            strokeColor={INK}
            fillColor={INK}
            strokeWidth={2.2}
            drawDuration={3.2}
            fillDelay={0.4}
            stagger={0.08}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={72}
            fontWeight={800}
            letterSpacing={-2}
            reverse={false}
          />
          <StrokeText
            text="YO ENGLISH?"
            strokeColor={ACCENT}
            fillColor={ACCENT}
            strokeWidth={2.2}
            drawDuration={3.2}
            fillDelay={0.4}
            stagger={0.08}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={72}
            fontWeight={800}
            letterSpacing={-2}
            reverse={false}
          />
        </>
      )}
    </div>
  );
}

export default function WhyUs() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="why-us"
        className="relative isolate overflow-hidden py-24 sm:py-32 lg:py-36"
        style={{ backgroundColor: BG }}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="hidden sm:block absolute -top-1/3 left-[6%] h-[420px] w-[420px] rounded-full blur-[110px]"
            style={{ background: `${ACCENT}45` }}
          />
          <div
            className="hidden sm:block absolute -bottom-1/4 right-[8%] h-[480px] w-[480px] rounded-full blur-[120px]"
            style={{ background: `${ACCENT}35` }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(${ACCENT} 1.5px, transparent 1.5px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-10 lg:px-16 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-center text-center"
          >
            <span
              className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600"
              style={{ borderColor: ACCENT, background: "#FFFFFF" }}
            >
              Our Advantage
            </span>

            <InViewHeading />

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-6 h-1.5 w-16 origin-center rounded-full"
              style={{ background: ACCENT }}
            />
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <RevealCard key={`${i}-${feature.parts[0].text}`} index={i}>
                  <SpotlightCard className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-[32px] bg-white p-9 text-left ring-1 ring-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-500 group-hover:shadow-[0_36px_70px_-28px_rgba(210,199,229,0.65)] sm:min-h-[320px] sm:p-10">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-8 top-7 z-0 select-none font-black leading-none tabular-nums"
                      style={{ fontSize: 52, color: ACCENT }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: ACCENT }}
                    >
                      <Icon className="h-6 w-6" style={{ color: INK }} strokeWidth={2} />
                    </div>

                    <h3 className="relative z-10 text-[22px] font-semibold leading-tight tracking-tight text-neutral-900 sm:text-2xl">
                      {feature.parts.map((part, idx) => (
                        <span key={idx}>
                          <span style={part.highlight ? { color: ACCENT } : undefined}>{part.text}</span>
                          {idx < feature.parts.length - 1 ? " " : ""}
                        </span>
                      ))}
                    </h3>
                    <p className="relative z-10 mt-4 text-[15px] leading-relaxed text-neutral-500">
                      {feature.description}
                    </p>
                  </SpotlightCard>
                </RevealCard>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative left-1/2 mt-20 w-screen -translate-x-1/2 lg:mt-24"
        >
          <TextLoop
            text="Fluency Begins Today"
            shape="wave"
            speed={90}
            direction="forward"
            separator="✦"
            curviness={90}
            fontSize={46}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            color={INK}
            ribbon
            ribbonColor={ACCENT}
            ribbonWidth={86}
            pauseOnHover={false}
          />
        </motion.div>
      </section>
    </MotionConfig>
  );
}