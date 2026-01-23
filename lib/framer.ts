"use client";

/**
 * Framer Motion Client Wrapper
 * 
 * This file re-exports framer-motion components as a client boundary
 * to fix Next.js build errors with "export *" in client components.
 */

export {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
  useInView,
} from "framer-motion";

export type { Variants } from "framer-motion";
