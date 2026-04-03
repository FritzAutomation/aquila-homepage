"use client";

import { motion } from "framer-motion";
import { BarChart3, Smartphone, Link2, FileText } from "lucide-react";
import { SectionWrapper } from "../ui";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Dashboards",
    description: "See your entire shop floor at a glance. Live KPIs, machine status, and order tracking in one view.",
    color: "bg-emerald/10 text-emerald",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Production data on any device, anywhere. Managers stay connected from the floor to the front office.",
    color: "bg-navy/10 text-navy",
  },
  {
    icon: Link2,
    title: "Seamless Integration",
    description: "Connect to ERP, CAD, and machine controls. One unified system instead of disconnected silos.",
    color: "bg-emerald/10 text-emerald",
  },
  {
    icon: FileText,
    title: "Custom Reports",
    description: "Build the reports you need, schedule them automatically, and distribute to the right people.",
    color: "bg-navy/10 text-navy",
  },
];

export default function Features() {
  return (
    <SectionWrapper background="white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-navy mb-4">
            Why Manufacturers Choose Aquila
          </h2>
          <p className="text-lg text-slate max-w-md">
            Purpose-built tools that solve real problems on the shop floor — not another generic software platform.
          </p>
        </motion.div>

        {/* Right — 2x2 offset grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12, type: "spring", stiffness: 100 }}
              className={`p-6 rounded-2xl border border-slate-light/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${index % 2 === 1 ? "sm:translate-y-6" : ""}`}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold font-display text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-slate text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
