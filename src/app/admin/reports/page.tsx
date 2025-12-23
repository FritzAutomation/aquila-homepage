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
} from "lucide-react";

interface Company {
  id: string;
  name: string;
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
        </div>
      )}
    </div>
  );
}
