"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Eye,
  EyeOff,
  Star,
  Pencil,
  Trash2,
  Newspaper,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "case-study": "Case Study",
  partnership: "Partnership",
  "industry-news": "Industry News",
  news: "News",
  announcement: "Announcement",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/news?admin=true");
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (article: NewsArticle) => {
    try {
      const res = await fetch(`/api/news/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !article.is_published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setArticles((prev) =>
          prev.map((a) => (a.id === updated.id ? { ...a, is_published: updated.is_published, published_at: updated.published_at } : a))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleToggleFeatured = async (article: NewsArticle) => {
    try {
      const res = await fetch(`/api/news/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !article.is_featured }),
      });
      if (res.ok) {
        // Refresh all since featured is exclusive
        fetchArticles();
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage news articles, case studies, and announcements
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald text-white font-medium text-sm rounded-lg hover:bg-emerald/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
          <p className="text-gray-500 mb-4">Create your first news article to get started.</p>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald text-white font-medium text-sm rounded-lg hover:bg-emerald/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Article
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/admin/news/${article.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-emerald truncate transition-colors"
                    >
                      {article.title}
                    </Link>
                    {article.is_featured && (
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {CATEGORY_LABELS[article.category] || article.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        article.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.is_published ? "Published" : "Draft"}
                    </span>
                    {article.published_at && (
                      <span>
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(article)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      article.is_featured
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title={article.is_featured ? "Remove featured" : "Set as featured"}
                  >
                    <Star className={`w-4 h-4 ${article.is_featured ? "fill-amber-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(article)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      article.is_published
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title={article.is_published ? "Unpublish" : "Publish"}
                  >
                    {article.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    disabled={deleting === article.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === article.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
