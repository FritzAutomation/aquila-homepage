"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { Button, VideoModal } from "../ui";

const slides = [
  {
    image: "/images/MESSlider.png",
    title: "World Class MES Solutions",
    subtitle: "Real-Time, Integrated Dynamic Nesting",
    href: "/products/dmm",
  },
  {
    image: "/images/GreenLightSlider.png",
    title: "Machine Monitoring",
    subtitle: "Real-Time Dashboards, OEE Metrics",
    href: "/products/green-light",
  },
  {
    image: "/images/DMMv9slider.png",
    title: "Introducing DMM V9",
    subtitle: "Deeper Analytics, Reporting, Much More...",
    href: "/products/dmm",
  },
  {
    image: "/images/DashboardSlider.png",
    title: "Dynamic Dashboards",
    subtitle: "User-Customized KPI Metrics",
    href: "/products/dmm",
  },
  {
    image: "/images/MobileSlider1.png",
    title: "Production \"On-The-Go\"",
    subtitle: "Knowledge On Your Mobile Device",
    href: "/products/dmm",
  },
  {
    image: "/images/ReportMasterSlider.png",
    title: "Reports, Reports, Reports",
    subtitle: "Customize, Schedule, Distribute",
    href: "/products/dmm",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: {
      y: 30,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -30,
      opacity: 0,
    },
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative pt-20 md:pt-24 pb-16 md:pb-24 bg-gradient-to-br from-white to-light-gray overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Animated Text */}
          <div className="min-h-[280px] md:min-h-[320px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-emerald font-medium mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.p
                  className="text-lg text-slate mb-8 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Gain complete visibility into your shop floor. From order to
                  shipment, know exactly where every part is.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button href="/contact" size="lg">
                    Request a Demo
                  </Button>
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-navy font-medium hover:text-emerald transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Overview
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Content - Image Carousel */}
          <div className="relative">
            <div className="relative overflow-hidden">
              <div className="relative min-h-[200px] md:min-h-[250px] flex items-center justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={700}
                      height={300}
                      className="w-full h-auto max-h-[250px] object-contain"
                      priority={currentSlide === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-emerald"
                      : "w-2 bg-slate-light/50 hover:bg-slate-light"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-light/20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy">98.5%</p>
                  <p className="text-sm text-slate">OEE Score</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Mobile Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-slate-light/20 hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-navy">Mobile Ready</p>
                  <p className="text-xs text-slate-light">Access anywhere</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </section>
  );
}
