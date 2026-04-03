"use client";

import { useState, useEffect } from "react";
import { Button } from "./index";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (roughly 400px)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-sm border-t border-slate-light/20 px-4 py-3 safe-bottom">
      <Button href="/contact" className="w-full">
        Request a Demo
      </Button>
    </div>
  );
}
