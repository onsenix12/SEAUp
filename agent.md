# agent.md — SEA-Up Creative: Agent Instructions

> **Read this first, every session, before writing a single line of code.**
> Then read `BUILD_STATE.md` to know where you are.
> Then read `DECISIONS.md` to know what has already been decided.

---

## 1. What This Project Is

**SEA-Up Creative** is an AI-powered creative platform for people with intellectual disabilities (ID) across ASEAN. It enables ID individuals to produce artworks through guided visual choices — without text prompts — and displays them in a personal gallery. A mock marketplace preview shows where Phase 2 leads.

This is being built for a competition pilot at **MINDS Singapore**, with a hard submission deadline of **March 24, 2026**. Speed and reliability matter. Scope discipline matters more.

The primary user is **not a developer**. It is an ID individual, likely using a mobile phone browser, possibly with a caregiver beside them. Every UI decision must pass this test: *"Can someone who cannot read use this?"*

---

## 2. Your Role as Agent

You are a collaborative builder, not an order-taker. You may:
- Make autonomous decisions on component structure, file naming, CSS class choices, and minor implementation details
- Choose between equivalent approaches without asking (e.g., which utility function to write first)
- Refactor code for clarity or performance without being asked, as long as behaviour is unchanged

You must **flag and wait** before:
- Changing the tech stack or introducing a new dependency not in the requirements
- Modifying the database schema
- Changing API provider or API call structure
- Altering the content moderation flow
- Changing how IP ownership is recorded
- Removing or combining any screen in the creation flow
- Any decision with privacy or safeguarding implications

When flagging, write:
```
⚠️ DECISION NEEDED: [one sentence summary]
Options: [A] ... [B] ...
My recommendation: [A/B] because [reason]
Waiting for confirmation before proceeding.
```

After completing each meaningful task or screen, **update `BUILD_STATE.md`** to reflect current progress. Do not wait until the end of a session.

---

## 3. Tech Stack (Non-Negotiable)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js (App Router) | PWA, no app store needed |
| Language | TypeScript | Strict mode on |
| Styling | Tailwind CSS | Mobile-first, 390px base |
| Deployment | Vercel (free tier) | |
| Database | Supabase (PostgreSQL) | Free tier |
| File Storage | Supabase Storage | CDN-served images |
| Auth | Supabase Auth | Magic link for facilitators only |
| AI — Prompt build | Gemini 2.0 Flash | Multimodal input |
| AI — Image gen | Imagen 3 | Via Google AI API |
| Moderation | Google SafeSearch API | Every image before display |
| Dev IDE | Google Antigravity | Gemini 3.1 Pro agent |

**Do not introduce new dependencies without flagging.** If a library would solve a problem elegantly, flag it with the rationale. Do not just `npm install`.

---

## 4. Coding Standards

### TypeScript
- Strict mode. No `any` types unless unavoidable, and comment why.
- Define interfaces for all API request/response shapes in `/types/index.ts`
- Zod validation on all API route inputs

### File Structure
```
/app
  /api          ← Next.js API routes (server-side only)
  /(creator)    ← Creator-facing routes
  /(facilitator) ← Facilitator mode routes
/components
  /ui           ← Reusable primitives (Button, Card, etc.)
  /creation     ← Creation flow step components
  /gallery      ← Gallery components
/lib
  /google-ai    ← Gemini + Imagen + SafeSearch wrappers
  /supabase     ← DB client + typed queries
/types
  index.ts      ← Shared TypeScript interfaces
/public
  /icons        ← SVG icons for creation flow choices
```

### Component Rules
- One component per file
- Props interfaces defined above the component, not inline
- No logic in JSX — extract to named functions above the return
- All tap targets minimum 72x72px (use `min-h-[72px] min-w-[72px]`)
- Maximum 3 choices visible per screen — enforce this as a hard constraint

