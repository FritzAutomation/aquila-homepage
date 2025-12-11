# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the homepage for **The Aquila Group**, a B2B SaaS company serving manufacturers with MES (Manufacturing Execution System) solutions. The target audience is manufacturing operations managers, plant managers, and IT directors.

## Tech Stack (Planned)

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (for scroll reveals, counters)
- **Deployment:** Vercel

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run linter
```

## Design System

### Colors
- Primary: `#1E3A5F` (deep navy) — trust, professionalism
- Accent: `#10B981` (emerald green) — CTAs, success states
- Secondary: `#64748B` (slate gray) — body text
- Background: `#FFFFFF` / `#F8FAFC` (white / light gray)
- Dark mode: `#0F172A` (slate 900)

### Typography
- Headings: Inter or Plus Jakarta Sans (600-700 weight)
- Body: Inter (400-500 weight)
- Monospace: JetBrains Mono (for technical content)

### Spacing
- 8px grid system
- 80-120px between sections
- 24-32px card padding

## Key Components

The site requires these reusable components:
- Button (primary, secondary, ghost variants)
- Card (product card, case study card)
- Navigation (desktop mega menu, mobile drawer)
- Testimonial carousel
- Stats counter with animation
- Section wrapper with consistent padding

## Page Structure

The homepage follows this section order (see `aquila-wireframe.md` for details):
1. Navigation (sticky header with mega menus)
2. Hero Section
3. Social Proof Bar (client logos)
4. Problem/Solution Section
5. Products Section (DMM System, Green Light Monitoring, Custom Solutions)
6. Features/Benefits Section
7. Testimonial Section
8. Results/Metrics Section (animated counters)
9. Case Studies Preview
10. CTA Section
11. Footer

## Mobile Considerations

- Hamburger menu with slide-out drawer
- Hero stacks vertically (text above image)
- Product/feature cards stack to single column
- Sticky "Request Demo" button at bottom of viewport
