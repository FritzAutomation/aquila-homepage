"use client";

import { motion } from "framer-motion";
import { BarChart3, Smartphone, Link2, FileText } from "lucide-react";
import { SectionWrapper } from "../ui";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Dashboards",
    description: "See your entire shop floor at a glance.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Production data on any device, anywhere.",
  },
  {
    icon: Link2,
    title: "Seamless Integration",
    description: "Connect to ERP, CAD, and machine controls.",
  },
  {
    icon: FileText,
    title: "Custom Reports",
    description: "Build the reports you need, scheduled.",
  },
];

export default function Features() {
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
          Why Manufacturers Choose Aquila
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-light-gray rounded-2xl flex items-center justify-center mx-auto mb-6">
              <feature.icon className="w-8 h-8 text-navy" />
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">
              {feature.title}
            </h3>
            <p className="text-slate">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
