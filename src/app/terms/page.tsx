"use client";

import { motion } from "framer-motion";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, SectionWrapper } from "@/components/ui";

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Terms of Service"
          subtitle="Please read these terms carefully before using our services."
          breadcrumb={[{ label: "Terms of Service", href: "/terms" }]}
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

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-slate mb-4">
              By accessing or using the website and services of The Aquila Group, Inc. (&quot;Company,&quot;
              &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use our website or services.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Description of Services</h2>
            <p className="text-slate mb-4">
              The Aquila Group provides manufacturing execution system (MES) software solutions,
              including the DMM System, Green Light Monitoring, and related services such as training,
              system integration, consulting, and technical support.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Use of Website</h2>
            <p className="text-slate mb-4">
              You agree to use our website only for lawful purposes and in accordance with these Terms.
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-slate mb-4 space-y-2">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
              <li>Use the website to transmit malware or other harmful code</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Collect or harvest information about other users without consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Intellectual Property</h2>
            <p className="text-slate mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the
              property of The Aquila Group, Inc. or its licensors and is protected by copyright,
              trademark, and other intellectual property laws. You may not reproduce, distribute, modify,
              or create derivative works without our express written permission.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Software Licensing</h2>
            <p className="text-slate mb-4">
              Use of our software products, including the DMM System and Green Light Monitoring, is
              subject to separate software license agreements. These Terms of Service do not grant any
              rights to use our software. Please contact us for information about software licensing.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Disclaimer of Warranties</h2>
            <p className="text-slate mb-4">
              THE WEBSITE AND ITS CONTENT ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, ERROR-FREE,
              OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-slate mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE AQUILA GROUP, INC. SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED
              TO YOUR USE OF THE WEBSITE OR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
              SUCH DAMAGES.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Indemnification</h2>
            <p className="text-slate mb-4">
              You agree to indemnify and hold harmless The Aquila Group, Inc. and its officers, directors,
              employees, and agents from any claims, damages, losses, or expenses arising out of your use
              of the website or violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Third-Party Links</h2>
            <p className="text-slate mb-4">
              Our website may contain links to third-party websites. These links are provided for your
              convenience only. We do not endorse or assume responsibility for the content or practices
              of any third-party websites.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Governing Law</h2>
            <p className="text-slate mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of
              Georgia, without regard to its conflict of law provisions. Any disputes arising under these
              Terms shall be resolved in the courts of Georgia.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Changes to Terms</h2>
            <p className="text-slate mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material
              changes by posting the updated Terms on this page. Your continued use of the website after
              changes are posted constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Severability</h2>
            <p className="text-slate mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will
              continue in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Contact Information</h2>
            <p className="text-slate mb-4">
              For questions about these Terms of Service, please contact us at:
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
