"use client";

import { motion } from "framer-motion";
import { GraduationCap, Monitor, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const trainingPrograms = [
  {
    name: "DMM Administrator Training",
    description: "Comprehensive system coverage emphasizing business process options and system configuration.",
    audience: "System Administrators, IT Staff",
  },
  {
    name: "DMM Operator Training",
    description: "Shop floor focused instruction for machine-specific interfaces and daily operations.",
    audience: "Machine Operators, Floor Staff",
  },
  {
    name: "DMM Planner Training",
    description: "Order management including capacity balancing, scheduling, and production tracking.",
    audience: "Production Planners, Schedulers",
  },
  {
    name: "DMM Manufacturing Engineer Training",
    description: "CAD/CAM software integration, production readiness, and engineering workflows.",
    audience: "Manufacturing Engineers, CAD/CAM Staff",
  },
  {
    name: "DMM Manager Training",
    description: "High-level system overview emphasizing performance metrics, reporting, and KPIs.",
    audience: "Plant Managers, Operations Directors",
  },
  {
    name: "Green Light Overview",
    description: "Monitoring system functionality, OEE calculations, and real-time dashboard usage.",
    audience: "All Staff Levels",
  },
];

const benefits = [
  "Trainers average over ten years of experience with the software",
  "Sessions accommodate questions throughout the presentation",
  "Projector presentations supplemented by hands-on practice labs",
  "Available post-implementation via web or on-site delivery",
  "Thorough, friendly, and engaging instruction style",
  "Customized for your specific implementation and processes",
];

export default function TrainingPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Training Services"
          subtitle="The most important factor in the success of software implementation is training."
          breadcrumb={[
            { label: "Services", href: "/services" },
            { label: "Training", href: "/services/training" },
          ]}
        />

        {/* Introduction */}
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-lg text-slate leading-relaxed">
                We provide extensive classroom and on-the-floor training during implementation,
                with ongoing options available for process changes, staff turnover, and software updates.
                Our trainers are thorough, friendly, and sometimes humorous—making learning engaging and effective.
              </p>
            </motion.div>

            {/* Delivery Methods */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full text-center p-8">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Web-Based Training</h3>
                  <p className="text-slate">
                    Remote sessions delivered via video conference, perfect for refresher courses and distributed teams.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full text-center p-8">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">On-Site Training</h3>
                  <p className="text-slate">
                    Hands-on instruction at your facility with access to your actual systems and workflows.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* Training Programs */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Training Programs</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Role-based curriculum designed for every level of your organization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{program.name}</h3>
                  <p className="text-slate text-sm mb-4">{program.description}</p>
                  <p className="text-xs text-emerald font-medium">
                    For: {program.audience}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Benefits */}
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Why Our Training Works</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                  <p className="text-slate">{benefit}</p>
                </motion.div>
              ))}
            </div>
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
                Ready to Train Your Team?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Contact us to discuss your training needs and schedule sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Schedule Training
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  View All Services
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
