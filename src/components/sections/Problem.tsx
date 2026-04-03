"use client";

import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";
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
    <SectionWrapper background="white" pattern="dots">
      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Left column — sticky heading */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-2 lg:sticky lg:top-32"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full mb-4">
            <XCircle className="w-3.5 h-3.5" />
            Common Pain Points
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-navy mb-6">
            The Challenge
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-6">
            Most manufacturers operate blind. Orders get lost between departments.
            Machines sit idle without anyone knowing. Shipping dates slip because
            no one saw the bottleneck coming.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 text-emerald font-medium hover:text-emerald-dark transition-colors"
          >
            See our solutions
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Right column — stacked problem cards */}
        <div className="lg:col-span-3 space-y-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.15, ease: "easeOut" }}
              className="bg-light-gray rounded-xl p-6 border border-slate-light/10 flex items-start gap-5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display text-navy mb-1">
                  {problem.title}
                </h3>
                <p className="text-slate">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
