# Aquila Group — Build Tasks

> **Session instruction:** At the start of every session, read this file to get context.
> Work through tasks top to bottom. Complete and polish one item fully before moving to the next.
> Mark items complete by changing `[ ]` to `[x]` as they are finished.

---

## 🎫 Support Ticket System
- [x] Confirm intake form is saving to Supabase correctly with proper error handling
- [x] Show a confirmation screen/message to the user after successful submission
- [x] Wire ticket status page to real authenticated data (customer sees their own tickets)
- [x] Display ticket status accurately — Open / In Progress / Resolved
- [x] Build admin-side ticket queue with status controls
- [x] Add email notification on ticket submission (notify Aquila admin)
- [x] Add email notification on ticket status change (notify customer)
- [x] Add ticket detail view for admin
- [x] Scope ticket API so customers only see their own tickets

---

## 📚 Knowledge Base
- [x] Build admin article editor (create, edit, publish, unpublish)
- [x] Add product category tagging (DMM, Green Light, Custom)
- [x] Add article search indexing
- [x] Link KB articles contextually from support portal and training modules

---

## 🔐 Auth & Role System
- [x] Enforce Aquila Admin vs Customer User role separation throughout
- [x] Build customer org grouping (multiple users under one company account)
- [x] Build invite-only user creation flow (no open registration)
- [x] Admin: create/invite/deactivate users, assign to org
- [x] Consolidate to single /login page with role-based redirect
- [x] Role-aware navigation (Sign In / My Portal / Admin)

---

## 📊 Admin Dashboard
- [x] User management table (list, invite, edit, deactivate)
- [x] Org management (create orgs, assign users)
- [x] Ticket queue summary widget
- [x] Training progress summary by org

---

## 🏗️ Training Platform
- [x] Design database schema for modules, lessons, steps, and progress tracking
- [x] Build module index page (list of DMM + Green Light training modules)
- [x] Build lesson/step UI with guided walkthrough format
- [x] Add knowledge-check question component (multiple choice, pass/fail)
- [x] Build progress tracking — per user, per module, completion percentage
- [x] Seed placeholder content for 5 DMM modules and 4 Green Light modules
- [x] Connect progress to customer portal dashboard
- [x] Training assignment system — admin assigns modules to specific users
- [x] Per-user progress tracking within each org (admin view)
- [x] Public vs gated training (is_public flag, access control on module detail)
- [x] Portal shows assigned vs public modules separately
- [ ] Interactive demo training — replace text/quiz steps with simulated UI walkthroughs
- [ ] Admin ability to manage which modules are public vs assigned-only

---

## 🌐 Vision 1 — Interactive Product Pages
- [ ] DMM interactive page — enhance existing DMMDemo with 4 sections (role selector, order flow, before/after, workflow mockups)
- [ ] Green Light interactive page — enhance existing GreenLightDemo with 4 sections (OEE explainer, data capture diagram, dashboard mockup, scenario walkthrough)
- [ ] Placeholder copy and layout ready for real content drop-in

---

*Last updated: March 2026*
