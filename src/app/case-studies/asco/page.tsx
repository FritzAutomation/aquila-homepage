"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, ArrowRight, Quote, Factory, Clock, TrendingUp } from "lucide-react";
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
  "Manual programming consuming excessive engineering time",
  "Inefficient material utilization in sheet metal nesting",
  "Limited visibility into production scheduling",
  "Difficulty coordinating between CAD/CAM and shop floor",
];

const solutions = [
  "Implemented DMM System for real-time production tracking",
  "Integrated advanced nesting software with CAD/CAM workflow",
  "Automated programming processes for sheet metal operations",
  "Connected shop floor systems with engineering department",
];

const results = [
  { metric: "75%", label: "Reduction in Programming Time", icon: Clock },
  { metric: "Significant", label: "Material Savings", icon: TrendingUp },
  { metric: "Improved", label: "Production Visibility", icon: Factory },
];

export default function ASCOCaseStudyPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="ASCO Power Technologies"
          subtitle="How a leading power management manufacturer reduced programming time by 75%"
          breadcrumb={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "ASCO Power Technologies", href: "/case-studies/asco" },
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
                  <div className="text-4xl md:text-5xl font-bold text-navy mb-2">
                    {result.metric === "75%" ? (
                      <><AnimatedCounter value={75} suffix="%" /></>
                    ) : (
                      result.metric
                    )}
                  </div>
                  <p className="text-slate">{result.label}</p>
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
              <h2 className="text-3xl font-bold text-navy mb-6">About ASCO Power Technologies</h2>
              <p className="text-lg text-slate mb-4">
                ASCO Power Technologies is a leading U.S. manufacturer specializing in power management
                solutions. Based in New Holland, Pennsylvania, ASCO produces critical power transfer
                switches, load banks, and related equipment for industries worldwide.
              </p>
              <p className="text-lg text-slate">
                With demanding production requirements and complex sheet metal fabrication processes,
                ASCO needed a solution that could streamline their CAD/CAM operations while maintaining
                the precision their products demand.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/images/asco.jpg"
                alt="ASCO Power Technologies Facility"
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
                Before partnering with The Aquila Group, ASCO faced significant bottlenecks in their
                sheet metal fabrication process. Programming time was consuming valuable engineering
                resources, limiting their ability to respond quickly to production demands.
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
                The Aquila Group implemented a comprehensive solution combining the DMM System with
                advanced nesting software integration, transforming ASCO&apos;s sheet metal operations.
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

        {/* Quote */}
        <SectionWrapper>
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
                &quot;Part fabrication has greatly improved as a result of the integrated real-time
                scheduling and dynamic nesting. The DMM System gives us complete visibility into
                our production process.&quot;
              </blockquote>
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-semibold">RU</span>
                </div>
                <div>
                  <p className="font-semibold">Robert Unruh</p>
                  <p className="text-white/60">New Holland, Pennsylvania</p>
                </div>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Results Detail */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">The Results</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              The implementation delivered measurable improvements across ASCO&apos;s operations
            </p>
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
                    <h3 className="text-xl font-bold text-navy mb-4">Efficiency Gains</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">75% reduction in programming time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Faster response to production changes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Improved material utilization</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">Operational Benefits</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Real-time production visibility</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Streamlined CAD/CAM workflow</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-slate">Better coordination across departments</span>
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
