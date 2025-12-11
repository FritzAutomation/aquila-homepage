"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings } from "lucide-react";
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

  useEffect(() => {
    // Check if user has already consented
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
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
                  <p className="text-sm text-slate mb-4">
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
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-navy text-sm">Necessary Cookies</p>
                              <p className="text-xs text-slate">Required for the website to function</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={consent.necessary}
                                disabled
                                className="sr-only"
                              />
                              <div className="w-10 h-6 bg-emerald rounded-full cursor-not-allowed">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                          </div>

                          {/* Analytics Cookies */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-navy text-sm">Analytics Cookies</p>
                              <p className="text-xs text-slate">Help us understand how visitors use our site</p>
                            </div>
                            <button
                              onClick={() => toggleConsent("analytics")}
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
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-navy text-sm">Marketing Cookies</p>
                              <p className="text-xs text-slate">Used to deliver relevant advertisements</p>
                            </div>
                            <button
                              onClick={() => toggleConsent("marketing")}
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
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-emerald text-white rounded-lg font-medium hover:bg-emerald/90 transition-colors text-sm"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleAcceptNecessary}
                      className="px-4 py-2 bg-gray-100 text-navy rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      Necessary Only
                    </button>
                    {showSettings ? (
                      <button
                        onClick={handleSavePreferences}
                        className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 transition-colors text-sm"
                      >
                        Save Preferences
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-4 py-2 text-slate hover:text-navy transition-colors text-sm flex items-center justify-center gap-1"
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
