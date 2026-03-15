"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  CheckCircle2,
  Circle,
  ChevronRight,
  GraduationCap,
  HelpCircle,
} from "lucide-react"

interface Step {
  id: string
  title: string
  step_type: "content" | "quiz"
  sort_order: number
}

interface Lesson {
  id: string
  title: string
  slug: string
  description: string | null
  sort_order: number
  estimated_minutes: number | null
  steps: Step[]
}

interface Module {
  id: string
  title: string
  slug: string
  description: string | null
  product: string
  estimated_minutes: number | null
  lessons: Lesson[]
}

interface ProgressRecord {
  step_id: string
  completed: boolean
}

const productLabels: Record<string, string> = {
  dmm: "DMM System",
  "green-light": "Green Light Monitoring",
}

export default function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [module_, setModule] = useState<Module | null>(null)
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/training/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setModule(data)
        }

        // Try to fetch progress (will 401 if not logged in, that's fine)
        try {
          const progRes = await fetch(`/api/training/progress`)
          if (progRes.ok) {
            setProgress(await progRes.json())
          }
        } catch {
          // Not logged in, no progress
        }
      } catch (err) {
        console.error("Failed to fetch module:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-64 bg-gray-200 rounded mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!module_) {
    return (
      <div className="min-h-screen bg-light-gray pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Module Not Found</h1>
          <Link href="/training" className="text-emerald hover:underline">
            Back to Training
          </Link>
        </div>
      </div>
    )
  }

  const completedStepIds = new Set(progress.filter((p) => p.completed).map((p) => p.step_id))
  const totalSteps = module_.lessons.reduce((sum, l) => sum + l.steps.length, 0)
  const completedSteps = module_.lessons.reduce(
    (sum, l) => sum + l.steps.filter((s) => completedStepIds.has(s.id)).length,
    0
  )
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <div className="min-h-screen bg-light-gray pt-20">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/training"
            className="inline-flex items-center gap-1 text-slate-light hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Modules
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm text-emerald font-medium">
              {productLabels[module_.product] || module_.product}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mt-1 mb-3">{module_.title}</h1>
            {module_.description && (
              <p className="text-slate-light max-w-2xl">{module_.description}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 text-sm text-slate-light">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {module_.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {totalSteps} steps
              </span>
              {module_.estimated_minutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  ~{module_.estimated_minutes} min
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {completedSteps > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-light">Progress</span>
                  <span className="text-emerald font-medium">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Lessons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {module_.lessons.map((lesson, index) => {
            const lessonCompleted = lesson.steps.every((s) => completedStepIds.has(s.id))
            const lessonStarted = lesson.steps.some((s) => completedStepIds.has(s.id))
            const lessonCompletedCount = lesson.steps.filter((s) =>
              completedStepIds.has(s.id)
            ).length

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-light/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate bg-gray-100 px-2 py-0.5 rounded">
                          Lesson {index + 1}
                        </span>
                        {lessonCompleted && (
                          <span className="text-xs font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-navy">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-sm text-slate mt-1">{lesson.description}</p>
                      )}
                    </div>
                    <Link
                      href={`/training/${slug}/${lesson.slug}`}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald/90 transition-colors shrink-0"
                    >
                      {lessonCompleted ? "Review" : lessonStarted ? "Continue" : "Start"}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Steps preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lesson.steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                          completedStepIds.has(step.id)
                            ? "bg-emerald/10 text-emerald"
                            : "bg-gray-100 text-slate"
                        }`}
                      >
                        {completedStepIds.has(step.id) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                        {step.step_type === "quiz" ? (
                          <HelpCircle className="w-3 h-3" />
                        ) : (
                          <GraduationCap className="w-3 h-3" />
                        )}
                        {step.title}
                      </div>
                    ))}
                  </div>

                  {/* Lesson progress */}
                  {lessonStarted && !lessonCompleted && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald rounded-full transition-all"
                          style={{
                            width: `${(lessonCompletedCount / lesson.steps.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
