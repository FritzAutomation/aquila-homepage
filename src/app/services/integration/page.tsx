"use client";

import { motion } from "framer-motion";
import { Puzzle, Database, Cpu, RefreshCw, CheckCircle, ArrowRight, Settings } from "lucide-react";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

const erpSystems = [
  { name: "SAP", logo: "/images/SAP_idEDqS_YGr_1.png" },
  { name: "Oracle", logo: "/images/Oracle_ideA555_no_3.png" },
  { name: "JD Edwards", logo: "/images/jdedwards.png" },
  { name: "Microsoft", logo: "/images/microsoft.png" },
  { name: "Custom/Homegrown", logo: null, icon: true },
];

const secondarySystems = [
  {
    icon: Cpu,
    name: "CAD/CAM Systems",
    description: "Seamless integration with your design and manufacturing software for production-ready workflows.",
  },
  {
    icon: Database,
    name: "Part-Drawing Libraries",
    description: "Connect your part libraries directly to DMM for instant access to specifications and drawings.",
  },
  {
    icon: Puzzle,
    name: "Machine PLCs",
    description: "Direct communication with programmable logic controllers for real-time machine data.",
  },
  {
    icon: RefreshCw,
    name: "Timekeeping Systems",
    description: "Synchronize labor tracking with production data for accurate cost analysis.",
  },
];

const benefits = [
  "Make the implementation process as painless as possible",
  "Verified correct information passing between all software packages",
  "Seamless transitions when upgrading legacy ERP/MRP systems",
  "Development and engineering teams collaborate with your IT department",
  "Experience from a large and diverse customer base",
  "Customized integration tailored to your specific environment",
];

export default function IntegrationPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="System Integration"
          subtitle="We make the implementation process as painless as possible."
          breadcrumb={[
            { label: "Services", href: "/services" },
            { label: "System Integration", href: "/services/integration" },
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
                The Aquila Group facilitates software implementation by integrating our Dynamic Machine Management (DMM)
                System with your existing business infrastructure. Our development and engineering teams collaborate
                with your IT department to verify correct information is being passed back and forth between any
                software packages required.
              </p>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ERP/MRP Systems */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">ERP/MRP Integration</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              We have successfully integrated DMM with major enterprise platforms
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {erpSystems.map((system, index) => (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="text-center p-4 h-full flex flex-col items-center justify-center min-h-[100px]">
                    {system.logo ? (
                      <Image
                        src={system.logo}
                        alt={system.name}
                        width={120}
                        height={48}
                        className="h-10 w-auto object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="w-8 h-8 text-navy" />
                        <p className="font-semibold text-navy text-xs">{system.name}</p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Secondary Systems */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Additional Integrations</h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              DMM communicates with multiple ancillary platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {secondarySystems.map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <system.icon className="w-6 h-6 text-emerald" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy mb-2">{system.name}</h3>
                      <p className="text-slate text-sm">{system.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Legacy Transition */}
        <SectionWrapper background="light">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-navy text-white rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Legacy System Transitions</h2>
                <p className="text-white/80 text-lg mb-6">
                  When you upgrade your ERP/MRP systems after DMM installation, we ensure the links to DMM
                  work just as well as they did in your legacy system—often resulting in seamless floor-level transitions.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                      <p className="text-white/90 text-sm">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
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
                Ready to Integrate Your Systems?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Let&apos;s discuss how DMM can connect with your existing infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Contact Our Team
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
