"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const BRAND = "#430098";
const GREEN = "#3bd42e";
const EASE = [0.16, 1, 0.3, 1] as const;

type Word = { text: string; highlight?: boolean };
type Feature = { parts: Word[]; description: string };

const FEATURES: Feature[] = [
  {
    parts: [{ text: "Unique", highlight: true }, { text: "Method" }],
    description: "We use a unique 16 step system, learn more about our method here.",
  },
  {
    parts: [{ text: "Make" }, { text: "Friends", highlight: true }],
    description: "Meet like-minded students from all over the world, all motivated to learn and succeed. Be prepared to have fun and socialise!",
  },
  {
    parts: [{ text: "Class Size" }, { text: "Small", highlight: true }],
    description: "A maximum class size of 8 students, so we can spend time making sure we are helping you with any weaknesses.",
  },
  {
    parts: [{ text: "Learn From" }, { text: "Anywhere", highlight: true }],
    description: "Learn remotely from the comfort and convenience of your home or wherever you so choose.",
  },
  {
    parts: [{ text: "Native Tutors" }, { text: "Expert", highlight: true }],
    description: "Optimise your learning with experts who have experience teaching English all over the world. Get used to different accents with our diverse team.",
  },
  {
    parts: [{ text: "Learning" }, { text: "languages", highlight: true }],
    description: "Learning language takes dedication and time. Our lessons are longer because we know this is how long you need to make a real progression. You choose how much time to commit.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: EASE },
  }),
};

function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="spot-glow pointer-events-none absolute inset-0 z-0 rounded-[27px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), ${BRAND}14, transparent 65%)` }}
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
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative rounded-[28px] p-[1.5px]"
    >
      {children}
    </motion.div>
  );
}

export default function WhyUs() {
  return (
    <section id="why-us" className="relative isolate overflow-hidden bg-white py-24 sm:py-32 lg:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hidden sm:block absolute -top-1/3 left-[6%] h-[420px] w-[420px] rounded-full blur-[110px]" style={{ background: `${BRAND}17` }} />
        <div className="hidden sm:block absolute -bottom-1/4 right-[8%] h-[480px] w-[480px] rounded-full blur-[120px]" style={{ background: `${BRAND}12` }} />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `radial-gradient(${BRAND} 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
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
            className="mb-5 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ borderColor: `${BRAND}33`, color: BRAND, background: `${BRAND}0d` }}
          >
            Our Advantage
          </span>
          <h2 className="text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            WHY <span style={{ color: BRAND }}>YO ENGLISH</span>?
          </h2>
          <span aria-hidden="true" className="mt-6 h-1 w-16 rounded-full" style={{ background: GREEN }} />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FEATURES.map((feature, i) => (
            <RevealCard key={feature.parts.map((p) => p.text).join(" ")} index={i}>
              <span aria-hidden="true" className="absolute inset-0 rounded-[28px] bg-neutral-200/80" />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: GREEN }}
              />
              <SpotlightCard className="flex h-full flex-col items-center overflow-hidden rounded-[27px] bg-white p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_28px_56px_-16px_rgba(59,212,46,0.25)] sm:items-start sm:text-left">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-4 z-0 select-none font-black text-neutral-100"
                  style={{ fontSize: 46, lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="relative z-10 text-lg font-semibold text-neutral-900 sm:text-xl">
                  {feature.parts.map((part, idx) => (
                    <span key={idx}>
                      <span style={part.highlight ? { color: BRAND } : undefined}>{part.text}</span>
                      {idx < feature.parts.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h3>
                <p className="relative z-10 mt-3 text-[15px] leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </SpotlightCard>
            </RevealCard>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative left-1/2 mt-20 w-screen -translate-x-1/2 overflow-hidden py-5 lg:mt-24"
        style={{ background: `linear-gradient(90deg, ${BRAND}, #5c1ec9, ${BRAND})` }}
      >
        <div className="marquee-mask flex overflow-hidden">
          <MarqueeTrack />
          <MarqueeTrack aria-hidden="true" />
        </div>
        <style jsx>{`
          .marquee-mask {
            -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
            mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          }
          :global(.yo-marquee-track) {
            animation: yoMarquee 26s linear infinite;
          }
          :global(.marquee-mask:hover .yo-marquee-track) {
            animation-play-state: paused;
          }
          @keyframes yoMarquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-100%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            :global(.yo-marquee-track) {
              animation: none;
            }
          }
        `}</style>
      </motion.div>
    </section>
  );
}

function MarqueeTrack(props: React.HTMLAttributes<HTMLDivElement>) {
  const items = Array.from({ length: 6 });
  return (
    <div {...props} className="yo-marquee-track flex shrink-0 items-center gap-10 pr-10">
      {items.map((_, i) => (
        <div key={i} className="flex shrink-0 items-center gap-10">
          <span className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Fluency Begins Today!
          </span>
          <svg width="64" height="24" viewBox="0 0 64 24" fill="none" aria-hidden="true" className="shrink-0 text-[#3bd42e]">
            <path
              d="M2 12c4-8 8-8 12 0s8 8 12 0 8-8 12 0 8 8 12 0 8-8 12 0"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}