# SEA-Up Creative — Product Requirements Document

## Overview

This document defines the technical requirements for SEA-Up Creative. Requirements are split into two phases:

- **MVP (March 24 deadline)** — what gets built and tested at MINDS Singapore. Focused entirely on the creation flow. This is the prototype that goes in the pitch video.
- **Phase 2 (post-contest)** — the full marketplace, revenue, community loop, and expanded creative modalities.

Every feature maps to a stage in the Solution Journey. If a feature does not serve a journey stage, it is not in scope for MVP.

---

## Scope Boundaries (Be Honest)

**What MVP is:**
A working AI creative tool that an ID individual or facilitator can use at MINDS — on their phone — to go from zero to a finished artwork in a single session, and see it displayed in a personal gallery.

**What MVP is not:**
A real marketplace. Real payments. Real print-on-demand fulfilment. A royalty system. Music or video creation. These are Phase 2. The MVP will mock the marketplace view to show judges where the journey leads — but no real commerce happens yet.

**Multimodal vision (important context):**
SEA-Up Creative is designed from the start to be a multimodal creative platform — image, music, and video are all part of the long-term product. The MVP builds image creation only, but the architecture is structured so music (via Google Lyria) and video (via Google Veo) are Phase 2 additions, not rebuilds. This is a deliberate architectural decision, not a limitation.

---

## Feature Map by Journey Stage

| Journey Stage | Feature Required | MVP or Phase 2 |
|---|---|---|
| Stage 1 — Discovery | Onboarding screen, language selection | MVP |
| Stage 2 — Creating | AI creation flow (visual choices to image) | MVP |
| Stage 2 — Creating | Photo-to-art input mode | MVP (basic) |
| Stage 2 — Creating | Voice input mode | Phase 2 |
| Stage 2 — Creating | Music creation mode | Phase 2 |
| Stage 2 — Creating | Video creation mode | Phase 2 |
| Stage 3 — Gallery | Personal creator gallery | MVP |
| Stage 3 — Gallery | Artwork attribution (name, date) | MVP |
| Stage 3 — Gallery | Shareable artwork link | MVP |
| Stage 4 — Market | Marketplace listing (mock) | MVP (mock only) |
| Stage 4 — Market | Real POD product creation | Phase 2 |
| Stage 4 — Market | Payment processing | Phase 2 |
| Stage 5 — Earning | Royalty tracking dashboard | Phase 2 |
| Stage 5 — Earning | Community fund reporting | Phase 2 |
| All stages | Facilitator/caregiver co-use mode | MVP (basic) |
| All stages | Bahasa Indonesia language support | MVP |

---

## 1. Frontend Requirements

### 1.1 Design Principles
The entire UI must be designed for cognitive accessibility first. This is not a standard web app with an accessibility layer added on top.

- No text input required at any point in the creation flow
- Large tap targets minimum 72x72px (accounts for motor variability in ID users)
- Maximum 3 choices per screen
- Visual-first — every choice is an image or icon, never text alone
- Progress always visible — creator sees where they are in the flow
- One action per screen — no multi-step forms, no dropdowns, no modals

### 1.2 Device Target
- Primary device: mobile phone (Android/iOS browser)
- All layouts designed mobile-first at 390px width
- Tested on Android Chrome and iOS Safari before pilot day
- No pinch/zoom interactions

### 1.3 Core Screens (MVP)

**Onboarding Screen**
- Language selector: English / Bahasa Indonesia
- Single large CTA: "Let's make something" / "Ayo berkarya"
- No account required to start

**Creation Flow — Step 1: Mood**
- "How are you feeling today?"
- 3 large illustrated icon options (e.g. Happy / Calm / Excited)
- Single tap advances immediately

**Creation Flow — Step 2: Colour World**
- "Pick your colours"
- 3 colour palette swatches — no colour names required

**Creation Flow — Step 3: Subject**
- "What do you want to draw?"
- 3 visual category cards (e.g. Nature / People / Shapes)
- Configurable — not hardcoded

**Creation Flow — Step 4: Photo Input (Optional)**
- "Want to add something from your world?"
- Camera access — Gemini uses the photo as multimodal creative input
- Skippable

**Creation Flow — Step 5: Style (Optional)**
- "What kind of art?"
- Default: abstract illustration
- Options shown as visual examples, not text descriptions
- Skippable — defaults to abstract illustration

**Creation Flow — Step 6: Generating**
- Full-screen animated loading screen
- "We're making your artwork..." / "Kami sedang membuat karya kamu..."
- Target: artwork appears within 15 seconds

