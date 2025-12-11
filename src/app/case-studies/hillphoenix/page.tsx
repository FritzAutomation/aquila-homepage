"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, ArrowRight, Quote, Factory, Layers, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
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

const challenges = [
  "Managing multiple punch and laser work centers",
  "Coordinating nesting across different machine types",
  "Need for unified production visibility across facilities",
  "Optimizing material usage across diverse equipment",
];

const solutions = [
  "Integrated JETCAM nesting across all work centers",
  "Unified multiple Amada punch and laser machines",
  "Connected Salvagnini laser work center to central system",
  "Partnered with NestONE Solutions for implementation",
];

const results = [
  { metric: "Multi", label: "Work Centers Integrated", sublabel: "Punch & Laser", icon: Layers },
  { metric: "Unified", label: "Production Visibility", sublabel: "Across Facilities", icon: Factory },
  { metric: "Increased", label: "Profitability", sublabel: "Measurable ROI", icon: TrendingUp },
];

export default function HillphoenixCaseStudyPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Hillphoenix Inc."
          subtitle="Integrating JETCAM nesting across multiple work centers to increase profits"
          breadcrumb={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "Hillphoenix Inc.", href: "/case-studies/hillphoenix" },
          ]}
        />

        {/* Hero Stats */}
        <SectionWrapper>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {results.map((result, index) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center p-8">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <result.icon className="w-8 h-8 text-emerald" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-navy mb-1">
                    {result.metric}
                  </div>
                  <p className="text-slate font-medium">{result.label}</p>
                  <p className="text-slate-light text-sm">{result.sublabel}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Company Overview */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-navy mb-6">About Hillphoenix Inc.</h2>
              <p className="text-lg text-slate mb-4">
                Hillphoenix is a leading manufacturer of commercial refrigeration systems, serving
                grocery stores, convenience stores, and food service operations across North America.
              </p>
              <p className="text-lg text-slate">
                With extensive sheet metal fabrication requirements and multiple work centers,
                Hillphoenix needed a solution that could unify their nesting operations and provide
                visibility across their entire manufacturing process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/images/hillpheonix.jpg"
                alt="Hillphoenix Manufacturing Facility"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Challenge & Solution */}
        <SectionWrapper background="light">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-navy mb-6">The Challenge</h2>
              <p className="text-slate mb-6">
                Hillphoenix operated multiple punch and laser work centers from different manufacturers,
                creating complexity in their nesting and production scheduling processes.
              </p>
              <ul className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.li
                    key={challenge}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <span className="text-slate">{challenge}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-navy mb-6">The Solution</h2>
              <p className="text-slate mb-6">
                The Aquila Group partnered with NestONE Solutions to implement JETCAM nesting
                software across all of Hillphoenix&apos;s work centers, creating a unified system.
              </p>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <motion.li
                    key={solution}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald flex-shrink-0 mt-0.5" />
                    <span className="text-slate">{solution}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Equipment Details */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Integrated Equipment</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Multiple work centers unified under a single nesting and tracking system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 h-full">
                <h3 className="text-xl font-bold text-navy mb-4">Amada Work Centers</h3>
                <p className="text-slate mb-4">
                  Multiple Amada punch and laser work centers integrated into a unified
                  nesting workflow, enabling optimal material utilization across machines.
                </p>
                <ul className="space-y-2 text-sm text-slate">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    Punch machines
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    Laser cutting systems
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    Unified job scheduling
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 h-full">
                <h3 className="text-xl font-bold text-navy mb-4">Salvagnini Laser</h3>
                <p className="text-slate mb-4">
                  Salvagnini laser work center brought into the same integrated system,
                  providing seamless coordination across all equipment types.
                </p>
                <ul className="space-y-2 text-sm text-slate">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    High-speed laser cutting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    Automated material handling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    Real-time production tracking
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Quote */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-navy text-white rounded-2xl p-8 md:p-12 relative">
              <Quote className="w-12 h-12 text-emerald/30 absolute top-6 left-6" />
              <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed relative z-10 pl-8">
                &quot;The integration of JETCAM nesting across our work centers has given us
                unprecedented visibility into our production process and measurably increased
                our profitability.&quot;
              </blockquote>
              <div className="pl-8">
                <p className="font-semibold">Hillphoenix Manufacturing Team</p>
                <p className="text-white/60">Commercial Refrigeration Leader</p>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Results Summary */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Key Outcomes</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">Operational Improvements</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Unified nesting across all machines</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Improved material utilization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Streamlined production scheduling</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">Business Impact</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Increased profitability</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Better production visibility</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Reduced coordination overhead</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for Similar Results?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                See how The Aquila Group can transform your manufacturing operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button href="/products/dmm" variant="secondary" size="lg">
                  Learn About DMM
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
