"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui";

const navItems = [
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "DMM System", href: "/products/dmm", description: "Complete MES solution for shop floor control" },
      { label: "Green Light Monitoring", href: "/products/green-light", description: "Real-time OEE tracking and dashboards" },
      { label: "Custom Solutions", href: "/products/custom", description: "Tailored integrations for your workflow" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Training", href: "/services/training", description: "Expert training for your team" },
      { label: "Integration", href: "/services/integration", description: "Seamless ERP and CAD connections" },
      { label: "Consulting", href: "/services/consulting", description: "Manufacturing optimization expertise" },
      { label: "Support", href: "/services/support", description: "24/7 technical assistance" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Serving manufacturers since 1996" },
      { label: "Our Team", href: "/about#team", description: "Meet our leadership" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
  { label: "News", href: "/news" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleMobileSection = (label: string) => {
    setMobileOpenSection(mobileOpenSection === label ? null : label);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/images/Aquila-Logo-DS_WA-2012.png"
              alt="The Aquila Group"
              width={180}
              height={95}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-slate hover:text-navy transition-colors font-medium"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </a>

                {/* Dropdown Menu */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 w-72 pt-2">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-light/20 py-3">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-3 hover:bg-light-gray transition-colors"
                        >
                          <span className="block text-navy font-medium">
                            {child.label}
                          </span>
                          <span className="block text-sm text-slate">
                            {child.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button href="/contact">Request Demo</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate hover:text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>
    </header>

      {/* Mobile Menu Overlay & Drawer - Rendered via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[9998] lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Slide-out Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[9999] lg:hidden flex flex-col shadow-2xl"
              >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Image
                  src="/images/Aquila-Logo-DS_WA-2012.png"
                  alt="The Aquila Group"
                  width={140}
                  height={74}
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSection(item.label)}
                          className="w-full flex items-center justify-between px-6 py-3 text-navy font-medium hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.label}</span>
                          <motion.div
                            animate={{ rotate: mobileOpenSection === item.label ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-slate" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {mobileOpenSection === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-gray-50"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-8 py-3 border-l-2 border-transparent hover:border-emerald hover:bg-white transition-all"
                                >
                                  <span className="block text-navy font-medium text-sm">
                                    {child.label}
                                  </span>
                                  <span className="block text-xs text-slate mt-0.5">
                                    {child.description}
                                  </span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-6 py-3 text-navy font-medium hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-gray-100 p-4 space-y-4">
                <Button href="/contact" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Request Demo
                </Button>

                {/* Contact Info */}
                <div className="space-y-2 pt-2">
                  <a
                    href="tel:+13307383441"
                    className="flex items-center gap-3 text-sm text-slate hover:text-navy transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald" />
                    (330) 738-3441
                  </a>
                  <a
                    href="mailto:info@the-aquila-group.com"
                    className="flex items-center gap-3 text-sm text-slate hover:text-navy transition-colors"
                  >
                    <Mail className="w-4 h-4 text-emerald" />
                    info@the-aquila-group.com
                  </a>
                  <div className="flex items-start gap-3 text-sm text-slate">
                    <MapPin className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                    <span>North Canton, OH</span>
                  </div>
                </div>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
