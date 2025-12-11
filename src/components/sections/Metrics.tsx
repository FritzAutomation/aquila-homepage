"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionWrapper } from "../ui";

const metrics = [
  {
    value: 75,
    suffix: "%",
    label: "Reduction in Programming Time",
    source: "ASCO Power Technologies",
  },
  {
    value: 29,
    suffix: "",
    label: "Years Serving Manufacturers",
    subtext: "Since 1996",
    source: null,
  },
  {
    value: 100,
    suffix: "+",
    label: "Manufacturing Facilities",
    source: null,
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const startTime = Date.now();

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quart for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * value));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <SectionWrapper background="white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Proven Results
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-5xl md:text-6xl font-bold text-navy mb-3">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
            </div>
            <p className="text-lg text-slate font-medium">{metric.label}</p>
            {"subtext" in metric && metric.subtext && (
              <p className="text-sm text-slate-light mt-1">{metric.subtext}</p>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-slate-light mt-8"
      >
        * Results from ASCO Power Technologies case study
      </motion.p>
    </SectionWrapper>
  );
}
