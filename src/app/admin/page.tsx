"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  avg_response_hours: number | null;
  avg_resolution_hours: number | null;
}

interface RecentTicket {
  id: string;
  ticket_number: number;
  subject: string;
  status: string;
  priority: string;
  product: string;
  email: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-500",
  normal: "text-blue-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch ticket stats
        const statsRes = await fetch("/api/analytics/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent tickets
        const ticketsRes = await fetch("/api/tickets?limit=5");
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setRecentTickets(ticketsData.tickets || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatHours = (hours: number | null) => {
    if (hours === null) return "N/A";
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Open Tickets",
      value: stats?.open_tickets || 0,
      icon: AlertCircle,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "In Progress",
      value: stats?.in_progress_tickets || 0,
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Resolved",
      value: stats?.resolved_tickets || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Tickets",
      value: stats?.total_tickets || 0,
      icon: Ticket,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald" />
            <h3 className="font-medium text-gray-900">Avg. First Response</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatHours(stats?.avg_response_hours || null)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Target: 24h for normal priority
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald" />
            <h3 className="font-medium text-gray-900">Avg. Resolution Time</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatHours(stats?.avg_resolution_hours || null)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Target: 72h for normal priority
          </p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
          <Link
            href="/admin/tickets"
            className="text-sm text-emerald hover:text-emerald/80 font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-8 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tickets yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Tickets will appear here when customers submit them
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-700">
                      TKT-{String(ticket.ticket_number).padStart(4, "0")}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[ticket.status] || STATUS_COLORS.open
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.normal
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {ticket.email} &bull; {formatDate(ticket.created_at)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
