"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ticket,
  X,
  CheckSquare,
  Square,
  Minus,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  PRODUCT_LABELS,
  ISSUE_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  type Product,
  type IssueType,
  type TicketStatus,
  type Priority,
} from "@/lib/types";
import {
  calculateSLAStatus,
  formatTimeRemaining,
  DEFAULT_SLA_CONFIGS,
  type SLAConfig,
} from "@/lib/sla";

interface TicketRow {
  id: string;
  ticket_number: number;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  product: Product;
  issue_type: IssueType;
  email: string;
  name: string | null;
  created_at: string;
  first_response_at: string | null;
  resolved_at: string | null;
  company: { id: string; name: string; domain: string | null } | null;
  assigned_to: string | null;
  assignee: { id: string; name: string } | null;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const PRIORITY_DOTS: Record<string, string> = {
  low: "bg-gray-400",
  normal: "bg-blue-400",
  high: "bg-orange-400",
  urgent: "bg-red-500",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>(DEFAULT_SLA_CONFIGS);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchTickets = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (product) params.set("product", product);
      if (issueType) params.set("issue_type", issueType);
      if (priority) params.set("priority", priority);
      if (assignedTo) params.set("assigned_to", assignedTo);

      const res = await fetch(`/api/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [search, status, product, issueType, priority, assignedTo]);

  useEffect(() => {
    fetchTickets(1);
  }, [fetchTickets]);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/staff");
        if (res.ok) {
          const data = await res.json();
          setStaffMembers(data.staff || []);
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      }
    }

    async function fetchSLAConfigs() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.sla_config && data.sla_config.length > 0) {
            setSlaConfigs(data.sla_config);
          }
        }
      } catch (error) {
        console.error("Failed to fetch SLA configs:", error);
      }
    }

    fetchStaff();
    fetchSLAConfigs();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setProduct("");
    setIssueType("");
    setPriority("");
    setAssignedTo("");
  };

  const hasActiveFilters = search || status || product || issueType || priority || assignedTo;

  // Selection helpers
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedTickets.size === tickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(tickets.map(t => t.id)));
    }
  };

  const clearSelection = () => {
    setSelectedTickets(new Set());
  };

  // Bulk actions
  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedTickets.size === 0) return;

    setBulkUpdating(true);
    try {
      const res = await fetch('/api/tickets/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_ids: Array.from(selectedTickets),
          action,
          value
        })
      });

      if (res.ok) {
        await fetchTickets(pagination.page);
        clearSelection();
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setBulkUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get SLA indicator for a ticket
  const getSLAIndicator = (ticket: TicketRow) => {
    const slaStatus = calculateSLAStatus(ticket, slaConfigs);

    // Check for breaches first (highest priority)
    if (slaStatus.firstResponse.status === "breached") {
      return {
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        label: `First response ${formatTimeRemaining(slaStatus.firstResponse.hoursRemaining || 0)}`,
      };
    }
    if (slaStatus.resolution.status === "breached") {
      return {
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        label: `Resolution ${formatTimeRemaining(slaStatus.resolution.hoursRemaining || 0)}`,
      };
    }

    // Check for warnings
    if (slaStatus.firstResponse.status === "warning") {
      return {
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        label: `First response ${formatTimeRemaining(slaStatus.firstResponse.hoursRemaining || 0)}`,
      };
    }
    if (slaStatus.resolution.status === "warning") {
      return {
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        label: `Resolution ${formatTimeRemaining(slaStatus.resolution.hoursRemaining || 0)}`,
      };
    }

    return null;
  };

  // Count tickets with SLA issues
  const slaBreachedCount = tickets.filter((t) => {
    const sla = calculateSLAStatus(t, slaConfigs);
    return sla.firstResponse.status === "breached" || sla.resolution.status === "breached";
  }).length;

  const slaWarningCount = tickets.filter((t) => {
    const sla = calculateSLAStatus(t, slaConfigs);
    return sla.firstResponse.status === "warning" || sla.resolution.status === "warning";
  }).length;

  return (
    <div className="space-y-4">
      {/* SLA Alert Banner */}
      {(slaBreachedCount > 0 || slaWarningCount > 0) && (
        <div className={`rounded-lg p-3 flex items-center gap-3 ${
          slaBreachedCount > 0 ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"
        }`}>
          {slaBreachedCount > 0 ? (
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${slaBreachedCount > 0 ? "text-red-700" : "text-amber-700"}`}>
              {slaBreachedCount > 0 && (
                <span>{slaBreachedCount} ticket{slaBreachedCount > 1 ? "s have" : " has"} breached SLA</span>
              )}
              {slaBreachedCount > 0 && slaWarningCount > 0 && <span className="mx-1">·</span>}
              {slaWarningCount > 0 && (
                <span>{slaWarningCount} ticket{slaWarningCount > 1 ? "s" : ""} approaching deadline</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "border-emerald bg-emerald/5 text-emerald"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-emerald rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
            >
              <option value="">All Products</option>
              {Object.entries(PRODUCT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
            >
              <option value="">All Types</option>
              {Object.entries(ISSUE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
            >
              <option value="">All Priorities</option>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
            >
              <option value="">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedTickets.size > 0 && (
        <div className="bg-emerald/5 border border-emerald/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-emerald">
              {selectedTickets.size} ticket{selectedTickets.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction('status', e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={bulkUpdating}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
            >
              <option value="">Change Status...</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction('priority', e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={bulkUpdating}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
            >
              <option value="">Change Priority...</option>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              onChange={(e) => {
                if (e.target.value !== '') {
                  handleBulkAction('assign', e.target.value === 'unassign' ? '' : e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={bulkUpdating}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
            >
              <option value="">Assign to...</option>
              <option value="unassign">Unassign</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
            {bulkUpdating && <Loader2 className="w-4 h-4 animate-spin text-emerald" />}
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No tickets found</p>
            <p className="text-sm text-gray-400 mt-1">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Tickets will appear here when customers submit them"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <button
                        onClick={toggleSelectAll}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {selectedTickets.size === tickets.length && tickets.length > 0 ? (
                          <CheckSquare className="w-5 h-5 text-emerald" />
                        ) : selectedTickets.size > 0 ? (
                          <Minus className="w-5 h-5 text-emerald" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Ticket
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                      Assignee
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-gray-50 transition-colors ${selectedTickets.has(ticket.id) ? 'bg-emerald/5' : ''}`}
                    >
                      <td className="w-10 px-4 py-3">
                        <button
                          onClick={() => toggleTicketSelection(ticket.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {selectedTickets.has(ticket.id) ? (
                            <CheckSquare className="w-5 h-5 text-emerald" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/tickets/${ticket.id}`}
                          className="block"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                PRIORITY_DOTS[ticket.priority]
                              }`}
                              title={PRIORITY_LABELS[ticket.priority]}
                            />
                            <span className="text-sm font-mono text-gray-700">
                              TKT-{String(ticket.ticket_number).padStart(4, "0")}
                            </span>
                            {(() => {
                              const slaIndicator = getSLAIndicator(ticket);
                              if (slaIndicator) {
                                const Icon = slaIndicator.icon;
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${slaIndicator.bgColor} ${slaIndicator.color}`}
                                    title={slaIndicator.label}
                                  >
                                    <Icon className="w-3 h-3" />
                                    <span className="hidden sm:inline">{slaIndicator.label}</span>
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1 line-clamp-1">
                            {ticket.subject}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">
                          {ticket.name || ticket.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-600">{ticket.email}</p>
                        {ticket.company && (
                          <p className="text-xs text-emerald">
                            {ticket.company.name}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-gray-900">
                          {PRODUCT_LABELS[ticket.product]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {ISSUE_TYPE_LABELS[ticket.issue_type]}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${
                            STATUS_COLORS[ticket.status]
                          }`}
                        >
                          {STATUS_LABELS[ticket.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {ticket.assignee ? (
                          <span className="text-sm text-gray-900">
                            {ticket.assignee.name}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-sm text-gray-600">
                          {formatDate(ticket.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                  of {pagination.total} tickets
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchTickets(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => fetchTickets(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
