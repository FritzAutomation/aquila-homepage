# Aquila Group — Vision 2 Build Tasks

> **Session instruction:** At the start of every session, read this file to get context.
> Work through tasks top to bottom. Complete and polish one item fully before moving to the next.
> Mark items complete by changing `[ ]` to `[x]` as they are finished.

---

## 🎫 Support Ticket System (Start here — polish existing scaffolding)
- [x] Confirm intake form is saving to Supabase correctly with proper error handling
- [x] Show a confirmation screen/message to the user after successful submission
- [x] Wire ticket status page to real authenticated data (customer sees their own tickets)
- [x] Display ticket status accurately — Open / In Progress / Resolved
- [x] Build admin-side ticket queue with status controls
- [x] Add email notification on ticket submission (notify Aquila admin)
- [x] Add email notification on ticket status change (notify customer)
- [x] Add ticket detail view for admin

---

## 📚 Knowledge Base (Public KB exists — build the admin layer)
- [x] Build admin article editor (create, edit, publish, unpublish)
- [x] Add product category tagging (DMM, Green Light, Custom)
- [x] Add article search indexing
- [x] Link KB articles contextually from support portal and training modules

---

## 🔐 Auth & Role System (Scaffolding exists — harden and complete)
- [x] Enforce Aquila Admin vs Customer User role separation throughout
- [x] Build customer org grouping (multiple users under one company account)
- [x] Build invite-only user creation flow (no open registration)
- [x] Admin: create/invite/deactivate users, assign to org

---

## 📊 Admin Dashboard (Scaffolding exists — wire up real data)
- [x] User management table (list, invite, edit, deactivate)
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
