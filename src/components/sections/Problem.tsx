"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { SectionWrapper } from "../ui";

const problems = [
  {
    title: "No real-time visibility",
    description: "Orders get lost between departments without anyone knowing.",
  },
  {
    title: "Manual tracking",
    description: "Paper-based systems lead to errors and delays.",
  },
  {
    title: "Siloed systems",
    description: "Disconnected software creates information gaps.",
  },
];

export default function Problem() {
  return (
    <SectionWrapper background="white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
          The Challenge
        </h2>
        <p className="text-lg text-slate leading-relaxed mb-12">
          Most manufacturers operate blind. Orders get lost between departments.
          Machines sit idle without anyone knowing. Shipping dates slip because
          no one saw the bottleneck coming.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-light-gray rounded-xl p-6 border border-slate-light/10"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">
              {problem.title}
            </h3>
            <p className="text-slate">{problem.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
