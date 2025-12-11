"use client";

import { motion } from "framer-motion";
import { MessageSquare, Target, ClipboardCheck, FileText, ArrowRight } from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const consultingServices = [
  {
    name: "Demand-Pull & Lean Manufacturing",
    description: "Optimize your production methodologies with pull-based systems that reduce waste and improve flow.",
  },
  {
    name: "MES Integration",
    description: "Expert guidance on manufacturing execution system implementation and optimization.",
  },
  {
    name: "Project Management",
    description: "Oversight of implementation initiatives to ensure on-time, on-budget delivery.",
  },
  {
    name: "Transition Planning",
    description: "Change management strategies to help your team adapt to new systems and processes.",
  },
  {
    name: "MAC/CAD Automation",
    description: "Design and manufacturing software optimization for improved productivity.",
  },
  {
    name: "IT Security & Networking",
    description: "Technical infrastructure support to keep your manufacturing systems secure and connected.",
  },
  {
    name: "Capacity Planning & Runtime Analysis",
    description: "Production efficiency evaluation to maximize throughput and resource utilization.",
  },
  {
    name: "Manufacturing Process Improvements",
    description: "Operational enhancements to streamline workflows and eliminate bottlenecks.",
  },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    step: "1",
    title: "On-Site Assessment",
    description: "Our team of manufacturing and IT experts visits your facility for a comprehensive operational review.",
  },
  {
    icon: Target,
    step: "2",
    title: "Challenge Identification",
    description: "We analyze your processes to identify bottlenecks, inefficiencies, and opportunities for improvement.",
  },
  {
    icon: FileText,
    step: "3",
    title: "Recommendations Delivery",
    description: "You receive detailed written recommendations with actionable steps for improvement.",
  },
];

export default function ConsultingPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Consulting Services"
          subtitle="Turn industry changes into opportunities with expert guidance."
          breadcrumb={[
            { label: "Services", href: "/services" },
            { label: "Consulting", href: "/services/consulting" },
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
                In the ever-changing, yet always competitive landscape of manufacturing and technology,
                our team of manufacturing and IT experts can help you navigate challenges and turn them
                into opportunities for growth and efficiency.
              </p>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Our Process */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Approach</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              A structured methodology to identify and solve your operational challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-8">
                  <div className="w-16 h-16 bg-emerald text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
                  <p className="text-slate">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Services Grid */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">What We Offer</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Comprehensive consulting services for modern manufacturing operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {consultingServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy mb-2">{service.name}</h3>
                      <p className="text-slate text-sm">{service.description}</p>
                    </div>
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
                Ready to Optimize Your Operations?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Contact us to discuss your consulting needs and schedule an assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Schedule a Consultation
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
