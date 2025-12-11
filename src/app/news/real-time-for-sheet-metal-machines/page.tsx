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
                  Partnership
                </span>
                <span className="text-slate flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  August 2017
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Automation News: Real-Time For Sheet Metal Machines!
              </h1>

              <p className="text-xl text-slate">
                The Aquila Group partners with Opto 22 to deliver real-time OEE monitoring for manufacturing customers.
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
                To help its manufacturing customers integrate OEE measurements with Enterprise
                systems, The Aquila Group has implemented data visibility systems with Opto 22
                platforms, enabling real-time tracking of Overall Equipment Effectiveness across
                sheet metal machinery operations.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Partnership</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                The Aquila Group has partnered with Opto 22, a leader in industrial automation
                and IIoT (Industrial Internet of Things) technology, to bring powerful real-time
                monitoring capabilities to sheet metal manufacturers.
              </p>

              <div className="flex justify-center my-8">
                <Image
                  src="/images/OptoPartner_IoT_Certified_192x163.png"
                  alt="Opto 22 IoT Certified Partner"
                  width={192}
                  height={163}
                  className="rounded-lg"
                />
              </div>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Real-Time OEE Monitoring</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                The integrated solution provides manufacturers with immediate visibility into
                their equipment performance. By connecting sheet metal machines to enterprise
                systems, operators and managers can monitor OEE metrics in real-time, including:
              </p>

              <ul className="list-disc pl-6 mb-6 text-lg text-slate space-y-2">
                <li>Machine availability and uptime</li>
                <li>Performance efficiency</li>
                <li>Quality rates</li>
                <li>Downtime causes and duration</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Benefits for Manufacturers</h2>
              <div className="bg-light-gray rounded-2xl p-8 my-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">Real-Time</div>
                    <div className="text-slate text-sm">Data Visibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">Integrated</div>
                    <div className="text-slate text-sm">Enterprise Systems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">Actionable</div>
                    <div className="text-slate text-sm">Insights</div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate leading-relaxed mb-6">
                This partnership enables manufacturers to make data-driven decisions quickly,
                identify bottlenecks as they occur, and continuously improve their operations
                based on accurate, real-time information.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">About Opto 22</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Opto 22 develops and manufactures hardware and software for industrial
                automation, remote monitoring, and data acquisition. Their products bridge
                the gap between information technology and operational technology.
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
                Want Real-Time Visibility Into Your Operations?
              </h3>
              <p className="text-white/80 mb-6">
                Learn how Green Light Monitoring can transform your shop floor data into actionable insights.
              </p>
              <Button href="/products/green-light">
                Learn About Green Light
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
