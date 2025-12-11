import { Navigation, Footer } from "@/components/layout";
import {
  Hero,
  SocialProof,
  Problem,
  Products,
  Features,
  Testimonial,
  Metrics,
  CaseStudies,
  FAQ,
  CTA,
} from "@/components/sections";
import { OrganizationJsonLd, LocalBusinessJsonLd } from "@/components/seo";

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <Navigation />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Products />
        <Features />
        <Testimonial />
        <Metrics />
        <CaseStudies />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
