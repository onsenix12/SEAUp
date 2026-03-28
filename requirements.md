# SEA-Up Creative — Product Requirements & Architecture Document

> **Living Document.** This PRD evolves continuously with the codebase. Whenever a new feature is shipped, a database schema changes, or a phase is completed, the Agent MUST update this document to ensure it remains the definitive source of truth for the platform's architecture.

## 1. Product Vision & Accessibility Principles

SEA-Up Creative is an AI-powered multimodal platform designed specifically for individuals with intellectual disabilities (ID) to express themselves through digital art and music, bridging the gap to the commercial creative economy.

### Core Cognitive Accessibility Rules:
- **No text input required** at any point in the creation flow for creators.
- **Large tap targets:** Minimum 72x72px to account for motor variability.
- **Maximum 3-6 choices** per screen to prevent cognitive overload.
- **Visual-first:** Every choice is an image or icon, never text alone.
- **Progress always visible:** Creator sees where they are in the flow.
- **One action per screen:** No multi-step forms, dropdowns, or modals.

---

## 2. The Journey Architecture

The MVP creation flow is bifurcated into distinct, semantic "Journeys". Rather than a generic "Make a Picture" button, creators embark on guided paths. Each journey has unique, dynamically generated step options powered by Gemini 2.0 Flash context generation (`app/api/journey-options`).

### Dynamic Journeys (✅ Live):
- **My Feelings (Visual):** Explores emotional states (e.g., Happy, Calm, Excited) using the Zones of Regulation framework to generate abstract / expressive art.
- **My World (Visual):** Explores physical environments and subjects (e.g., Nature, Space, Animals) for more illustrative outputs.
- **My Sounds (Audio):** An auditory/rhythmic journey generating 48kHz music tracks via Google Lyria 2 based on chosen sound palettes.

*Note: The older fixed 6-step flow (Mood -> Colour -> Subject) was replaced by the Journey Paradigm (DEC-008 & DEC-009).*

---

## 3. Data Model (Supabase)

The primary data structures driving the MVP.

**`creators` table**
- `id` (UUID, primary key)
- `name` (TEXT, optional)
- `organisation` (TEXT)
- `language` (TEXT, default 'en')
- `created_at` (TIMESTAMP)
- `facilitator_id` (UUID, nullable)

**`artworks` table (Visual)**
- `id` (UUID, primary key)
- `creator_id` (UUID, foreign key)
- `title` (TEXT, nullable)  *- Added by Facilitator*
- `is_featured` (BOOLEAN, default false) *- Added by Facilitator*
- `image_url` (TEXT)
- `prompt_used` (TEXT, internal)
- `journey` (TEXT) *- Union type: 'feelings' / 'world' / 'sounds'*
- `learning_tags` (TEXT, default '') *- Comma-separated list of derived skills*
- `style` (TEXT, default 'abstract_illustration')
- `moderation_pass` (BOOLEAN)
- `marketplace_status` (TEXT, default 'private') *- private | pending_review | approved*
- `ip_owner` (TEXT, default 'creator')

**`music_tracks` table (Audio)**
- `id` (UUID, primary key)
- `creator_id` (UUID, foreign key)
- `journey` (TEXT, default 'sounds')
- `audio_url` (TEXT)
- `cover_art_url` (TEXT, nullable)
- `prompt_used` (TEXT, internal)
- `learning_tags` (TEXT, default '')
- `duration_seconds` (INTEGER)

**`facilitators` table**
- `id` (UUID, primary key)
- `name` (TEXT)
- `email` (TEXT)
- `organisation` (TEXT)

---

## 4. Content & Safety Architecture

Platform safety relies on a mandatory **Two-Layer Moderation System** due to the vulnerability of the users and the public exposure of the marketplace.

1. **Layer 1 — Automatic (Point of Generation):**
   Every generated image/audio piece is checked against Google SafeSearch / Safety Filters before it is ever shown to the creator. Harmful generations are silently discarded and regenerated. The creator never encounters inappropriate content.
2. **Layer 2 — Human Review (Point of Publication):**
   No artwork or track is visible on the public marketplace until a Facilitator explicitly approves it via their Dashboard. Facilitators can add a Title and toggle `is_featured` during this step.

---

## 5. Technology Stack & Infrastructure

- **Frontend:** Next.js (App Router), React, Tailwind CSS. Designed as a Progressive Web App (PWA) for mobile browsers.
- **Backend/DB/Auth:** Supabase (PostgreSQL, Storage, Magic Link auth for Facilitators).
- **Generative AI Providers:**
  - **Text/Prompting:** Google Gemini 2.0 Flash (Constructs detailed Imagen/Lyria prompts from tap inputs).
  - **Images:** Google Imagen 3 (Via Gemini API).
  - **Audio:** Google Lyria 2 (Via Replicate `google/lyria-2` model for 48kHz WAV audio; falls back to Gemini Audio).

---

## 6. Phase 2: Future Scope (Post-MVP)

The MVP validates the *creation flow*. Phase 2 will introduce the *commercial loop* and expanded modalities.

| Addition | Expected Tech | Purpose |
|---|---|---|
| **Video Creation** | Google Veo | Cinematic video clips directed by ID creators. |
| **Voice Input** | Google Speech-to-Text | Bahasa Indonesia spoken intent to visual output. |
| **Real POD Fulfilment** | Printful API | Turn mock product images into real shippable goods. |
| **Direct Payments** | Stripe (SG) / Xendit (ID) | Allow buyers to actually purchase gallery items. |
| **Royalty Distribution** | Custom Ledger | Split revenue (e.g. 50% creator, 25% ops, 25% community fund). |
