export { motion, AnimatePresence } from "framer-motion";

/** Respects the user's reduced-motion preference. */
export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
