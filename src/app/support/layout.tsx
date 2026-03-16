import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with DMM System and Green Light Monitoring. Submit support requests, check ticket status, and browse our knowledge base for troubleshooting guides and FAQs.",
  keywords: [
    "DMM support",
    "manufacturing software support",
    "Green Light Monitoring help",
    "technical support",
    "knowledge base",
    "troubleshooting",
  ],
  openGraph: {
    title: "Support | The Aquila Group",
    description:
      "Get help with DMM System and Green Light Monitoring. Submit requests, check tickets, and browse our knowledge base.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Aquila Group Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | The Aquila Group",
    description:
      "Get help with DMM System and Green Light Monitoring. Submit requests and browse our knowledge base.",
    images: ["/og-image.png"],
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
