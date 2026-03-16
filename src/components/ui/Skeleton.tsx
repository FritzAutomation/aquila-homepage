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

// Admin skeleton loaders
export function AdminStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" className="w-24 h-3" />
              <Skeleton variant="text" className="w-12 h-8" />
            </div>
            <Skeleton variant="circular" className="w-10 h-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <AdminStatCardsSkeleton count={4} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <Skeleton variant="text" className="w-36 h-4 mb-4" />
            <Skeleton variant="text" className="w-16 h-10 mb-2" />
            <Skeleton variant="text" className="w-40 h-3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" className="w-28 h-4" />
            <Skeleton variant="text" className="w-20 h-4" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="space-y-1.5">
                <Skeleton variant="text" className="w-48 h-3" />
                <Skeleton variant="text" className="w-24 h-2.5" />
              </div>
              <Skeleton variant="rounded" className="w-14 h-5" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" className="w-28 h-4" />
            <Skeleton variant="text" className="w-20 h-4" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="space-y-1.5">
                <Skeleton variant="text" className="w-36 h-3" />
                <Skeleton variant="text" className="w-28 h-2.5" />
              </div>
              <Skeleton variant="rounded" className="w-16 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminTicketsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton variant="rounded" className="flex-1 h-10" />
        <Skeleton variant="rounded" className="w-24 h-10" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200 flex gap-6">
          {["w-8", "w-32", "w-40", "w-24", "w-16", "w-24", "w-24"].map((w, i) => (
            <Skeleton key={i} variant="text" className={`${w} h-3`} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={row} className="px-6 py-4 flex gap-6 items-center border-b border-gray-50">
            <Skeleton variant="rounded" className="w-4 h-4" />
            <div className="space-y-1.5 w-32">
              <Skeleton variant="text" className="w-20 h-3" />
              <Skeleton variant="text" className="w-full h-2.5" />
            </div>
            <div className="space-y-1.5 w-40">
              <Skeleton variant="text" className="w-28 h-3" />
              <Skeleton variant="text" className="w-36 h-2.5" />
            </div>
            <Skeleton variant="text" className="w-20 h-3" />
            <Skeleton variant="rounded" className="w-16 h-5" />
            <Skeleton variant="text" className="w-24 h-3" />
            <Skeleton variant="text" className="w-20 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCompaniesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center justify-between">
        <Skeleton variant="text" className="w-48 h-4" />
        <Skeleton variant="rounded" className="w-36 h-10" />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="rounded" className="flex-1 h-10 max-w-md" />
        <Skeleton variant="rounded" className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton variant="text" className="w-36 h-4" />
                <Skeleton variant="text" className="w-28 h-3" />
              </div>
              <Skeleton variant="rounded" className="w-14 h-5" />
            </div>
            <Skeleton variant="text" className="w-32 h-3" />
            <div className="flex justify-between pt-2">
              <Skeleton variant="text" className="w-20 h-3" />
              <Skeleton variant="text" className="w-20 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center justify-between">
        <Skeleton variant="rounded" className="flex-1 h-10 max-w-md" />
        <Skeleton variant="rounded" className="w-32 h-10" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-50">
            <Skeleton variant="circular" className="w-9 h-9" />
            <div className="flex-1 space-y-1.5">
              <Skeleton variant="text" className="w-32 h-3" />
              <Skeleton variant="text" className="w-48 h-2.5" />
            </div>
            <Skeleton variant="rounded" className="w-16 h-5" />
            <Skeleton variant="text" className="w-28 h-3" />
            <Skeleton variant="rounded" className="w-16 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
