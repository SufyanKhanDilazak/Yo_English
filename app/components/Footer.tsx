"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, ArrowRight, Phone, Mail, PlayCircle } from "lucide-react";

/* -----------------------------------------------------------------------
 * Brand tokens
 * ---------------------------------------------------------------------*/
const BRAND_BG = "#7c5996";
const BRAND_GREEN = "#3bd42e"; // same accent used across the rest of the site

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

/* -----------------------------------------------------------------------
 * Real, full-color brand marks — plain inline SVG, so there's no extra
 * icon-pack dependency to install and nothing that can go missing at
 * build time. React.useId() keeps gradient ids collision-safe.
 * ---------------------------------------------------------------------*/
function InstagramIcon({ className }: { className?: string }) {
  const gradientId = React.useId();
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Instagram">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="35%" stopColor="#FF543E" />
          <stop offset="65%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5E00C8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gradientId})`} />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="#fff" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="YouTube">
      <rect x="1" y="5" width="22" height="14" rx="5" fill="#FF0000" />
      <path d="M10 8.5 16 12l-6 3.5v-7Z" fill="#fff" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  const notePath =
    "M16.6 9.5c-1.2-.8-2-2.1-2.1-3.6h-2.2v10.2a2.1 2.1 0 1 1-1.5-2v-2.2a4.3 4.3 0 1 0 3.7 4.2V10c.8.6 1.8 1 2.9 1V8.8c-.3 0-.6 0-.8-.1v.8Z";
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="TikTok">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#000" />
      <path d={notePath} fill="#25F4EE" transform="translate(-0.4,-0.4)" />
      <path d={notePath} fill="#FE2C55" transform="translate(0.4,0.4)" />
      <path d={notePath} fill="#fff" />
    </svg>
  );
}

/* -----------------------------------------------------------------------
 * Back-to-top button
 * ---------------------------------------------------------------------*/
function BackToTopButton() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:-translate-y-0.5 sm:right-8 sm:top-8 sm:h-12 sm:w-12"
      style={{ color: BRAND_GREEN }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

/* -----------------------------------------------------------------------
 * Footer
 * ---------------------------------------------------------------------*/
export default function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const year = new Date().getFullYear();

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    // TODO: wire this up to your newsletter provider, e.g.
    // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: BRAND_BG }}>
      <BackToTopButton />

      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-14 sm:px-8 sm:pt-14 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 md:gap-8 md:text-left"
        >
          {/* Brand column */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="inline-flex rounded-xl bg-white px-4 py-2">
              <Image
                src="/Logo.png"
                alt="Yo English"
                width={120}
                height={40}
                className="h-8 w-auto sm:h-9"
              />
            </div>

            <div className="space-y-1.5 text-sm text-white/85 sm:text-[15px]">
              <a
                href="tel:+447552254877"
                className="flex items-center justify-center gap-2 transition-colors hover:text-white md:justify-start"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                +44 7552254877
              </a>
              <a
                href="mailto:hello@yoenglish.education"
                className="flex items-center justify-center gap-2 transition-colors hover:text-white md:justify-start"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                hello@yoenglish.education
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
              <a
                href="/contact"
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: BRAND_GREEN }}
              >
                Contact Us
              </a>
              <a
                href="/book-a-demo"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-white/80"
              >
                <PlayCircle className="h-4 w-4" />
                Book a Free Demo
              </a>
            </div>
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col items-center gap-3 md:items-end md:text-right">
            <p className="text-base font-semibold text-white sm:text-lg">Course updates</p>

            {subscribed ? (
              <p className="text-sm text-white/80">You&apos;re on the list — thanks!</p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                noValidate
                className="flex w-full max-w-xs items-center overflow-hidden rounded-full bg-white/95 pr-1"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get product updates"
                  className="h-11 w-full bg-transparent px-4 text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: BRAND_GREEN }}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Bottom row — socials, legal links, and copyright, always centered
           as a unit (not split left/right) at every breakpoint */}
        <div className="mt-10 flex flex-col items-center gap-5 border-t border-white/15 pt-6 sm:gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white transition-transform hover:-translate-y-0.5"
            >
              <InstagramIcon className="h-[22px] w-[22px]" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white transition-transform hover:-translate-y-0.5"
            >
              <YoutubeIcon className="h-[22px] w-[22px]" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white transition-transform hover:-translate-y-0.5"
            >
              <TiktokIcon className="h-[22px] w-[22px]" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70 sm:text-sm">
            {LEGAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
            <span className="text-white/50">© {year} Yo English Academy. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

