import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Green Light Monitoring - OEE Tracking",
  description:
    "Automated machine uptime data collection for real-time Overall Equipment Effectiveness (OEE) calculations. Passive hardware monitoring, automatic downtime prompts, and mobile dashboards.",
  keywords: [
    "Green Light Monitoring",
    "OEE",
    "Overall Equipment Effectiveness",
    "machine monitoring",
    "uptime tracking",
    "downtime analysis",
    "manufacturing analytics",
  ],
  openGraph: {
    title: "Green Light Monitoring - OEE Tracking | The Aquila Group",
    description:
      "Automated OEE tracking with real-time dashboards and downtime analysis.",
  },
};

export default function GreenLightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
