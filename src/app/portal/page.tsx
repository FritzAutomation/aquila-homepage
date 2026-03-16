"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Ticket,
  BookOpen,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  LogOut,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface UserProfile {
  name: string
  email: string
  user_type: string
  company_name?: string
}

interface ProgressRecord {
  step_id: string
  completed: boolean
}

interface TrainingModule {
  id: string
  title: string
  slug: string
  product: string
  lesson_count: number
  step_count: number
  is_public: boolean
  is_assigned: boolean
  lessons?: { id: string; steps: { id: string }[] }[]
}

interface TicketSummary {
  id: string
  ticket_number: number
  subject: string
  status: string
  created_at: string
}

const STATUS_ICONS: Record<string, typeof AlertCircle> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle2,
}

const STATUS_COLORS: Record<string, string> = {
  open: "text-blue-500",
  in_progress: "text-purple-500",
  resolved: "text-green-500",
  closed: "text-gray-400",
}

export default function CustomerPortal() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/auth/me")
        if (!userRes.ok) {
          router.push("/login")
          return
        }
        const userData = await userRes.json()
        if (userData.error) {
          router.push("/login")
          return
        }
        setUser(userData)

        const [modulesRes, progressRes, ticketsRes] = await Promise.all([
          fetch("/api/training"),
          fetch("/api/training/progress"),
          fetch("/api/tickets?limit=5"),
        ])

        if (modulesRes.ok) setModules(await modulesRes.json())
        if (progressRes.ok) setProgress(await progressRes.json())
        if (ticketsRes.ok) {
          const data = await ticketsRes.json()
          setTickets(data.tickets || [])
        }
      } catch {
        // Redirect on error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
      </div>
    )
  }

  if (!user) return null

  // Separate assigned vs public modules
  const assignedModules = modules.filter((m) => m.is_assigned)
  const publicModules = modules.filter((m) => m.is_public && !m.is_assigned)

  // Progress calculated only against assigned modules
  const assignedTotalSteps = assignedModules.reduce((sum, m) => sum + m.step_count, 0)
  const completedSteps = progress.filter((p) => p.completed).length
  const overallPercent =
    assignedTotalSteps > 0 ? Math.round((completedSteps / assignedTotalSteps) * 100) : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffDays < 1) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#1E3A5F] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
              &larr; Back to site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          {user.company_name && (
            <p className="text-white/60 text-sm mt-1">{user.company_name}</p>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Training Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#10B981]" />
              <h2 className="text-lg font-semibold text-[#1E3A5F]">
                Training Progress
              </h2>
            </div>
            <Link
              href="/training"
              className="text-sm text-[#10B981] hover:text-[#10B981]/80 font-medium flex items-center gap-1"
            >
              All modules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5">
            {/* Overall progress (assigned training only) */}
            {assignedModules.length > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-600">Assigned training completion</span>
                      <span className="font-medium text-[#1E3A5F]">{overallPercent}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all"
                        style={{ width: `${overallPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1E3A5F]">
                      {completedSteps}
                      <span className="text-sm font-normal text-gray-400">
                        /{assignedTotalSteps}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">steps completed</p>
                  </div>
                </div>

                {/* Assigned module cards */}
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Your Assigned Training
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {assignedModules.map((mod) => (
                    <Link
                      key={mod.id}
                      href={`/training/${mod.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all group"
                    >
                      <BookOpen className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E3A5F] truncate">
                          {mod.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {mod.lesson_count} lessons &bull; {mod.step_count} steps
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No training has been assigned to you yet
              </p>
            )}

            {/* Public modules (explore on your own) */}
            {publicModules.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Explore
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {publicModules.slice(0, 2).map((mod) => (
                    <Link
                      key={mod.id}
                      href={`/training/${mod.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all group"
                    >
                      <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-[#64748B] transition-colors flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E3A5F] truncate">
                          {mod.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {mod.lesson_count} lessons &bull; {mod.step_count} steps
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-[#1E3A5F]">
                Support Tickets
              </h2>
            </div>
            <Link
              href="/support/status"
              className="text-sm text-[#10B981] hover:text-[#10B981]/80 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {tickets.length === 0 ? (
            <div className="p-8 text-center">
              <Ticket className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No support tickets</p>
              <Link
                href="/support"
                className="text-sm text-[#10B981] hover:underline mt-1 inline-block"
              >
                Submit a request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket) => {
                const StatusIcon = STATUS_ICONS[ticket.status] || AlertCircle
                return (
                  <Link
                    key={ticket.id}
                    href={`/support/status`}
                    className="flex items-center gap-3 p-4 px-5 hover:bg-gray-50 transition-colors"
                  >
                    <StatusIcon
                      className={`w-4 h-4 flex-shrink-0 ${
                        STATUS_COLORS[ticket.status] || "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        TKT-{String(ticket.ticket_number).padStart(4, "0")} &bull;{" "}
                        {formatDate(ticket.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        ticket.status === "open"
                          ? "bg-blue-100 text-blue-700"
                          : ticket.status === "in_progress"
                          ? "bg-purple-100 text-purple-700"
                          : ticket.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLink href="/training" icon={GraduationCap} label="Training" />
          <QuickLink href="/support" icon={Ticket} label="New Ticket" />
          <QuickLink href="/support/kb" icon={BookOpen} label="Knowledge Base" />
          <QuickLink href="/support/status" icon={Clock} label="Ticket Status" />
        </div>
      </div>
    </div>
  )
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#10B981]/30 hover:shadow-sm transition-all text-center"
    >
      <Icon className="w-6 h-6 text-[#64748B]" />
      <span className="text-sm font-medium text-[#1E3A5F]">{label}</span>
    </Link>
  )
}
