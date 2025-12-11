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
  Menu,
  X,
} from "lucide-react";

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

export default function DMMDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setExpandedMenu(null);
    setMobileMenuOpen(false);
    setIsLoggedIn(false);
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  // Sidebar menu component
  const SidebarMenu = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`bg-[#f5f5f5] ${isMobile ? "h-full" : "border-r border-[#ccc] shadow-lg"}`}>
      {/* Refresh button */}
      <div className="p-1 border-b border-[#ccc] flex justify-between items-center">
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex-1"></div>
        <button className="w-6 h-6 rounded-full bg-[#4CAF50] text-white text-xs flex items-center justify-center hover:bg-[#45a049]">
          ↻
        </button>
      </div>

      {/* Menu Items */}
      <div className={`overflow-y-auto ${isMobile ? "max-h-[280px]" : "max-h-[440px]"}`}>
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
    </div>
  );

  // Dashboard preview cards component
  const DashboardPreviews = ({ small = false }: { small?: boolean }) => (
    <div className={`relative ${small ? "h-24" : "h-48"} flex items-end justify-center gap-1 md:gap-2`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`bg-white rounded shadow-lg p-1 md:p-2 ${(i === 0 || i === 4) && small ? "hidden" : ""}`}
          style={{
            width: small
              ? (i === 2 ? "60px" : "45px")
              : (i === 2 ? "140px" : "100px"),
            height: small
              ? (i === 2 ? "70px" : "55px")
              : (i === 2 ? "160px" : "120px"),
            transform: `translateY(${i === 2 ? "0" : small ? "10px" : "20px"})`,
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
              <div className="space-y-1 w-full px-1">
                <div className={`${small ? "h-1" : "h-2"} bg-gray-300 rounded`}></div>
                <div className={`flex gap-0.5 ${small ? "h-6" : "h-12"}`}>
                  <div className="flex-1 bg-yellow-300 rounded"></div>
                  <div className="flex-1 bg-red-300 rounded"></div>
                </div>
              </div>
            )}
            {i === 2 && (
              <div className="space-y-2 w-full px-1">
                <div className={`${small ? "h-1" : "h-2"} bg-gray-300 rounded`}></div>
                <div className={`${small ? "w-8 h-8" : "w-20 h-20"} mx-auto rounded-full border-4 md:border-8 border-green-400 border-t-blue-400 border-r-yellow-400`}></div>
              </div>
            )}
            {i === 3 && (
              <div className="space-y-1 w-full px-1">
                <div className={`${small ? "h-1" : "h-2"} bg-gray-300 rounded`}></div>
                <div className={`flex gap-0.5 ${small ? "h-5" : "h-10"} items-end`}>
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
  );

  // Partner logos footer
  const PartnerLogos = ({ compact = false }: { compact?: boolean }) => (
    <div className={`bg-white/90 ${compact ? "px-2 py-1.5" : "px-4 py-3"} flex justify-center items-center ${compact ? "gap-2" : "gap-8"} flex-wrap border-t border-white/20`}>
      <div className="flex items-center gap-1">
        <div className={`${compact ? "w-6 h-3" : "w-12 h-6"} bg-[#C74634] rounded-sm`}></div>
        {!compact && <span className="text-[10px] text-gray-500">Gold Partner</span>}
      </div>
      <span className={`${compact ? "text-[10px]" : "text-sm"} font-bold text-[#4A8C2A]`}>⬡ ptc</span>
      {!compact && (
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-orange-600 font-bold">OPTO PARTNER</span>
          <span className="text-[8px] text-gray-500">IoT CERTIFIED</span>
        </div>
      )}
      <span className={`${compact ? "text-[10px]" : "text-lg"} font-bold text-[#003087]`}>SICK</span>
      {!compact && <span className="text-sm text-[#00A650]">⬢ kepware</span>}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* DESKTOP VERSION - lg and up (1024px+) */}
      <div className="hidden lg:block">
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
                  <DashboardPreviews />

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
                  className="w-48"
                >
                  <SidebarMenu />
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
                  <DashboardPreviews />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partner Logos Footer */}
          <PartnerLogos />
        </div>
      </div>

      {/* TABLET VERSION - md to lg (768px - 1023px) */}
      <div className="hidden md:flex lg:hidden justify-center">
        {/* Tablet outer frame */}
        <div className="bg-[#2a2a2a] rounded-[1.5rem] p-3 shadow-2xl max-w-[600px] w-full">
          {/* Tablet inner bezel */}
          <div className="bg-[#1a1a1a] rounded-[1rem] overflow-hidden">
            {/* Tablet camera */}
            <div className="bg-[#1a1a1a] py-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
            </div>

            {/* Tablet screen content */}
            <div className="relative" style={{ backgroundColor: "#5BA4D9" }}>
              <AnimatePresence mode="wait">
                {!isLoggedIn ? (
                  /* Tablet Login Screen */
                  <motion.div
                    key="tablet-login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px] p-6 flex items-center justify-center"
                  >
                    {/* Login Dialog */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white border border-[#999] shadow-lg z-10 w-[180px]"
                    >
                      <div className="bg-[#4088c7] px-3 py-1.5 border-b border-[#3577b0] font-semibold text-sm text-white">
                        DMM Login
                      </div>
                      <div className="p-3 space-y-2 bg-[#f5f5f5]">
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
                            className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white text-black"
                            readOnly
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="px-3 py-1 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] active:bg-[#ccc] disabled:opacity-50 rounded-sm text-black font-medium"
                          >
                            {isLoggingIn ? "..." : "Logon"}
                          </button>
                          <button className="px-3 py-1 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] rounded-sm text-black font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="text-center ml-auto mr-8">
                      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        Machine Monitoring
                      </h1>
                      <p className="text-base text-white/90 mb-6">
                        Real-Time Dashboards, OEE Metrics
                      </p>

                      <DashboardPreviews />

                      <p className="text-white/70 text-sm mt-6">
                        Copyright - The Aquila Group, Inc. 1996 - 2025
                      </p>
                      <p className="text-white/60 text-xs">Version: 9.0.713</p>
                    </div>
                  </motion.div>
                ) : (
                  /* Tablet Dashboard */
                  <motion.div
                    key="tablet-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px] flex"
                  >
                    {/* Sidebar Menu */}
                    <motion.div
                      initial={{ x: -200 }}
                      animate={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-44"
                    >
                      <SidebarMenu />
                    </motion.div>

                    {/* Main content */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center">
                      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">
                        Machine Monitoring
                      </h1>
                      <p className="text-base text-white/90 mb-6 text-center">
                        Real-Time Dashboards, OEE Metrics
                      </p>
                      <DashboardPreviews />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Partner Logos Footer */}
              <PartnerLogos />
            </div>

            {/* Tablet home button area */}
            <div className="bg-[#1a1a1a] py-3 flex justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#333]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VERSION - Phone Frame (below 768px) */}
      <div className="md:hidden flex justify-center">
        {/* Phone outer frame */}
        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-2 shadow-2xl max-w-[320px] w-full">
          {/* Phone inner bezel */}
          <div className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden">
            {/* Phone top notch/speaker area */}
            <div className="bg-[#1a1a1a] pt-2 pb-1 px-4 flex items-center justify-center">
              <div className="w-20 h-5 bg-[#0a0a0a] rounded-full flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2a2a2a]"></div>
                <div className="w-8 h-1 bg-[#2a2a2a] rounded-full"></div>
              </div>
            </div>

            {/* Phone status bar */}
            <div className="bg-[#4a94c4] px-4 py-1 flex items-center justify-between text-white text-[10px]">
              <span>9:41</span>
              <span className="font-medium truncate max-w-[50%]">
                {isLoggedIn ? "DMM - Logged In" : "DMM System"}
              </span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-2 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-2.5 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-3 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-3.5 bg-white/50 rounded-sm"></div>
                </div>
                <span>100%</span>
              </div>
            </div>

            {/* Phone screen content */}
            <div className="relative" style={{ backgroundColor: "#5BA4D9" }}>
              <AnimatePresence mode="wait">
                {!isLoggedIn ? (
                  /* Mobile Login Screen */
                  <motion.div
                    key="mobile-login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[350px] p-4 flex flex-col items-center justify-center"
                  >
                    {/* Login Dialog */}
                    <div className="bg-white border border-[#999] shadow-lg w-[180px]">
                      <div className="bg-[#4088c7] px-3 py-1.5 border-b border-[#3577b0] font-semibold text-sm text-white">
                        DMM Login
                      </div>
                      <div className="p-3 space-y-2 bg-[#f5f5f5]">
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
                            className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white text-black"
                            readOnly
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="px-3 py-1 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] active:bg-[#ccc] disabled:opacity-50 rounded-sm text-black font-medium"
                          >
                            {isLoggingIn ? "..." : "Logon"}
                          </button>
                          <button className="px-3 py-1 text-sm bg-[#e8e8e8] border border-[#aaa] hover:bg-[#ddd] rounded-sm text-black font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="text-center mt-4">
                      <h1 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                        Machine Monitoring
                      </h1>
                      <p className="text-xs text-white/90 mb-3">
                        Real-Time Dashboards, OEE Metrics
                      </p>

                      <DashboardPreviews small />

                      <p className="text-white/70 text-[10px] mt-3">
                        Copyright - The Aquila Group, Inc. 1996 - 2025
                      </p>
                      <p className="text-white/60 text-[8px]">Version: 9.0.713</p>
                    </div>
                  </motion.div>
                ) : (
                  /* Mobile Dashboard */
                  <motion.div
                    key="mobile-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[350px] flex flex-col"
                  >
                    {/* Mobile header with menu button */}
                    <div className="p-2 bg-[#f5f5f5] border-b border-[#ccc] flex items-center justify-between">
                      <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#ccc] rounded text-sm text-gray-700"
                      >
                        <Menu className="w-4 h-4" />
                        <span>Menu</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#ccc] rounded text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>

                    {/* Mobile Menu Drawer - INSIDE the phone screen */}
                    <AnimatePresence>
                      {mobileMenuOpen && (
                        <>
                          {/* Backdrop inside phone */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                          />
                          {/* Drawer inside phone */}
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute left-0 top-0 bottom-0 w-48 z-50"
                          >
                            <SidebarMenu isMobile />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Main content */}
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                      <h1 className="text-xl font-bold text-white mb-1 drop-shadow-lg text-center">
                        Machine Monitoring
                      </h1>
                      <p className="text-xs text-white/90 mb-3 text-center">
                        Real-Time Dashboards, OEE Metrics
                      </p>
                      <DashboardPreviews small />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Partner Logos Footer */}
              <PartnerLogos compact />
            </div>

            {/* Phone home indicator */}
            <div className="bg-[#1a1a1a] py-2 flex justify-center">
              <div className="w-24 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-xs sm:text-sm text-slate mt-4 px-4">
        Click <strong>Logon</strong> to explore the DMM interface.
        <span className="hidden lg:inline"> Use the menu on the left to navigate through modules.</span>
        <span className="hidden md:inline lg:hidden"> Use the sidebar menu to navigate through modules.</span>
        <span className="md:hidden"> Use the Menu button to navigate.</span>
      </p>
    </div>
  );
}
