import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMM System - Dynamic Machine Management",
  description:
    "User-friendly demand-pull Manufacturing Execution System (MES) delivering real-time shop floor control. Dynamic scheduling, paperless work orders, ERP integration, and complete order tracking.",
  keywords: [
    "DMM System",
    "Dynamic Machine Management",
    "MES",
    "Manufacturing Execution System",
    "shop floor control",
    "dynamic scheduling",
    "paperless manufacturing",
    "ERP integration",
  ],
  openGraph: {
    title: "DMM System - Dynamic Machine Management | The Aquila Group",
    description:
      "Real-time shop floor control with dynamic scheduling, paperless work orders, and complete order tracking.",
  },
};

export default function DMMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
