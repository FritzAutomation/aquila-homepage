import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See how leading manufacturers transformed their operations with The Aquila Group. Real results including 75% reduction in programming time and unified production visibility.",
  keywords: [
    "manufacturing case study",
    "MES implementation",
    "ASCO Power Technologies",
    "Hillphoenix",
    "production optimization",
    "sheet metal nesting",
  ],
  openGraph: {
    title: "Case Studies | The Aquila Group",
    description:
      "See how leading manufacturers transformed their operations with The Aquila Group.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Aquila Group Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | The Aquila Group",
    description:
      "See how leading manufacturers transformed their operations with The Aquila Group.",
    images: ["/og-image.png"],
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
