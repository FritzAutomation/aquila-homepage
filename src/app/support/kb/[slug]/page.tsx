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

// Simple Markdown renderer for common patterns
function renderMarkdown(content: string): string {
  let html = content
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm font-mono"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-emerald pl-4 py-1 my-3 text-gray-600 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
    // Line breaks to paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
    .replace(/\n/g, "<br />");

  // Wrap consecutive <li> elements with appropriate list tag
  html = html.replace(
    /(<li[^>]*>.*?<\/li>(<br \/>)?[\s]*)+/g,
    (match) => {
      const isOrdered = match.includes("list-decimal");
      const tag = isOrdered ? "ol" : "ul";
      const cleaned = match.replace(/<br \/>/g, "");
      return `<${tag} class="my-3 space-y-1">${cleaned}</${tag}>`;
    }
  );

  return `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`;
}

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
