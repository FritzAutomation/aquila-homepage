"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  is_featured: boolean;
  published_at: string | null;
  cover_image_url: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  "case-study": "Case Study",
  partnership: "Partnership",
  "industry-news": "Industry News",
  news: "News",
  announcement: "Announcement",
};

const certifications = [
  {
    name: "Opto 22 IoT Certified Partner",
    description:
      "Certified expertise in Industrial Internet of Things solutions",
    logo: "/images/OptoPartner_IoT_Certified_192x163.png",
  },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setArticles(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.find((a) => a.is_featured);
  const rest = articles.filter((a) => !a.is_featured);

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
        <PageHeader
          title="News & Updates"
          subtitle="Stay up to date with the latest from The Aquila Group, including case studies, partnerships, and industry insights."
          breadcrumb={[{ label: "News", href: "/news" }]}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        ) : articles.length === 0 ? (
          <SectionWrapper>
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-navy mb-2">No articles yet</h2>
              <p className="text-slate">Check back soon for news and updates.</p>
            </div>
          </SectionWrapper>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <SectionWrapper>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 md:p-12 bg-gradient-to-br from-navy to-navy/90 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-emerald/20 text-emerald rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {CATEGORY_LABELS[featured.category] || featured.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-white/80 text-lg mb-6 max-w-3xl">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      {featured.published_at && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featured.published_at)}
                        </div>
                      )}
                      <Button href={`/news/${featured.slug}`} variant="secondary">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </SectionWrapper>
            )}

            {/* All Articles */}
            {rest.length > 0 && (
              <SectionWrapper background="light">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                    All Articles
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  {rest.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/news/${article.slug}`} className="block h-full">
                        <Card className="h-full p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-medium">
                              {CATEGORY_LABELS[article.category] || article.category}
                            </span>
                            {article.published_at && (
                              <span className="text-sm text-slate-light flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.published_at)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-navy mb-3">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-slate mb-4">{article.excerpt}</p>
                          )}
                          <span className="inline-flex items-center gap-2 text-navy font-medium hover:text-emerald transition-colors">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </SectionWrapper>
            )}
          </>
        )}

        {/* Certifications */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Certifications & Partnerships
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 flex items-center gap-6">
                  <div className="w-24 h-20 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={cert.logo}
                      alt={cert.name}
                      width={192}
                      height={163}
                      className="w-auto h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-slate">{cert.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Want to Be Our Next Success Story?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                See how our solutions can transform your manufacturing
                operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  View Products
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
