"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Gauge, Timer, Hash, TrendingUp } from "lucide-react";

type MachineStatus = "running" | "idle" | "down";

interface MachineMetrics {
  runtime: number; // seconds
  cycleCount: number;
  currentSpeed: number; // parts per hour
  oee: number;
  downtime: number; // seconds
}

// Format seconds to HH:MM:SS
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Laser Machine Component
function LaserMachine({ status, onStatusChange }: { status: MachineStatus; onStatusChange?: (status: MachineStatus) => void }) {
  const statusColors = {
    running: "#10B981", // emerald
    idle: "#F59E0B", // amber
    down: "#EF4444", // red
  };

  const statusLabels = {
    running: "RUNNING",
    idle: "IDLE",
    down: "DOWN",
  };

  return (
    <div className="flex flex-col items-center">
      {/* Machine Housing */}
      <div className="relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 shadow-xl border border-gray-600">
        {/* Machine Top Section */}
        <div className="bg-gray-900 rounded-t-md p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-mono">LASER-001</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Laser Visualization */}
          <div className="relative h-16 bg-gray-950 rounded border border-gray-700 overflow-hidden flex items-center justify-center">
            {status === "running" && (
              <>
                {/* Laser beam effect */}
                <motion.div
                  className="absolute w-0.5 h-full bg-red-500"
                  animate={{
                    x: [-30, 30, -30],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Sparks effect */}
                <motion.div
                  className="absolute bottom-2 w-4 h-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <div className="w-full h-full bg-orange-400 rounded-full blur-sm" />
                </motion.div>
              </>
            )}
            {status === "idle" && (
              <span className="text-[8px] text-gray-500">STANDBY</span>
            )}
            {status === "down" && (
              <span className="text-[8px] text-red-400">STOPPED</span>
            )}
          </div>
        </div>

        {/* Status Light */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="relative">
            <motion.div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: statusColors[status] }}
              animate={status === "running" ? {
                boxShadow: [
                  `0 0 10px ${statusColors[status]}`,
                  `0 0 20px ${statusColors[status]}`,
                  `0 0 10px ${statusColors[status]}`
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {status === "running" && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <span
            className="text-xs font-bold font-mono"
            style={{ color: statusColors[status] }}
          >
            {statusLabels[status]}
          </span>
        </div>

        {/* Machine Base */}
        <div className="bg-gray-600 h-2 rounded-b-md mt-2" />
      </div>

      <span className="text-xs text-slate mt-2 font-medium">Laser Cutter</span>
    </div>
  );
}

// Animated Signal Path
function SignalPath({ active, status }: { active: boolean; status: MachineStatus }) {
  const color = status === "running" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex-1 flex items-center justify-center px-2 min-w-[60px]">
      <div className="relative w-full h-8">
        {/* Base line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2" />

        {/* Animated dots */}
        {active && (
          <>
            <motion.div
              className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2"
              style={{ backgroundColor: color }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2"
              style={{ backgroundColor: color }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2"
              style={{ backgroundColor: color }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </>
        )}

        {/* Arrow head */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent"
          style={{ borderLeftColor: active ? color : "#D1D5DB" }}
        />
      </div>
    </div>
  );
}

// Opto22 Groov Device
function GroovDevice({ receiving, status }: { receiving: boolean; status: MachineStatus }) {
  const statusColor = status === "running" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center">
      {/* Device Housing */}
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] rounded-lg p-3 shadow-xl border border-gray-700 min-w-[100px]">
        {/* Top Label */}
        <div className="bg-[#ff6600] text-white text-[8px] font-bold px-2 py-0.5 rounded-sm mb-2 text-center">
          OPTO 22
        </div>

        {/* Device Face */}
        <div className="bg-[#0d0d0d] rounded p-2 border border-gray-800">
          {/* LED Row */}
          <div className="flex justify-between mb-2">
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={receiving ? { opacity: [1, 0.3, 1] } : { opacity: 0.3 }}
                transition={{ duration: 0.3, repeat: receiving ? Infinity : 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
                animate={receiving ? { opacity: [1, 0.5, 1] } : { opacity: 0.5 }}
                transition={{ duration: 0.5, repeat: receiving ? Infinity : 0 }}
              />
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-80" />
          </div>

          {/* Screen */}
          <div className="bg-[#001a00] rounded p-1.5 mb-2 border border-green-900">
            <div className="text-[8px] font-mono text-green-400 leading-tight">
              <div>GROOV EPIC</div>
              <div className="text-green-300/70">
                {receiving ? "RX: ACTIVE" : "RX: IDLE"}
              </div>
            </div>
          </div>

          {/* Port indicators */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-1.5 rounded-sm bg-gray-700"
                animate={receiving && i === 0 ? {
                  backgroundColor: ["#374151", statusColor, "#374151"]
                } : {}}
                transition={{ duration: 0.5, repeat: receiving ? Infinity : 0, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Bottom vents */}
        <div className="flex justify-center gap-0.5 mt-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-2 bg-gray-800 rounded-sm" />
          ))}
        </div>
      </div>

      <span className="text-xs text-slate mt-2 font-medium">Groov EPIC</span>
    </div>
  );
}

// Dashboard Display
function MetricsDashboard({ metrics, status }: { metrics: MachineMetrics; status: MachineStatus }) {
  const statusColors = {
    running: "text-emerald",
    idle: "text-amber-500",
    down: "text-red-500",
  };

  const oeePercentage = Math.min(100, Math.max(0, metrics.oee));
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (oeePercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Monitor Frame */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-1 shadow-xl">
        {/* Screen Bezel */}
        <div className="bg-[#1e293b] rounded-md p-3 min-w-[180px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald" />
              <span className="text-[10px] font-semibold text-white">GREEN LIGHT</span>
            </div>
            <motion.div
              className={`w-2 h-2 rounded-full ${status === "running" ? "bg-emerald" : status === "idle" ? "bg-amber-500" : "bg-red-500"}`}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Runtime */}
            <div className="bg-slate-800/50 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <Timer className="w-3 h-3 text-blue-400" />
                <span className="text-[8px] text-slate-400">RUNTIME</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={metrics.runtime}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono font-bold text-white"
                >
                  {formatTime(metrics.runtime)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Speed */}
            <div className="bg-slate-800/50 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span className="text-[8px] text-slate-400">SPEED</span>
              </div>
              <div className="text-sm font-mono font-bold text-white">
                {metrics.currentSpeed}
                <span className="text-[8px] text-slate-400 ml-0.5">/hr</span>
              </div>
            </div>

            {/* Cycles */}
            <div className="bg-slate-800/50 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <Hash className="w-3 h-3 text-cyan-400" />
                <span className="text-[8px] text-slate-400">CYCLES</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={metrics.cycleCount}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-mono font-bold text-white"
                >
                  {metrics.cycleCount}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Status */}
            <div className="bg-slate-800/50 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-[8px] text-slate-400">STATUS</span>
              </div>
              <div className={`text-sm font-bold uppercase ${statusColors[status]}`}>
                {status}
              </div>
            </div>
          </div>

          {/* OEE Ring */}
          <div className="flex items-center justify-center gap-3 bg-slate-800/30 rounded p-2">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#334155"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#10B981"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{metrics.oee.toFixed(1)}</div>
                  <div className="text-[8px] text-slate-400">OEE %</div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald" />
                <span className="text-[8px] text-slate-400">EFFICIENCY</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald" />
                  <span className="text-[8px] text-slate-300">Availability</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[8px] text-slate-300">Performance</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-[8px] text-slate-300">Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor Stand */}
        <div className="flex justify-center">
          <div className="w-8 h-2 bg-gray-700 rounded-b-sm" />
        </div>
      </div>

      <span className="text-xs text-slate mt-2 font-medium">Real-Time Dashboard</span>
    </div>
  );
}

// Main Demo Component
export default function GreenLightDemo() {
  const [status, setStatus] = useState<MachineStatus>("running");
  const [metrics, setMetrics] = useState<MachineMetrics>({
    runtime: 0,
    cycleCount: 0,
    currentSpeed: 42,
    oee: 85.5,
    downtime: 0,
  });
  const [signalActive, setSignalActive] = useState(true);

  // Simulate machine status cycling
  useEffect(() => {
    let statusTimeout: NodeJS.Timeout;

    const cycleStatus = () => {
      // Determine next status and duration
      const rand = Math.random();

      if (status === "running") {
        // After running, go to idle briefly or occasionally down
        if (rand < 0.08) {
          // 8% chance of going down
          setStatus("down");
          statusTimeout = setTimeout(cycleStatus, 5000 + Math.random() * 5000); // Down for 5-10 seconds
        } else {
          setStatus("idle");
          statusTimeout = setTimeout(cycleStatus, 2000 + Math.random() * 2000); // Idle for 2-4 seconds
        }
      } else if (status === "idle") {
        // After idle, go back to running
        setStatus("running");
        setMetrics(prev => ({ ...prev, cycleCount: prev.cycleCount + 1 }));
        statusTimeout = setTimeout(cycleStatus, 8000 + Math.random() * 7000); // Run for 8-15 seconds
      } else {
        // After down, go to idle then running
        setStatus("idle");
        statusTimeout = setTimeout(cycleStatus, 1500); // Brief idle before restart
      }
    };

    // Start first cycle
    statusTimeout = setTimeout(cycleStatus, 8000 + Math.random() * 7000);

    return () => clearTimeout(statusTimeout);
  }, [status]);

  // Update metrics every second
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newRuntime = status === "running" ? prev.runtime + 1 : prev.runtime;
        const newDowntime = status === "down" ? prev.downtime + 1 : prev.downtime;
        const totalTime = newRuntime + newDowntime + 1;
        const availability = (newRuntime / totalTime) * 100;
        const performance = 85 + Math.random() * 10; // Simulated
        const quality = 95 + Math.random() * 4; // Simulated
        const newOee = (availability * performance * quality) / 10000;

        return {
          ...prev,
          runtime: newRuntime,
          downtime: newDowntime,
          currentSpeed: status === "running" ? 38 + Math.floor(Math.random() * 10) : 0,
          oee: Math.min(99, Math.max(0, newOee)),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Signal is active when machine is running or just changed status
  useEffect(() => {
    setSignalActive(true);
    const timeout = setTimeout(() => {
      if (status !== "running") {
        setSignalActive(status === "idle"); // Keep signal for idle, stop for down
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:block">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald animate-pulse" />
              <span className="text-sm font-semibold text-navy">Live Monitoring Demo</span>
            </div>
            <span className="text-xs text-slate bg-white px-2 py-1 rounded-full">
              Signal: {signalActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Main Flow Visualization */}
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            <LaserMachine status={status} />
            <SignalPath active={signalActive} status={status} />
            <GroovDevice receiving={signalActive} status={status} />
            <SignalPath active={signalActive} status={status} />
            <MetricsDashboard metrics={metrics} status={status} />
          </div>

          {/* Footer Labels */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald" />
              <span className="text-xs text-slate">Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-slate">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-slate">Down</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-4 shadow-lg border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs font-semibold text-navy">Live Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === "running" ? "bg-emerald" : status === "idle" ? "bg-amber-500" : "bg-red-500"}`} />
              <span className="text-xs text-slate capitalize">{status}</span>
            </div>
          </div>

          {/* Vertical Flow */}
          <div className="flex flex-col items-center gap-3">
            {/* Machine (simplified) */}
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 w-full">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: status === "running" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444" }}
                  animate={status === "running" ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
              </div>
              <div>
                <div className="text-sm font-semibold text-navy">Laser Cutter</div>
                <div className="text-xs text-slate capitalize">{status}</div>
              </div>
            </div>

            {/* Signal Arrow */}
            <motion.div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: status === "running" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444" }}
              animate={{ opacity: signalActive ? [1, 0.5, 1] : 0.3 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Groov Device (simplified) */}
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 w-full">
              <div className="w-10 h-10 bg-[#ff6600] rounded-lg flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">OPTO</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-navy">Groov EPIC</div>
                <div className="text-xs text-slate">{signalActive ? "Receiving" : "Standby"}</div>
              </div>
            </div>

            {/* Signal Arrow */}
            <motion.div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: status === "running" ? "#10B981" : status === "idle" ? "#F59E0B" : "#EF4444" }}
              animate={{ opacity: signalActive ? [1, 0.5, 1] : 0.3 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Metrics Card */}
            <div className="bg-navy rounded-lg p-4 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-emerald" />
                <span className="text-sm font-semibold text-white">Dashboard</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded p-2">
                  <div className="text-[10px] text-white/60">Runtime</div>
                  <div className="text-sm font-mono font-bold text-white">{formatTime(metrics.runtime)}</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-[10px] text-white/60">Cycles</div>
                  <div className="text-sm font-mono font-bold text-white">{metrics.cycleCount}</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-[10px] text-white/60">Speed</div>
                  <div className="text-sm font-mono font-bold text-white">{metrics.currentSpeed}/hr</div>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <div className="text-[10px] text-white/60">OEE</div>
                  <div className="text-sm font-mono font-bold text-emerald">{metrics.oee.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-300">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-[10px] text-slate">Running</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] text-slate">Idle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-slate">Down</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-xs sm:text-sm text-slate mt-4 px-4">
        Watch as the laser machine cycles through operational states. Data flows through the Opto22 Groov device to the real-time dashboard.
      </p>
    </div>
  );
}
