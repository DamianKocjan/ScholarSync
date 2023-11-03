import { cx } from "class-variance-authority";
import React from "react";

interface GlowGradientProps {
  className?: string;
}

export const GlowGradient: React.FC<GlowGradientProps> = ({ className }) => (
  <div
    className={cx(
      "absolute animate-blob rounded-full mix-blend-multiply blur-2xl filter",
      className
    )}
  />
);
