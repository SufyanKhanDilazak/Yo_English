"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Our Courses", href: "#courses" },
  { label: "Summer School", href: "#summer-school" },
  { label: "About Us", href: "#about" },
] as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Yo English home">
      <Image
        src="/Logo.png"
        alt="Yo English"
        width={160}
        height={44}
        priority
        className={compact ? "h-7 w-auto" : "h-8 w-auto sm:h-9"}
      />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);

  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-6">
      <motion.nav
        initial={prefersReducedMotion ? false : { y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "flex w-full max-w-[90rem] items-center justify-between rounded-full border border-black/5 bg-white/90 px-3 py-2 backdrop-blur-md transition-shadow duration-300 sm:px-5 sm:py-2.5 lg:px-7",
          scrolled
            ? "shadow-[0_8px_30px_rgba(141,104,168,0.18)]"
            : "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        {/* ===== Mobile bar: hamburger (left) — logo (centered) ===== */}
        <div className="relative flex w-full items-center justify-between lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  className="shrink-0 rounded-full text-neutral-700 hover:bg-neutral-100"
                />
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex w-[85vw] max-w-sm flex-col gap-0 rounded-r-3xl border-r-0 border-l-0 bg-white p-0"
            >
              <SheetHeader className="px-5 pb-3 pt-5">
                <SheetTitle className="flex items-center">
                  <Logo compact />
                </SheetTitle>
              </SheetHeader>

              <div className="h-px w-full bg-neutral-100" />

              <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-2">
                {NAV_LINKS.map((link, i) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i + 0.08, duration: 0.3, ease: "easeOut" }}
                      />
                    }
                  >
                    <Link
                      href={link.href}
                      className="block rounded-xl px-3 py-3.5 text-[15px] font-semibold text-neutral-800 transition-colors hover:bg-[#8d68a8]/10 hover:text-[#8d68a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d68a8]/40"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="border-t border-neutral-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Button
                      render={<Link href="#get-started" />}
                      nativeButton={false}
                      size="lg"
                      className="w-full rounded-full bg-[#430098] font-semibold text-white shadow-[0_6px_18px_rgba(141,104,168,0.35)] hover:bg-[#7c5996]"
                    />
                  }
                >
                  Get Started
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <div className="pointer-events-auto">
              <Logo compact />
            </div>
          </div>

          <div className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>

        {/* ===== Desktop bar ===== */}
        <div className="hidden w-full items-center justify-between lg:flex">
          <Logo />

          <ul
            className="relative flex items-center gap-1"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-[#8d68a8]/[0.08]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  onFocus={() => setHovered(link.href)}
                  className="relative z-10 block rounded-full px-4 py-2 text-[15px] font-medium text-neutral-700 transition-colors duration-200 hover:text-[#8d68a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d68a8]/40"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button
            render={<Link href="#get-started" />}
            nativeButton={false}
            className="rounded-full bg-[#430098] px-6 font-semibold text-white shadow-[0_6px_18px_rgba(141,104,168,0.4)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#7c5996] active:translate-y-0"
          >
            Get Started
          </Button>
        </div>
      </motion.nav>
    </header>
  );
}