"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SectionWrapper, Card } from "../ui";

const caseStudies = [
  {
    company: "ASCO Power Technologies",
    result: "75% reduction in programming time",
    description: "Streamlined sheet metal nesting and production tracking",
    image: "/images/asco.jpg",
    href: "/case-studies/asco",
  },
  {
    company: "Hillphoenix Inc.",
    result: "Integrated JETCAM nesting across multiple work centers",
    description: "Unified production visibility across facilities",
    image: "/images/hillphoenix.jpg",
    href: "/case-studies/hillphoenix",
  },
];

export default function CaseStudies() {
  return (
    <SectionWrapper background="light" divider="angle">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy/10 text-navy text-sm font-medium rounded-full mb-4">
          Case Studies
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-navy mb-4">
          Success Stories
        </h2>
        <p className="text-lg text-slate max-w-2xl mx-auto">
          See how leading manufacturers transformed their operations
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.company}
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
          >
            <Card className="h-full" accent="navy">
              {/* Case Study Image */}
              <div className="rounded-xl aspect-video overflow-hidden mb-6">
                <Image
                  src={study.image}
                  alt={study.company}
                  width={600}
                  height={338}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-navy mb-2">
                {study.company}
              </h3>
              <p className="text-emerald font-semibold mb-2">{study.result}</p>
              <p className="text-slate mb-4">{study.description}</p>
              <a
                href={study.href}
                className="inline-flex items-center gap-2 text-navy font-medium hover:text-emerald transition-colors"
              >
                Read Case Study
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <a
          href="/case-studies"
          className="inline-flex items-center gap-2 text-navy font-medium hover:text-emerald transition-colors"
        >
          View All Case Studies
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
