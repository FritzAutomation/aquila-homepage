"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Shield, BarChart3, Target } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "aquila-cookie-consent";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });
  const bannerRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user has already consented
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Focus the accept button when banner appears
  useEffect(() => {
    if (isVisible && acceptButtonRef.current) {
      acceptButtonRef.current.focus();
    }
  }, [isVisible]);

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleAcceptNecessary();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleAcceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(fullConsent);
  };

  const handleAcceptNecessary = () => {
    const minimalConsent: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimalConsent);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  const saveConsent = (consentState: ConsentState) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState));
    setIsVisible(false);
    // Here you would typically trigger analytics/marketing scripts based on consent
  };

  const toggleConsent = (key: keyof ConsentState) => {
    if (key === "necessary") return; // Can't disable necessary cookies
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          aria-describedby="cookie-description"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Main Banner */}
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 bg-emerald/10 rounded-xl items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-emerald" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    We value your privacy
                  </h3>
                  <p id="cookie-description" className="text-sm text-slate mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic,
                    and personalize content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
                    <Link href="/privacy" className="text-emerald hover:underline">
                      Learn more
                    </Link>
                  </p>

                  {/* Settings Panel */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 pt-4 mb-4 space-y-3">
                          {/* Necessary Cookies */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-emerald" />
                              </div>
                              <div>
                                <p className="font-medium text-navy text-sm">Necessary Cookies</p>
                                <p className="text-xs text-slate">Required for the website to function</p>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={consent.necessary}
                                disabled
                                className="sr-only"
                                id="necessary-cookies"
                              />
                              <label htmlFor="necessary-cookies" className="sr-only">Necessary cookies (always enabled)</label>
                              <div className="w-10 h-6 bg-emerald rounded-full cursor-not-allowed opacity-75" aria-hidden="true">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                          </div>

                          {/* Analytics Cookies */}
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium text-navy text-sm">Analytics Cookies</p>
                                <p className="text-xs text-slate">Help us understand how visitors use our site</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleConsent("analytics")}
                              role="switch"
                              aria-checked={consent.analytics}
                              aria-label="Toggle analytics cookies"
                              className="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
                              style={{ backgroundColor: consent.analytics ? "#10B981" : "#E5E7EB" }}
                            >
                              <motion.div
                                animate={{ x: consent.analytics ? 16 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"
                              />
                            </button>
                          </div>

                          {/* Marketing Cookies */}
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-purple-500" />
                              </div>
                              <div>
                                <p className="font-medium text-navy text-sm">Marketing Cookies</p>
                                <p className="text-xs text-slate">Used to deliver relevant advertisements</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleConsent("marketing")}
                              role="switch"
                              aria-checked={consent.marketing}
                              aria-label="Toggle marketing cookies"
                              className="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
                              style={{ backgroundColor: consent.marketing ? "#10B981" : "#E5E7EB" }}
                            >
                              <motion.div
                                animate={{ x: consent.marketing ? 16 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      ref={acceptButtonRef}
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-emerald text-white rounded-lg font-medium hover:bg-emerald/90 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleAcceptNecessary}
                      className="px-4 py-2 bg-gray-100 text-navy rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      Necessary Only
                    </button>
                    {showSettings ? (
                      <button
                        onClick={handleSavePreferences}
                        className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
                      >
                        Save Preferences
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-4 py-2 text-slate hover:text-navy transition-colors text-sm flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 rounded-lg"
                      >
                        <Settings className="w-4 h-4" />
                        Customize
                      </button>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleAcceptNecessary}
                  className="p-1 text-slate hover:text-navy transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
