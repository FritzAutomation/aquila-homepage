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
                  Case Study
                </span>
                <span className="text-slate flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  July 2016
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Case Study: Hillphoenix Inc. Increases Profits!
              </h1>

              <p className="text-xl text-slate">
                Long-time customer Hillphoenix achieves significant profitability improvements through JETCAM nesting integration.
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
                Long-time customer Hillphoenix Inc. recently integrated the JETCAM nesting solution
                on multiple Amada punch and laser work centers, partnering with NestONE Solutions
                to achieve measurable profitability improvements.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">About Hillphoenix</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Hillphoenix is a leading manufacturer of commercial refrigeration systems for
                supermarkets, convenience stores, and food service operations. With multiple
                manufacturing facilities, they require efficient sheet metal fabrication processes
                to maintain competitive pricing and delivery schedules.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Implementation</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                Working with The Aquila Group and NestONE Solutions, Hillphoenix implemented
                JETCAM nesting technology across their fabrication operations. The integration
                covered multiple work centers including:
              </p>

              <ul className="list-disc pl-6 mb-6 text-lg text-slate space-y-2">
                <li>Amada punch press machines</li>
                <li>Laser cutting work centers</li>
                <li>Salvagnini equipment</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">The Results</h2>
              <div className="bg-light-gray rounded-2xl p-8 my-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">↑</div>
                    <div className="text-slate">Increased Profitability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">↓</div>
                    <div className="text-slate">Material Waste Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald mb-2">⚡</div>
                    <div className="text-slate">Faster Programming</div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate leading-relaxed mb-6">
                The JETCAM nesting solution optimizes material utilization by intelligently
                arranging parts on sheet metal, reducing scrap and maximizing the yield from
                each sheet. Combined with faster programming times, Hillphoenix has seen
                significant improvements in their bottom line.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Long-Term Partnership</h2>
              <p className="text-lg text-slate leading-relaxed mb-6">
                As a long-time customer of The Aquila Group, Hillphoenix has benefited from
                continuous improvement initiatives and technology upgrades over the years.
                This latest implementation builds on that foundation of success and positions
                them for continued growth.
              </p>

              <blockquote className="border-l-4 border-emerald pl-6 py-2 my-8 italic text-slate">
                &quot;The partnership with The Aquila Group has consistently delivered results.
                This latest integration is another example of how the right technology,
                properly implemented, drives real business value.&quot;
              </blockquote>
            </motion.div>

            {/* Related Case Study Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 bg-light-gray rounded-2xl"
            >
              <h3 className="text-lg font-bold text-navy mb-2">Related Case Study</h3>
              <p className="text-slate mb-4">
                Read the full Hillphoenix case study to learn more about their journey with The Aquila Group.
              </p>
              <Link
                href="/case-studies/hillphoenix"
                className="inline-flex items-center gap-2 text-emerald font-medium hover:text-emerald/80 transition-colors"
              >
                View Full Case Study
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 p-8 bg-navy rounded-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to Increase Your Profitability?
              </h3>
              <p className="text-white/80 mb-6">
                Learn how our solutions can deliver measurable results for your operations.
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
