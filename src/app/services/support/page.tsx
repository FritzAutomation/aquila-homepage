"use client";

import { motion } from "framer-motion";
import { Headphones, Clock, Mail, Phone, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const supportFeatures = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock support for customers with annual maintenance plans. We're here when you need us.",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our technical team at (608) 834-9213 for immediate assistance.",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send detailed issue reports to support@the-aquila-group.com for thorough troubleshooting.",
  },
  {
    icon: Shield,
    title: "Annual Maintenance",
    description: "Maintenance agreements ensure priority support and rapid response to keep your systems running.",
  },
];

const commitments = [
  "Your issues are important to us",
  "We want to help you resolve them as quickly as possible",
  "We take pride in customer support",
  "Don't hesitate to contact us when you need assistance",
  "Technical problems addressed promptly around the clock",
  "Experienced support team familiar with shop floor operations",
];

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Support Services"
          subtitle="We take pride in customer support and are here when you need us."
          breadcrumb={[
            { label: "Services", href: "/services" },
            { label: "Support", href: "/services/support" },
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
                Your issues are important to us, and we want to help you resolve them as quickly as possible.
                Our support team is equipped to help address technical issues with our software products
                and resolve shop floor operational challenges.
              </p>
            </motion.div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.a
                href="tel:+16088349213"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="block"
              >
                <Card className="h-full text-center p-8 hover:border-emerald transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Call Us</h3>
                  <p className="text-2xl font-semibold text-emerald">(608) 834-9213</p>
                </Card>
              </motion.a>

              <motion.a
                href="mailto:support@the-aquila-group.com"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="block"
              >
                <Card className="h-full text-center p-8 hover:border-emerald transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Email Us</h3>
                  <p className="text-lg font-semibold text-emerald">support@the-aquila-group.com</p>
                </Card>
              </motion.a>
            </div>
          </div>
        </SectionWrapper>

        {/* Support Features */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">How We Support You</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Multiple channels and options to get the help you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {supportFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
                      <p className="text-slate text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Our Commitment */}
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-navy text-white rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Commitment to You</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {commitments.map((commitment, index) => (
                    <motion.div
                      key={commitment}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                      <p className="text-white/90">{commitment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Testimonial */}
        <SectionWrapper background="light">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 md:p-12">
                <blockquote className="text-xl md:text-2xl font-medium text-navy mb-6 leading-relaxed text-center">
                  &quot;We have called them in the middle of the night and they have always
                  been eager to help solve any issues. Their 15-year partnership and dedication
                  to weekend and holiday maintenance availability has been invaluable.&quot;
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-navy">ML</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Michael Long</p>
                    <p className="text-slate text-sm">Sumter, South Carolina</p>
                  </div>
                </div>
              </Card>
            </motion.div>
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
                Need Assistance?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Our support team is ready to help. Don&apos;t hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="tel:+16088349213" size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Support
                </Button>
                <Button href="mailto:support@the-aquila-group.com" variant="secondary" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
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
