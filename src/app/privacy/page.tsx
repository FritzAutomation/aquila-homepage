"use client";

import { motion } from "framer-motion";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, SectionWrapper } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Privacy Policy"
          subtitle="How we collect, use, and protect your information."
          breadcrumb={[{ label: "Privacy Policy", href: "/privacy" }]}
        />

        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto prose prose-slate prose-lg"
          >
            <p className="text-slate-light text-sm mb-8">
              Last Updated: December 2024
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Introduction</h2>
            <p className="text-slate mb-4">
              The Aquila Group, Inc. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed
              to protecting your personal information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Information We Collect</h2>
            <p className="text-slate mb-4">
              We may collect information about you in various ways, including:
            </p>
            <h3 className="text-xl font-semibold text-navy mt-6 mb-3">Personal Data</h3>
            <p className="text-slate mb-4">
              When you contact us or request information about our products and services, we may collect:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>Name and job title</li>
              <li>Company name and address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Information about your manufacturing operations relevant to our services</li>
            </ul>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3">Automatically Collected Data</h3>
            <p className="text-slate mb-4">
              When you visit our website, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-slate mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you information about our products, services, and updates</li>
              <li>Process transactions and deliver services you have requested</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Information Sharing</h2>
            <p className="text-slate mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors such as lawyers and accountants</li>
              <li>Law enforcement or government agencies when required by law</li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Data Security</h2>
            <p className="text-slate mb-4">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Your Rights</h2>
            <p className="text-slate mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to opt out of marketing communications</li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Cookies</h2>
            <p className="text-slate mb-4">
              Our website may use cookies and similar tracking technologies to enhance your experience.
              You can set your browser to refuse cookies, but some features of our website may not
              function properly.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Third-Party Links</h2>
            <p className="text-slate mb-4">
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices of these external sites and encourage you to review their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-slate mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Contact Us</h2>
            <p className="text-slate mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-light-gray rounded-xl p-6 text-slate">
              <p className="font-semibold text-navy">The Aquila Group, Inc.</p>
              <p>P.O. Box 1700</p>
              <p>Evans, GA 30809</p>
              <p className="mt-2">
                Email: <a href="mailto:sales@the-aquila-group.com" className="text-emerald hover:text-emerald/80">sales@the-aquila-group.com</a>
              </p>
              <p>
                Phone: <a href="tel:+16088349213" className="text-emerald hover:text-emerald/80">(608) 834-9213</a>
              </p>
            </div>
          </motion.div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
