"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
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
                  Industry News
                </span>
                <span className="text-slate flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  August 2017
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Manufacturing Information, Instructions, and Performance Metrics in Real Time
              </h1>

              <p className="text-xl text-slate">
                Bridging IT and operational technology to deliver real-time MES and OEE solutions for major manufacturers.
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
                Implementing manufacturing execution systems (MES) or enterprise resource planning
                (ERP) systems that also integrate overall equipment effectiveness (OEE) monitoring
                can be a daunting task. The Aquila Group has developed solutions that bridge the
                gap between IT and operational technology resources, making this integration
                seamless and effective.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Challenge</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Many manufacturers struggle with disconnected systems. Production data lives on
                the shop floor while business systems operate in the IT department. This disconnect
                leads to delayed decisions, incomplete information, and missed opportunities for
                improvement.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Aquila Group Approach</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                By leveraging Industrial Internet of Things (IIoT) technology, The Aquila Group
                enables manufacturers to access process improvement data in real time without
                disrupting current operations. This approach provides:
              </p>

              <ul className="list-disc pl-6 mb-6 text-lg text-slate space-y-2">
                <li>Real-time visibility into shop floor operations</li>
                <li>Integration between MES, ERP, and OEE systems</li>
                <li>Actionable data for continuous improvement</li>
                <li>Minimal disruption to existing workflows</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Trusted by Industry Leaders</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                The Aquila Group serves customers ranging from smaller manufacturers to large
                industrial companies. Notable customers include:
              </p>

              <div className="bg-light-gray rounded-2xl p-8 my-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-navy">Eaton</div>
                    <div className="text-sm text-slate">Electrical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-navy">Kohler</div>
                    <div className="text-sm text-slate">Manufacturing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-navy">Fiat</div>
                    <div className="text-sm text-slate">Automotive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-navy">Siemens</div>
                    <div className="text-sm text-slate">Industrial</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Visible Data Analytics</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                These clients benefit from visible data analytics for process optimization through
                The Aquila Group&apos;s integrated approach to MES, ERP, and OEE monitoring implementation.
                The result is faster decision-making, improved efficiency, and measurable ROI.
              </p>

              <p className="text-lg text-slate leading-relaxed mb-6">
                With nearly three decades of experience, The Aquila Group understands the unique
                challenges manufacturers face and provides tailored solutions that deliver real results.
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
                Ready to Bridge Your IT and OT Systems?
              </h3>
              <p className="text-white/80 mb-6">
                Discover how the DMM System can integrate your manufacturing operations.
              </p>
              <Button href="/products/dmm">
                Learn About DMM System
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
