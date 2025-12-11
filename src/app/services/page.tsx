"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Puzzle,
  MessageSquare,
  Headphones,
  ArrowRight,
  Clock,
  Users,
  Award
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const services = [
  {
    icon: GraduationCap,
    name: "Training",
    description:
      "The most important factor in the success of software implementation is training. We provide extensive classroom and on-the-floor training during implementation, with ongoing options for process changes, staff turnover, and software updates.",
    features: [
      "DMM Administrator & Operator Training",
      "Planner & Manufacturing Engineer Training",
      "Manager Training & Green Light Overview",
      "Web or on-site delivery options",
    ],
    href: "/services/training",
  },
  {
    icon: Puzzle,
    name: "System Integration",
    description:
      "We make the implementation process as painless as possible by integrating DMM with your existing business infrastructure—from ERP systems to CAD/CAM and machine PLCs.",
    features: [
      "SAP, Oracle, JDEdwards, Mapics integration",
      "CAD/CAM & part-drawing library connections",
      "Machine PLC & timekeeping systems",
      "Legacy system transitions",
    ],
    href: "/services/integration",
  },
  {
    icon: MessageSquare,
    name: "Consulting",
    description:
      "Our team of manufacturing and IT experts can visit your facility for comprehensive operational reviews, helping you turn industry changes into opportunities.",
    features: [
      "Demand-Pull & Lean Manufacturing",
      "MES Integration & Project Management",
      "Capacity Planning & Runtime Analysis",
      "Manufacturing Process Improvements",
    ],
    href: "/services/consulting",
  },
  {
    icon: Headphones,
    name: "Support",
    description:
      "Your issues are important to us, and we want to help you resolve them as quickly as possible. We take pride in customer support and are here when you need us.",
    features: [
      "24/7 availability for maintenance plan customers",
      "Phone & email support channels",
      "Rapid response to shop floor issues",
      "Annual maintenance agreements",
    ],
    href: "/services/support",
  },
];

const stats = [
  { icon: Clock, value: "24/7", label: "Support Availability" },
  { icon: Users, value: "29+", label: "Years Experience" },
  { icon: Award, value: "100+", label: "Facilities Served" },
];

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Our Services"
          subtitle="Comprehensive support to help you succeed with your manufacturing technology investment."
          breadcrumb={[{ label: "Services", href: "/services" }]}
        />

        {/* Services Grid */}
        <SectionWrapper>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-emerald/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-7 h-7 text-emerald" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-navy mb-2">
                        {service.name}
                      </h2>
                      <p className="text-slate">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button href={service.href} variant="ghost">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Stats Section */}
        <SectionWrapper background="light">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-navy" />
                </div>
                <div className="text-4xl font-bold text-navy mb-2">{stat.value}</div>
                <p className="text-slate">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Testimonial */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-8 md:p-12 bg-navy text-white rounded-2xl">
              <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                &quot;We have called them in the middle of the night and they have always
                been eager to help solve any issues. Their 15-year partnership and dedication
                to weekend and holiday maintenance availability has been invaluable.&quot;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-semibold">ML</span>
                </div>
                <div>
                  <p className="font-semibold">Michael Long</p>
                  <p className="text-white/60">Sumter, South Carolina</p>
                </div>
              </div>
            </div>
          </motion.div>
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
                Need Help With Your Manufacturing Systems?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Our team is ready to support you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Contact Us
                </Button>
                <Button href="mailto:support@the-aquila-group.com" variant="secondary" size="lg">
                  Email Support
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
