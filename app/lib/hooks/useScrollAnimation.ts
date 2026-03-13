"use client";

import { useScroll, useTransform, useSpring, motion } from "framer-motion";

export function useScrollAnimation() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to animation values
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  return { opacity, y, scale };
}

export function useParallax(speed: number = 0.5) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value) => value * speed);
  
  return { y };
}

export function useScrollTriggeredAnimation() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to animation values
  const fadeIn = useTransform(scrollYProgress, (value: number) => value < 0.1 ? 0 : 1);
  const slideUp = useTransform(scrollYProgress, (value: number) => value < 0.1 ? 100 : 0);
  const scaleIn = useTransform(scrollYProgress, (value: number) => value < 0.1 ? 0.8 : 1);
  
  return { fadeIn, slideUp, scaleIn };
}
