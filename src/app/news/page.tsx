"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Award } from "lucide-react";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const newsArticles = [
  {
    title: "Focus on CAD/CAM: Packing a Punch",
    date: "February 2021",
    category: "Case Study",
    excerpt:
      "ASCO Power Technologies, a U.S. power management manufacturer, achieved significant gains through new nesting software implementation, reducing programming time by 75% and increasing efficiency.",
    featured: true,
  },
  {
    title: "Automation News: Real-Time For Sheet Metal Machines!",
    date: "August 2017",
    category: "Partnership",
    excerpt:
      "The Aquila Group partnered with Opto 22 to help manufacturing customers integrate OEE measurements into their Enterprise systems, enabling real-time data visibility for sheet metal machinery operations.",
    featured: false,
  },
  {
    title: "Manufacturing Information, Instructions, and Performance Metrics in Real Time",
    date: "August 2017",
    category: "Industry News",
    excerpt:
      "How The Aquila Group bridges IT and operational technology gaps for major manufacturers including Eaton Electrical, Kohler, Fiat, and Siemens.",
    featured: false,
  },
  {
    title: "Case Study: Hillphoenix Inc. Increases Profits!",
    date: "July 2016",
    category: "Case Study",
    excerpt:
      "Hillphoenix Inc. integrated JETCAM nesting solutions across multiple punch and laser work centers, partnering with NestONE Solutions to achieve measurable profitability improvements.",
    featured: false,
  },
];

const certifications = [
  {
    name: "Opto 22 IoT Certified Partner",
    description: "Certified expertise in Industrial Internet of Things solutions",
    logo: "/images/OptoPartner_IoT_Certified_192x163.png",
  },
];

export default function NewsPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="News & Updates"
          subtitle="Stay up to date with the latest from The Aquila Group, including case studies, partnerships, and industry insights."
          breadcrumb={[{ label: "News", href: "/news" }]}
        />

        {/* Featured Article */}
        <SectionWrapper>
          {newsArticles
            .filter((article) => article.featured)
            .map((article) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 md:p-12 bg-gradient-to-br from-navy to-navy/90 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-emerald/20 text-emerald rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {article.title}
                  </h2>
                  <p className="text-white/80 text-lg mb-6 max-w-3xl">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <Button href="#" variant="secondary">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
        </SectionWrapper>

        {/* All Articles */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              All Articles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {newsArticles
              .filter((article) => !article.featured)
              .map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-sm text-slate-light flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {article.title}
                    </h3>
                    <p className="text-slate mb-4">{article.excerpt}</p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-navy font-medium hover:text-emerald transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Card>
                </motion.div>
              ))}
          </div>
        </SectionWrapper>

        {/* Certifications */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Certifications & Partnerships
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 flex items-center gap-6">
                  <div className="w-24 h-20 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={cert.logo}
                      alt={cert.name}
                      width={192}
                      height={163}
                      className="w-auto h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-1">{cert.name}</h3>
                    <p className="text-slate">{cert.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
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
                Want to Be Our Next Success Story?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                See how our solutions can transform your manufacturing operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  View Products
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
