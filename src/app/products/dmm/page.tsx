"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Zap,
  FileText,
  Search,
  Layers,
  RefreshCw,
  ArrowRight,
  Check
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper, DMMDemo } from "@/components/ui";

const features = [
  {
    icon: RefreshCw,
    title: "Dynamic Scheduling",
    description: "New schedule created with each machine cycle, enabling rapid response to demand changes.",
  },
  {
    icon: Layers,
    title: "ERP/MRP Integration",
    description: "Seamless integration with your existing enterprise systems for unified data flow.",
  },
  {
    icon: FileText,
    title: "Paperless Distribution",
    description: "Eliminate manual work order printing with digital distribution to all work centers.",
  },
  {
    icon: Search,
    title: "Complete Order Tracking",
    description: "Total operational visibility - know exactly where every part is at any time.",
  },
  {
    icon: Monitor,
    title: "Specialized Work Centers",
    description: "Custom screens for punch, laser, press brake, welding, kitting, paint line, and assembly.",
  },
  {
    icon: Zap,
    title: "Dynamic Nesting",
    description: "Interfaces with JETCAM, SigmaNest, Hypertherm CAM, and other nest engine software.",
  },
];

const benefits = [
  "Rapid response to demand changes",
  "Eliminate manual work order printing",
  "Reduce time searching for parts",
  "Total operational visibility",
  "Real-time performance metrics",
  "Faster machine code generation",
];

const workCenters = [
  "Punch",
  "Laser",
  "Press Brake",
  "Welding",
  "Kitting",
  "Paint Line",
  "Assembly",
  "General Production",
];

export default function DMMPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="DMM System"
          subtitle="Dynamic Machine Management - A next-generation Manufacturing Execution System delivering real-time shop floor control."
          breadcrumb={[
            { label: "Products", href: "/products" },
            { label: "DMM System", href: "/products/dmm" },
          ]}
        />

        {/* Overview Section */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                The Right Information, to the Right People, at the Right Time
              </h2>
              <p className="text-lg text-slate mb-6">
                The DMM System is a straightforward, user-friendly &quot;Demand-Pull&quot; based
                Manufacturing Execution System (MES). It provides real-time creation, collection,
                distribution, and management of manufacturing data, instructions, and performance metrics.
              </p>
              <p className="text-lg text-slate mb-8">
                From order to shipment, gain complete visibility into your shop floor operations
                and respond rapidly to changing demands.
              </p>
              <Button href="/contact" size="lg">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-light-gray rounded-2xl p-8"
            >
              <h3 className="font-semibold text-navy mb-6 text-lg">Supported Work Centers</h3>
              <div className="grid grid-cols-2 gap-4">
                {workCenters.map((center) => (
                  <div key={center} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald" />
                    <span className="text-slate">{center}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Interactive Demo Section */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Experience the DMM Interface
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Try our interactive demo to see how the DMM System works. Click through the menus to explore the various modules.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DMMDemo />
          </motion.div>
        </SectionWrapper>

        {/* Features Grid */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Key Features
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Comprehensive tools for complete shop floor control
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6">
                  <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Benefits Section */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Benefits That Impact Your Bottom Line
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald" />
                    </div>
                    <span className="text-lg text-slate">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-navy text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Case Study Result</h3>
                <div className="text-5xl font-bold text-emerald mb-2">75%</div>
                <p className="text-white/80 mb-4">Reduction in programming time</p>
                <p className="text-sm text-white/60">
                  ASCO Power Technologies achieved significant efficiency gains
                  with the DMM System and nesting integration.
                </p>
              </div>
            </motion.div>
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
                Ready to Transform Your Shop Floor?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                See how the DMM System can give you complete visibility and control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact Sales
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
