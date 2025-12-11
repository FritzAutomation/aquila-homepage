"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Footer } from "@/components/layout";
import { Button, SectionWrapper } from "@/components/ui";

export default function ArticlePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Article Header */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-light-gray to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-slate hover:text-navy transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Link>

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-medium">
                  Case Study
                </span>
                <span className="text-slate flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  February 2021
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Focus on CAD/CAM: Packing a Punch
              </h1>

              <p className="text-xl text-slate">
                ASCO Power Technologies achieves 75% reduction in programming time with new nesting software implementation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-lg text-slate leading-relaxed mb-6">
                ASCO Power Technologies, a leading U.S. power management product manufacturer,
                has achieved remarkable operational improvements through the implementation of
                new nesting software solutions. The results speak for themselves: a 75% reduction
                in programming time and significant increases in overall efficiency.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Challenge</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Like many manufacturers, ASCO faced the challenge of optimizing their sheet metal
                fabrication processes. Programming time for nesting operations was consuming
                valuable resources and limiting throughput potential.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Solution</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Working with The Aquila Group, ASCO implemented advanced nesting software that
                automates and optimizes the programming process. The new system intelligently
                arranges parts on sheet metal to minimize waste while dramatically reducing the
                time required to create efficient cutting programs.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Results</h2>
              <div className="bg-light-gray rounded-2xl p-8 my-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald mb-2">75%</div>
                    <div className="text-slate">Reduction in Programming Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald mb-2">↑</div>
                    <div className="text-slate">Increased Overall Efficiency</div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate leading-relaxed mb-6">
                The implementation has transformed ASCO&apos;s fabrication operations, allowing them
                to process more jobs in less time while maintaining the high quality standards
                their customers expect.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">About ASCO Power Technologies</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                ASCO Power Technologies is a global leader in power management solutions,
                providing critical power equipment to customers worldwide. Their products
                help ensure reliable power for hospitals, data centers, and other facilities
                where power continuity is essential.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 p-8 bg-navy rounded-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Optimize Your Operations?
              </h3>
              <p className="text-white/80 mb-6">
                See how The Aquila Group can help you achieve similar results.
              </p>
              <Button href="/contact">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
