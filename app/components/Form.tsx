"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  HelpCircle,
  Users,
  MessageSquare,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import StrokeText from "../../components/Text";

const WHATSAPP_NUMBER = "10000000000";
const WHATSAPP_PREFILL = "Hi! I'd like to know more.";

const TOPIC_LABELS: Record<string, string> = {
  schedule: "Class Schedule",
  pricing: "Pricing & Discounts",
  enrolment: "Enrolment",
  other: "Something Else",
};

const AUDIENCE_LABELS: Record<string, string> = {
  student: "A Student",
  parent: "A Parent",
  teacher: "A Teacher / Tutor",
  other: "Other",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const popIn = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="WhatsApp">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        fill="#fff"
        d="M23.47 8.52A10.26 10.26 0 0 0 16.02 5.3c-5.68 0-10.3 4.61-10.3 10.29 0 1.81.48 3.58 1.38 5.14L5.6 26.7l6.12-1.6a10.3 10.3 0 0 0 4.3.95h.01c5.68 0 10.3-4.61 10.3-10.29a10.2 10.2 0 0 0-2.86-7.24Zm-7.45 15.8h-.01a8.6 8.6 0 0 1-4.36-1.2l-.31-.18-3.63.95.97-3.54-.2-.32a8.55 8.55 0 0 1-1.32-4.55c0-4.73 3.86-8.58 8.6-8.58 2.3 0 4.46.9 6.08 2.52a8.51 8.51 0 0 1 2.52 6.07c0 4.74-3.86 8.58-8.6 8.58Zm4.72-6.43c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.51-1.43-1.77-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.4-.8-1.91-.21-.5-.42-.43-.58-.44l-.5-.01c-.17 0-.45.06-.68.32-.24.26-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.79 2.74 4.35 3.83.61.26 1.08.42 1.45.54.61.19 1.16.17 1.6.1.49-.07 1.53-.62 1.74-1.23.22-.6.22-1.11.15-1.22-.06-.11-.23-.17-.49-.3Z"
      />
    </svg>
  );
}

const fieldClass =
  "h-12 w-full rounded-2xl border border-[#D2C7E5]/30 bg-white pl-11 pr-4 text-[15px] text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#D2C7E5] focus:ring-4 focus:ring-[#D2C7E5]/25";

const selectClass =
  "h-12 w-full appearance-none rounded-2xl border border-[#D2C7E5]/30 bg-white pl-11 pr-11 text-[15px] text-neutral-800 outline-none transition-colors focus:border-[#D2C7E5] focus:ring-4 focus:ring-[#D2C7E5]/25";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  topic: string;
  audience: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  topic: "",
  audience: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

function useSectionInView<T extends HTMLElement>() {
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
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView } as const;
}

export default function ContactForm() {
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [status, setStatus] = React.useState<Status>("idle");
  const { ref: sectionRef, inView } = useSectionInView<HTMLElement>();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="relative w-full overflow-hidden bg-[#D3EADA] py-20 sm:py-24 lg:py-32"
    >
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-16 xl:px-24">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#D3EADA] shadow-[0_20px_50px_-24px_rgba(178,201,187,0.55)] sm:rounded-[2.5rem]"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-2"
          >
            <motion.div variants={slideInLeft} className="relative flex md:items-end md:justify-start">
              <Image
                src="/Form.png"
                alt="A team member ready to welcome you"
                width={554}
                height={680}
                priority
                sizes="(max-width: 768px) 100vw, 35vw"
                quality={90}
                className="h-auto w-full md:max-w-sm lg:max-w-md xl:max-w-lg"
              />
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="flex h-full w-full flex-col items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-10 lg:px-14 lg:py-14 xl:px-16 xl:py-16"
            >
              <div
                role="heading"
                aria-level={2}
                aria-label="We're Just a Click Away!"
                className="flex max-w-md items-center justify-center sm:max-w-none"
                style={{ minHeight: 56 }}
              >
                {inView && (
                  <span aria-hidden="true">
                    <StrokeText
                      text="We're Just a Click Away!"
                      strokeColor="#D2C7E5"
                      fillColor="#D2C7E5"
                      strokeWidth={2.2}
                      drawDuration={3.2}
                      fillDelay={0.4}
                      stagger={0.06}
                      ease="power2.out"
                      trigger="mount"
                      fillMode="wipe"
                      fontSize={40}
                      fontWeight={800}
                      letterSpacing={-1.5}
                      reverse={false}
                    />
                  </span>
                )}
              </div>
              <p className="mt-3 text-base font-medium text-[#D2C7E5]/80 sm:text-lg">
                Join our team
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-10 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-[#3bd42e]/30 bg-[#3bd42e]/5 px-6 py-12 text-center"
                >
                  <CheckCircle2 className="h-10 w-10 text-[#3bd42e]" />
                  <p className="text-lg font-semibold text-neutral-900">
                    Thanks — your message is on its way.
                  </p>
                  <p className="text-sm text-neutral-500">We&apos;ll get back to you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-4 rounded-full border border-[#D2C7E5]/50 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-[#D2C7E5]/20"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xl space-y-4 text-left" noValidate>
                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="name" className="sr-only">Name</label>
                    <User className={iconClass} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Name"
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="phone" className="sr-only">Phone number</label>
                    <Phone className={iconClass} />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone number"
                      autoComplete="tel"
                      required
                      value={values.phone}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="email" className="sr-only">Your email</label>
                    <Mail className={iconClass} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      autoComplete="email"
                      required
                      value={values.email}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="topic" className="sr-only">
                      What would you like to ask about?
                    </label>
                    <HelpCircle className={iconClass} />
                    <select
                      id="topic"
                      name="topic"
                      required
                      value={values.topic}
                      onChange={handleChange}
                      className={`${selectClass} ${values.topic === "" ? "text-neutral-400" : "text-neutral-800"}`}
                    >
                      <option value="" disabled hidden>
                        What would you like to ask about?
                      </option>
                      {Object.entries(TOPIC_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  </motion.div>

                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="audience" className="sr-only">Are you...?</label>
                    <Users className={iconClass} />
                    <select
                      id="audience"
                      name="audience"
                      required
                      value={values.audience}
                      onChange={handleChange}
                      className={`${selectClass} ${values.audience === "" ? "text-neutral-400" : "text-neutral-800"}`}
                    >
                      <option value="" disabled hidden>
                        Are you...?
                      </option>
                      {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  </motion.div>

                  <motion.div variants={popIn} className="relative">
                    <label htmlFor="message" className="sr-only">Message</label>
                    <MessageSquare className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-neutral-400" />
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message"
                      rows={4}
                      required
                      value={values.message}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#D2C7E5]/30 bg-white pl-11 pr-4 pt-3.5 text-[15px] text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#D2C7E5] focus:ring-4 focus:ring-[#D2C7E5]/25"
                    />
                  </motion.div>

                  <motion.button
                    variants={popIn}
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-[#D2C7E5] text-base font-bold text-neutral-900 shadow-[0_10px_25px_-8px_rgba(210,199,229,0.6)] transition-colors duration-300 hover:bg-[#C3B3DD] disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </motion.button>

                  {status === "error" && (
                    <p className="text-center text-sm font-medium text-red-500">
                      Something went wrong — please try again.
                    </p>
                  )}
                </form>
              )}

              <motion.a
                variants={popIn}
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 underline decoration-[#D2C7E5]/60 underline-offset-4 transition-colors hover:text-[#8B6FA8]"
              >
                <WhatsAppIcon className="h-6 w-6" />
                click to contact us by WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        #contact-form button,
        #contact-form a {
          -webkit-tap-highlight-color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          #contact-form * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}