"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Settings,
  Users,
  Package,
  Factory,
  ClipboardList,
  LogOut,
  User,
  Lock,
  Monitor,
} from "lucide-react";
import Image from "next/image";

// Menu structure matching the real DMM system
const menuStructure = [
  {
    name: "Demand Management",
    icon: ClipboardList,
    items: [
      { name: "Dynamic Demand", icon: "📊" },
      { name: "Dynamic Scheduling", icon: "📅" },
      { name: "Order Status", icon: "📋" },
      { name: "Assembly Sequencing", icon: "🔧" },
      { name: "Advanced Planning", icon: "📈" },
      { name: "NxCell Dispatcher", icon: "🚀" },
    ],
  },
  {
    name: "Part Management",
    icon: Package,
    items: [
      { name: "Item Master", icon: "📦" },
      { name: "Material Specification", icon: "📄" },
      { name: "Product Flow Templates", icon: "🔄" },
      { name: "Work Flow Templates", icon: "📝" },
      { name: "Route Oper Master", icon: "🛤️" },
      { name: "Bin Master", icon: "🗃️" },
      { name: "Product Master", icon: "📦" },
    ],
  },
  {
    name: "Production Analysis",
    icon: BarChart3,
    items: [
      { name: "Report Master", icon: "📊" },
      { name: "Production History", icon: "📜" },
      { name: "Green Light Analysis", icon: "🟢" },
      { name: "DMM Historian", icon: "📚" },
      { name: "Activity Log Analysis", icon: "📋" },
      { name: "Delay Log Analysis", icon: "⏱️" },
      { name: "Dashboard Master", icon: "📈" },
      { name: "Maintenance Plan History", icon: "🔧" },
    ],
  },
  {
    name: "MES Configuration",
    icon: Factory,
    items: [
      { name: "Machine Master", icon: "⚙️" },
      { name: "Work Center Views", icon: "🏭" },
      { name: "DMM Import Templates", icon: "📥" },
      { name: "DMM Import Viewer", icon: "👁️" },
      { name: "Activity Master", icon: "📋" },
      { name: "Mfg. Eng. Tools", icon: "🔧" },
      { name: "Paint Utilities", icon: "🎨" },
    ],
  },
  {
    name: "System Configuration",
    icon: Settings,
    items: [
      { name: "Administrative Tools", icon: "🛠️" },
      { name: "Employee Master", icon: "👤" },
      { name: "Global Options", icon: "⚙️" },
      { name: "User Groups", icon: "👥" },
      { name: "DMM Database Revision Log", icon: "📝" },
      { name: "Log On As Different User", icon: "🔄" },
      { name: "DMM System Version Log", icon: "📋" },
      { name: "About DMM System", icon: "ℹ️" },
    ],
  },
  {
    name: "User Specific",
    icon: Users,
    items: [
      { name: "Training Center", icon: "🎓" },
      { name: "User Preferences", icon: "⚙️" },
      { name: "Clear Cache", icon: "🗑️" },
      { name: "Change Your Password", icon: "🔐" },
    ],
  },
];

// Partner logos
const partnerLogos = [
  { name: "Oracle", color: "#C74634" },
  { name: "PTC", color: "#4A8C2A" },
  { name: "Opto 22", color: "#E65100" },
  { name: "SICK", color: "#003087" },
  { name: "Kepware", color: "#00A650" },
  { name: "Microsoft", color: "#737373" },
];

