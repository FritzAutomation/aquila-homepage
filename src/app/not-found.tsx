"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { Navigation, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center py-16 relative">
          {/* 404 Graphic - positioned behind content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none -top-16"
          >
            <div className="text-[180px] md:text-[280px] font-bold text-emerald/15 leading-none select-none">
              404
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 pt-20"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-slate mb-8 max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have
              been moved or no longer exists.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald text-white rounded-lg font-medium hover:bg-emerald/90 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy/10 text-navy rounded-lg font-medium hover:bg-navy/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 border-t border-gray-200 pt-8"
          >
            <p className="text-sm text-slate mb-4">Here are some helpful links:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link
                href="/products/dmm"
                className="text-navy hover:text-emerald transition-colors"
              >
                DMM System
              </Link>
              <Link
                href="/products/green-light"
                className="text-navy hover:text-emerald transition-colors"
              >
                Green Light Monitoring
              </Link>
              <Link
                href="/services"
                className="text-navy hover:text-emerald transition-colors"
              >
                Services
              </Link>
              <Link
                href="/case-studies"
                className="text-navy hover:text-emerald transition-colors"
              >
                Case Studies
              </Link>
              <Link
                href="/contact"
                className="text-navy hover:text-emerald transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 mt-8 p-6 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center justify-center gap-3 text-slate">
              <Phone className="w-5 h-5 text-emerald" />
              <span>Need help? Call us at</span>
              <a
                href="tel:+16088349213"
                className="font-medium text-navy hover:text-emerald transition-colors"
              >
                (608) 834-9213
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
