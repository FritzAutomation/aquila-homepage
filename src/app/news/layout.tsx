import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Latest news from The Aquila Group including case studies, partnerships, and manufacturing industry insights. See how our clients achieve results.",
  keywords: [
    "manufacturing news",
    "case studies",
    "manufacturing success stories",
    "Aquila Group news",
    "MES case studies",
  ],
  openGraph: {
    title: "News & Updates | The Aquila Group",
    description:
      "Case studies, partnerships, and manufacturing industry insights.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The Aquila Group News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Updates | The Aquila Group",
    description: "Case studies, partnerships, and manufacturing industry insights from The Aquila Group.",
    images: ["/og-image.png"],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
