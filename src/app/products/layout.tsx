import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Manufacturing software solutions: DMM System for shop floor control, Green Light Monitoring for OEE tracking, and custom integrations tailored to your needs.",
  keywords: [
    "manufacturing software",
    "DMM System",
    "Green Light Monitoring",
    "MES solutions",
    "shop floor control",
    "OEE tracking",
  ],
  openGraph: {
    title: "Products | The Aquila Group",
    description:
      "Manufacturing software solutions: DMM System, Green Light Monitoring, and custom integrations.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The Aquila Group Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | The Aquila Group",
    description: "DMM System, Green Light Monitoring, and custom manufacturing integrations.",
    images: ["/og-image.png"],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
