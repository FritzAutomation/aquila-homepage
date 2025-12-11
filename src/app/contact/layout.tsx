import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with The Aquila Group. Request a demo, contact sales, or reach our technical support team. Located in Evans, GA with 24/7 support availability.",
  keywords: [
    "contact Aquila Group",
    "request demo",
    "manufacturing software demo",
    "technical support",
    "Evans GA",
  ],
  openGraph: {
    title: "Contact Us | The Aquila Group",
    description:
      "Request a demo, contact sales, or reach our 24/7 technical support team.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
