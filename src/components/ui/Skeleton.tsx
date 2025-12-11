"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-gray-200";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (animation === "wave") {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className} overflow-hidden relative`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["0%", "200%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <Skeleton variant="rounded" className="w-full h-48 mb-4" />
      <Skeleton variant="text" className="w-3/4 h-6 mb-2" />
      <Skeleton variant="text" className="w-1/2 h-4 mb-4" />
      <Skeleton variant="text" className="w-full h-4 mb-2" />
      <Skeleton variant="text" className="w-full h-4 mb-2" />
      <Skeleton variant="text" className="w-2/3 h-4" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton variant="rectangular" className="w-full h-56" />
      <div className="p-6">
        <Skeleton variant="text" className="w-1/3 h-4 mb-2" />
        <Skeleton variant="text" className="w-3/4 h-7 mb-3" />
        <Skeleton variant="text" className="w-full h-4 mb-2" />
        <Skeleton variant="text" className="w-full h-4 mb-2" />
        <Skeleton variant="text" className="w-2/3 h-4 mb-4" />
        <div className="flex gap-2">
          <Skeleton variant="rounded" className="w-24 h-10" />
          <Skeleton variant="rounded" className="w-24 h-10" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
      <Skeleton variant="circular" className="w-12 h-12 mb-6" />
      <Skeleton variant="text" className="w-full h-6 mb-3" />
      <Skeleton variant="text" className="w-full h-6 mb-3" />
      <Skeleton variant="text" className="w-3/4 h-6 mb-8" />
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-14 h-14" />
        <div>
          <Skeleton variant="text" className="w-32 h-5 mb-2" />
          <Skeleton variant="text" className="w-24 h-4" />
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rounded" className="w-full h-64" />
      <Skeleton variant="text" className="w-1/4 h-4" />
      <Skeleton variant="text" className="w-3/4 h-8" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-2/3 h-4" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      <Skeleton variant="circular" className="w-10 h-10" />
      <Skeleton variant="text" className="flex-1 h-4" />
      <Skeleton variant="text" className="w-24 h-4" />
      <Skeleton variant="text" className="w-20 h-4" />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="py-16 md:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton variant="text" className="w-48 h-4 mb-4 bg-white/20" />
        <Skeleton variant="text" className="w-96 h-12 mb-4 bg-white/20" />
        <Skeleton variant="text" className="w-72 h-6 bg-white/20" />
      </div>
    </div>
  );
}
