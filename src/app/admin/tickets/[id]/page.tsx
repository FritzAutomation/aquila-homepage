"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Loader2,
  User,
  Building2,
  Mail,
  Phone,
  Clock,
  Tag,
  AlertCircle,
  Lock,
  MessageSquare,
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

interface Message {
  id: string;
  content: string;
  sender_type: "customer" | "agent" | "system";
  sender_email: string | null;
  sender_name: string | null;
  created_at: string;
  is_internal: boolean;
}

interface TicketDetail {
  id: string;
  ticket_number: number;
  ticket_id: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  product: Product;
  issue_type: IssueType;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  first_response_at: string | null;
  resolved_at: string | null;
  messages: Message[];
  company: { id: string; name: string; domain: string | null } | null;
}

const STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in_progress",
  "pending",
  "resolved",
  "closed",
];

const PRIORITY_OPTIONS: Priority[] = ["low", "normal", "high", "urgent"];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  in_progress: "bg-purple-100 text-purple-700 border-purple-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      } else {
        router.push("/admin/tickets");
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: TicketStatus) {
    if (!ticket) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  }

  async function handlePriorityChange(newPriority: Priority) {
    if (!ticket) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      console.error("Failed to update priority:", error);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || !ticket) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          sender_type: "agent",
          sender_name: "Support Team",
          send_email: !isInternalNote,
          is_internal: isInternalNote,
        }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setTicket((prev) =>
          prev ? { ...prev, messages: [...prev.messages, message] } : null
        );
        setReplyContent("");
        setIsInternalNote(false);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/tickets"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to tickets
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {ticket.ticket_id}
            </h1>
            <span
              className={`text-sm font-medium px-2.5 py-1 rounded-full border ${
                STATUS_COLORS[ticket.status]
              }`}
            >
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{ticket.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Messages */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Conversation</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 ${
                    message.is_internal
                      ? "bg-amber-50 border-l-4 border-amber-400"
                      : message.sender_type === "agent"
                      ? "bg-emerald/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.is_internal
                          ? "bg-amber-500 text-white"
                          : message.sender_type === "agent"
                          ? "bg-emerald text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {message.is_internal ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {message.sender_name ||
                            message.sender_email ||
                            (message.sender_type === "agent"
                              ? "Support Team"
                              : "Customer")}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatDate(message.created_at)}
                        </span>
                        {message.is_internal ? (
                          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Internal Note
                          </span>
                        ) : message.sender_type === "agent" ? (
                          <span className="text-xs bg-emerald/10 text-emerald px-1.5 py-0.5 rounded">
                            Staff
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <form
            onSubmit={handleSendReply}
            className={`bg-white border rounded-lg p-4 ${
              isInternalNote ? "border-amber-300" : "border-gray-200"
            }`}
          >
            {/* Toggle between Reply and Internal Note */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setIsInternalNote(false)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  !isInternalNote
                    ? "bg-emerald text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Send className="w-4 h-4" />
                Reply to Customer
              </button>
              <button
                type="button"
                onClick={() => setIsInternalNote(true)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isInternalNote
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Lock className="w-4 h-4" />
                Internal Note
              </button>
            </div>

            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={
                isInternalNote
                  ? "Add an internal note (not visible to customer)..."
                  : "Type your reply..."
              }
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none resize-none text-gray-900 placeholder:text-gray-500 ${
                isInternalNote
                  ? "border-amber-300 focus:ring-amber-500 focus:border-amber-500"
                  : "border-gray-300 focus:ring-emerald focus:border-emerald"
              }`}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-600">
                {isInternalNote ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Lock className="w-3 h-3" />
                    This note is only visible to staff
                  </span>
                ) : (
                  `Email will be sent to ${ticket.email}`
                )}
              </p>
              <button
                type="submit"
                disabled={!replyContent.trim() || sending}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  isInternalNote
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald hover:bg-emerald/90"
                }`}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isInternalNote ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isInternalNote ? "Add Note" : "Send Reply"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar - Ticket Details */}
        <div className="space-y-4">
          {/* Status & Priority Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Ticket Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as TicketStatus)
                  }
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    handlePriorityChange(e.target.value as Priority)
                  }
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm text-gray-900"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Customer</h3>
            <div className="space-y-2">
              {ticket.name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{ticket.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href={`mailto:${ticket.email}`}
                  className="text-emerald hover:underline"
                >
                  {ticket.email}
                </a>
              </div>
              {ticket.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{ticket.phone}</span>
                </div>
              )}
              {ticket.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{ticket.company.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-800">
                  {PRODUCT_LABELS[ticket.product]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800">{ISSUE_TYPE_LABELS[ticket.issue_type]}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Created:</span>
                <span className="text-gray-800">{formatDate(ticket.created_at)}</span>
              </div>
              {ticket.first_response_at && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">First response:</span>
                  <span className="text-gray-800">{formatDate(ticket.first_response_at)}</span>
                </div>
              )}
              {ticket.resolved_at && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Resolved:</span>
                  <span className="text-gray-800">{formatDate(ticket.resolved_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