**Artwork Result Screen**
- Full-screen artwork display
- Creator name + date overlaid
- Three buttons: Save to Gallery / Try Again / Share

**Creator Gallery**
- Grid view of creator's artworks
- Tap to full-screen view with share link

**Marketplace Preview (Mock — MVP only)**
- Artwork shown on mock products: tote bag, phone case, framed print
- Static mockup — not real products
- "This could be in a shop. Coming soon."

**Facilitator Mode**
- Toggle on onboarding: "I'm helping someone create"
- Unlocks: creator naming, session notes, artwork review before gallery save
- Same accessibility-first creation flow throughout

### 1.4 Tech Stack — Frontend
- Framework: Next.js (React) — PWA, mobile browser compatible, no app store needed
- Styling: Tailwind CSS
- Language: TypeScript
- Deployment: Vercel free tier
- Build tooling: Google Antigravity (agentic IDE, free in public preview) with Gemini 3.1 Pro as the coding agent. Download at antigravity.google/download. This is the development environment — not part of the deployed app architecture.

### 1.5 Known Frontend Limitations
- Voice input excluded from MVP
- Fixed 6-step creation flow for MVP — adaptive flows are Phase 2
- Offline mode not supported — MINDS pilot requires WiFi
- Music and video creation show "Coming soon" placeholders in MVP

---

## 2. Database Requirements

### 2.1 Data Model (MVP)

**Creators table**
```
id               UUID primary key
name             TEXT optional
organisation     TEXT
language         TEXT default en
created_at       TIMESTAMP
facilitator_id   UUID nullable
```

**Artworks table**
```
id               UUID primary key
creator_id       UUID foreign key
image_url        TEXT
prompt_used      TEXT internal
mood             TEXT
colour_palette   TEXT
subject          TEXT
style            TEXT default abstract_illustration
photo_used       BOOLEAN
moderation_pass  BOOLEAN
session_notes    TEXT nullable
created_at       TIMESTAMP
is_public        BOOLEAN default false
ip_owner         TEXT default creator
```

**Facilitators table**
```
id               UUID primary key
name             TEXT
organisation     TEXT
email            TEXT
created_at       TIMESTAMP
```

**Sessions table** (MINDS pilot research tracking)
```
id               UUID primary key
facilitator_id   UUID nullable
creator_id       UUID
artworks_created INTEGER
duration_minutes INTEGER
notes            TEXT
created_at       TIMESTAMP
```

### 2.2 Tech Stack — Database
- Database: Supabase (managed PostgreSQL, free tier sufficient for MVP)
- File Storage: Supabase Storage for generated images, served via CDN
- Auth: Supabase Auth (magic link for facilitators only — ID creators need no account)

### 2.3 IP Ownership Model
Creator owns every artwork. This is enforced in the data model from day one (ip_owner = "creator" on every record), not just stated in policy.

The platform's commercial right is a revenue share on sales, not IP ownership. Proposed split for Phase 2:
- 50% to creator (paid to them or their care facility)
- 25% to platform operations
- 25% to community reinvestment fund

This split should be validated with disability organisations before Phase 2 launch. It is not in the MVP data model — no sales occur in MVP.

### 2.4 Privacy Considerations
- No PII of ID individuals required or stored in MVP
- Creator name field is optional
- Artwork images private by default — facilitator must approve before public listing
- Only constructed prompts sent to Google AI APIs — never personal details
- Compliant with Singapore PDPA and Indonesia PDP Law at MVP scope

### 2.5 Known Database Limitations
- Royalty tracking and financial ledger are Phase 2
- Multi-organisation admin dashboards are Phase 2

---

## 3. Infrastructure and Tech Architecture

### 3.1 Architecture Overview

```
USER (Mobile Phone Browser)
        |
   Next.js Frontend (Vercel)
        |
   API Routes (Next.js serverless)
        |
   +-----------------------------------------+
   |         Google AI Platform               |
   |  Gemini 2.0 Flash -> Imagen 3            |
   |  (multimodal input + prompt building)    |
   |                                          |
   |  Phase 2: Lyria (music) / Veo (video)    |
   +-----------------------------------------+
        |
   Supabase (DB + storage + auth)
```

### 3.2 Why Google AI (Not Mixed Providers)
Single platform across the full multimodal stack:

- Gemini 2.0 Flash accepts the user's photo alongside mood/colour/subject selections as unified multimodal input — not separate inputs stitched together
- Imagen 3 generates images from the prompt Gemini constructs — produces abstract and illustration styles well
- Lyria (music) and Veo (video) available under the same API — Phase 2 additions are straightforward, not rebuilds
- Single API key, single billing, consistent safety filters across all modalities
- Built-in SafeSearch at no meaningful extra cost

