"use client";

import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

/* -----------------------------------------------------------------------
 * Brand tokens — used inside the raw CSS block below (keyframes / hover
 * states that live outside Tailwind's static class scanner). Tailwind
 * utility classes elsewhere keep literal hex values on purpose: Tailwind's
 * compiler only picks up arbitrary-value classes it can see as plain
 * strings, so interpolating BRAND.* into a `bg-[...]` class would silently
 * drop the style in production.
 * ---------------------------------------------------------------------*/
const BRAND = {
  purple: "#430098",
  purpleDark: "#37017d",
  green: "#3bd42e",
} as const;

/* -----------------------------------------------------------------------
 * Data
 * ---------------------------------------------------------------------*/
export interface Plan {
  id: string;
  badgeText: string;
  title: string;
  hoursValue: string;
  hoursLabel: string;
  regFeeLabel: string;
  regFeeValue: string;
  price: string;
  priceUnit: string;
  featured?: boolean;
}

export interface CourseTab {
  id: string;
  label: string;
  plans: Plan[];
}

const CORE_PLANS: Plan[] = [
  {
    id: "3x-week",
    badgeText: "Recruitment is ongoing",
    title: "3 x 2 Hours Group Class Per Week",
    hoursValue: "24–26",
    hoursLabel: "hours per month",
    regFeeLabel: "Reg Fee / Materials",
    regFeeValue: "£50",
    price: "£420",
    priceUnit: "per month",
    featured: true,
  },
  {
    id: "2x-week",
    badgeText: "Recruitment is ongoing",
    title: "2 x 2 Hours Group Class Per Week",
    hoursValue: "16–18",
    hoursLabel: "hours per month",
    regFeeLabel: "Reg Fee / Materials",
    regFeeValue: "£50",
    price: "£310",
    priceUnit: "per month",
  },
  {
    id: "1x-week",
    badgeText: "Recruitment is ongoing",
    title: "1 x 2 Hours Group Class Per Week",
    hoursValue: "8–10",
    hoursLabel: "hours per month",
    regFeeLabel: "Reg Fee / Materials",
    regFeeValue: "£50",
    price: "£180",
    priceUnit: "per month",
  },
];

// NOTE: all four tabs currently point at the same CORE_PLANS array (this
// was already true in the source file). Swap in real per-category plans
// here whenever they're ready — the rest of the component doesn't need
// to change.
const COURSE_TABS: CourseTab[] = [
  { id: "courses", label: "Courses (3 months)", plans: CORE_PLANS },
  { id: "private", label: "Private Classes (all 1.5 hours)", plans: CORE_PLANS },
  { id: "exam", label: "Exam Classes", plans: CORE_PLANS },
  { id: "specialised", label: "Specialised", plans: CORE_PLANS },
];

/* -----------------------------------------------------------------------
 * Reveal-on-scroll — fires once, then disconnects. Runs once at mount
 * (not re-subscribed on every state change) and is intentionally cheap:
 * a single observer for the whole section, not one per card.
 * ---------------------------------------------------------------------*/
function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // Intentionally run once — re-subscribing on `inView` changes was
    // wasted work since the observer already disconnects itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView } as const;
}

/* -----------------------------------------------------------------------
 * Cursor-tracked glow — desktop-only "immersive" touch. Never attaches a
 * pointermove listener on touch devices, so it costs nothing on mobile.
 * ---------------------------------------------------------------------*/
function usePointerGlow<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const handleMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
        el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
        frame = 0;
      });
    };

    el.addEventListener("pointermove", handleMove);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/* -----------------------------------------------------------------------
 * Decorative wavy divider
 * ---------------------------------------------------------------------*/
function WavyDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-2.5 w-28", className)}
    >
      <path
        d="M0 5 C 5 0, 10 0, 15 5 S 25 10, 30 5 S 40 0, 45 5 S 55 10, 60 5 S 70 0, 75 5 S 85 10, 90 5 S 100 0, 105 5 S 115 10, 120 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -----------------------------------------------------------------------
 * Single plan card — memoized so carousel state changes (selected index,
 * arrow enable/disable) on mobile don't cascade into re-rendering every
 * card. Hover choreography lives in plain CSS gated behind
 * `(hover: hover) and (pointer: fine)` in the <style> block below, so
 * nothing ever gets stuck "hovered" after a tap on iOS/Android.
 * ---------------------------------------------------------------------*/
