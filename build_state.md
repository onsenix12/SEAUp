# BUILD_STATE.md — Current Build Status

> **Updated by the agent at the end of every session.**
> This is the single source of truth for where the build is right now.

---

## Last Updated
- Date: [AGENT: fill in date]
- Session duration: [AGENT: fill in]
- Updated by: [AGENT: fill in — e.g. "Avi + Antigravity, session 1"]

---

## Active Task
> What is being worked on RIGHT NOW or should be started NEXT.

```
[ ] 0.4 Configure Vercel deployment + confirm mobile preview works
```

*When you begin a task, move it here. When done, move it to Completed below.*

---

## Build Queue (Ordered)
Work through these in sequence. Do not skip ahead.

### Phase 0 — Foundation
- [x] **0.1** Initialise Next.js project (App Router, TypeScript strict, Tailwind)
- [x] **0.2** Configure Supabase project — create tables per schema in requirements.md
- [x] **0.3** Set up environment variables (.env.local template)
- [ ] **0.4** Configure Vercel deployment + confirm mobile preview works
- [ ] **0.5** Create `/types/index.ts` with all TypeScript interfaces
- [ ] **0.6** Create Supabase client wrapper in `/lib/supabase/`
- [ ] **0.7** Create Google AI wrapper stubs in `/lib/google-ai/` (Gemini, Imagen, SafeSearch)

### Phase 1 — Creation Flow (Core MVP)
- [ ] **1.1** Onboarding screen — language selector + CTA
- [ ] **1.2** Step 1: Mood selection screen
- [ ] **1.3** Step 2: Colour palette selection screen
- [ ] **1.4** Step 3: Subject selection screen
- [ ] **1.5** Step 4: Photo input screen (optional, skippable)
- [ ] **1.6** Step 5: Style selection screen (optional, skippable)
- [ ] **1.7** Step 6: Generating screen — animated loading
- [ ] **1.8** Step 7: Artwork result screen — display + Save / Try Again / Share
- [ ] **1.9** Creation flow state management (selections passed through all steps)

### Phase 2 — AI Integration
- [ ] **2.1** Gemini 2.0 Flash — prompt construction from user selections + optional photo
- [ ] **2.2** Imagen 3 — image generation from Gemini prompt
- [ ] **2.3** Google SafeSearch — moderation check on generated image
- [ ] **2.4** Silent regeneration logic on moderation fail
- [ ] **2.5** Fallback image + facilitator notification on double fail
- [ ] **2.6** End-to-end creation flow API route (`/api/create`)
- [ ] **2.7** Latency test — confirm ≤ 15 seconds from selection to result

### Phase 3 — Gallery & Storage
- [ ] **3.1** Save artwork to Supabase Storage (CDN image)
- [ ] **3.2** Write artwork record to Supabase DB (with ip_owner = 'creator')
- [ ] **3.3** Creator gallery screen — grid view of artworks
- [ ] **3.4** Full-screen artwork view with share link
- [ ] **3.5** Artwork attribution — name + date overlaid on image

### Phase 4 — Facilitator Mode
- [ ] **4.1** Facilitator toggle on onboarding screen
- [ ] **4.2** Facilitator magic link auth (Supabase Auth)
- [ ] **4.3** Creator naming within a facilitator session
- [ ] **4.4** Session notes field (optional)
- [ ] **4.5** Artwork review / approve before gallery save
- [ ] **4.6** Session record written to DB on completion

### Phase 5 — Mock Marketplace & Polish
- [ ] **5.1** Mock marketplace preview screen (static product mockup images)
- [ ] **5.2** Music / video "Coming soon" placeholder screens
- [ ] **5.3** Bahasa Indonesia — full string audit across all screens
- [ ] **5.4** Mobile responsiveness audit (390px, Android Chrome + iOS Safari)
- [ ] **5.5** Tap target audit (all interactive elements ≥ 72x72px)
- [ ] **5.6** Loading animation — confirm no blank screens at any point

### Phase 6 — Pre-Pilot Checklist
- [ ] **6.1** End-to-end test on physical Android device (Chrome)
- [ ] **6.2** End-to-end test on physical iOS device (Safari)
- [ ] **6.3** Edge-case content moderation test (provocative prompts)
- [ ] **6.4** Minimum 3 internal test sessions completed
- [ ] **6.5** WiFi-only dependency confirmed (no mobile data required)
- [ ] **6.6** All MINDS Pilot Readiness Checklist items in requirements.md ticked

---

## Completed
> Moved here when done. Include date and any notes.

- 2026-03-07: **0.1** Initialise Next.js project (App Router, TypeScript strict, Tailwind)
- 2026-03-07: **0.2** Configure Supabase project — create tables per schema
- 2026-03-07: **0.3** Set up environment variables (.env.local template)

---

## Known Blockers / Flags
> Issues that need Avi's decision before work can continue.

*None yet.*

---

## Session Notes
> Running log of what happened each session. Append, don't overwrite.

```
[Session 1 — 2026-03-07]
- [x] Task 0.1 Initialise Next.js project (App Router, TypeScript strict, Tailwind) completed. Initialised React 19 app with Tailwind v4 via postcss. Configured app/globals.css and app/layout.tsx to match brand-guidelines.md, using next/font/google to map to css variables and @theme space.
- The `create-next-app` failed at the root because Next.js template does not allow capital letters in the directory name. Handled by creating in a `temp-app` folder and moving the files.
- [x] Task 0.2 Configure Supabase project completed. Generated the `supabase/schema.sql` script with the exact schema from `requirements.md`, including the `ip_owner = 'creator'` strict constraint on the artworks table.
- [x] Task 0.3 Set up environment variables completed. Added `.env.example` with the exact keys required by `agent.md`.
- Next phase: Configure Vercel deployment + confirm mobile preview works.
```

---

## Environment Status
| Item | Status |
|---|---|
| Next.js project initialised | ✅ Done |
| Supabase project created | ✅ SQL Schema Prepared |
| Google AI API key configured | ❌ Not started |
| Vercel deployment live | ❌ Not started |
| Mobile preview tested | ❌ Not started |
| Imagen 3 output quality confirmed | ❌ Not started |
| Gemini latency from SG IPs measured | ❌ Not started |
