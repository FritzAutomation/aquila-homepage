export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Aquila Group",
    url: "https://www.the-aquila-group.com",
    logo: "https://www.the-aquila-group.com/logo.png",
    description:
      "Manufacturing Execution System (MES) solutions provider serving manufacturers since 1996.",
    foundingDate: "1996",
    address: {
      "@type": "PostalAddress",
      streetAddress: "P.O. Box 1700",
      addressLocality: "Evans",
      addressRegion: "GA",
      postalCode: "30809",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-608-834-9213",
        contactType: "sales",
        email: "sales@the-aquila-group.com",
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-608-834-9213",
        contactType: "technical support",
        email: "support@the-aquila-group.com",
        availableLanguage: "English",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/the-aquila-group",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: {
      "@type": "Brand",
      name: "The Aquila Group",
    },
    manufacturer: {
      "@type": "Organization",
      name: "The Aquila Group",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "The Aquila Group",
    description: "Manufacturing software and consulting services",
    url: "https://www.the-aquila-group.com",
    telephone: "+1-608-834-9213",
    email: "sales@the-aquila-group.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "P.O. Box 1700",
      addressLocality: "Evans",
      addressRegion: "GA",
      postalCode: "30809",
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    priceRange: "$$$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
