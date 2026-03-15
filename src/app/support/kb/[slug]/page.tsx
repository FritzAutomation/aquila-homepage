"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Loader2,
  Tag,
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { renderMarkdown } from "@/lib/kb-utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  product: string[];
  published_at: string | null;
  updated_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  configuration: "Configuration & Setup",
  troubleshooting: "Troubleshooting",
  integration: "Integration & APIs",
  training: "Training & Best Practices",
  general: "General",
};

const PRODUCT_LABELS: Record<string, string> = {
  dmm: "DMM System",
  "green-light": "Green Light Monitoring",
  custom: "Custom Solutions",
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/kb/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/support/kb"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-emerald" />
            </div>
          ) : error || !article ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Article not found
              </h2>
              <p className="text-gray-600 mb-6">
                The article you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/support/kb"
                className="text-emerald font-medium hover:underline"
              >
                Browse Knowledge Base
              </Link>
            </div>
          ) : (
            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Article Header */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-navy/10 text-navy rounded-full">
                    {CATEGORY_LABELS[article.category] || article.category}
                  </span>
                  {article.product.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald/10 text-emerald rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {PRODUCT_LABELS[p] || p}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-gray-600 text-lg">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  {article.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDate(article.published_at)}
                    </span>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div
                className="p-6 md:p-8 prose-custom"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(article.content),
                }}
              />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
