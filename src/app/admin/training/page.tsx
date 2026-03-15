"use client"

import { useEffect, useState } from "react"
import {
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface ModuleProgress {
  module_id: string
  module_title: string
  product: string
  completed_steps: number
  total_steps: number
  percent: number
}

interface OrgProgress {
  company_id: string
  company_name: string
  total_users: number
  active_learners: number
  overall_percent: number
  modules: ModuleProgress[]
}

interface TrainingSummary {
  total_modules: number
  total_learners: number
  total_completions: number
  orgs_with_progress: number
}

interface TrainingData {
  summary: TrainingSummary
  organizations: OrgProgress[]
}

const productLabels: Record<string, string> = {
  dmm: "DMM",
  "green-light": "Green Light",
}

const productColors: Record<string, string> = {
  dmm: "bg-blue-100 text-blue-700",
  "green-light": "bg-emerald-100 text-emerald-700",
}

export default function AdminTrainingPage() {
  const [data, setData] = useState<TrainingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/admin/training")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleOrg = (id: string) => {
    setExpandedOrgs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load training data.</p>
      </div>
    )
  }

  const { summary, organizations } = data

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Training Modules"
          value={summary.total_modules}
          icon={BookOpen}
          color="bg-purple-50"
          iconColor="text-purple-500"
        />
        <SummaryCard
          label="Active Learners"
          value={summary.total_learners}
          icon={Users}
          color="bg-blue-50"
          iconColor="text-blue-500"
        />
        <SummaryCard
          label="Steps Completed"
          value={summary.total_completions}
          icon={GraduationCap}
          color="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <SummaryCard
          label="Orgs with Progress"
          value={summary.orgs_with_progress}
          icon={Building2}
          color="bg-amber-50"
          iconColor="text-amber-500"
        />
      </div>

      {/* Org Progress Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 p-5 border-b border-gray-200">
          <Building2 className="w-5 h-5 text-navy" />
          <h2 className="text-lg font-semibold text-gray-900">
            Progress by Organization
          </h2>
        </div>

        {organizations.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No organizations found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {organizations.map((org) => {
              const isExpanded = expandedOrgs.has(org.company_id)
              return (
                <div key={org.company_id}>
                  <button
                    onClick={() => toggleOrg(org.company_id)}
                    className="w-full flex items-center gap-4 p-4 px-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {org.company_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {org.total_users} users &bull; {org.active_learners} active learners
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald rounded-full transition-all"
                          style={{ width: `${org.overall_percent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10 text-right">
                        {org.overall_percent}%
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 pl-14">
                      <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                        {org.modules.map((mod) => (
                          <div
                            key={mod.module_id}
                            className="flex items-center gap-3 p-3 px-4"
                          >
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                productColors[mod.product] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {productLabels[mod.product] || mod.product}
                            </span>
                            <span className="text-sm text-gray-900 flex-1">
                              {mod.module_title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {mod.completed_steps}/{mod.total_steps} steps
                            </span>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald rounded-full"
                                style={{ width: `${mod.percent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 w-8 text-right">
                              {mod.percent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  iconColor,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  iconColor: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}
