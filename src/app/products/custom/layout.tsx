import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Solutions - Tailored Manufacturing Software",
  description:
    "Custom-developed manufacturing solutions designed for your unique processes. Custom integrations, specialized dashboards, workflow automation, and legacy system connections.",
  keywords: [
    "custom manufacturing software",
    "custom integrations",
    "manufacturing automation",
    "workflow automation",
    "legacy system integration",
    "custom dashboards",
  ],
  openGraph: {
    title: "Custom Solutions - Tailored Manufacturing Software | The Aquila Group",
    description:
      "Custom manufacturing solutions designed specifically for your unique processes and goals.",
  },
};

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
