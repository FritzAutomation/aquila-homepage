"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Building2,
  Calendar,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
}

interface UserTrainingProgress {
  user_name: string;
  user_email: string;
  modules_assigned: number;
  steps_completed: number;
  total_steps: number;
  completion_percent: number;
  quizzes_passed: number;
  quizzes_failed: number;
}

interface ModuleProgress {
  module_title: string;
  product: string;
  users_assigned: number;
  users_completed: number;
  avg_completion: number;
}

interface TrainingSummary {
  total_users: number;
  users_with_assignments: number;
  total_assignments: number;
  total_steps_completed: number;
  total_quizzes_passed: number;
  total_quizzes_failed: number;
  user_progress: UserTrainingProgress[];
  by_module: ModuleProgress[];
}

interface ReportData {
  company: {
    id: string;
    name: string;
  };
  year: number;
  total_tickets: number;
  resolved_tickets: number;
  avg_response_hours: number | null;
  avg_resolution_hours: number | null;
  by_product: Record<string, number>;
  by_issue_type: Record<string, number>;
  monthly_breakdown: { month: string; count: number }[];
  training: TrainingSummary;
}

export default function ReportsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setCompaniesLoading(false);
    }
  }

  async function generateReport() {
    if (!selectedCompany) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch(
        `/api/reports?company_id=${selectedCompany}&year=${selectedYear}`
      );
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatHours = (hours: number | null) => {
    if (hours === null) return "N/A";
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${Math.round(hours)} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-navy" />
          <h2 className="font-semibold text-gray-900">Generate Customer Report</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            {companiesLoading ? (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
              >
                <option value="">Select a company...</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={!selectedCompany || loading}
              className="w-full px-4 py-2 bg-emerald text-white font-medium rounded-lg hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Generate Report
            </button>
          </div>
        </div>

        {companies.length === 0 && !companiesLoading && (
          <div className="text-center py-8 text-gray-600">
            <Building2 className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No companies found. Reports will be available once customers submit tickets.</p>
          </div>
        )}
      </div>

      {/* Report Results */}
      {report && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{report.company.name}</h2>
                <p className="text-gray-600">Annual Support Report - {report.year}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-navy" />
                  <span className="text-sm text-gray-700">Total Tickets</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{report.total_tickets}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Resolved</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{report.resolved_tickets}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-emerald" />
                  <span className="text-sm text-gray-700">Avg Response</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHours(report.avg_response_hours)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Resolution Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {report.total_tickets > 0
                    ? Math.round((report.resolved_tickets / report.total_tickets) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-navy" />
              <h3 className="font-semibold text-gray-900">Monthly Breakdown</h3>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {report.monthly_breakdown.map((month) => (
                <div key={month.month} className="text-center">
                  <div
                    className="bg-emerald/20 rounded-t-lg mx-auto"
                    style={{
                      height: `${Math.max(20, month.count * 20)}px`,
                      width: "100%",
                      maxWidth: "40px",
                    }}
                  />
                  <p className="text-xs text-gray-700 mt-1">{month.month}</p>
                  <p className="text-sm font-medium">{month.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">By Product</h3>
              <div className="space-y-2">
                {Object.entries(report.by_product).map(([product, count]) => (
                  <div key={product} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-700">{product}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(report.by_product).length === 0 && (
                  <p className="text-gray-500 text-sm">No tickets in this period</p>
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">By Issue Type</h3>
              <div className="space-y-2">
                {Object.entries(report.by_issue_type).map(([type, count]) => (
                  <div key={type} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-700">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(report.by_issue_type).length === 0 && (
                  <p className="text-gray-500 text-sm">No tickets in this period</p>
                )}
              </div>
            </div>
          </div>

          {/* Training Section */}
          {report.training && report.training.total_users > 0 && (
            <>
              {/* Training Header */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Training Overview</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">Users in Training</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {report.training.users_with_assignments}
                      <span className="text-sm font-normal text-gray-500">
                        /{report.training.total_users}
                      </span>
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Assignments</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {report.training.total_assignments}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Steps Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {report.training.total_steps_completed}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-700">Quizzes Passed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {report.training.total_quizzes_passed}
                      {report.training.total_quizzes_failed > 0 && (
                        <span className="text-sm font-normal text-red-500 ml-1">
                          ({report.training.total_quizzes_failed} failed)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Per-Module Progress */}
              {report.training.by_module.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Progress by Module</h3>
                  <div className="space-y-3">
                    {report.training.by_module.map((mod) => (
                      <div key={mod.module_title} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {mod.module_title}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {mod.product}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                mod.avg_completion >= 100 ? "bg-green-500" :
                                mod.avg_completion >= 50 ? "bg-emerald" : "bg-blue-500"
                              }`}
                              style={{ width: `${mod.avg_completion}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {mod.users_completed}/{mod.users_assigned} users completed
                            </span>
                            <span className="text-xs font-medium text-gray-700">
                              {mod.avg_completion}% avg
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-User Training Progress */}
              {report.training.user_progress.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Individual Progress</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 pr-4 font-medium text-gray-700">User</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-700">Modules</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-700">Steps</th>
                          <th className="text-center py-2 px-2 font-medium text-gray-700">Quizzes</th>
                          <th className="text-right py-2 pl-4 font-medium text-gray-700">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.training.user_progress.map((user) => (
                          <tr key={user.user_email} className="border-b border-gray-50">
                            <td className="py-2.5 pr-4">
                              <p className="font-medium text-gray-900">{user.user_name}</p>
                              <p className="text-xs text-gray-500">{user.user_email}</p>
                            </td>
                            <td className="text-center py-2.5 px-2 text-gray-700">
                              {user.modules_assigned}
                            </td>
                            <td className="text-center py-2.5 px-2 text-gray-700">
                              {user.steps_completed}/{user.total_steps}
                            </td>
                            <td className="text-center py-2.5 px-2">
                              <span className="text-green-600">{user.quizzes_passed}</span>
                              {user.quizzes_failed > 0 && (
                                <span className="text-red-500 ml-1">/ {user.quizzes_failed}</span>
                              )}
                            </td>
                            <td className="text-right py-2.5 pl-4">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      user.completion_percent >= 100 ? "bg-green-500" :
                                      user.completion_percent >= 50 ? "bg-emerald" : "bg-blue-500"
                                    }`}
                                    style={{ width: `${user.completion_percent}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-medium w-8 text-right ${
                                  user.completion_percent >= 100 ? "text-green-600" : "text-gray-700"
                                }`}>
                                  {user.completion_percent}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {report.training.users_with_assignments === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No training assigned to users at this company</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
