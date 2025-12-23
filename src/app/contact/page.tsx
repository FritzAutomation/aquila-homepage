"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, CheckCircle, Ticket, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { PageHeader, Card, Button, SectionWrapper } from "@/components/ui";
import { useState, useCallback } from "react";

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

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        break;
      case "phone":
        if (value && value.replace(/\D/g, "").length > 0 && value.replace(/\D/g, "").length < 10) {
          return "Please enter a valid 10-digit phone number";
        }
        break;
      case "subject":
        if (!value) return "Please select a subject";
        break;
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        break;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formState) as Array<keyof typeof formState>).forEach((field) => {
      const error = validateField(field, formState[field]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formState, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formState).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormState({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
    });
    setTouched({});
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Format phone number as user types
    const newValue = name === "phone" ? formatPhoneNumber(value) : value;

    setFormState({ ...formState, [name]: newValue });

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
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

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-emerald/10 border border-emerald/20 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0" />
                    <p className="text-emerald font-medium">
                      Thank you for your message! We&apos;ll be in touch shortly.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-navy placeholder:text-slate-light ${
                          errors.name && touched.name
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                        }`}
                        placeholder="John Smith"
                      />
                      {errors.name && touched.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-navy placeholder:text-slate-light ${
                          errors.email && touched.email
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                        }`}
                        placeholder="john@company.com"
                      />
                      {errors.email && touched.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
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
                        onBlur={handleBlur}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-navy placeholder:text-slate-light ${
                          errors.phone && touched.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && touched.phone && (
                        <p id="phone-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all text-navy bg-white ${
                        errors.subject && touched.subject
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                      }`}
                    >
                      <option value="">Select a subject...</option>
                      <option value="demo">Request a Demo</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && touched.subject && (
                      <p id="subject-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all resize-none text-navy placeholder:text-slate-light ${
                        errors.message && touched.message
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-slate-light/30 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                      }`}
                      placeholder="Tell us about your needs..."
                    />
                    {errors.message && touched.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
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

        {/* Support Ticket CTA */}
        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-navy to-navy/90 rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-emerald/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-8 h-8 text-emerald" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need Technical Support?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Submit a support ticket for faster, tracked assistance. Our team will
                respond within 4 hours for critical issues and 24 hours for general inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/support" variant="primary" size="lg">
                  Submit Support Ticket
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button href="/support/status" variant="ghost" size="lg" className="border border-white/30 text-white hover:bg-white/10">
                  Check Ticket Status
                </Button>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
