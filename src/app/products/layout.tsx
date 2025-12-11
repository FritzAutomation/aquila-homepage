import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Manufacturing software solutions: DMM System for shop floor control, Green Light Monitoring for OEE tracking, and custom integrations tailored to your needs.",
  openGraph: {
    title: "Products | The Aquila Group",
    description:
      "Manufacturing software solutions: DMM System, Green Light Monitoring, and custom integrations.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
