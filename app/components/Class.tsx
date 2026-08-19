"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import StrokeText from "../../components/Text";

/* -----------------------------------------------------------------------
 * Palette — continues the cascading pastel system from the other
 * sections: BG here is the lilac that WhyUs used as its ACCENT, so the
 * two sections read as one connected story rather than isolated blocks.
 * ACCENT_DEEP exists only for the StrokeText stroke on "Details" — pure
 * ACCENT is close in lightness to BG, so a plain gold fill at large size
 * would read as washed-out; the deeper stroke gives it a defined edge
 * while the fill itself stays exactly the gold you asked for.
 * ---------------------------------------------------------------------*/
const BG = "#D2C7E5";
const ACCENT = "#F2D894";
const ACCENT_DEEP = "#C9A227"; // stroke-only — keeps the gold fill legible at headline size
const INK = "#171717";

/* -----------------------------------------------------------------------
 * Framer Motion Variants — Premium GPU-accelerated easing
 * ---------------------------------------------------------------------*/
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const popIn = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const CLASS_BADGES = [
  "Charged monthly",
  "Minimum 1 month",
  "Continuous enrolment",
];

// Inline treatment for the "10% discount" phrase sitting inside the body
// paragraph — same legibility fix as the headline (gold fill, thin dark
// stroke) but sized down since it's running text, not a display word.
const goldInlineText: React.CSSProperties = {
  color: ACCENT,
  WebkitTextStroke: "0.4px rgba(23, 23, 23, 0.35)",
  textShadow: "0 1px 1px rgba(23, 23, 23, 0.12)",
};

/* -----------------------------------------------------------------------
 * Heading — same two-tone StrokeText pattern as WhyUs's "WHY YO ENGLISH?"
 * and Courses's "OUR COURSES": two StrokeText instances side by side
 * ("Class" in ink, "Details" in gold), mounted only once the heading
 * scrolls into view so `trigger="mount"` fires at the right moment.
 * ---------------------------------------------------------------------*/
function ClassHeading() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4, margin: "0px 0px -80px 0px" });

  return (
    <div
      ref={ref}
      className="mb-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
      style={{ minHeight: 84 }}
    >
      {isInView && (
        <>
          <StrokeText
            text="Class"
            strokeColor={INK}
            fillColor={INK}
            strokeWidth={2.2}
            drawDuration={3.2}
            fillDelay={0.4}
            stagger={0.08}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={68}
            fontWeight={800}
            letterSpacing={-2}
            reverse={false}
          />
          <StrokeText
            text="Details"
            strokeColor={ACCENT_DEEP}
            fillColor={ACCENT}
            strokeWidth={2.2}
            drawDuration={3.2}
            fillDelay={0.4}
            stagger={0.08}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={68}
            fontWeight={800}
            letterSpacing={-2}
            reverse={false}
          />
        </>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------
 * Class Details Component
 * ---------------------------------------------------------------------*/
export default function ClassDetails() {
  return (
    <section
      id="class-details"
      className="relative w-full overflow-hidden py-20 sm:py-24 lg:py-32"
      style={{ backgroundColor: BG }}
    >
      {/* Ambient background blobs — kept faint so they read as soft light,
          not a competing tint, against the already-saturated lilac bg. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div
          className="absolute -right-40 bottom-1/4 h-[550px] w-[550px] rounded-full blur-[130px]"
          style={{ background: `${ACCENT}30` }}
        />
      </div>

      {/* Immersive Edge-to-Edge Container for Desktop */}
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-16 xl:px-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 xl:gap-32"
        >
          {/* Left Side: Raw, plain image (No borders, shadows, or overlays) */}
          <motion.div variants={slideInLeft} className="relative w-full">
            <div className="relative w-full md:w-[90%] lg:w-[85%]">
              <Image
                src="/Class.png"
                alt="Students engaging in a language class"
                width={554}
                height={680}
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="h-auto w-full"
                quality={90}
              />
            </div>
          </motion.div>

          {/* Right Side: Content (Centered on mobile, left-aligned on desktop) */}
          <motion.div
            variants={slideInRight}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            {/* Premium Heading */}
            <ClassHeading />

            {/* Modern UI Pills (Centered on mobile) — dark, legible text;
                gold reserved for the dot and border so the label itself
                never drops below a readable contrast. */}
            <div className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-start">
              {CLASS_BADGES.map((badge) => (
                <motion.span
                  key={badge}
                  variants={popIn}
                  className="inline-flex items-center gap-2.5 rounded-full border bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] sm:text-base"
                  style={{ borderColor: `${ACCENT_DEEP}55` }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                  {badge}
                </motion.span>
              ))}
            </div>

            {/* Large Readable Paragraph (Centered on mobile) */}
            <motion.p
              variants={slideInRight}
              className="max-w-xl text-xl leading-relaxed text-neutral-700 sm:text-2xl lg:text-3xl lg:leading-relaxed"
            >
              Pay for the full period upfront and get{" "}
              <span className="font-bold" style={goldInlineText}>
                10% discount
              </span>
              . Each period is 3 months. There are 4 periods a year.
            </motion.p>

            {/* Minimalist Divider (Centered on mobile) */}
            <motion.div
              variants={popIn}
              className="mt-12 h-1.5 w-24 origin-center rounded-full md:origin-left"
              style={{ background: ACCENT }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}