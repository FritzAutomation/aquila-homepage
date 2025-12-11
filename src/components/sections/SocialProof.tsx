"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const clients = [
  { name: "Eaton", logo: "/images/Eaton_idQDslYR77_1.png", className: "h-6 md:h-8" },
  { name: "Kohler", logo: "/images/KOHLER_idoXOAwHSc_1.png", className: "h-6 md:h-8" },
  { name: "Siemens", logo: "/images/Siemens_id0if2F9r8_1.png", className: "h-6 md:h-8" },
  { name: "Fiat", logo: "/images/FIAT_idGeGBWemT_1.png", className: "h-6 md:h-8" },
  { name: "CNH Industrial", logo: "/images/CNH Industrial_id20lyZduS_1.png", className: "h-6 md:h-8" },
];

export default function SocialProof() {
  return (
    <section className="py-12 md:py-16 bg-light-gray border-y border-slate-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-slate font-medium">
            Trusted by manufacturing leaders worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16"
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="opacity-80 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={48}
                className={`${client.className} w-auto object-contain`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate">
            29+ years serving manufacturers
          </p>
        </motion.div>
      </div>
    </section>
  );
}
