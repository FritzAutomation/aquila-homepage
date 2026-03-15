"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  Mail,
  Ticket,
  Users,
  Loader2,
  ExternalLink,
  Plus,
  X,
  Pencil,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  created_at: string;
  notes: string | null;
  status: string;
  user_count: number;
  ticket_count: number;
  open_tickets: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/companies?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeCount = companies.filter((c) => c.status === "active").length;
  const inactiveCount = companies.filter((c) => c.status === "inactive").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {companies.length} companies — {activeCount} active, {inactiveCount} inactive
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald" />
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No companies found</p>
          <p className="text-sm text-gray-500 mt-1">
            {search
              ? "Try adjusting your search"
              : "Click \"Add Company\" to create one"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    {company.domain && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>@{company.domain}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      company.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {company.status}
                  </span>
                  <button
                    onClick={() => setEditingCompany(company)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Edit company"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{company.user_count} users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{company.ticket_count} tickets</span>
                </div>
                {company.open_tickets > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {company.open_tickets} open
                  </span>
                )}
              </div>

              {company.notes && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {company.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Added {formatDate(company.created_at)}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/users?company_id=${company.id}`}
                    className="text-sm text-navy hover:text-navy/80 font-medium flex items-center gap-1"
                  >
                    Users
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/admin/tickets?company=${company.id}`}
                    className="text-sm text-emerald hover:text-emerald/80 font-medium flex items-center gap-1"
                  >
                    Tickets
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateModal && (
        <CompanyModal
          onClose={() => setShowCreateModal(false)}
          onSaved={() => {
            setShowCreateModal(false);
            fetchCompanies();
          }}
        />
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <CompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSaved={() => {
            setEditingCompany(null);
            fetchCompanies();
          }}
        />
      )}
    </div>
  );
}

function CompanyModal({
  company,
  onClose,
  onSaved,
}: {
  company?: Company;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!company;
  const [name, setName] = useState(company?.name || "");
  const [domain, setDomain] = useState(company?.domain || "");
  const [notes, setNotes] = useState(company?.notes || "");
  const [status, setStatus] = useState(company?.status || "active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/admin/companies/${company.id}`
        : "/api/admin/companies";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain, notes, ...(isEditing && { status }) }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save company");
        return;
      }

      onSaved();
    } catch {
      setError("Failed to save company");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
              placeholder="Acme Manufacturing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
              placeholder="acme.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to auto-match users by email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900 resize-none"
              placeholder="Internal notes about this company..."
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald hover:bg-emerald/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
