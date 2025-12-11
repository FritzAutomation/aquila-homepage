"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionWrapper } from "../ui";

const faqs = [
  {
    question: "What is the DMM System?",
    answer:
      "The DMM (Dynamic Manufacturing Manager) System is a comprehensive manufacturing execution system (MES) that provides real-time visibility into your shop floor operations. It integrates with your existing ERP, CAD/CAM, and machine systems to track jobs, materials, and production status in real-time.",
  },
  {
    question: "How long does implementation typically take?",
    answer:
      "Implementation timelines vary based on the complexity of your operations and the number of machines and systems being integrated. A typical implementation ranges from a few weeks for basic setups to several months for enterprise-wide deployments. We work closely with your team to minimize disruption and ensure a smooth transition.",
  },
  {
    question: "Does the DMM System integrate with our existing ERP?",
    answer:
      "Yes, the DMM System is designed to integrate with a wide range of ERP systems including SAP, Oracle, JD Edwards, Microsoft Dynamics, and many others. We also support custom and legacy ERP systems through our flexible API and integration services.",
  },
  {
    question: "What kind of training and support do you provide?",
    answer:
      "We provide comprehensive training for all users, from shop floor operators to management. This includes on-site training, remote sessions, and access to our documentation and knowledge base. Our support team is available to help with any questions or issues that arise.",
  },
  {
    question: "Can the system track OEE and other key metrics?",
    answer:
      "Absolutely. The DMM System and Green Light Monitoring solutions provide real-time OEE (Overall Equipment Effectiveness) tracking, along with dozens of other key performance indicators. You can customize dashboards and reports to focus on the metrics that matter most to your operation.",
  },
  {
    question: "What industries do you serve?",
    answer:
      "We serve manufacturers across a wide range of industries including sheet metal fabrication, automotive, aerospace, appliance manufacturing, HVAC, and more. Our solutions are flexible and can be customized to meet the specific needs of your industry and operation.",
  },
  {
    question: "Is the system cloud-based or on-premise?",
    answer:
      "We offer both deployment options. You can choose a cloud-based solution for easier maintenance and remote access, or an on-premise installation if you have specific security or compliance requirements. Many customers choose a hybrid approach that combines the benefits of both.",
  },
  {
    question: "How do I get started?",
    answer:
      "The best way to get started is to request a demo. We'll schedule a call to understand your specific needs and challenges, then show you how our solutions can help. From there, we can develop a customized implementation plan for your facility.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-navy pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-slate max-w-2xl mx-auto">
          Get answers to common questions about our manufacturing solutions
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
