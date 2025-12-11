import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BackToTop, CookieConsent, ScrollProgress } from "@/components/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.the-aquila-group.com"),
  title: {
    default: "The Aquila Group | Real-Time Manufacturing Intelligence",
    template: "%s | The Aquila Group",
  },
  description:
    "Partners in Success since 1996. MES solutions for manufacturers including DMM System, Green Light Monitoring, and custom integrations. Serving 100+ facilities worldwide.",
  keywords: [
    "manufacturing execution system",
    "MES",
    "shop floor control",
    "real-time tracking",
    "OEE",
    "Overall Equipment Effectiveness",
    "DMM System",
    "Green Light Monitoring",
    "manufacturing software",
    "production tracking",
    "industrial automation",
  ],
  authors: [{ name: "The Aquila Group" }],
  creator: "The Aquila Group",
  publisher: "The Aquila Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.the-aquila-group.com",
    siteName: "The Aquila Group",
    title: "The Aquila Group | Real-Time Manufacturing Intelligence",
    description:
      "Partners in Success since 1996. MES solutions for manufacturers including DMM System, Green Light Monitoring, and custom integrations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Aquila Group - Manufacturing Intelligence Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aquila Group | Real-Time Manufacturing Intelligence",
    description:
      "Partners in Success since 1996. MES solutions for manufacturers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have the verification codes
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ScrollProgress />
        {children}
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
