import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";
import { GlowGradient } from "../shared/GlowGradient";

export const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1.5, 0.2]);
  const translateY = useTransform(scrollYProgress, [0, 1], [1.5, 0.4]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.4]);

  return (
    <div className="relative flex h-[80vh] w-full items-center justify-center">
      <GlowGradient className="top-2 -left-10 h-48 w-48 rotate-12 bg-opacity-50 bg-gradient-to-r from-pink-600 to-purple-600 opacity-70 md:top-56 md:left-28" />
      <GlowGradient className="-bottom-7 left-4 h-48 w-48 rotate-45 bg-opacity-60 bg-gradient-to-r from-pink-600 to-purple-600 delay-1000 md:bottom-7 md:right-52" />
      <GlowGradient className="right-2 bottom-4 h-60 w-60 rotate-45 bg-opacity-60 bg-gradient-to-r from-pink-600 to-purple-600 delay-[2500ms] md:left-7 md:top-72" />
      <GlowGradient className="left-2 bottom-56 h-60 w-60 rotate-45 bg-opacity-60 bg-gradient-to-r from-fuchsia-600 to-indigo-600 delay-700 md:right-7 md:bottom-72" />
      <GlowGradient className="right-12 top-2 h-60 w-60 rotate-180 bg-opacity-60 bg-gradient-to-r from-fuchsia-600 to-indigo-600 delay-500 md:right-24 md:top-7" />
      <GlowGradient className="right-14 top-16 h-60 w-60 bg-indigo-600 bg-opacity-50 md:right-44 md:top-36" />

      <motion.div
        style={{
          scale,
        }}
      >
        <motion.h1
          className="-mt-24 bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-6xl font-bold uppercase text-transparent drop-shadow-lg sm:mt-0 sm:text-8xl md:text-9xl"
          style={{ translateY, opacity }}
        >
          This
          <br />
          <span className="sm:ml-24">Place</span>
        </motion.h1>
      </motion.div>
    </div>
  );
};