### API Routes
- All Google AI calls happen server-side only — never expose API keys to client
- Every route returns `{ success: boolean, data?: ..., error?: string }`
- Wrap all external API calls in try/catch with meaningful error messages logged

### Accessibility (Non-Negotiable)
- No text input in the creation flow — ever
- All interactive elements must be tappable, not just clickable
- Loading states must be visually alive (animation), never blank screens
- Error states must never surface to the creator — only to the facilitator

### Environment Variables
```
GOOGLE_AI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
Never hardcode. Never commit `.env.local`. Always use `process.env.*` server-side.

---

## 5. Creation Flow — The Sacred Path

This is the core of the MVP. Do not abbreviate, reorder, or merge steps without flagging.

```
Step 1: Mood       → 3 illustrated icon choices
Step 2: Colour     → 3 palette swatches
Step 3: Subject    → 3 visual category cards
Step 4: Photo      → optional camera input (skippable)
Step 5: Style      → optional art style (skippable, defaults to abstract_illustration)
Step 6: Generating → full-screen animated loading
Step 7: Result     → artwork + Save / Try Again / Share
```

Every step: one action, one screen, immediate advance on tap. No back button required in MVP.

---

## 6. Content Moderation Flow — Do Not Simplify

```
Image generated by Imagen 3
        ↓
Google SafeSearch check
        ↓
Pass? → Save to Supabase Storage → Write artwork record → Return to frontend
Fail? → Silent regeneration (once)
        ↓
Second fail? → Show safe fallback image → Notify facilitator only
              → NEVER surface the issue to the creator
```

The creator must never encounter a harmful image or an error message. Facilitator-only notifications can be console logs or a Supabase `moderation_flags` table entry in MVP.

---

## 7. Data Model Snapshot

Refer to `requirements.md` for full schema. Key IP ownership rule:
```sql
ip_owner TEXT DEFAULT 'creator'
```
This must be set on every artwork record. It is a non-negotiable product commitment, not just a policy.

Creator name is optional. No PII of ID individuals is required. Facilitator email is the only PII collected, and only for facilitators.

---

## 8. Bahasa Indonesia

Every user-facing string must exist in both English and Bahasa Indonesia. Use a simple translation object pattern until i18n is needed at scale:

```typescript
const COPY = {
  en: { cta: "Let's make something", generating: "We're making your artwork..." },
  id: { cta: "Ayo berkarya", generating: "Kami sedang membuat karya kamu..." }
}
```

Language selection happens on the onboarding screen and is stored in component state (not localStorage, not a cookie) for MVP scope.

---

## 9. Performance Targets

| Metric | Target |
|---|---|
| Artwork generation (end-to-end) | ≤ 15 seconds |
| Loading animation starts | Immediately on Step 6 |
| Time-to-interactive on mobile | ≤ 3 seconds |
| Works on WiFi (MINDS) | Yes — no offline mode needed |

If Gemini + Imagen combined latency exceeds 15 seconds in testing, flag it immediately with the measured time. This is a pilot-day blocker.

---

## 10. Out of Scope for MVP (Do Not Build)

- Voice input
- Real payment processing
- Real print-on-demand fulfilment
- Royalty tracking dashboard
- Multi-organisation admin dashboards
- Music or video creation (show "Coming soon" placeholder only)
- Offline mode
- Account creation for ID creators

The mock marketplace preview (artworks shown on product mockups) is in scope — but it is static images only. No real commerce.

---

## 11. Session Start Checklist

At the start of every coding session, before writing code:

1. Read this file (`agent.md`)
2. Read `BUILD_STATE.md` — know what's done and what's next
3. Read `DECISIONS.md` — know what's already been decided
4. Confirm the active task from `BUILD_STATE.md`
5. Begin work on that task only — do not jump ahead

At the end of every session:
1. Update `BUILD_STATE.md` with what was completed
2. Add any new decisions to `DECISIONS.md`
3. Note any blockers or flags for the next session
