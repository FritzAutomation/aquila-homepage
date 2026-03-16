"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Monitor,
  Smartphone,
  Shield,
  Search,
  Zap,
  BookOpen,
  LifeBuoy,
  BarChart3,
  Layout,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const CATEGORIES = [
  "overview",
  "design",
  "mobile",
  "seo",
  "products",
  "platform",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_META: Record<
  Category,
  { label: string; icon: React.ReactNode }
> = {
  overview: { label: "Overview", icon: <Layout className="w-4 h-4" /> },
  design: { label: "Design & UX", icon: <Monitor className="w-4 h-4" /> },
  mobile: {
    label: "Mobile Experience",
    icon: <Smartphone className="w-4 h-4" />,
  },
  seo: { label: "SEO & Performance", icon: <Search className="w-4 h-4" /> },
  products: {
    label: "Product Pages",
    icon: <Globe className="w-4 h-4" />,
  },
  platform: {
    label: "New Capabilities",
    icon: <Zap className="w-4 h-4" />,
  },
};

interface ComparisonItem {
  category: Category;
  title: string;
  before: string;
  after: string;
  impact: "high" | "medium";
  details?: string;
}

const COMPARISONS: ComparisonItem[] = [
  // Design & UX
  {
    category: "design",
    title: "Visual Identity",
    before:
      "Dated WordPress theme with blue gradient backgrounds, clip-art style icons, and inconsistent styling across pages.",
    after:
      "Modern, professional design system with navy/emerald brand colors, consistent typography, and polished component library.",
    impact: "high",
  },
  {
    category: "design",
    title: "Navigation",
    before:
      '"Pages Menu" dropdown button — non-standard, confusing pattern. No visual hierarchy or mega-menu.',
    after:
      "Sticky header with clear navigation, mega-menu for products, smooth transitions, and scroll progress indicator.",
    impact: "high",
  },
  {
    category: "design",
    title: "Hero Section",
    before:
      "Basic image carousel/slider with generic headings. No clear call-to-action or value proposition.",
    after:
      "Full-width hero with animated text, strong value proposition, dual CTAs (Request Demo / Watch Video), and client trust logos.",
    impact: "high",
  },
  {
    category: "design",
    title: "Social Proof",
    before: "Single testimonial quote buried in the page. No client logos or trust indicators.",
    after:
      "Dedicated social proof bar with client logos, animated stat counters (100+ facilities, 30% efficiency gain), and multiple testimonial cards.",
    impact: "medium",
  },
  {
    category: "design",
    title: "Footer",
    before:
      'Minimal footer with clip-art icons for "Find Out More" links. Basic copyright text.',
    after:
      "Comprehensive footer with site map, contact info, newsletter signup, social links, and structured layout.",
    impact: "medium",
  },

  // Mobile
  {
    category: "mobile",
    title: "Responsive Layout",
    before:
      'Not mobile-responsive. Content overflows, text is unreadable without zooming. "Pages Menu" button instead of hamburger menu.',
    after:
      "Fully responsive design with mobile-first approach. Content adapts fluidly to all screen sizes from 375px up.",
    impact: "high",
  },
  {
    category: "mobile",
    title: "Mobile Navigation",
    before:
      "Dropdown menu that doesn't work well on touch devices. No mobile-specific interaction patterns.",
    after:
      'Slide-out drawer menu with smooth animations, touch-friendly tap targets, and sticky "Request Demo" CTA.',
    impact: "high",
  },
  {
    category: "mobile",
    title: "Touch Interactions",
    before: "No touch-optimized interactions. Small click targets. No swipe support.",
    after:
      "Touch-optimized buttons (minimum 44px targets), swipeable carousels, and mobile-friendly form inputs.",
    impact: "medium",
  },

  // SEO
  {
    category: "seo",
    title: "Meta Tags & Descriptions",
    before:
      "Generic or missing meta descriptions. No Open Graph or Twitter Card tags. Poor social sharing preview.",
    after:
      "Unique meta descriptions per page, full Open Graph images/tags, Twitter Cards, and structured data (JSON-LD) for rich search results.",
    impact: "high",
  },
  {
    category: "seo",
    title: "Page Load Performance",
    before:
      "WordPress with multiple plugins, unoptimized images, and render-blocking scripts. Slow load times.",
    after:
      "Next.js with automatic code splitting, optimized images (WebP/AVIF), edge caching via Vercel, and sub-second load times.",
    impact: "high",
  },
  {
    category: "seo",
    title: "Structured Data",
    before: "No structured data. Search engines have minimal context about the business.",
    after:
      "Full Schema.org markup — Organization, SoftwareApplication, ContactPoint — enabling rich snippets in search results.",
    impact: "medium",
  },
  {
    category: "seo",
    title: "Dynamic Content",
    before:
      'Hardcoded year references ("29 years") that become stale and require manual updates.',
    after:
      "Dynamic year calculations throughout the site. Years in business, copyright dates, and experience stats auto-update annually.",
    impact: "medium",
  },

  // Products
  {
    category: "products",
    title: "Product Showcase",
    before:
      'Basic text descriptions with placeholder content like "DMM V8 (Soon to be upgraded to V9) – will include screenshots we will provide when ready."',
    after:
      "Rich product pages with feature breakdowns, interactive demos, comparison tables, and professional screenshots.",
    impact: "high",
  },
  {
    category: "products",
    title: "Interactive Demos",
    before: "No interactive content. Static text and images only. Users must request a live demo to see the product.",
    after:
      "Built-in interactive DMM demo with simulated dashboard, real-time data visualization, and guided walkthrough — available 24/7.",
    impact: "high",
  },
  {
    category: "products",
    title: "Case Studies",
    before:
      "News-style articles mixed with case studies. No structured format or clear results/metrics.",
    after:
      "Dedicated case studies section with structured format: challenge, solution, results with quantified metrics.",
    impact: "medium",
  },

  // Platform (New)
  {
    category: "platform",
    title: "Customer Support Portal",
    before: "No customer portal. Support handled entirely through email and phone.",
    after:
      "Full-featured support ticketing system with customer portal, ticket tracking, SLA monitoring, and knowledge base.",
    impact: "high",
  },
  {
    category: "platform",
    title: "Knowledge Base",
    before: "No self-service documentation. Customers rely on direct support for all questions.",
    after:
      "Searchable knowledge base with categorized articles, markdown rendering, and admin management tools.",
    impact: "high",
  },
  {
    category: "platform",
    title: "Training Platform",
    before: "No online training. All training done in-person or via manual PDF materials.",
    after:
      "Interactive training platform with modules, lessons, quizzes, progress tracking, and per-user assignments.",
    impact: "high",
  },
  {
    category: "platform",
    title: "Admin Dashboard",
    before: "WordPress admin only. No business-specific management tools or analytics.",
    after:
      "Custom admin panel with ticket management, user administration, company management, analytics dashboards, training oversight, and role-based access control.",
    impact: "high",
  },
  {
    category: "platform",
    title: "Email Integration",
    before: "Standard email. No integration between website and support communications.",
    after:
      "Inbound email-to-ticket conversion via Resend webhook. Customers can reply to tickets via email, and responses are threaded automatically.",
    impact: "medium",
  },
];

const OVERVIEW_STATS = [
  { label: "Pages redesigned", value: "20+" },
  { label: "New features added", value: "15+" },
  { label: "Mobile-responsive", value: "100%" },
  { label: "Load time improvement", value: "~5x" },
];

const FEATURE_CHECKLIST = [
  { feature: "Responsive design", before: false, after: true },
  { feature: "SEO-optimized meta tags", before: false, after: true },
  { feature: "Open Graph / social cards", before: false, after: true },
  { feature: "Structured data (JSON-LD)", before: false, after: true },
  { feature: "Interactive product demos", before: false, after: true },
  { feature: "Customer support portal", before: false, after: true },
  { feature: "Knowledge base", before: false, after: true },
  { feature: "Training platform", before: false, after: true },
  { feature: "Admin dashboard", before: false, after: true },
  { feature: "Email-to-ticket integration", before: false, after: true },
  { feature: "Role-based access control", before: false, after: true },
  { feature: "Skeleton loading states", before: false, after: true },
  { feature: "Analytics & reporting", before: false, after: true },
  { feature: "Dynamic content (auto-updating)", before: false, after: true },
  { feature: "Cookie consent management", before: false, after: true },
  { feature: "Scroll progress indicator", before: false, after: true },
  { feature: "Back-to-top button", before: false, after: true },
  { feature: "Company / org management", before: false, after: true },
];

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("overview");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const filtered = COMPARISONS.filter(
    (c) => c.category === activeCategory
  );

  const highImpactCount = COMPARISONS.filter((c) => c.impact === "high").length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Site Transformation</span>
          </div>
          <a
            href="https://aquila-homepage.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald hover:text-emerald/80 flex items-center gap-1.5 transition-colors"
          >
            View Live Site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          Complete Digital Transformation
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          From Static WordPress
          <br />
          <span className="text-emerald">to Modern Platform</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          A comprehensive overhaul of The Aquila Group&apos;s digital presence — new design,
          new capabilities, and a complete customer platform built from the ground up.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {OVERVIEW_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-2xl sm:text-3xl font-bold text-emerald">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-[#0F172A]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-emerald text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {CATEGORY_META[cat].icon}
                {CATEGORY_META[cat].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {activeCategory === "overview" ? (
          <OverviewSection
            highImpactCount={highImpactCount}
            totalItems={COMPARISONS.length}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center text-emerald">
                {CATEGORY_META[activeCategory].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {CATEGORY_META[activeCategory].label}
                </h2>
                <p className="text-sm text-gray-400">
                  {filtered.length} improvement{filtered.length !== 1 && "s"} in
                  this category
                </p>
              </div>
            </div>

            {filtered.map((item, i) => {
              const globalIdx = COMPARISONS.indexOf(item);
              const isExpanded = expandedItems.has(globalIdx);
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-white/20"
                >
                  <button
                    onClick={() => toggleItem(globalIdx)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        item.impact === "high"
                          ? "bg-emerald"
                          : "bg-yellow-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.impact === "high"
                              ? "bg-emerald/20 text-emerald"
                              : "bg-yellow-400/20 text-yellow-400"
                          }`}
                        >
                          {item.impact} impact
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">
                            Before
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{item.before}</p>
                      </div>
                      <div className="bg-emerald/5 border border-emerald/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-emerald" />
                          <span className="text-sm font-medium text-emerald">
                            After
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{item.after}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Feature Checklist */}
      {activeCategory === "overview" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] gap-0 text-sm">
              {/* Header */}
              <div className="px-5 py-3 font-semibold text-gray-400 border-b border-white/10">
                Feature
              </div>
              <div className="px-3 py-3 font-semibold text-center text-red-400 border-b border-white/10">
                Before
              </div>
              <div className="px-3 py-3 font-semibold text-center text-emerald border-b border-white/10">
                After
              </div>

              {/* Rows */}
              {FEATURE_CHECKLIST.map((row, i) => (
                <div key={i} className="contents">
                  <div
                    className={`px-5 py-3 text-gray-300 ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } border-b border-white/5`}
                  >
                    {row.feature}
                  </div>
                  <div
                    className={`px-3 py-3 flex items-center justify-center ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } border-b border-white/5`}
                  >
                    {row.before ? (
                      <Check className="w-4 h-4 text-emerald" />
                    ) : (
                      <X className="w-4 h-4 text-red-400/60" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-3 flex items-center justify-center ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } border-b border-white/5`}
                  >
                    {row.after ? (
                      <Check className="w-4 h-4 text-emerald" />
                    ) : (
                      <X className="w-4 h-4 text-red-400/60" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Explore the live site to experience the full transformation —
            every page, feature, and interaction redesigned from the ground up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://aquila-homepage.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald text-white rounded-xl font-medium hover:bg-emerald/90 transition-colors"
            >
              Explore New Site
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://www.the-aquila-group.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              View Original Site
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewSection({
  highImpactCount,
  totalItems,
}: {
  highImpactCount: number;
  totalItems: number;
}) {
  const pillars = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Modern Design",
      description:
        "Professional visual identity with consistent brand system, responsive layouts, and polished interactions.",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile-First",
      description:
        "Fully responsive from 375px to ultrawide. Touch-optimized navigation, drawer menu, and adaptive layouts.",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "SEO & Performance",
      description:
        "Complete meta tags, Open Graph images, JSON-LD structured data, and edge-cached delivery via Vercel.",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      icon: <LifeBuoy className="w-6 h-6" />,
      title: "Customer Portal",
      description:
        "Support ticketing, knowledge base, and email integration — reducing support overhead and improving response times.",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Training Platform",
      description:
        "Interactive learning modules with lessons, quizzes, progress tracking, and per-user assignment management.",
      color: "text-teal-400",
      bg: "bg-teal-400/10",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Admin Panel",
      description:
        "Full management dashboard with role-based access, analytics, company management, and reporting tools.",
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Transformation at a Glance</h2>
        <p className="text-gray-400 text-lg">
          {totalItems} documented improvements across {CATEGORIES.length - 1}{" "}
          categories, with {highImpactCount} high-impact changes. Here&apos;s
          what changed and why it matters.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
          >
            <div
              className={`w-12 h-12 ${pillar.bg} rounded-xl flex items-center justify-center ${pillar.color} mb-4`}
            >
              {pillar.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{pillar.title}</h3>
            <p className="text-sm text-gray-400">{pillar.description}</p>
          </div>
        ))}
      </div>

      {/* Before/After Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <X className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">
              Previous Site
            </h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              Static WordPress site with dated theme
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              Not mobile-responsive
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              No meta descriptions or social sharing tags
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              Placeholder product content
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              No customer portal or self-service tools
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              Email/phone only support
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              No training or onboarding platform
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400/60 mt-0.5 flex-shrink-0" />
              WordPress admin only
            </li>
          </ul>
        </div>

        <div className="bg-emerald/5 border border-emerald/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-emerald" />
            <h3 className="text-lg font-semibold text-emerald">New Platform</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Modern Next.js app with professional design system
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Fully responsive on all devices
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Complete SEO with OG images, Twitter cards, JSON-LD
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Rich product pages with interactive demos
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Customer portal with ticketing and knowledge base
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Email-to-ticket integration via Resend
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Interactive training platform with progress tracking
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald mt-0.5 flex-shrink-0" />
              Full admin panel with analytics and RBAC
            </li>
          </ul>
        </div>
      </div>

      {/* Impact Callout */}
      <div className="bg-gradient-to-r from-emerald/10 to-blue-500/10 border border-emerald/20 rounded-xl p-8 text-center">
        <BarChart3 className="w-8 h-8 text-emerald mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Business Impact</h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          The new platform doesn&apos;t just look better — it reduces support overhead with
          self-service tools, accelerates onboarding with built-in training, improves
          search visibility with proper SEO, and provides data-driven insights through
          analytics dashboards.
        </p>
      </div>
    </div>
  );
}
