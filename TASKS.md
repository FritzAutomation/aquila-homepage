# Aquila Group — Vision 2 Build Tasks

> **Session instruction:** At the start of every session, read this file to get context.
> Work through tasks top to bottom. Complete and polish one item fully before moving to the next.
> Mark items complete by changing `[ ]` to `[x]` as they are finished.

---

## 🎫 Support Ticket System (Start here — polish existing scaffolding)
- [ ] Confirm intake form is saving to Supabase correctly with proper error handling
- [ ] Show a confirmation screen/message to the user after successful submission
- [ ] Wire ticket status page to real authenticated data (customer sees their own tickets)
- [ ] Display ticket status accurately — Open / In Progress / Resolved
- [ ] Build admin-side ticket queue with status controls
- [ ] Add email notification on ticket submission (notify Aquila admin)
- [ ] Add email notification on ticket status change (notify customer)
- [ ] Add ticket detail view for admin

---

## 📚 Knowledge Base (Public KB exists — build the admin layer)
- [ ] Build admin article editor (create, edit, publish, unpublish)
- [ ] Add product category tagging (DMM, Green Light, Custom)
- [ ] Add article search indexing
- [ ] Link KB articles contextually from support portal and training modules

---

## 🔐 Auth & Role System (Scaffolding exists — harden and complete)
- [ ] Enforce Aquila Admin vs Customer User role separation throughout
- [ ] Build customer org grouping (multiple users under one company account)
- [ ] Build invite-only user creation flow (no open registration)
- [ ] Admin: create/invite/deactivate users, assign to org

---

## 📊 Admin Dashboard (Scaffolding exists — wire up real data)
- [ ] User management table (list, invite, edit, deactivate)
- [ ] Org management (create orgs, assign users)
- [ ] Ticket queue summary widget
- [ ] Training progress summary by org

---

## 🏗️ Training Platform (Build from scratch — highest priority after polish)
- [ ] Design database schema for modules, lessons, steps, and progress tracking
- [ ] Build module index page (list of DMM + Green Light training modules)
- [ ] Build lesson/step UI with guided walkthrough format
- [ ] Add knowledge-check question component (multiple choice, pass/fail)
- [ ] Build progress tracking — per user, per module, completion percentage
- [ ] Build admin view — see all users' training progress by org
- [ ] Seed placeholder content for 5 DMM modules and 4 Green Light modules
- [ ] Connect progress to customer portal dashboard

---

## 🌐 Vision 1 — Interactive Product Pages (Needs Aquila content — build shells now)
- [ ] DMM interactive page shell — 4 section layout (role selector, order flow, before/after, workflow mockups)
- [ ] Green Light interactive page shell — 4 section layout (OEE explainer, data capture diagram, dashboard mockup, scenario walkthrough)
- [ ] Placeholder copy and layout ready for real content drop-in

---

*Last updated: March 2026*
