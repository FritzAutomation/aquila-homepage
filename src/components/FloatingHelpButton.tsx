"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, MessageSquare, Search, Phone, Mail } from "lucide-react";
import Link from "next/link";

// Threshold must match BackToTop component (shows when scrollY > 400)
const BACK_TO_TOP_THRESHOLD = 400;

const helpOptions = [
  {
    icon: MessageSquare,
    label: "Submit Ticket",
    description: "Get help from our team",
    href: "/support",
  },
  {
    icon: Search,
    label: "Check Status",
    description: "Track your ticket",
    href: "/support/status",
  },
  {
    icon: Phone,
    label: "Call Us",
    description: "(608) 834-9213",
    href: "tel:+16088349213",
  },
  {
    icon: Mail,
    label: "Email Support",
    description: "sales@the-aquila-group.com",
    href: "mailto:sales@the-aquila-group.com",
  },
];

export default function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll to know when BackToTop button is visible
  useEffect(() => {
    const handleScroll = () => {
      setIsBackToTopVisible(window.scrollY > BACK_TO_TOP_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Move up when back-to-top button is visible (48px button + 16px gap)
  const bottomOffset = isBackToTopVisible ? 88 : 24; // 88px when visible, 24px (bottom-6) otherwise

  return (
    <motion.div
      className="fixed right-6 z-50"
      animate={{ bottom: bottomOffset }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-light/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy px-4 py-3">
              <h3 className="text-white font-semibold">Need Help?</h3>
              <p className="text-slate-light text-sm">Choose an option below</p>
            </div>

            {/* Options */}
            <div className="p-2">
              {helpOptions.map((option) => {
                const isExternal = option.href.startsWith("tel:") || option.href.startsWith("mailto:");
                const Component = isExternal ? "a" : Link;

                return (
                  <Component
                    key={option.label}
                    href={option.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-light-gray transition-colors group"
                  >
                    <div className="w-10 h-10 bg-emerald/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald/20 transition-colors">
                      <option.icon className="w-5 h-5 text-emerald" />
                    </div>
                    <div>
                      <span className="block text-navy font-medium text-sm">
                        {option.label}
                      </span>
                      <span className="block text-slate text-xs">
                        {option.description}
                      </span>
                    </div>
                  </Component>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-light-gray border-t border-slate-light/20">
              <p className="text-xs text-slate text-center">
                Support hours: Mon-Fri, 8am-6pm EST
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen
            ? "bg-slate-600 hover:bg-slate-700"
            : "bg-emerald hover:bg-emerald/90"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close help menu" : "Open help menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <HelpCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
