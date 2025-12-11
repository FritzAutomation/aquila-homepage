"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Factory, Layers, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, SectionWrapper } from "@/components/ui";

const caseStudies = [
  {
    company: "ASCO Power Technologies",
    industry: "Power Management",
    result: "75% Reduction in Programming Time",
    description:
      "ASCO Power Technologies, a leading U.S. manufacturer of power management solutions, partnered with The Aquila Group to streamline their sheet metal fabrication process and gain real-time production visibility.",
    image: "/images/asco.jpg",
    href: "/case-studies/asco",
    highlights: [
      { icon: Clock, label: "75% faster programming" },
      { icon: TrendingUp, label: "Improved material utilization" },
      { icon: Factory, label: "Real-time visibility" },
    ],
  },
  {
    company: "Hillphoenix Inc.",
    industry: "Commercial Refrigeration",
    result: "Multi-Center Integration",
    description:
      "Hillphoenix, a leading manufacturer of commercial refrigeration systems, integrated JETCAM nesting across multiple punch and laser work centers to increase profits and unify production visibility.",
    image: "/images/hillpheonix.jpg",
    href: "/case-studies/hillphoenix",
    highlights: [
      { icon: Layers, label: "Multiple work centers" },
      { icon: Factory, label: "Unified visibility" },
      { icon: TrendingUp, label: "Increased profitability" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Case Studies"
          subtitle="See how leading manufacturers transformed their operations with The Aquila Group"
        />

        <SectionWrapper>
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="relative aspect-video lg:aspect-auto lg:min-h-[300px]">
                      <Image
                        src={study.image}
                        alt={study.company}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="text-sm text-emerald font-medium mb-2">
                        {study.industry}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
                        {study.company}
                      </h2>
                      <p className="text-lg text-emerald font-semibold mb-4">
                        {study.result}
                      </p>
                      <p className="text-slate mb-6">{study.description}</p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        {study.highlights.map((highlight) => (
                          <div
                            key={highlight.label}
                            className="flex items-center gap-2 text-sm text-slate"
                          >
                            <highlight.icon className="w-4 h-4 text-emerald" />
                            {highlight.label}
                          </div>
                        ))}
                      </div>

                      <Link
                        href={study.href}
                        className="inline-flex items-center gap-2 text-navy font-medium hover:text-emerald transition-colors"
                      >
                        Read Full Case Study
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Be Our Next Success Story?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Join the ranks of leading manufacturers who have transformed their
                operations with The Aquila Group.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald text-white rounded-lg font-medium hover:bg-emerald/90 transition-colors"
                >
                  Request a Demo
                </Link>
                <Link
                  href="/products/dmm"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Learn About DMM
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
