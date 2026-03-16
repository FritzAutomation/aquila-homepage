"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, ArrowRight, Loader2, Download, FileText, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation, Footer } from "@/components/layout";
import { Button, SectionWrapper } from "@/components/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ArticleAttachment {
  filename: string;
  url: string;
  mime_type: string;
  size: number;
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  is_featured: boolean;
  published_at: string | null;
  cover_image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  attachments?: ArticleAttachment[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "case-study": "Case Study",
  partnership: "Partnership",
  "industry-news": "Industry News",
  news: "News",
  announcement: "Announcement",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/news/${slug}`)
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
      year: "numeric",
    });
  };

  return (
    <>
      <Navigation />
      <main>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        ) : error || !article ? (
          <section className="pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-navy mb-2">Article not found</h1>
              <p className="text-slate mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link href="/news" className="text-emerald font-medium hover:underline">Back to News</Link>
            </div>
          </section>
        ) : (
          <>
            {/* Article Header */}
            <section className="pt-32 pb-12 bg-gradient-to-b from-light-gray to-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-slate hover:text-navy transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to News
                  </Link>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-medium">
                      {CATEGORY_LABELS[article.category] || article.category}
                    </span>
                    {article.published_at && (
                      <span className="text-slate flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.published_at)}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                    {article.title}
                  </h1>

                  {article.excerpt && (
                    <p className="text-xl text-slate">{article.excerpt}</p>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Article Content */}
            <SectionWrapper>
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-emerald prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:max-h-[500px] prose-img:w-auto prose-img:mx-auto prose-pre:bg-gray-100 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-emerald prose-blockquote:text-slate [&_video]:rounded-lg [&_video]:max-h-[500px] [&_video]:w-auto [&_video]:max-w-full [&_video]:mx-auto prose-p:text-slate prose-li:text-slate"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {article.content}
                  </ReactMarkdown>
                </motion.div>

                {/* Downloadable Attachments */}
                {article.attachments && article.attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 p-6 bg-light-gray rounded-2xl"
                  >
                    <h3 className="text-sm font-semibold text-navy uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4 text-slate" />
                      Downloads
                    </h3>
                    <div className="space-y-2">
                      {article.attachments.map((att, index) => (
                        <a
                          key={index}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-emerald/5 border border-transparent hover:border-emerald/20 transition-all group no-underline"
                        >
                          <FileText className="w-5 h-5 text-slate group-hover:text-emerald flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy truncate">{att.filename}</p>
                            <p className="text-xs text-slate">{formatFileSize(att.size)}</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-300 group-hover:text-emerald flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTA */}
                {article.cta_text && article.cta_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 p-8 bg-navy rounded-2xl text-center"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Interested in Learning More?
                    </h3>
                    <p className="text-white/80 mb-6">
                      See how The Aquila Group can help transform your manufacturing operations.
                    </p>
                    <Button href={article.cta_url}>
                      {article.cta_text}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </SectionWrapper>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
