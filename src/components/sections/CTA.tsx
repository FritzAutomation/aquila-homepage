"use client";

import { motion } from "framer-motion";
import { Button } from "../ui";

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-navy to-navy-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to see your shop floor in real time?
          </h2>
          <p className="text-lg md:text-xl text-slate-light mb-8 max-w-2xl mx-auto">
            Get a personalized demo and see how DMM can transform your
            manufacturing operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg">
              Request a Demo
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
