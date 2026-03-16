import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Platform",
  description:
    "Interactive training modules for DMM System and Green Light Monitoring. Complete lessons, pass knowledge checks, and track your progress with our self-paced learning platform.",
  keywords: [
    "DMM training",
    "manufacturing software training",
    "MES training",
    "Green Light Monitoring training",
    "operator training",
    "administrator training",
  ],
  openGraph: {
    title: "Training Platform | The Aquila Group",
    description:
      "Interactive training modules for DMM System and Green Light Monitoring. Self-paced learning with knowledge checks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Aquila Group Training Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Training Platform | The Aquila Group",
    description:
      "Interactive training modules for DMM System and Green Light Monitoring.",
    images: ["/og-image.png"],
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