interface PlanCardProps {
  plan: Plan;
  index: number;
  inView: boolean;
  onSelect?: (plan: Plan) => void;
}

const PlanCard = React.memo(function PlanCard({ plan, index, inView, onSelect }: PlanCardProps) {
  const glowRef = usePointerGlow<HTMLDivElement>();

  return (
    <div
      className={cn(
        "h-full transition-[transform,opacity] duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: inView ? `${index * 90}ms` : "0ms" }}
    >
      <div
        ref={glowRef}
        className={cn(
          "plan-card relative flex h-full flex-col items-center overflow-hidden rounded-[28px] p-7 text-center sm:p-8 lg:rounded-[32px] lg:p-9",
          "transition-[transform,box-shadow] duration-300 ease-out",
          plan.featured
            ? "border-2 border-neutral-900 bg-white"
            : "border border-[#430098]/12 bg-white"
        )}
      >
        {/* cursor-tracked glow, desktop pointer only */}
        <span aria-hidden className="plan-card-glow" />

        {/* top accent — solid green only, no gradient */}
        <span
          aria-hidden
          className="plan-card-accent absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#3bd42e] transition-transform duration-500 ease-out"
        />

        {/* subtle green sweep on hover — contained, no bleeding */}
        <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out plan-card-sweep-wrap">
          <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#3bd42e]/[0.06] to-transparent" />
        </span>

        <div className="relative flex h-full w-full flex-col items-center">
          <Badge className="plan-card-badge mb-6 gap-1.5 rounded-full border-transparent bg-[#3bd42e] px-4 py-1.5 text-sm font-semibold text-neutral-900 transition-transform duration-300">
            <span aria-hidden className="plan-card-emoji text-base leading-none transition-transform duration-300">
              🚀
            </span>
            {plan.badgeText}
          </Badge>

          <h3 className="mb-6 min-h-[3.5rem] text-balance text-xl font-extrabold uppercase leading-snug tracking-tight text-neutral-900 sm:text-2xl">
            {plan.title}
          </h3>

          <ul className="mb-6 flex w-full max-w-[240px] flex-col items-center gap-2 text-[15px]">
            <li className="flex items-center justify-center gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#430098]" />
              <span>
                <span className="font-bold text-neutral-900">{plan.hoursValue}</span>{" "}
                <span className="text-neutral-500">{plan.hoursLabel}</span>
              </span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#430098]" />
              <span>
                <span className="text-neutral-500">{plan.regFeeLabel}:</span>{" "}
                <span className="font-bold text-neutral-900">{plan.regFeeValue}</span>
              </span>
            </li>
          </ul>

          <WavyDivider className="mb-6 text-neutral-300" />

          <div className="plan-card-price mb-7 transition-colors duration-300">
            <p className="text-4xl font-extrabold tracking-tight text-neutral-900 transition-colors duration-300">
              {plan.price}
            </p>
            <p className="text-sm font-medium text-[#430098]/80">{plan.priceUnit}</p>
          </div>

          <Button
            onClick={() => onSelect?.(plan)}
            className={cn(
              "plan-card-cta mt-auto w-full max-w-[200px] touch-manipulation rounded-full bg-[#430098] py-6 text-[15px] font-semibold text-white",
              "shadow-[0_10px_25px_-8px_rgba(67,0,152,0.5)] transition-[transform,box-shadow,background-color] duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430098] focus-visible:ring-offset-2",
              "motion-safe:active:scale-95"
            )}
          >
            <span className="inline-flex items-center gap-2">
              Submit A Request
              <ArrowRight className="plan-card-cta-arrow h-4 w-4 transition-transform duration-300" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
});
PlanCard.displayName = "PlanCard";

/* -----------------------------------------------------------------------
 * Plans layout — edge-to-edge on mobile, full-width grid on desktop
 * ---------------------------------------------------------------------*/
function PlansGroup({
  plans,
  inView,
  onSubmitRequest,
}: {
  plans: Plan[];
  inView: boolean;
  onSubmitRequest?: (plan: Plan) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div>
      {/* Desktop / tablet: edge-to-edge grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-3 md:items-stretch lg:gap-6 xl:gap-7">
        {plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} index={i} inView={inView} onSelect={onSubmitRequest} />
        ))}
      </div>

      {/* Mobile: edge-to-edge carousel */}
      <div className="relative md:hidden">
        <Carousel setApi={setApi} opts={{ align: "center", loop: false }} className="w-full">
          <CarouselContent className="-ml-3">
            {plans.map((plan, i) => (
              <CarouselItem key={plan.id} className="basis-[90%] pl-3">
                <PlanCard plan={plan} index={i} inView={inView} onSelect={onSubmitRequest} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button
          type="button"
          aria-label="Previous plan"
          onClick={() => api?.scrollPrev()}
          disabled={!canPrev}
          className={cn(
            "absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full",
            "border border-neutral-200 bg-white text-neutral-700 shadow-lg backdrop-blur-sm",
            "transition-colors duration-300 active:bg-[#430098] active:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430098] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-30"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next plan"
          onClick={() => api?.scrollNext()}
          disabled={!canNext}
          className={cn(
            "absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full",
            "border border-neutral-200 bg-white text-neutral-700 shadow-lg backdrop-blur-sm",
            "transition-colors duration-300 active:bg-[#430098] active:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430098] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-30"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-2">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              aria-label={`Go to ${plan.title}`}
              aria-current={i === selected ? "true" : undefined}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 touch-manipulation rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430098] focus-visible:ring-offset-2",
                i === selected ? "w-6 bg-[#430098]" : "w-2 bg-neutral-300 active:bg-neutral-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
 * Segmented-control tabs.
 *
 * Two class-based approaches (a JS-measured pill, then forced
 * `data-[state=active]:!bg-...` classes) both got visually overridden by
 * something in your base <TabsTrigger /> — most likely it ships its own
 * default active-state classes, and depending on how `cn()`/tailwind-merge
 * is set up in that file, or how Tailwind's cascade layers are ordered in
 * your build, those can end up beating a plain utility class regardless of
 * the `!` modifier.
 *
 * This version sets the active-state colors via the `style` prop instead
 * of Tailwind classes. Inline styles are second only to `!important` in
 * the CSS cascade — they win over *any* external stylesheet rule, so this
 * can't lose to whatever the base component is doing, short of that
 * component itself using `!important` internally (unusual for a UI
 * primitive). If you'd like this back to pure Tailwind classes for
 * consistency with the rest of your codebase, share your
 * `components/ui/tabs.tsx` and I can target the actual conflict directly
 * instead of overpowering it.
 * ---------------------------------------------------------------------*/
const TAB_COLORS = {
  activeBg: BRAND.green,
  activeBorder: "transparent",
  activeText: "#171717", // neutral-900, matches the on-green text used on plan badges
  activeShadow: "0 6px 16px -4px rgba(59, 212, 46, 0.55)",
  idleBg: "#ffffff",
  idleBorder: "#d4d4d4", // neutral-300
  idleText: "#404040", // neutral-700
  idleBorderHover: "#a3a3a3", // neutral-400
} as const;

function CourseTabs({ activeTab }: { activeTab: string }) {
  return (
    <TabsList
      aria-label="Course plan categories"
      className={cn(
        "mx-auto flex h-auto w-full max-w-3xl flex-wrap justify-center",
        "gap-2 bg-transparent p-0",
        "mb-16 sm:mb-14 sm:gap-3"
      )}
    >
      {COURSE_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "course-tab touch-manipulation rounded-full border font-semibold",
              "text-xs px-3.5 py-2 sm:text-sm sm:px-5 sm:py-2.5",
              "transition-[background-color,border-color,color,box-shadow] duration-300 ease-out",
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430098] focus-visible:ring-offset-2"
            )}
            style={{
              backgroundColor: isActive ? TAB_COLORS.activeBg : TAB_COLORS.idleBg,
              borderColor: isActive ? TAB_COLORS.activeBorder : TAB_COLORS.idleBorder,
              color: isActive ? TAB_COLORS.activeText : TAB_COLORS.idleText,
              boxShadow: isActive ? TAB_COLORS.activeShadow : "none",
            }}
          >
            {tab.label}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}

/* -----------------------------------------------------------------------
 * Courses section
 * ---------------------------------------------------------------------*/
export interface CoursesProps {
  onSubmitRequest?: (plan: Plan) => void;
}

export default function Courses({ onSubmitRequest }: CoursesProps) {
  const [activeTab, setActiveTab] = React.useState(COURSE_TABS[0].id);
  const { ref: sectionRef, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <section id="courses" className="relative w-full overflow-hidden bg-white">
      {/* Ambient background — contained, low opacity, no bleeding */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="courses-blob absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#430098]/[0.04] blur-[100px]" />
        <div className="courses-blob courses-blob-delay absolute -bottom-40 -right-24 h-[440px] w-[440px] rounded-full bg-[#3bd42e]/[0.04] blur-[110px]" />
      </div>

      <div ref={sectionRef} className="relative mx-auto max-w-7xl px-3 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-10">
        {/* Heading — "Our" stays neutral, "Courses" = purple #430098 */}
        <div
          className={cn(
            "mx-auto mb-10 max-w-2xl text-center transition-[transform,opacity] duration-700 ease-out sm:mb-12",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Our <span className="text-[#430098]">Courses</span>
          </h2>
          <div
            aria-hidden
            className={cn(
              "courses-underline mx-auto mt-4 h-1 w-16 origin-center rounded-full bg-[#430098]",
              inView && "courses-underline-grow"
            )}
          />
          <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Classes are unique, and we are far from traditional. We focus on
            conversation, drilling, pronunciation and self-discovery, by
            understanding WHY as well as how we use language.
          </p>
        </div>

        {/* Tabs + plans */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CourseTabs activeTab={activeTab} />

          {COURSE_TABS.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className={cn(
                "mt-0 focus-visible:outline-none focus-visible:ring-0",
                "motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:slide-in-from-bottom-2 motion-safe:data-[state=active]:duration-300"
              )}
            >
              <PlansGroup plans={tab.plans} inView={inView} onSubmitRequest={onSubmitRequest} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer note */}
        <p
          className={cn(
            "mt-14 text-center text-lg font-bold text-neutral-900 transition-opacity duration-700 sm:mt-16 sm:text-xl",
            inView ? "opacity-100" : "opacity-0"
          )}
        >
          Monthly Progress Reports, End of Course Test, to progress to the next level.
        </p>
      </div>

      <style>{`
        @keyframes coursesFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20px, -22px, 0) scale(1.04); }
        }
        @keyframes coursesGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .courses-blob {
          animation: coursesFloat 12s ease-in-out infinite;
        }
        .courses-blob-delay {
          animation-delay: -6s;
        }
        .courses-underline-grow {
          animation: coursesGrow 0.8s ease-out 0.3s both;
        }

        /* Remove tap-flash / 300ms delay on touch devices across this section */
        #courses button,
        #courses [role="tab"] {
          -webkit-tap-highlight-color: transparent;
        }

        /* Cursor-tracked glow, set via --glow-x/--glow-y in usePointerGlow */
        .plan-card-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: radial-gradient(220px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(59, 212, 46, 0.10), transparent 70%);
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        /* Elaborate hover choreography — real pointers only, so nothing
           gets stuck "hovered" after a tap on iOS/Android. */
        @media (hover: hover) and (pointer: fine) {
          .plan-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 22px 50px -18px rgba(59, 212, 46, 0.4);
          }
          .plan-card:hover .plan-card-glow { opacity: 1; }
          .plan-card:hover .plan-card-accent { transform: scaleX(1); }
          .plan-card:hover .plan-card-sweep-wrap { opacity: 1; }
          .plan-card:hover .plan-card-badge { transform: translateY(-2px); }
          .plan-card:hover .plan-card-emoji { transform: rotate(12deg); }
          .plan-card:hover .plan-card-price p:first-child { color: ${BRAND.purple}; }
          .plan-card-cta:hover {
            background-color: ${BRAND.purpleDark};
            box-shadow: 0 14px 32px -8px rgba(67, 0, 152, 0.65);
          }
          .plan-card-cta:hover .plan-card-cta-arrow { transform: translateX(4px); }
        }

        /* Light tactile feedback on touch instead of a hover state */
        @media (hover: none) {
          .plan-card:active {
            transform: scale(0.985);
            transition-duration: 150ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .courses-blob,
          .courses-underline-grow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}