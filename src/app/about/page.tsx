"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Target, Users, Award, ArrowRight, Mail, Phone } from "lucide-react";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const startTime = Date.now();

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * value));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const values = [
  "Customer-driven work only",
  "Build/stock only what ships today",
  "Commit only when necessary",
  "Set high expectations",
  "Measure cost-benefit of operations",
  "Recognize software alone won't solve business problems",
];

const team = [
  {
    name: "Stephen J. Orth",
    title: "President",
    phone: "(608) 834-9213 x700",
    email: "s.orth@the-aquila-group.com",
  },
  {
    name: "David A. Wilmer",
    title: "Vice President – Manufacturing Integration",
    phone: "(804) 314-4621",
    email: "d.wilmer@the-aquila-group.com",
  },
  {
    name: "Jeremy L. Parrish",
    title: "Manager – Applications Engineering",
    phone: "(719) 641-8324",
    email: "j.parrish@the-aquila-group.com",
  },
];

const milestones = [
  { year: "1996", event: "The Aquila Group founded" },
  { year: "2000s", event: "DMM System deployed across major manufacturers" },
  { year: "2010s", event: "Green Light Monitoring introduced" },
  { year: "2017", event: "Opto 22 IoT Partnership certified" },
  { year: "Today", event: "100+ facilities served worldwide" },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="About Us"
          subtitle="Partners in Success since 1996. We help manufacturers implement demand-pull practices through technology and effective management."
          breadcrumb={[{ label: "About", href: "/about" }]}
        />

        {/* Mission Section */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate mb-6">
                The Aquila Group, Inc. is a national consulting firm focused on implementing
                demand-pull practices through technology and effective management.
              </p>
              <p className="text-lg text-slate mb-6">
                Our fundamental principle is straightforward: <strong>the goal of every
                organization is to make money</strong>. All our work centers on helping
                clients implement guiding principles focused on this objective.
              </p>
              <p className="text-lg text-slate">
                We position ourselves as &quot;Partners in Success,&quot; working alongside clients
                to overcome past practices and prepare for future growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 bg-light-gray">
                <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-emerald" />
                  Our Guiding Principles
                </h3>
                <ul className="space-y-4">
                  {values.map((value, index) => (
                    <li key={value} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald text-sm font-bold">{index + 1}</span>
                      </span>
                      <span className="text-slate">{value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Timeline */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-slate">Nearly three decades of manufacturing excellence</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-lg font-bold text-emerald">{milestone.year}</span>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald rounded-full" />
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1.5 w-1 h-full bg-emerald/20" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-slate text-lg">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Team Section */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Experienced professionals united by a shared philosophy of helping manufacturers succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.email}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 text-center">
                  <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-navy">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
                  <p className="text-slate mb-4">{member.title}</p>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                      className="flex items-center justify-center gap-2 text-slate hover:text-navy transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Stats */}
        <SectionWrapper background="navy">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-emerald mb-2">
                <AnimatedCounter value={29} />
              </div>
              <p className="text-white/80">Years in Business</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-emerald mb-2">
                <AnimatedCounter value={100} suffix="+" />
              </div>
              <p className="text-white/80">Facilities Served</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-emerald mb-2">24/7</div>
              <p className="text-white/80">Support Available</p>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* CTA Section */}
        <SectionWrapper>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Ready to Partner with Us?
              </h2>
              <p className="text-lg text-slate mb-8">
                Let&apos;s discuss how we can help transform your manufacturing operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" size="lg">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  View Our Products
                </Button>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
