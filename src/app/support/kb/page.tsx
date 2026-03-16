"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Settings,
  AlertTriangle,
  Zap,
  Server,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader } from "@/components/ui";

interface KBArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  product: string[];
}

const categoryMeta = [
  { key: "getting-started", icon: Zap, title: "Getting Started", description: "New to our products? Start here." },
  { key: "configuration", icon: Settings, title: "Configuration & Setup", description: "Customizing your system settings." },
  { key: "troubleshooting", icon: AlertTriangle, title: "Troubleshooting", description: "Solutions to common issues." },
  { key: "integration", icon: Server, title: "Integration & APIs", description: "Connecting with other systems." },
  { key: "training", icon: Users, title: "Training & Best Practices", description: "Getting the most from your investment." },
];

function ArticleList({ articles }: { articles: KBArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="space-y-3">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/support/kb/${article.slug}`}
            className="block p-4 border border-gray-200 rounded-xl hover:border-emerald/50 hover:bg-emerald/5 transition-colors"
          >
            <h4 className="font-medium text-gray-900">{article.title}</h4>
            {article.excerpt && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kb")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group articles by category
  const categories = categoryMeta.map((meta) => ({
    ...meta,
    articles: articles.filter((a) => a.category === meta.key),
  }));

  // Filter based on search
  const filteredCategories = searchQuery
    ? categories
        .map((cat) => ({
          ...cat,
          articles: cat.articles.filter(
            (a) =>
              a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (a.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.articles.length > 0)
    : categories;

  return (
    <>
      <Navigation />
      <PageHeader
        title="Knowledge Base"
        subtitle="Find answers to common questions and learn how to get the most from our products."
        breadcrumb={[
          { label: "Support", href: "/support" },
          { label: "Knowledge Base", href: "/support/kb" },
        ]}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Search */}
        <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald outline-none text-gray-900 placeholder:text-gray-500 shadow-lg bg-white"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-emerald" />
            </div>
          ) : searchQuery ? (
            // Search Results
            <div>
              <p className="text-sm text-gray-500 mb-6">
                {filteredCategories.reduce((acc, cat) => acc + cat.articles.length, 0)} results for &ldquo;{searchQuery}&rdquo;
              </p>
              {filteredCategories.length > 0 ? (
                <div className="space-y-8">
                  {filteredCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-4">
                        <category.icon className="w-5 h-5 text-emerald" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h2>
                      </div>
                      <ArticleList articles={category.articles} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No results found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try different keywords or browse categories below
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-emerald font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Category View
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Category Navigation */}
              <div className="lg:col-span-1">
                <nav className="sticky top-24 space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCategory(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                        activeCategory === index
                          ? "bg-emerald/10 text-emerald"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <category.icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <span className="block font-medium text-sm">
                          {category.title}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {category.articles.length} {category.articles.length === 1 ? "article" : "articles"}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = categories[activeCategory].icon;
                      return <Icon className="w-6 h-6 text-emerald" />;
                    })()}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {categories[activeCategory].title}
                    </h2>
                  </div>
                  <p className="text-gray-600">
                    {categories[activeCategory].description}
                  </p>
                </div>
                <ArticleList articles={categories[activeCategory].articles} />
              </div>
            </div>
          )}

          {/* Contact Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-navy to-navy/90 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-white/80 mb-6">
              Our support team is ready to help with any questions you may have.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
