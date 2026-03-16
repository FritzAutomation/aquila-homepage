import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Transformation Showcase | The Aquila Group",
  description:
    "See the complete digital transformation — from static WordPress to modern platform with customer portal, training, and analytics.",
  robots: { index: false, follow: false },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
