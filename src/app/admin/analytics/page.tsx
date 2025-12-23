"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Package,
  Tag,
} from "lucide-react";
import {
  PRODUCT_LABELS,
  ISSUE_TYPE_LABELS,
  type Product,
  type IssueType,
} from "@/lib/types";

interface AnalyticsData {
  stats: {
    total_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    pending_tickets: number;
    resolved_tickets: number;
    closed_tickets: number;
    avg_response_hours: number | null;
    avg_resolution_hours: number | null;
  };
  by_product: Record<string, number>;
  by_issue_type: Record<string, number>;
  by_priority: Record<string, number>;
  recent_trend: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatHours = (hours: number | null) => {
    if (hours === null) return "N/A";
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  const statusData = [
    { label: "Open", value: data.stats.open_tickets, color: "bg-blue-500" },
    { label: "In Progress", value: data.stats.in_progress_tickets, color: "bg-purple-500" },
    { label: "Pending", value: data.stats.pending_tickets, color: "bg-yellow-500" },
    { label: "Resolved", value: data.stats.resolved_tickets, color: "bg-green-500" },
    { label: "Closed", value: data.stats.closed_tickets, color: "bg-gray-500" },
  ];

  const totalForBar = Math.max(...statusData.map(s => s.value), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-navy" />
            <span className="text-sm font-medium text-gray-600">Total Tickets</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.stats.total_tickets}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Active Tickets</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {data.stats.open_tickets + data.stats.in_progress_tickets}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-emerald" />
            <span className="text-sm font-medium text-gray-600">Avg Response</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatHours(data.stats.avg_response_hours)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Avg Resolution</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatHours(data.stats.avg_resolution_hours)}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-navy" />
          <h2 className="font-semibold text-gray-900">Tickets by Status</h2>
        </div>
        <div className="space-y-3">
          {statusData.map((status) => (
            <div key={status.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-24">{status.label}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.color} transition-all duration-500`}
                  style={{ width: `${(status.value / totalForBar) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8 text-right">
                {status.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Product and Issue Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Product */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-navy" />
            <h2 className="font-semibold text-gray-900">By Product</h2>
          </div>
          <div className="space-y-2">
            {Object.entries(data.by_product).length === 0 ? (
              <p className="text-sm text-gray-500">No data yet</p>
            ) : (
              Object.entries(data.by_product).map(([product, count]) => (
                <div key={product} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">
                    {PRODUCT_LABELS[product as Product] || product}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* By Issue Type */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-navy" />
            <h2 className="font-semibold text-gray-900">By Issue Type</h2>
          </div>
          <div className="space-y-2">
            {Object.entries(data.by_issue_type).length === 0 ? (
              <p className="text-sm text-gray-500">No data yet</p>
            ) : (
              Object.entries(data.by_issue_type).map(([issueType, count]) => (
                <div key={issueType} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">
                    {ISSUE_TYPE_LABELS[issueType as IssueType] || issueType}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-navy" />
          <h2 className="font-semibold text-gray-900">By Priority</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {["low", "normal", "high", "urgent"].map((priority) => {
            const count = data.by_priority[priority] || 0;
            const colors: Record<string, string> = {
              low: "bg-gray-100 text-gray-700",
              normal: "bg-blue-100 text-blue-700",
              high: "bg-orange-100 text-orange-700",
              urgent: "bg-red-100 text-red-700",
            };
            return (
              <div key={priority} className={`rounded-lg p-4 text-center ${colors[priority]}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm font-medium capitalize">{priority}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
