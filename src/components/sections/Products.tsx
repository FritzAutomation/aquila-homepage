"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SectionWrapper, Card, Button } from "../ui";

const products = [
  {
    image: "/images/DMM_Logo.png",
    title: "DMM System",
    description: "Complete MES solution for shop floor control and order visibility.",
    features: [
      "Real-time tracking",
      "Dynamic nesting",
      "Mobile access",
      "Custom reporting",
    ],
    href: "/products/dmm",
  },
  {
    image: "/images/DMM-Green-Light-5.png",
    title: "Green Light Monitoring",
    description: "Real-time OEE tracking and machine monitoring dashboards.",
    features: [
      "Automatic data collection",
      "OEE calculations",
      "Downtime alerts",
      "Performance analytics",
    ],
    href: "/products/green-light",
  },
];

export default function Products() {
  return (
    <SectionWrapper id="products" background="light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Our Solutions
        </h2>
        <p className="text-lg text-slate max-w-2xl mx-auto">
          Purpose-built software for modern manufacturing operations
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {products.map((product, index) => (
          <motion.div
            key={product.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="mb-6">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={120}
                  height={120}
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">
                {product.title}
              </h3>
              <p className="text-slate mb-6">{product.description}</p>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={product.href}
                className="inline-flex items-center gap-2 text-emerald font-medium hover:text-emerald-dark transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Solutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-navy text-white rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/images/DMM-Custom-Solutions-3.png"
                  alt="Custom Solutions"
                  width={80}
                  height={80}
                  className="h-14 w-auto"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Custom Solutions</h3>
                <p className="text-slate-light max-w-xl">
                  No two manufacturers are alike. We build tailored integrations
                  that fit your exact workflow.
                </p>
              </div>
            </div>
            <Button href="/products/custom" variant="secondary" className="flex-shrink-0">
              Talk to Our Team
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
