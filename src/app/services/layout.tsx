import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive manufacturing technology services: training, system integration, consulting, and 24/7 technical support. Partners in Success since 1996.",
  keywords: [
    "manufacturing training",
    "system integration",
    "manufacturing consulting",
    "technical support",
    "ERP integration",
    "CAD CAM integration",
  ],
  openGraph: {
    title: "Services | The Aquila Group",
    description:
      "Training, system integration, consulting, and 24/7 support for manufacturing technology.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The Aquila Group Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | The Aquila Group",
    description: "Training, system integration, consulting, and 24/7 support for manufacturing technology.",
    images: ["/og-image.png"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
