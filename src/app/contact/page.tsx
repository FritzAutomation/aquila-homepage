"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";
import { useState } from "react";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "P.O. Box 1700\nEvans, GA 30809",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(608) 834-9213",
    href: "tel:+16088349213",
  },
  {
    icon: Mail,
    label: "Sales",
    value: "sales@the-aquila-group.com",
    href: "mailto:sales@the-aquila-group.com",
  },
  {
    icon: Mail,
    label: "Support",
    value: "support@the-aquila-group.com",
    href: "mailto:support@the-aquila-group.com",
  },
];

const team = [
  {
    name: "Stephen J. Orth",
    title: "President",
    phone: "(608) 834-9213 x700",
    email: "s.orth@the-aquila-group.com",
    image: "/images/orth.jpg",
  },
  {
    name: "David A. Wilmer",
    title: "VP – Manufacturing Integration",
    phone: "(804) 314-4621",
    email: "d.wilmer@the-aquila-group.com",
    image: "/images/wilmer.jpg",
  },
  {
    name: "Jeremy L. Parrish",
    title: "Manager – Applications Engineering",
    phone: "(719) 641-8324",
    email: "j.parrish@the-aquila-group.com",
    image: "/images/parrish.jpg",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert("Thank you for your message. We will be in touch shortly!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          title="Contact Us"
          subtitle="Get in touch with our team. We're here to help with your manufacturing technology needs."
          breadcrumb={[{ label: "Contact", href: "/contact" }]}
        />

        {/* Contact Form & Info */}
        <SectionWrapper>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all text-navy placeholder:text-slate-light"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all text-navy placeholder:text-slate-light"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all text-navy placeholder:text-slate-light"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all text-navy placeholder:text-slate-light"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all text-navy bg-white"
                    >
                      <option value="">Select a subject...</option>
                      <option value="demo">Request a Demo</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all resize-none text-navy placeholder:text-slate-light"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <Button type="submit" size="lg">
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-navy mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="w-10 h-10 bg-emerald/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-emerald" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-light">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-navy hover:text-emerald transition-colors whitespace-pre-line"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-navy whitespace-pre-line">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="p-6 bg-navy text-white rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-emerald" />
                  <h3 className="text-lg font-bold">24/7 Support</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Our technical support team is available around the clock for
                  critical issues. Contact us anytime.
                </p>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Team Contacts */}
        <SectionWrapper background="light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Contact Our Team Directly
            </h2>
            <p className="text-lg text-slate">
              Reach out to the right person for your needs
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
                <Card className="h-full p-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-emerald/20">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-navy">{member.name}</h3>
                    <p className="text-slate text-sm mb-4">{member.title}</p>
                    <div className="space-y-2 text-sm">
                      <a
                        href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                        className="block text-slate hover:text-navy transition-colors"
                      >
                        {member.phone}
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="block text-emerald hover:text-emerald/80 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
