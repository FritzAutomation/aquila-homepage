"use client";

import { motion } from "framer-motion";
import { ArrowRight, Monitor, Activity, Code } from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button } from "@/components/ui";

const products = [
  {
    name: "DMM System",
    tagline: "Dynamic Machine Management",
    description:
      "A straightforward, user-friendly demand-pull based Manufacturing Execution System (MES) delivering real-time shop floor control and visibility across your entire order-to-shipment process.",
    icon: Monitor,
    features: [
      "Real-time dynamic scheduling",
      "Paperless work order distribution",
      "Complete order tracking",
      "ERP/MRP integration",
    ],
    href: "/products/dmm",
    color: "emerald",
  },
  {
    name: "Green Light Monitoring",
    tagline: "Automated OEE Tracking",
    description:
      "A powerful tool for automatically collecting machine uptime data for real-time Overall Equipment Effectiveness (OEE) calculations and actionable insights.",
    icon: Activity,
    features: [
      "Passive hardware monitoring",
      "Real-time OEE calculations",
      "Automatic downtime prompts",
      "Mobile dashboards",
    ],
    href: "/products/green-light",
    color: "emerald",
  },
  {
    name: "Custom Solutions",
    tagline: "Tailored to Your Needs",
    description:
      "Custom-developed solutions designed specifically for your organization's unique manufacturing processes, workflows, and business goals.",
    icon: Code,
    features: [
      "Custom integrations",
      "Specialized dashboards",
      "Workflow automation",
      "Legacy system connections",
    ],
    href: "/products/custom",
    color: "navy",
  },
];

export default function ProductsPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Our Products"
          subtitle="Manufacturing software solutions that provide the right information, to the right people, at the right time."
          breadcrumb={[{ label: "Products", href: "/products" }]}
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 md:p-10">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            product.color === "emerald" ? "bg-emerald/10" : "bg-navy/10"
                          }`}>
                            <product.icon className={`w-6 h-6 ${
                              product.color === "emerald" ? "text-emerald" : "text-navy"
                            }`} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-navy">
                              {product.name}
                            </h2>
                            <p className="text-slate">{product.tagline}</p>
                          </div>
                        </div>

                        <p className="text-slate mb-6 text-lg">
                          {product.description}
                        </p>

                        <Button href={product.href}>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      <div className="bg-light-gray rounded-xl p-6">
                        <h3 className="font-semibold text-navy mb-4">Key Features</h3>
                        <ul className="space-y-3">
                          {product.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-slate">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Not Sure Which Solution is Right for You?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Our team will help you find the perfect fit for your manufacturing operations.
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
