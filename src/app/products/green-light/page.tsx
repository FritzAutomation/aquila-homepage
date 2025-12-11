"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Gauge,
  Bell,
  Smartphone,
  Database,
  BarChart3,
  ArrowRight,
  Check
} from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper, GreenLightDemo } from "@/components/ui";

// Live metrics component with realistic fluctuations
function LiveMetricsPanel() {
  const [metrics, setMetrics] = useState({
    uptime: 94.2,
    oee: 87.5,
    activeMachines: 12,
    totalMachines: 14,
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        uptime: Math.min(99.9, Math.max(85, prev.uptime + (Math.random() - 0.48) * 0.8)),
        oee: Math.min(99, Math.max(75, prev.oee + (Math.random() - 0.48) * 0.6)),
        activeMachines: Math.random() > 0.92
          ? Math.min(14, Math.max(10, prev.activeMachines + (Math.random() > 0.5 ? 1 : -1)))
          : prev.activeMachines,
        totalMachines: 14,
      }));
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-navy text-white p-8 rounded-2xl relative overflow-hidden">
      {/* Subtle scanning line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-emerald/5 via-emerald/10 to-transparent"
        initial={{ y: "-100%" }}
        animate={{ y: "200%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ height: "50%" }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-emerald" />
              <motion.div
                className="absolute inset-0 w-4 h-4 rounded-full bg-emerald"
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-lg font-medium">Real-Time Status</span>
          </div>
          <motion.span
            key={lastUpdate.getTime()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/50"
          >
            Updated {lastUpdate.toLocaleTimeString()}
          </motion.span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/80">Machine Uptime</span>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={metrics.uptime.toFixed(1)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-bold text-emerald tabular-nums"
                >
                  {metrics.uptime.toFixed(1)}%
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/80">OEE Score</span>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={metrics.oee.toFixed(1)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-bold text-emerald tabular-nums"
                >
                  {metrics.oee.toFixed(1)}%
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-white/80">Active Machines</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: metrics.totalMachines }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${
                      i < metrics.activeMachines ? "bg-emerald" : "bg-white/20"
                    }`}
                    animate={i < metrics.activeMachines ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={metrics.activeMachines}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="font-bold tabular-nums"
                >
                  {metrics.activeMachines}/{metrics.totalMachines}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Activity,
    title: "Passive Hardware Monitoring",
    description: "Records electrical states from machine controllers or PLCs without active intervention.",
  },
  {
    icon: Gauge,
    title: "Real-Time OEE Calculations",
    description: "Automatically calculate Overall Equipment Effectiveness metrics in real-time.",
  },
  {
    icon: Bell,
    title: "Automatic Downtime Prompts",
    description: "Operators receive automatic prompts to document downtime causes when thresholds are exceeded.",
  },
  {
    icon: Smartphone,
    title: "Mobile Accessibility",
    description: "Access metrics and dashboards from any mobile device, anywhere on your shop floor.",
  },
  {
    icon: Database,
    title: "DMM System Integration",
    description: "Seamlessly integrates with the DMM System for unified data collection and analysis.",
  },
  {
    icon: BarChart3,
    title: "Automated Reporting",
    description: "Scheduled automated reporting, interactive dashboards, and on-demand charting.",
  },
];

const benefits = [
  "Identify why machines go down",
  "Direct improvements to high-impact areas",
  "Reliable downtime cause documentation",
  "Real-time shop floor visibility",
  "Data-driven decision making",
  "Comprehensive OEE tracking",
];

const howItWorks = [
  {
    step: "1",
    title: "Hardware Monitors",
    description: "Passive hardware monitors electrical points on machine controllers or PLCs.",
  },
  {
    step: "2",
    title: "Data Translation",
    description: "Proprietary software translates electrical states into operational status data.",
  },
  {
    step: "3",
    title: "Trigger Detection",
    description: "When idle time exceeds your preset threshold, the system triggers an action.",
  },
  {
    step: "4",
    title: "Operator Documentation",
    description: "Operators are prompted to document the cause of downtime for accurate tracking.",
  },
];

export default function GreenLightPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Green Light Monitoring"
          subtitle="Automated machine uptime data collection for real-time OEE calculations and actionable insights."
          breadcrumb={[
            { label: "Products", href: "/products" },
            { label: "Green Light Monitoring", href: "/products/green-light" },
          ]}
        />

        {/* Overview Section */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Know Why Your Machines Go Down
              </h2>
              <p className="text-lg text-slate mb-6">
                Green Light Monitoring is a powerful tool for automatically collecting machine
                uptime data for real-time Overall Equipment Effectiveness (OEE) calculations.
                It works with nearly any machine tool in your facility.
              </p>
              <p className="text-lg text-slate mb-8">
                By capturing accurate downtime reasons, you can direct your improvement efforts
                to the areas that will have the greatest impact on your operations.
              </p>
              <Button href="/contact" size="lg">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LiveMetricsPanel />
            </motion.div>
          </div>
        </SectionWrapper>

        {/* How It Works */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Simple, non-invasive monitoring that delivers powerful insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-emerald text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-slate text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Interactive Demo */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Watch how data flows from the machine through the Opto22 Groov device to your real-time dashboard
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GreenLightDemo />
          </motion.div>
        </SectionWrapper>

        {/* Features Grid */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Key Features
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6">
                  <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Benefits Section */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Benefits of Green Light Monitoring
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald" />
                    </div>
                    <span className="text-lg text-slate">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-light/20">
                <h3 className="font-semibold text-navy mb-4">Works With Any Machine</h3>
                <p className="text-slate mb-6">
                  Green Light Monitoring can be customized for nearly any machine tool
                  in your facility. The system monitors electrical points and translates
                  them into actionable operational data.
                </p>
                <Button href="/contact" variant="secondary">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Tracking Your OEE Today
              </h2>
              <p className="text-lg text-white/80 mb-8">
                See how Green Light Monitoring can help you identify and eliminate downtime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact Sales
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
