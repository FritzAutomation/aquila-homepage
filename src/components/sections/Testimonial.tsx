"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "../ui";

const testimonials = [
  {
    quote:
      "I don't know how we would operate without the DMM System. It would be chaos!",
    author: "Robert Unruh",
    title: "",
    location: "New Holland, Pennsylvania",
    company: "",
  },
  {
    quote:
      "Part fabrication has greatly improved – literally from days to minutes! We've seen improved efficiency in time, labor, and material usage.",
    author: "Rommel B. Galo, P.Eng.",
    title: "Engineer",
    location: "Airdrie, Alberta, Canada",
    company: "Eaton",
  },
  {
    quote:
      "I have come to regard Aquila group as my own team, so much so, that I now understand the meaning of business partner. After 10 years with the DMM System, their support team responsiveness during critical business applications has been exceptional.",
    author: "Raj Patel",
    title: "",
    location: "Milton, Ontario, Canada",
    company: "",
  },
  {
    quote:
      "We have called them in the middle of the night and they have always been eager to help solve any issues. Their 15-year partnership and dedication to weekend and holiday maintenance availability has been invaluable.",
    author: "Michael Long",
    title: "",
    location: "Sumter, South Carolina",
    company: "",
  },
  {
    quote:
      "Aquila has been, and continues to be both timely and effective in their services.",
    author: "Kirsten Hallerud",
    title: "",
    location: "Greenwood, South Carolina",
    company: "",
  },
  {
    quote:
      "The team's dedication to delivering exactly what we needed for our real-time dashboards and inter-plant metrics has been exceptional.",
    author: "Gary Carnall",
    title: "",
    location: "Birmingham, England",
    company: "",
  },
  {
    quote:
      "Cycle time improved from 5 days to 2 days. Their 24/7 support access and expertise across platforms has been outstanding.",
    author: "Denise Hayes",
    title: "",
    location: "Asheville, North Carolina",
    company: "",
  },
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const current = testimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <SectionWrapper background="light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          What Our Clients Say
        </h2>
        <p className="text-lg text-slate">
          Trusted by manufacturers across North America and beyond
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate hover:text-navy hover:shadow-xl transition-all z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate hover:text-navy hover:shadow-xl transition-all z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Testimonial Card */}
        <div className="pt-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="pb-4"
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg relative" style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
                {/* Quote Icon */}
                <div className="absolute -top-6 left-8 w-12 h-12 bg-emerald rounded-full flex items-center justify-center shadow-md">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium text-navy leading-relaxed mb-8 pt-4">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-navy font-semibold text-lg">
                      {current.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{current.author}</p>
                    {current.title && (
                      <p className="text-slate">{current.title}</p>
                    )}
                    <p className="text-sm text-slate-light">
                      {current.company ? `${current.company} • ` : ""}
                      {current.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-emerald w-6"
                  : "bg-slate-light/50 hover:bg-slate-light"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-slate-light mt-4">
          {currentIndex + 1} of {testimonials.length}
        </p>
      </div>
    </SectionWrapper>
  );
}
