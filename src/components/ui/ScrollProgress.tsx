"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  color?: string;
  height?: number;
  position?: "top" | "bottom";
  showPercentage?: boolean;
}

export default function ScrollProgress({
  color = "bg-emerald",
  height = 3,
  position = "top",
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (showPercentage) {
      const unsubscribe = scrollYProgress.on("change", (latest) => {
        setPercentage(Math.round(latest * 100));
      });
      return () => unsubscribe();
    }
  }, [scrollYProgress, showPercentage]);

  return (
    <>
      <motion.div
        className={`fixed ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 ${color} origin-left z-[100]`}
        style={{
          scaleX,
          height: `${height}px`,
        }}
      />
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: percentage > 5 ? 1 : 0 }}
          className={`fixed ${position === "top" ? "top-4" : "bottom-4"} right-4 bg-navy text-white text-xs font-medium px-2 py-1 rounded-full z-[100]`}
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
}
