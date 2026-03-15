"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  BookOpen,
  GripVertical,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  product: string[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "configuration": "Configuration & Setup",
  "troubleshooting": "Troubleshooting",
  "integration": "Integration & APIs",
  "training": "Training & Best Practices",
  "general": "General",
};

const PRODUCT_LABELS: Record<string, string> = {
  dmm: "DMM",
  "green-light": "Green Light",
  custom: "Custom",
};

const PRODUCT_COLORS: Record<string, string> = {
  dmm: "bg-blue-100 text-blue-700",
  "green-light": "bg-green-100 text-green-700",
  custom: "bg-purple-100 text-purple-700",
};

export default function AdminKBPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ admin: "true" });
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/kb?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const togglePublish = async (article: Article) => {
    try {
      const res = await fetch(`/api/kb/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !article.is_published }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? { ...a, is_published: !a.is_published }
              : a
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/kb/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const publishedCount = articles.filter((a) => a.is_published).length;
  const draftCount = articles.filter((a) => !a.is_published).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 text-sm mt-1">
            {publishedCount} published, {draftCount} draft
          </p>
        </div>
        <Link
          href="/admin/kb/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald text-white font-medium rounded-lg hover:bg-emerald/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
              />
            </div>
          </form>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-gray-900"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald" />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No articles yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Create your first knowledge base article to get started.
          </p>
          <Link
            href="/admin/kb/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald text-white text-sm font-medium rounded-lg hover:bg-emerald/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/admin/kb/${article.id}`}
                      className="font-medium text-gray-900 hover:text-emerald transition-colors truncate"
                    >
                      {article.title}
                    </Link>
                    {article.is_published ? (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{CATEGORY_LABELS[article.category] || article.category}</span>
                    {article.product.length > 0 && (
                      <div className="flex gap-1">
                        {article.product.map((p) => (
                          <span
                            key={p}
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              PRODUCT_COLORS[p] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {PRODUCT_LABELS[p] || p}
                          </span>
                        ))}
                      </div>
                    )}
                    <span>Updated {formatDate(article.updated_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(article)}
                    title={article.is_published ? "Unpublish" : "Publish"}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {article.is_published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/admin/kb/${article.id}`}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  {deleteConfirm === article.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-2 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(article.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
