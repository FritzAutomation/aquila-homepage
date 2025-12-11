"use client";

import { motion } from "framer-motion";
import {
  Code,
  Puzzle,
  Database,
  LayoutDashboard,
  Workflow,
  ArrowRight,
  Check,
  MessageSquare
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const capabilities = [
  {
    icon: Puzzle,
    title: "Custom Integrations",
    description: "Connect your existing systems, databases, and third-party applications seamlessly.",
  },
  {
    icon: LayoutDashboard,
    title: "Specialized Dashboards",
    description: "Real-time dashboards designed for your specific KPIs and operational metrics.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your manufacturing processes.",
  },
  {
    icon: Database,
    title: "Legacy System Connections",
    description: "Bridge the gap between old and new systems without costly replacements.",
  },
  {
    icon: Code,
    title: "Custom Code Solutions",
    description: "Purpose-built applications tailored to your unique business requirements.",
  },
  {
    icon: MessageSquare,
    title: "Inter-Plant Metrics",
    description: "Track and compare performance across multiple facilities in real-time.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "We learn about your unique challenges, workflows, and goals through in-depth consultation.",
  },
  {
    step: "02",
    title: "Design",
    description: "Our team designs a solution architecture tailored specifically to your requirements.",
  },
  {
    step: "03",
    title: "Development",
    description: "We build your custom solution using proven technologies and best practices.",
  },
  {
    step: "04",
    title: "Deployment",
    description: "Seamless implementation with training and ongoing support for your team.",
  },
];

export default function CustomSolutionsPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Custom Solutions"
          subtitle="Tailored manufacturing software designed specifically for your organization's unique processes and goals."
          breadcrumb={[
            { label: "Products", href: "/products" },
            { label: "Custom Solutions", href: "/products/custom" },
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
                Your Business, Your Solution
              </h2>
              <p className="text-lg text-slate mb-6">
                Every manufacturing operation is unique. Off-the-shelf software can&apos;t always
                address your specific challenges. That&apos;s where our custom solutions come in.
              </p>
              <p className="text-lg text-slate mb-8">
                We work closely with your team to understand your processes, identify opportunities,
                and build solutions that fit your exact needs—not the other way around.
              </p>
              <Button href="/contact" size="lg">
                Start a Conversation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-navy to-navy/90 text-white">
                <h3 className="text-xl font-bold mb-6">What Our Clients Say</h3>
                <blockquote className="text-white/90 text-lg italic mb-6">
                  &quot;The team&apos;s dedication to delivering exactly what we needed for our
                  real-time dashboards and inter-plant metrics has been exceptional.&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold">GC</span>
                  </div>
                  <div>
                    <p className="font-medium">Gary Carnall</p>
                    <p className="text-sm text-white/60">Birmingham, England</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Capabilities Grid */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What We Can Build for You
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              From simple integrations to complex custom applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6">
                  <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4">
                    <capability.icon className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {capability.title}
                  </h3>
                  <p className="text-slate">{capability.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Process Section */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Process
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              A proven approach to delivering solutions that work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-emerald/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-slate">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Why Custom Section */}
        <SectionWrapper background="light">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Why Choose Custom?
              </h2>
              <div className="space-y-4">
                {[
                  "Fits your exact workflow, not a generic template",
                  "Integrates with your existing systems seamlessly",
                  "Scales with your business as you grow",
                  "Provides competitive advantage through differentiation",
                  "Addresses challenges no off-the-shelf product can",
                ].map((benefit, index) => (
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
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-light/20">
                <h3 className="font-semibold text-navy mb-4 text-xl">Ready to Discuss Your Project?</h3>
                <p className="text-slate mb-6">
                  Our team has decades of experience building custom manufacturing solutions.
                  Let&apos;s talk about what we can create for you.
                </p>
                <div className="space-y-3">
                  <Button href="/contact" className="w-full">
                    Schedule a Consultation
                  </Button>
                  <Button href="mailto:sales@the-aquila-group.com" variant="ghost" className="w-full">
                    Email Us Directly
                  </Button>
                </div>
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
                Let&apos;s Build Something Great Together
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Tell us about your challenges and we&apos;ll show you what&apos;s possible.
              </p>
              <Button href="/contact" size="lg">
                Start Your Project
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
