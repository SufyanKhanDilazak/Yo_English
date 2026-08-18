"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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

/* -----------------------------------------------------------------------
 * Class Details Component
 * ---------------------------------------------------------------------*/
export default function ClassDetails() {
  return (
    <section id="class-details" className="relative w-full overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* Ambient background blobs - extremely subtle */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#430098]/[0.03] blur-[120px]" />
        <div className="absolute -right-40 bottom-1/4 h-[550px] w-[550px] rounded-full bg-[#3bd42e]/[0.03] blur-[130px]" />
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
            {/* Using a standard aspect ratio. Removed all styling classes. */}
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
            <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Class <span className="text-[#430098]">Details</span>
            </h2>

            {/* Modern UI Pills (Centered on mobile) */}
            <div className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-start">
              {CLASS_BADGES.map((badge) => (
                <motion.span
                  key={badge}
                  variants={popIn}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#430098]/15 bg-[#430098]/[0.03] px-5 py-2.5 text-sm font-semibold text-[#430098] backdrop-blur-sm sm:text-base"
                >
                  <span className="h-2 w-2 rounded-full bg-[#3bd42e]" />
                  {badge}
                </motion.span>
              ))}
            </div>

            {/* Large Readable Paragraph (Centered on mobile) */}
            <motion.p
              variants={slideInRight}
              className="max-w-xl text-xl leading-relaxed text-neutral-600 sm:text-2xl lg:text-3xl lg:leading-relaxed"
            >
              Pay for the full period upfront and get{" "}
              <span className="font-bold text-[#430098]">10% discount</span>. 
              Each period is 3 months. There are 4 periods a year.
            </motion.p>

            {/* Minimalist Divider (Centered on mobile) */}
            <motion.div 
              variants={popIn} 
              className="mt-12 h-1.5 w-24 origin-center rounded-full bg-[#3bd42e] md:origin-left" 
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}