export default function DMMDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setExpandedMenu(null);
    setIsLoggedIn(false);
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Window Chrome */}
      <div className="bg-[#f0f0f0] rounded-t-lg border border-[#999] border-b-0 px-2 py-1 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-600">
          {isLoggedIn
            ? "DMM Mfg Execution System - [Logged Into DMM-4DC on CUSBUR01APCP050]"
            : "DMM - Manufacturing Execution System"}
        </div>
      </div>

      {/* Main Application Window */}
      <div
        className="relative border border-[#999] rounded-b-lg overflow-hidden"
        style={{ backgroundColor: "#5BA4D9" }}
      >
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* Login Screen */
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[500px] p-8 flex items-center justify-center"
            >
              {/* Login Dialog */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white border border-[#999] shadow-lg z-10"
                style={{ width: "200px" }}
              >
                <div className="bg-[#4088c7] px-3 py-1.5 border-b border-[#3577b0] font-semibold text-sm text-white">
                  DMM Login
                </div>
                <div className="p-4 space-y-3 bg-[#f5f5f5]">
                  <div>
                    <label className="block text-xs mb-1 text-black font-medium">User Name:</label>
                    <input
                      type="text"
                      defaultValue="840447"
                      className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white text-black"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-black font-medium">Password:</label>
                    <input
                      type="password"
                      defaultValue="password"
                      placeholder="Enter Password"
                      className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white text-black"
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      className="px-4 py-1.5 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] active:bg-[#ccc] disabled:opacity-50 rounded-sm text-black font-medium"
                    >
                      {isLoggingIn ? "..." : "Logon"}
                    </button>
                    <button className="px-4 py-1.5 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] rounded-sm text-black font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Main Content Area */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  Machine Monitoring
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Real-Time Dashboards, OEE Metrics
                </p>

                {/* Dashboard Preview Images */}
                <div className="relative h-48 flex items-end justify-center gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="bg-white rounded shadow-lg p-2"
                      style={{
                        width: i === 2 ? "140px" : "100px",
                        height: i === 2 ? "160px" : "120px",
                        transform: `translateY(${i === 2 ? "0" : "20px"})`,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded flex flex-col items-center justify-center text-xs text-gray-400">
                        {i === 0 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-blue-200 rounded"></div>
                            <div className="flex gap-1 h-8">
                              <div className="flex-1 bg-orange-300 rounded-t"></div>
                              <div className="flex-1 bg-blue-300 rounded-t"></div>
                              <div className="flex-1 bg-green-300 rounded-t"></div>
                            </div>
                          </div>
                        )}
                        {i === 1 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="flex gap-1 h-12">
                              <div className="flex-1 bg-yellow-300 rounded"></div>
                              <div className="flex-1 bg-red-300 rounded"></div>
                            </div>
                          </div>
                        )}
                        {i === 2 && (
                          <div className="space-y-2 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="w-20 h-20 mx-auto rounded-full border-8 border-green-400 border-t-blue-400 border-r-yellow-400"></div>
                          </div>
                        )}
                        {i === 3 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="flex gap-1 h-10 items-end">
                              <div className="flex-1 bg-blue-400 h-full rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-3/4 rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-1/2 rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-2/3 rounded-t"></div>
                            </div>
                          </div>
                        )}
                        {i === 4 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="space-y-1">
                              <div className="h-2 bg-red-300 rounded"></div>
                              <div className="h-2 bg-green-300 rounded"></div>
                              <div className="h-2 bg-yellow-300 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Copyright */}
                <p className="text-white/70 text-sm mt-8">
                  Copyright - The Aquila Group, Inc. 1996 - 2025
                </p>
                <p className="text-white/60 text-xs">Version: 9.0.713</p>
              </div>
            </motion.div>
          ) : (
            /* Main Dashboard */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[500px] flex"
            >
              {/* Left Sidebar Menu */}
              <motion.div
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-48 bg-[#f5f5f5] border-r border-[#ccc] shadow-lg"
              >
                {/* Refresh button */}
                <div className="p-1 border-b border-[#ccc] flex justify-end">
                  <button className="w-6 h-6 rounded-full bg-[#4CAF50] text-white text-xs flex items-center justify-center hover:bg-[#45a049]">
                    ↻
                  </button>
                </div>

                {/* Menu Items */}
                <div className="overflow-y-auto max-h-[440px]">
                  {menuStructure.map((menu) => (
                    <div key={menu.name}>
                      {/* Menu Header */}
                      <button
                        onClick={() => toggleMenu(menu.name)}
                        className={`w-full px-2 py-1.5 flex items-center gap-2 text-left text-sm hover:bg-[#e8e8e8] transition-colors ${
                          expandedMenu === menu.name
                            ? "bg-[#d32f2f] text-white font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        <menu.icon className="w-4 h-4" />
                        <span className="flex-1 text-xs">{menu.name}</span>
                        {expandedMenu === menu.name ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {/* Submenu Items */}
                      <AnimatePresence>
                        {expandedMenu === menu.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-white"
                          >
                            <div className="grid grid-cols-2 gap-0.5 p-1">
                              {menu.items.map((item) => (
                                <button
                                  key={item.name}
                                  className="p-1.5 text-xs text-gray-600 hover:bg-[#e3f2fd] rounded flex flex-col items-center gap-0.5 transition-colors"
                                  onClick={() => {
                                    // Show a tooltip or highlight effect
                                  }}
                                >
                                  <span className="text-base">{item.icon}</span>
                                  <span className="text-center leading-tight text-[10px]">
                                    {item.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Exit DMM System */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-2 py-1.5 flex items-center gap-2 text-left text-sm text-gray-700 hover:bg-[#ffebee] hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs">Exit DMM System</span>
                  </button>
                </div>
              </motion.div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  Machine Monitoring
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Real-Time Dashboards, OEE Metrics
                </p>

                {/* Dashboard Preview Images */}
                <div className="relative h-48 flex items-end justify-center gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="bg-white rounded shadow-lg p-2"
                      style={{
                        width: i === 2 ? "140px" : "100px",
                        height: i === 2 ? "160px" : "120px",
                        transform: `translateY(${i === 2 ? "0" : "20px"})`,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded flex flex-col items-center justify-center text-xs text-gray-400">
                        {i === 0 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-blue-200 rounded"></div>
                            <div className="flex gap-1 h-8">
                              <div className="flex-1 bg-orange-300 rounded-t"></div>
                              <div className="flex-1 bg-blue-300 rounded-t"></div>
                              <div className="flex-1 bg-green-300 rounded-t"></div>
                            </div>
                          </div>
                        )}
                        {i === 1 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="flex gap-1 h-12">
                              <div className="flex-1 bg-yellow-300 rounded"></div>
                              <div className="flex-1 bg-red-300 rounded"></div>
                            </div>
                          </div>
                        )}
                        {i === 2 && (
                          <div className="space-y-2 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="w-20 h-20 mx-auto rounded-full border-8 border-green-400 border-t-blue-400 border-r-yellow-400"></div>
                          </div>
                        )}
                        {i === 3 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="flex gap-1 h-10 items-end">
                              <div className="flex-1 bg-blue-400 h-full rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-3/4 rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-1/2 rounded-t"></div>
                              <div className="flex-1 bg-blue-400 h-2/3 rounded-t"></div>
                            </div>
                          </div>
                        )}
                        {i === 4 && (
                          <div className="space-y-1 w-full px-2">
                            <div className="h-2 bg-gray-300 rounded"></div>
                            <div className="space-y-1">
                              <div className="h-2 bg-red-300 rounded"></div>
                              <div className="h-2 bg-green-300 rounded"></div>
                              <div className="h-2 bg-yellow-300 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Partner Logos Footer */}
        <div className="bg-white/90 px-4 py-3 flex justify-center items-center gap-8 flex-wrap border-t border-white/20">
          <div className="flex items-center gap-1">
            <div className="w-12 h-6 bg-[#C74634] rounded-sm"></div>
            <span className="text-[10px] text-gray-500">Gold Partner</span>
          </div>
          <span className="text-sm font-bold text-[#4A8C2A]">⬡ ptc</span>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-orange-600 font-bold">
              OPTO PARTNER
            </span>
            <span className="text-[8px] text-gray-500">IoT CERTIFIED</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-yellow-400"></div>
          <span className="text-lg font-bold text-[#003087]">SICK</span>
          <span className="text-sm text-[#00A650]">⬢ kepware</span>
          <span className="text-xs text-gray-500">
            Microsoft
            <br />
            Partner
          </span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-slate mt-4">
        Click <strong>Logon</strong> to explore the DMM interface. Use the menu
        on the left to navigate through modules.
      </p>
    </div>
  );
}
