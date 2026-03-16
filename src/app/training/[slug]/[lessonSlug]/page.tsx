"use client"

import { useState, useEffect, useCallback, use } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Navigation } from "@/components/layout"

interface Step {
  id: string
  title: string
  step_type: "content" | "quiz"
  content: string | null
  sort_order: number
  quiz_question: string | null
  quiz_options: string[] | null
  quiz_correct_index: number | null
  quiz_explanation: string | null
}

interface Lesson {
  id: string
  title: string
  slug: string
  description: string | null
  steps: Step[]
}

interface Module {
  id: string
  title: string
  slug: string
  lessons: Lesson[]
}

interface ProgressRecord {
  step_id: string
  completed: boolean
  quiz_passed: boolean | null
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = use(params)
  const [module_, setModule] = useState<Module | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/training/${slug}`)
        if (res.ok) {
          const data: Module = await res.json()
          setModule(data)
          const found = data.lessons.find((l) => l.slug === lessonSlug)
          setLesson(found || null)
        }

        try {
          const progRes = await fetch(`/api/training/progress`)
          if (progRes.ok) {
            setProgress(await progRes.json())
          }
        } catch {
          // Not logged in
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, lessonSlug])

  const markComplete = useCallback(
    async (stepId: string, quizAnswerIndex?: number, passed?: boolean) => {
      try {
        const body: Record<string, unknown> = { step_id: stepId, completed: true }
        if (quizAnswerIndex !== undefined) {
          body.quiz_answer_index = quizAnswerIndex
          body.quiz_passed = passed
        }
        const res = await fetch("/api/training/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const record = await res.json()
          setProgress((prev) => {
            const existing = prev.findIndex((p) => p.step_id === stepId)
            if (existing >= 0) {
              const updated = [...prev]
              updated[existing] = record
              return updated
            }
            return [...prev, record]
          })
        }
      } catch {
        // Progress save failed silently
      }
    },
    []
  )

  const handleContentComplete = useCallback(() => {
    if (!lesson) return
    const step = lesson.steps[currentStep]
    if (step && step.step_type === "content") {
      markComplete(step.id)
    }
  }, [lesson, currentStep, markComplete])

  const handleQuizSubmit = useCallback(() => {
    if (!lesson || selectedAnswer === null) return
    const step = lesson.steps[currentStep]
    if (!step || step.step_type !== "quiz") return

    const passed = selectedAnswer === step.quiz_correct_index
    setQuizPassed(passed)
    setShowResult(true)
    markComplete(step.id, selectedAnswer, passed)
  }, [lesson, currentStep, selectedAnswer, markComplete])

  const goToStep = useCallback(
    (index: number) => {
      if (!lesson) return
      // Mark current content step complete when navigating away
      const currentStepData = lesson.steps[currentStep]
      if (currentStepData?.step_type === "content") {
        markComplete(currentStepData.id)
      }
      setCurrentStep(index)
      setSelectedAnswer(null)
      setShowResult(false)
      setQuizPassed(false)
    },
    [lesson, currentStep, markComplete]
  )

  const nextStep = useCallback(() => {
    if (!lesson) return
    if (currentStep < lesson.steps.length - 1) {
      goToStep(currentStep + 1)
    }
  }, [lesson, currentStep, goToStep])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray pt-24">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-96 bg-gray-200 rounded mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!module_ || !lesson) {
    return (
      <div className="min-h-screen bg-light-gray pt-24 text-center py-12">
        <h1 className="text-2xl font-bold text-navy mb-4">Lesson Not Found</h1>
        <Link href={`/training/${slug}`} className="text-emerald hover:underline">
          Back to Module
        </Link>
      </div>
    )
  }

  const step = lesson.steps[currentStep]
  const completedStepIds = new Set(progress.filter((p) => p.completed).map((p) => p.step_id))
  const isLastStep = currentStep === lesson.steps.length - 1
  const allComplete = lesson.steps.every((s) => completedStepIds.has(s.id))

  // Find next lesson
  const currentLessonIndex = module_.lessons.findIndex((l) => l.slug === lessonSlug)
  const nextLesson = module_.lessons[currentLessonIndex + 1]

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-light/20 sticky top-16 md:top-20 z-10 mt-16 md:mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-1.5 text-sm text-slate">
              <Link href="/training" className="hover:text-navy transition-colors">Training</Link>
              <span className="text-gray-300">/</span>
              <Link href={`/training/${slug}`} className="hover:text-navy transition-colors truncate max-w-[150px]">{module_.title}</Link>
              <span className="text-gray-300">/</span>
              <span className="text-navy font-medium truncate max-w-[150px]">{lesson.title}</span>
            </nav>
            <span className="text-sm text-slate">
              Step {currentStep + 1} of {lesson.steps.length}
            </span>
          </div>

          {/* Step indicators */}
          <div className="flex gap-1 mt-2">
            {lesson.steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i === currentStep
                    ? "bg-emerald"
                    : completedStepIds.has(s.id)
                      ? "bg-emerald/40"
                      : "bg-gray-200"
                }`}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step header */}
            <div className="flex items-center gap-2 mb-4">
              {step.step_type === "quiz" ? (
                <HelpCircle className="w-5 h-5 text-amber-500" />
              ) : (
                <BookOpen className="w-5 h-5 text-emerald" />
              )}
              <h2 className="text-lg font-semibold text-navy">{step.title}</h2>
            </div>

            {step.step_type === "content" ? (
              /* Content Step */
              <div className="bg-white rounded-xl shadow-sm border border-slate-light/20 p-6 md:p-8">
                <div className="prose max-w-none prose-a:text-emerald [&_h1]:!text-[#1E3A5F] [&_h2]:!text-[#1E3A5F] [&_h3]:!text-[#1E3A5F] [&_h4]:!text-[#1E3A5F] [&_p]:!text-[#374151] [&_li]:!text-[#374151] [&_ol]:!text-[#374151] [&_ul]:!text-[#374151] [&_strong]:!text-[#1E3A5F]">
                  <ReactMarkdown>{step.content || ""}</ReactMarkdown>
                </div>
              </div>
            ) : (
              /* Quiz Step */
              <div className="bg-white rounded-xl shadow-sm border border-slate-light/20 p-6 md:p-8">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-amber-800 text-lg">
                    {step.quiz_question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {(step.quiz_options || []).map((option, i) => {
                    let optionStyle =
                      "border-slate-light/30 hover:border-emerald/50 hover:bg-emerald/5"
                    if (showResult) {
                      if (i === step.quiz_correct_index) {
                        optionStyle = "border-emerald bg-emerald/10"
                      } else if (i === selectedAnswer && !quizPassed) {
                        optionStyle = "border-red-400 bg-red-50"
                      } else {
                        optionStyle = "border-slate-light/20 opacity-50"
                      }
                    } else if (selectedAnswer === i) {
                      optionStyle = "border-emerald bg-emerald/5"
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => !showResult && setSelectedAnswer(i)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                            showResult && i === step.quiz_correct_index
                              ? "bg-emerald text-white"
                              : showResult && i === selectedAnswer && !quizPassed
                                ? "bg-red-400 text-white"
                                : selectedAnswer === i
                                  ? "bg-emerald text-white"
                                  : "bg-gray-100 text-slate"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-navy">{option}</span>
                        {showResult && i === step.quiz_correct_index && (
                          <CheckCircle2 className="w-5 h-5 text-emerald ml-auto" />
                        )}
                        {showResult && i === selectedAnswer && !quizPassed && (
                          <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {!showResult && (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="mt-6 px-6 py-2.5 bg-emerald text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald/90 transition-colors"
                  >
                    Submit Answer
                  </button>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg ${
                      quizPassed
                        ? "bg-emerald/10 border border-emerald/20"
                        : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <p
                      className={`font-semibold mb-1 ${
                        quizPassed ? "text-emerald" : "text-amber-700"
                      }`}
                    >
                      {quizPassed ? "Correct!" : "Not quite right"}
                    </p>
                    {step.quiz_explanation && (
                      <p className="text-sm text-slate">{step.quiz_explanation}</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLastStep ? (
            <div className="flex items-center gap-3">
              {step.step_type === "content" && (
                <button
                  onClick={handleContentComplete}
                  className="px-4 py-2 text-sm font-medium text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                >
                  Mark Complete
                </button>
              )}
              {allComplete && nextLesson ? (
                <Link
                  href={`/training/${slug}/${nextLesson.slug}`}
                  className="flex items-center gap-1 px-5 py-2.5 bg-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald/90 transition-colors"
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : allComplete ? (
                <Link
                  href={`/training/${slug}`}
                  className="flex items-center gap-1 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Back to Module
                </Link>
              ) : null}
            </div>
          ) : (
            <button
              onClick={() => {
                if (step.step_type === "content") handleContentComplete()
                nextStep()
              }}
              className="flex items-center gap-1 px-5 py-2.5 bg-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald/90 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
