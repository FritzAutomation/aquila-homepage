import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Partners in Success since 1996. The Aquila Group helps manufacturers implement demand-pull practices through technology. Serving 100+ facilities worldwide.",
  keywords: [
    "manufacturing consulting",
    "demand-pull manufacturing",
    "The Aquila Group",
    "manufacturing technology",
    "Evans GA",
  ],
  openGraph: {
    title: "About Us | The Aquila Group",
    description:
      "Partners in Success since 1996. Helping manufacturers succeed with technology and effective management.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About The Aquila Group" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | The Aquila Group",
    description: "Partners in Success since 1996. Helping manufacturers succeed with technology.",
    images: ["/og-image.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
