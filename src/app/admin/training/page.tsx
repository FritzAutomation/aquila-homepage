"use client"

import { useEffect, useState, useCallback } from "react"
import {
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Loader2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Plus,
  X,
  ClipboardList,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"

// --- Types ---

interface UserModuleProgress {
  module_id: string
  module_title: string
  product: string
  completed_steps: number
  total_steps: number
  percent: number
}

interface UserProgress {
  user_id: string
  user_name: string
  user_email: string
  assigned_modules: number
  completed_steps: number
  total_steps: number
  percent: number
  modules: UserModuleProgress[]
}

interface OrgProgress {
  company_id: string
  company_name: string
  total_users: number
  users_with_assignments: number
  overall_percent: number
  users: UserProgress[]
}

interface TrainingSummary {
  total_modules: number
  total_assignments: number
  users_with_assignments: number
  total_completions: number
  orgs_with_assignments: number
}

interface TrainingData {
  summary: TrainingSummary
  organizations: OrgProgress[]
}

interface AvailableModule {
  id: string
  title: string
  product: string
  slug: string
  is_public: boolean
  is_published: boolean
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
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  // Assignment modal state
  const [assignModal, setAssignModal] = useState<{
    companyId: string
    companyName: string
    users: { id: string; name: string; email: string }[]
  } | null>(null)
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>([])
  const [allModules, setAllModules] = useState<AvailableModule[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set())
  const [assigning, setAssigning] = useState(false)

  const fetchModules = useCallback(() => {
    fetch("/api/training?admin=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((mods) => { if (mods) setAllModules(mods) })
      .catch(() => {})
  }, [])

  const fetchData = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/training")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchData()
    fetchModules()
  }, [fetchData, fetchModules])

  const handleModuleToggle = async (slug: string, field: "is_public" | "is_published", value: boolean) => {
    try {
      const res = await fetch(`/api/training/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      if (res.ok) {
        setAllModules((prev) =>
          prev.map((m) => (m.slug === slug ? { ...m, [field]: value } : m))
        )
      }
    } catch {
      // ignore
    }
  }

  const toggleOrg = (id: string) => {
    setExpandedOrgs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleUser = (id: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAssignModal = async (org: OrgProgress) => {
    setAssignModal({
      companyId: org.company_id,
      companyName: org.company_name,
      users: org.users.map((u) => ({
        id: u.user_id,
        name: u.user_name,
        email: u.user_email,
      })),
    })
    setSelectedUsers(new Set())
    setSelectedModules(new Set())

    // Fetch available modules
    const res = await fetch("/api/training")
    if (res.ok) {
      const mods = await res.json()
      setAvailableModules(mods)
    }
  }

  const handleAssign = async () => {
    if (selectedUsers.size === 0 || selectedModules.size === 0) return
    setAssigning(true)

    try {
      const res = await fetch("/api/admin/training/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ids: Array.from(selectedUsers),
          module_ids: Array.from(selectedModules),
        }),
      })

      if (res.ok) {
        setAssignModal(null)
        fetchData() // Refresh
      }
    } catch {
      // Error handling
    } finally {
      setAssigning(false)
    }
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
          label="Assigned Users"
          value={summary.users_with_assignments}
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
          label="Active Assignments"
          value={summary.total_assignments}
          icon={ClipboardList}
          color="bg-amber-50"
          iconColor="text-amber-500"
        />
      </div>

      {/* Manage Modules */}
      {allModules.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 p-5 border-b border-gray-200">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Manage Modules
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {allModules.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        productColors[mod.product] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {productLabels[mod.product] || mod.product}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {mod.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() =>
                      handleModuleToggle(mod.slug, "is_public", !mod.is_public)
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      mod.is_public
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title={mod.is_public ? "Public — anyone can view" : "Private — requires assignment"}
                  >
                    {mod.is_public ? (
                      <Globe className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                    {mod.is_public ? "Public" : "Assigned Only"}
                  </button>
                  <button
                    onClick={() =>
                      handleModuleToggle(mod.slug, "is_published", !mod.is_published)
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      mod.is_published
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    }`}
                    title={mod.is_published ? "Published — visible to users" : "Draft — hidden from users"}
                  >
                    {mod.is_published ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    {mod.is_published ? "Published" : "Draft"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  {/* Org Row */}
                  <div className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => toggleOrg(org.company_id)}
                      className="flex-1 flex items-center gap-4 p-4 px-5 text-left"
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
                          {org.total_users} users &bull;{" "}
                          {org.users_with_assignments} with assignments
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
                    <button
                      onClick={() => openAssignModal(org)}
                      className="mr-4 p-2 text-gray-400 hover:text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                      title="Assign training"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded: Per-User Progress */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pl-14 space-y-2">
                      {org.users.length === 0 ? (
                        <p className="text-sm text-gray-400 py-2">
                          No users in this organization
                        </p>
                      ) : (
                        org.users.map((user) => {
                          const isUserExpanded = expandedUsers.has(user.user_id)
                          return (
                            <div
                              key={user.user_id}
                              className="bg-gray-50 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleUser(user.user_id)}
                                className="w-full flex items-center gap-3 p-3 px-4 text-left hover:bg-gray-100 transition-colors"
                              >
                                {isUserExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.user_name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.user_email}
                                    {user.assigned_modules === 0 && (
                                      <span className="ml-2 text-amber-500">
                                        No training assigned
                                      </span>
                                    )}
                                  </p>
                                </div>
                                {user.assigned_modules > 0 && (
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-gray-500">
                                      {user.assigned_modules} module
                                      {user.assigned_modules !== 1 ? "s" : ""}
                                    </span>
                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald rounded-full"
                                        style={{
                                          width: `${user.percent}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 w-8 text-right">
                                      {user.percent}%
                                    </span>
                                  </div>
                                )}
                              </button>

                              {/* User's module breakdown */}
                              {isUserExpanded && user.modules.length > 0 && (
                                <div className="px-4 pb-3 pl-10 space-y-1.5">
                                  {user.modules.map((mod) => (
                                    <div
                                      key={mod.module_id}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      {mod.percent === 100 ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                      )}
                                      <span
                                        className={`font-medium px-1.5 py-0.5 rounded ${
                                          productColors[mod.product] ||
                                          "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {productLabels[mod.product] ||
                                          mod.product}
                                      </span>
                                      <span className="text-gray-700 flex-1 truncate">
                                        {mod.module_title}
                                      </span>
                                      <span className="text-gray-500">
                                        {mod.completed_steps}/{mod.total_steps}
                                      </span>
                                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-emerald rounded-full"
                                          style={{
                                            width: `${mod.percent}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {isUserExpanded && user.modules.length === 0 && (
                                <p className="px-4 pb-3 pl-10 text-xs text-gray-400">
                                  No modules assigned to this user
                                </p>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Assign Training Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Assign Training
                </h3>
                <p className="text-sm text-gray-500">{assignModal.companyName}</p>
              </div>
              <button
                onClick={() => setAssignModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Select Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Users
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {assignModal.users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => {
                          setSelectedUsers((prev) => {
                            const next = new Set(prev)
                            if (next.has(user.id)) next.delete(user.id)
                            else next.add(user.id)
                            return next
                          })
                        }}
                        className="rounded border-gray-300 text-emerald focus:ring-emerald"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (selectedUsers.size === assignModal.users.length) {
                      setSelectedUsers(new Set())
                    } else {
                      setSelectedUsers(
                        new Set(assignModal.users.map((u) => u.id))
                      )
                    }
                  }}
                  className="text-xs text-emerald hover:underline mt-1"
                >
                  {selectedUsers.size === assignModal.users.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              {/* Select Modules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Modules
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {availableModules.map((mod) => (
                    <label
                      key={mod.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules.has(mod.id)}
                        onChange={() => {
                          setSelectedModules((prev) => {
                            const next = new Set(prev)
                            if (next.has(mod.id)) next.delete(mod.id)
                            else next.add(mod.id)
                            return next
                          })
                        }}
                        className="rounded border-gray-300 text-emerald focus:ring-emerald"
                      />
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          productColors[mod.product] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {productLabels[mod.product] || mod.product}
                      </span>
                      <span className="text-sm text-gray-900">{mod.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? "s" : ""},{" "}
                {selectedModules.size} module
                {selectedModules.size !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setAssignModal(null)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={
                    selectedUsers.size === 0 ||
                    selectedModules.size === 0 ||
                    assigning
                  }
                  className="px-4 py-2 text-sm bg-emerald text-white rounded-lg hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {assigning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
