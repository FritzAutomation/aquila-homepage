"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Clock, ChevronRight, Layers } from "lucide-react"
import { Navigation, Footer } from "@/components/layout"
import { PageHeader } from "@/components/ui"

interface TrainingModule {
  id: string
  title: string
  slug: string
  description: string | null
  product: string
  sort_order: number
  is_published: boolean
  is_public: boolean
  is_assigned: boolean
  estimated_minutes: number | null
  lesson_count: number
  step_count: number
}

const productLabels: Record<string, string> = {
  dmm: "DMM System",
  "green-light": "Green Light Monitoring",
}

const productColors: Record<string, { bg: string; text: string; border: string }> = {
  dmm: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "green-light": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
}

export default function TrainingPage() {
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch("/api/training")
        if (res.ok) {
          const data = await res.json()
          setModules(data)
        }
      } catch (err) {
        console.error("Failed to fetch modules:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchModules()
  }, [])

  const filtered = filter === "all" ? modules : modules.filter((m) => m.product === filter)
  const dmmModules = filtered.filter((m) => m.product === "dmm")
  const glModules = filtered.filter((m) => m.product === "green-light")

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      <PageHeader
        title="Training Platform"
        subtitle="Interactive training modules for DMM and Green Light Monitoring. Complete lessons, pass knowledge checks, and track your progress."
        breadcrumb={[{ label: "Training", href: "/training" }]}
      />

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-light/20 p-2 flex gap-2 w-fit mx-auto">
          {[
            { value: "all", label: "All Modules" },
            { value: "dmm", label: "DMM System" },
            { value: "green-light", label: "Green Light" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? "bg-navy text-white"
                  : "text-slate hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {(filter === "all" || filter === "dmm") && dmmModules.length > 0 && (
              <ModuleSection title="DMM System" modules={dmmModules} />
            )}
            {(filter === "all" || filter === "green-light") && glModules.length > 0 && (
              <ModuleSection
                title="Green Light Monitoring"
                modules={glModules}
                className={filter === "all" && dmmModules.length > 0 ? "mt-12" : ""}
              />
            )}
            {filtered.length === 0 && (
              <p className="text-center text-slate py-12">No training modules available.</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

function ModuleSection({
  title,
  modules,
  className = "",
}: {
  title: string
  modules: TrainingModule[]
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-navy mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, index) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/training/${mod.slug}`}
              className="block bg-white rounded-xl shadow-sm border border-slate-light/20 p-6 hover:shadow-md hover:border-emerald/30 transition-all group"
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    productColors[mod.product]?.bg || "bg-gray-50"
                  } ${productColors[mod.product]?.text || "text-gray-700"}`}
                >
                  {productLabels[mod.product] || mod.product}
                </span>
                {mod.is_assigned && (
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                    Assigned
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-emerald transition-colors">
                {mod.title}
              </h3>

              {mod.description && (
                <p className="text-sm text-slate mb-4 line-clamp-2">{mod.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-slate mb-4">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {mod.lesson_count} lessons
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {mod.step_count} steps
                </span>
                {mod.estimated_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {mod.estimated_minutes} min
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-emerald">
                Start Learning
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
