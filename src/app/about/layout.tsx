import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Partners in Success since 1996. The Aquila Group helps manufacturers implement demand-pull practices through technology. Serving 100+ facilities with 29 years of experience.",
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
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
