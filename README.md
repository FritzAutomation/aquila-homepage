# The Aquila Group - Homepage

Modern, responsive website for The Aquila Group, a B2B company providing Manufacturing Execution System (MES) solutions since 1996.

## Overview

This website showcases The Aquila Group's products and services:

- **DMM System** - Complete MES solution for shop floor control
- **Green Light Monitoring** - Real-time OEE tracking and dashboards
- **Custom Solutions** - Tailored integrations for manufacturing workflows

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Vercel

## Features

- Responsive design (mobile-first)
- Animated page transitions and scroll reveals
- Interactive testimonial carousel
- Animated metrics counters
- FAQ accordion
- Cookie consent banner
- Scroll progress indicator
- Back to top button
- SEO optimized with JSON-LD structured data
- Custom 404 page

## Pages

- **Home** - Hero, social proof, products, features, testimonials, metrics, case studies, FAQ, CTA
- **Products** - DMM System, Green Light Monitoring, Custom Solutions
- **Services** - Training, Integration, Consulting, Support
- **Case Studies** - ASCO, Hillphoenix
- **About** - Company history and team
- **Contact** - Contact form and information
- **News** - Company updates and articles

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── case-studies/
│   ├── contact/
│   ├── news/
│   ├── products/
│   ├── services/
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Navigation, Footer
│   ├── sections/          # Page sections (Hero, Features, etc.)
│   ├── seo/               # JSON-LD structured data
│   └── ui/                # Reusable UI components
public/
├── images/                # Product and logo images
└── favicon.ico
```

## Deployment

This site is configured for deployment on Vercel. Push to the `main` branch to trigger automatic deployments.

## License

Proprietary - The Aquila Group
