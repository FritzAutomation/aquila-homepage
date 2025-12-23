"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
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
  sender_name: string | null;
  created_at: string;
}

interface TicketData {
  id: string;
  ticket_number: number;
  ticket_id: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  product: Product;
  issue_type: IssueType;
  created_at: string;
  first_response_at: string | null;
  resolved_at: string | null;
  messages: Message[];
}

const STATUS_ICONS: Record<TicketStatus, React.ReactNode> = {
  open: <AlertCircle className="w-5 h-5 text-blue-500" />,
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  in_progress: <Loader2 className="w-5 h-5 text-purple-500" />,
  resolved: <CheckCircle className="w-5 h-5 text-green-500" />,
  closed: <CheckCircle className="w-5 h-5 text-gray-500" />,
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  in_progress: "bg-purple-100 text-purple-700 border-purple-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function TicketStatusPage() {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/tickets/lookup?ticket_id=${encodeURIComponent(ticketId)}&email=${encodeURIComponent(email)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ticket not found");
        return;
      }

      setTicket(data);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Check Ticket Status</h1>
            <p className="text-gray-600 mt-2">
              Enter your ticket ID and email to view your support request.
            </p>
          </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket ID
              </label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
                placeholder="TKT-0001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald text-white font-medium rounded-lg hover:bg-emerald/90 focus:ring-2 focus:ring-emerald focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Look Up Ticket
                </>
              )}
            </button>
          </form>

          {error && searched && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Ticket Details */}
        {ticket && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Ticket Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {STATUS_ICONS[ticket.status]}
                    <span className="text-lg font-bold text-gray-900">
                      {ticket.ticket_id}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {ticket.subject}
                  </h2>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[ticket.status]}`}
                >
                  {STATUS_LABELS[ticket.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Product</p>
                  <p className="font-medium text-gray-900">
                    {PRODUCT_LABELS[ticket.product]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Issue Type</p>
                  <p className="font-medium text-gray-900">
                    {ISSUE_TYPE_LABELS[ticket.issue_type]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Priority</p>
                  <p className="font-medium text-gray-900">
                    {PRIORITY_LABELS[ticket.priority]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Conversation</h3>
              </div>

              <div className="space-y-4">
                {ticket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender_type === "agent"
                        ? "bg-emerald/5 border-l-4 border-emerald"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender_type === "agent"
                            ? "bg-emerald text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 text-sm">
                          {message.sender_name ||
                            (message.sender_type === "agent"
                              ? "Support Team"
                              : "You")}
                        </span>
                        {message.sender_type === "agent" && (
                          <span className="ml-2 text-xs bg-emerald/10 text-emerald px-1.5 py-0.5 rounded">
                            Staff
                          </span>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap ml-10">
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {ticket.status !== "closed" && ticket.status !== "resolved" && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <p>
                    <strong>Need to add more information?</strong> Reply to your
                    confirmation email or submit a new support request referencing
                    ticket <strong>{ticket.ticket_id}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No ticket found state */}
        {searched && !ticket && !error && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No ticket found</p>
            <p className="text-sm text-gray-500 mt-1">
              Please check your ticket ID and email address.
            </p>
          </div>
        )}

        {/* Help Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Can&apos;t find your ticket?</p>
            <Link
              href="/support"
              className="text-emerald font-medium hover:underline"
            >
              Submit a new support request
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
