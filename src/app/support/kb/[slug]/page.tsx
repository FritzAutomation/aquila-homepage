"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Loader2,
  Tag,
  Download,
  FileText,
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ArticleAttachment {
  filename: string;
  url: string;
  mime_type: string;
  size: number;
}

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
  attachments?: ArticleAttachment[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
              <li className="flex items-center gap-2"><span>/</span><Link href="/support" className="hover:text-gray-700 transition-colors">Support</Link></li>
              <li className="flex items-center gap-2"><span>/</span><Link href="/support/kb" className="hover:text-gray-700 transition-colors">Knowledge Base</Link></li>
              {article && (
                <li className="flex items-center gap-2"><span>/</span><span className="text-gray-900 truncate max-w-[200px]">{article.title}</span></li>
              )}
            </ol>
          </nav>

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
              <div className="p-6 md:p-8 prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-emerald prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:max-h-[500px] prose-img:w-auto prose-img:mx-auto prose-pre:bg-gray-100 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-emerald prose-blockquote:text-gray-600 [&_video]:rounded-lg [&_video]:max-h-[500px] [&_video]:w-auto [&_video]:max-w-full [&_video]:mx-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Downloadable Attachments */}
              {article.attachments && article.attachments.length > 0 && (
                <div className="p-6 md:p-8 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-gray-500" />
                    Downloads
                  </h3>
                  <div className="space-y-2">
                    {article.attachments.map((att, index) => (
                      <a
                        key={index}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald/5 hover:border-emerald/20 border border-transparent transition-all group no-underline"
                      >
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-emerald flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {att.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(att.size)}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-300 group-hover:text-emerald flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
