"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  BookOpen,
  Settings,
  AlertTriangle,
  Zap,
  Server,
  Users,
  ArrowRight,
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  icon: React.ElementType;
  title: string;
  description: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "New to our products? Start here.",
    items: [
      {
        question: "How do I set up DMM System for the first time?",
        answer: "DMM System setup involves installing the server component, configuring your database connection, and setting up client workstations. Our team provides comprehensive onboarding support including a kickoff meeting, installation assistance, and initial training. Contact your account manager to schedule your implementation.",
      },
      {
        question: "What are the system requirements for Green Light Monitoring?",
        answer: "Green Light Monitoring requires Windows Server 2016 or later, .NET Framework 4.8, and a SQL Server 2017+ database. Client workstations need Windows 10/11 with a modern web browser. For IoT connectivity, you'll need an Opto 22 groov EPIC or RIO device.",
      },
      {
        question: "How do I add new users to my system?",
        answer: "In DMM System, go to Administration > User Management > Add User. Fill in the user details and assign appropriate roles. For Green Light Monitoring, users are managed through the Admin Dashboard under Settings > Users. Both systems support Active Directory integration for streamlined user management.",
      },
      {
        question: "Can I import data from my existing ERP system?",
        answer: "Yes, we offer integration with major ERP systems including SAP, Oracle, Microsoft Dynamics, and Epicor. Our Integration Services team can configure bi-directional data sync for work orders, inventory, and production data. Custom integrations are also available for other systems.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Configuration & Setup",
    description: "Customizing your system settings.",
    items: [
      {
        question: "How do I configure OEE calculations?",
        answer: "Navigate to Settings > OEE Configuration in Green Light Monitoring. You can define your planned production time, set quality parameters, and configure ideal cycle times per product. The system supports both standard OEE calculation and custom formulas for specific manufacturing processes.",
      },
      {
        question: "How do I set up automated alerts and notifications?",
        answer: "In the Admin Dashboard, go to Alerts > Alert Rules. You can create rules based on conditions like downtime duration, OEE thresholds, or quality metrics. Notifications can be sent via email, SMS, or push notification. You can also set up escalation chains for critical alerts.",
      },
      {
        question: "Can I customize the dashboard layout?",
        answer: "Yes, Green Light Monitoring dashboards are fully customizable. Click the Edit button on any dashboard to add, remove, or rearrange widgets. You can create role-specific dashboards and set them as defaults for different user groups. Custom KPI widgets can be created using our widget builder.",
      },
      {
        question: "How do I configure machine connectivity?",
        answer: "Machine connectivity is configured through our IoT Gateway interface. We support OPC-UA, Modbus TCP/IP, MQTT, and direct PLC connections. For each machine, you'll define signal mappings for status, counts, and quality data. Our Applications Engineering team can assist with complex integrations.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Troubleshooting",
    description: "Solutions to common issues.",
    items: [
      {
        question: "Why am I seeing 'Connection Failed' errors?",
        answer: "Connection errors typically indicate network issues between components. First, verify the server is running and accessible. Check firewall settings to ensure required ports are open (default: 443 for HTTPS, 1433 for SQL Server). If using VPN, confirm it's connected. Review the connection string in your configuration file.",
      },
      {
        question: "My real-time data isn't updating. What should I check?",
        answer: "Check the IoT Gateway status in the Admin Dashboard. Verify the machine connection is active and data is flowing. Common causes include network interruptions, PLC communication errors, or signal mapping issues. Check the Gateway logs for specific error messages. Restart the Gateway service if needed.",
      },
      {
        question: "Reports are generating slowly. How can I improve performance?",
        answer: "Slow reports usually indicate database performance issues. First, check that database maintenance jobs are running (index rebuilding, statistics updates). Consider adding indexes for frequently queried columns. For large date ranges, use summary tables instead of raw data. Our support team can analyze query performance.",
      },
      {
        question: "I'm locked out of my account. What do I do?",
        answer: "Contact your system administrator to reset your password or unlock your account. If you're the administrator, use the DMM Console application with the master recovery key. For urgent access, contact our support team who can verify your identity and assist with account recovery.",
      },
    ],
  },
  {
    icon: Server,
    title: "Integration & APIs",
    description: "Connecting with other systems.",
    items: [
      {
        question: "How do I access the REST API?",
        answer: "API access requires an API key generated in Settings > API Management. Documentation is available at /api/docs on your server. The API supports OAuth 2.0 and API key authentication. Rate limits apply based on your license tier. Sample code is available for common integration scenarios.",
      },
      {
        question: "Can I export data to Power BI or Tableau?",
        answer: "Yes, we provide native connectors for both Power BI and Tableau. Install the connector from our downloads page, then use your API credentials to connect. Direct database access is also available for enterprise customers. Pre-built dashboard templates are available for common manufacturing KPIs.",
      },
      {
        question: "How do I set up ERP integration?",
        answer: "ERP integration is configured through the Integration Hub. We support real-time and batch synchronization modes. Standard integrations include work order import, inventory sync, and production posting. Custom field mappings and business rules can be configured. Contact our Integration Services team for setup assistance.",
      },
      {
        question: "Is there a webhook system for real-time notifications?",
        answer: "Yes, our webhook system can send real-time events to external systems. Configure webhooks in Settings > Integrations > Webhooks. Supported events include production updates, quality alerts, downtime events, and system notifications. We support retry logic and event logging for reliability.",
      },
    ],
  },
  {
    icon: Users,
    title: "Training & Best Practices",
    description: "Getting the most from your investment.",
    items: [
      {
        question: "What training options are available?",
        answer: "We offer multiple training formats: on-site instructor-led training, virtual live training sessions, self-paced online courses, and custom training programs. All new customers receive initial training as part of implementation. Additional training can be scheduled through your account manager.",
      },
      {
        question: "Are there certification programs available?",
        answer: "Yes, we offer certification tracks for Operators, Administrators, and Power Users. Certifications validate proficiency and are recognized across our customer community. Exam preparation materials and practice tests are included with the training subscription.",
      },
      {
        question: "What are the best practices for OEE improvement?",
        answer: "Start by establishing baseline measurements and identifying your biggest losses. Focus on quick wins first - often small adjustments yield significant improvements. Use Pareto analysis to prioritize issues. Engage operators in problem-solving and celebrate improvements. Our Customer Success team can provide industry benchmarks.",
      },
      {
        question: "How often should we review our system configuration?",
        answer: "We recommend quarterly reviews of alert thresholds, dashboard effectiveness, and data quality. Annual reviews should cover system architecture, integration health, and capacity planning. Our Customer Success team can conduct reviews and provide optimization recommendations.",
      },
    ],
  },
];

function FAQAccordion({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {category.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 pr-4">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  // Filter FAQ items based on search
  const filteredCategories = searchQuery
    ? faqCategories.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.items.length > 0)
    : faqCategories;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-navy pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Knowledge Base
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Find answers to common questions and learn how to get the most from our products.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-emerald outline-none text-gray-900 placeholder:text-gray-500 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {searchQuery ? (
            // Search Results
            <div>
              <p className="text-sm text-gray-500 mb-6">
                {filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)} results for &ldquo;{searchQuery}&rdquo;
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
                      <FAQAccordion category={category} />
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
                  {faqCategories.map((category, index) => (
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
                          {category.items.length} articles
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = faqCategories[activeCategory].icon;
                      return <Icon className="w-6 h-6 text-emerald" />;
                    })()}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {faqCategories[activeCategory].title}
                    </h2>
                  </div>
                  <p className="text-gray-600">
                    {faqCategories[activeCategory].description}
                  </p>
                </div>
                <FAQAccordion category={faqCategories[activeCategory]} />
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