Known tradeoff: Imagen 3 has stricter content policies than open-source alternatives. Abstract and illustration styles are well within policy. Test output quality for the specific styles needed before the MINDS pilot.

### 3.3 Creation Flow — Technical Sequence

1. User makes selections in frontend (mood, colour, subject, optional photo, optional style)
2. Frontend sends all inputs to a Next.js API route
3. API route calls Gemini 2.0 Flash with:
   - Structured user selections
   - Photo as base64 image if provided
   - System prompt: act as creative director, produce an Imagen-ready prompt for abstract or illustrative art suitable for commercial licensing
4. Gemini returns a detailed image generation prompt
5. Prompt sent to Imagen 3 — returns generated image
6. Image checked via Google SafeSearch API
   - Pass: save to Supabase Storage, write artwork record, return to frontend
   - Fail: silently regenerate once. If second attempt also fails, show safe fallback and notify facilitator only — never surface the issue to the creator
7. Frontend displays artwork to creator

### 3.4 Content Moderation — Two-Layer Approach

**Layer 1 — Automatic (Google SafeSearch)**
Every generated image checked before shown to creator. Flagged images discarded and silently regenerated once. Creator never sees a harmful image. Facilitator notified if both attempts fail.

**Layer 2 — Human review (Facilitator approval)**
No artwork visible outside the creator's personal gallery until a facilitator explicitly approves it for public listing. Applies in MVP (mock marketplace) and Phase 2 (real marketplace).

Result: creator is protected at point of creation. Public and corporate buyers are protected at point of sale. The platform is never in a position where harmful content reaches a buyer.

### 3.5 Third-Party Services Summary

| Service | Role | Est. Cost Per Session |
|---|---|---|
| Gemini 2.0 Flash | Multimodal prompt construction | ~$0.01–0.03 |
| Imagen 3 | Image generation | ~$0.02–0.04 |
| Google SafeSearch | Content moderation | ~$0.001 |
| Supabase | DB + auth + storage | Free (MVP scale) |
| Vercel | Frontend + serverless | Free (MVP scale) |

Estimated total per creation session: under $0.10 USD

### 3.6 Phase 2 Architecture Additions

| Addition | Service | Purpose |
|---|---|---|
| Music creation | Google Lyria | ID creators compose short music pieces |
| Video creation | Google Veo | ID creators direct short video clips |
| Voice input | Google Speech-to-Text | Bahasa Indonesia voice-to-intent |
| POD fulfilment | Printful API | Physical products from artworks |
| Payments SG | Stripe | Buyer checkout |
| Payments ID | Xendit | Indonesia payment methods (GoPay, OVO, bank transfer) |
| Revenue split | Custom logic | Automated creator royalty payouts |

### 3.7 Known Infrastructure Limitations
- Imagen 3 style constraints: abstract and illustration confirmed safe. Photorealism not recommended for MVP.
- Gemini + Imagen combined latency: estimated 6–14 seconds. Loading animation must feel alive — not a blank screen.
- No real-time collaboration in MVP: facilitator and creator share one device.
- Confirm Google AI latency from Indonesian IPs before Phase 2 Indonesia rollout.

---

## 4. MINDS Pilot Readiness Checklist

- [ ] Creation flow completes end-to-end on mobile phone browser (Android Chrome + iOS Safari)
- [ ] Generated artwork appears within 15 seconds of final selection
- [ ] Artwork passes moderation and saves to gallery immediately
- [ ] Facilitator mode allows session to be attributed to a named creator
- [ ] Bahasa Indonesia functional on all screens
- [ ] No PII collected without facilitator consent
- [ ] Works on WiFi at MINDS — no mobile data dependency
- [ ] Content moderation tested with edge-case prompts before pilot day
- [ ] Minimum 3 internal test sessions completed before pilot day
- [ ] Loading animation in place — no blank screens during generation

---

## 5. Resolved and Open Decisions

| Decision | Status | Answer |
|---|---|---|
| Primary device | Resolved | Mobile phone |
| Image style | Resolved | Abstract + illustration default; open/configurable |
| IP ownership | Resolved | Creator owns artwork; platform takes revenue share |
| Content moderation | Resolved | Google SafeSearch + facilitator approval |
| AI provider | Resolved | Google AI (Gemini + Imagen; Lyria + Veo in Phase 2) |
| Build tooling | Resolved | Google Antigravity IDE (Gemini 3.1 Pro agent, free preview) |
