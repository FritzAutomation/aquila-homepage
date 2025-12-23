import { Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Products: [
    { label: "DMM System", href: "/products/dmm" },
    { label: "Green Light Monitoring", href: "/products/green-light" },
    { label: "Custom Solutions", href: "/products/custom" },
  ],
  Services: [
    { label: "Training", href: "/services/training" },
    { label: "System Integration", href: "/services/integration" },
    { label: "Consulting", href: "/services/consulting" },
  ],
  Support: [
    { label: "Contact Support", href: "/support" },
    { label: "Check Ticket Status", href: "/support/status" },
    { label: "Knowledge Base", href: "/support/kb" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
};

const teamContacts = [
  { name: "Stephen J. Orth", title: "President", email: "s.orth@the-aquila-group.com" },
  { name: "David A. Wilmer", title: "VP - Manufacturing Integration", email: "d.wilmer@the-aquila-group.com" },
  { name: "Jeremy L. Parrish", title: "Applications Engineering", email: "j.parrish@the-aquila-group.com" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image
                src="/images/Aquila-Logo-DS_WA-2012.png"
                alt="The Aquila Group"
                width={200}
                height={105}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-slate-light text-lg mb-4">Partners in Success</p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-slate-light text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>P.O. Box 1700, Evans, GA 30809</span>
              </div>
              <div className="flex items-center gap-2 text-slate-light text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:sales@the-aquila-group.com" className="hover:text-white transition-colors">
                  sales@the-aquila-group.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-light text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+16088349213" className="hover:text-white transition-colors">
                  (608) 834-9213
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Certification Badge */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/OptoPartner_IoT_Certified_192x163.png"
                alt="Opto 22 IoT Certified Partner"
                width={60}
                height={51}
                className="h-12 w-auto"
              />
              <span className="text-xs text-slate-light">IoT Certified Partner</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-lg mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-light hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Team Contacts */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-semibold text-lg mb-4">Contact Our Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamContacts.map((person) => (
              <div key={person.email} className="text-sm">
                <p className="font-medium text-white">{person.name}</p>
                <p className="text-slate-light text-xs mb-1">{person.title}</p>
                <a
                  href={`mailto:${person.email}`}
                  className="text-emerald hover:text-emerald/80 transition-colors"
                >
                  {person.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-light text-sm">
              © 1996-{new Date().getFullYear()} The Aquila Group, Inc. | Evans, GA
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="/privacy"
                className="text-slate-light hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-slate-light hover:text-white transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
