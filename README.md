# SEA-Up Creative

SEA-Up Creative is an AI-powered creative platform built from the ground up for people with intellectual disabilities (ID) across ASEAN. It enables ID individuals to produce gallery-grade artworks and music through guided visual and auditory choices — without text prompts — and routes their work into a curated marketplace where it can be sold and permanently attributed to them.

---

## The Problem

Across ASEAN's 690 million people, an estimated 7 million live with intellectual disabilities. Indonesia alone accounts for 2.8 million — yet for ID individuals, competitive employment is essentially nonexistent. The creative economy is no exception: tools like Midjourney and DALL-E require precise English text prompting, sustained digital literacy, and abstract reasoning. These are not minor friction for ID individuals — they are total barriers.

Research at MINDS Singapore (Gusta & Ramanathan, 2025) confirmed that generative AI currently functions as a multiplier of existing competence, not a substitute for it. The fastest-growing creative technology in history is widening the gap — at precisely the moment when that gap was becoming impossible to ignore. In Indonesia, the UGM Center for Digital Society confirmed in 2024 that virtually no generative AI applications for people with disabilities exist in Bahasa Indonesia.

The result is a five-stage failure: no accessible entry point → immediate exclusion by existing tools → artwork produced in day programmes that never leaves the room → no infrastructure to bridge art to income → return to passivity. SEA-Up exists to break every stage of this cycle.

---

## What Changes With SEA-Up

| Stage | Before | After |
|---|---|---|
| Discovery | No tool designed for ID individuals; nothing in Bahasa Indonesia | Platform reaches creators through organisations they already trust; available in EN + ID |
| Creating | Text prompts, English required, immediate exclusion | Tap through mood → colour → subject → canvas; AI interprets intent into finished artwork |
| Seeing yourself | Artwork pinned to a wall or discarded | Personal gallery — named, dated, attributed, shareable |
| Reaching the market | Gap between "art made" and "income earned" is unbridgeable | Artwork listed in marketplace; platform handles fulfilment and IP protection |
| Earning | No income, no economic identity | Creator royalty on every sale; community fund reinvests in more creators *(Phase 2)* |

---

## The Three Users

**Creator (ID Individual)** — guided through a visual creation flow (mood → colour → subject → canvas → style) with no text input required. May work independently or with a facilitator. Creates artworks and music. No account required.

**Facilitator (Caregiver / Disability Org)** — co-pilots sessions without taking over creative decisions. Uses magic-link auth. Sets up sessions, names creators, views in-session learning progress, and approves artworks before public listing.

**Buyer (Individual / Corporate)** — browses the curated marketplace. Purchases physical products (print-on-demand). *(Commerce is Phase 2 — current marketplace is a preview.)*

---

## Design Principles

- **No text input** anywhere in the creation flow — ever
- **Large tap targets** — minimum 72×72px, non-negotiable for the creator app
- **Maximum 3 choices** per screen
- **Visual-first** navigation — no reading required
- **Nothing's bones, HERALBONY's soul** — dot-grid structure and monospace precision from Nothing Phone; colour and energy from the artwork itself, inspired by HERALBONY
- **Bilingual** — Bahasa Indonesia and English throughout; ID is a primary language, not a fallback

See `brand-guidelines.md` for the full visual system (colours, typography, spacing, motion, component patterns).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| Database / Auth / Storage | Supabase (PostgreSQL + Storage Buckets + Magic Link Auth) |
| Image generation | Google Imagen 4 via Gemini 2.5 Flash |
| Music generation | Google Lyria 2 via Replicate API (48kHz stereo WAV); Gemini Audio as fallback |
| Dynamic journey options | Google Gemini 2.5 Flash (step 2 + 3 options personalised per journey and prior choice) |
| Deployment | Vercel |

---

## Project Structure

```
app/
  create/           # Creator flow — step-1 through step-9 + music sub-flow
  facilitator/      # Facilitator setup and dashboard (auth-gated)
  admin/            # Admin bypass dashboard (no-auth, internal only)
  gallery/          # Creator's personal artwork gallery
  marketplace/      # Public-facing curated storefront
  api/
    save/           # Save artwork + derive learning tags → Supabase
    save-music/     # Save music track + derive learning tags → Supabase
    journey-options/ # AI-generated step 2/3 options with static fallbacks
    facilitator/review/ # Approve/reject artwork from facilitator dashboard

components/
  ui/               # Shared primitives (StepLayout, OptionCard, MarketplaceArtworkCard, PendingArtworkCard)
  facilitator/      # FacilitatorPromptCard — in-session facilitator overlay
  learning/         # SkillsCard — bilingual skills display post-creation

contexts/           # React context providers (CreationFlow, MusicFlow, Facilitator, Language)
hooks/              # useFacilitatorPrompt

lib/
  google-ai/        # Gemini + Imagen + Lyria API wrappers (server-side only — never import in components)
  journey/          # JOURNEY_CONTENT — questions, canvas config, stickers, facilitator prompts (EN + ID)
  learning/         # SKILL_MAP, deriveImageSkills, deriveMusicSkills, storage helpers
  i18n/             # COPY object — bilingual UI strings
  supabase/         # Supabase client wrappers (browser + service role)

types/              # Shared TypeScript interfaces — Artwork, Journey, CreationFlowState, MusicFlowState, etc.
```

---

## Getting Started

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
REPLICATE_API_TOKEN=        # Required for Lyria 2 music generation
```

Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architectural Decisions

Full rationale and implications for each decision are in `decisions.md`.

| # | Decision | Choice |
|---|---|---|
| DEC-001 | AI provider | Google AI exclusively — Gemini + Imagen + Lyria via Replicate |
| DEC-002 | Creator accounts | None — facilitator magic-link auth only; creators are fully anonymous |
| DEC-003 | IP ownership | `ip_owner = 'creator'` enforced at DB level, not just policy |
| DEC-004 | Content moderation | Two layers: SafeSearch at creation + facilitator approval before public listing |
| DEC-005 | Delivery | PWA via Next.js — no app store required, share via URL |
| DEC-006 | Language persistence | React context — resets on refresh; acceptable for a sub-2-minute flow |
| DEC-007 | Music generation | Lyria 2 via Replicate as primary; Gemini Audio fallback when token unset |
| DEC-008 | Journey type | `'feelings' \| 'world' \| 'sounds'` typed union — adding a journey requires an explicit code change |
| DEC-009 | Dynamic step options | AI-generated per session (Gemini) with static fallback arrays — never fully hardcoded |
| DEC-010 | Generated content storage | `sessionStorage` for artwork URL + creation story; cleared by `resetState()` |
| DEC-011 | Learning tags schema | Comma-separated `TEXT DEFAULT ''` — parsed client-side via `storageStringToSkills` |
| DEC-012 | Facilitator prompts | Stored in `JOURNEY_CONTENT` (not DB); served via `useFacilitatorPrompt` hook; never shown outside active facilitator session |

---

## Acknowledgements

Built with Google Antigravity and Claude Code.
Research foundation: Gusta & Ramanathan (2025), MINDS Singapore.
