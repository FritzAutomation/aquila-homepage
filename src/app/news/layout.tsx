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
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
