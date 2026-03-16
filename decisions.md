# DECISIONS.md — Architectural Decision Log

> **Append-only. Never delete or modify past entries.**
> When a non-obvious decision is made, the agent adds it here with rationale.
> This prevents re-litigating the same decisions across sessions.

---

## How to Add an Entry

```
### [DEC-XXX] Short title
- Date: YYYY-MM-DD
- Made by: Avi / Agent / Both
- Status: Decided | Revisable | Superseded by DEC-XXX

**Context:** Why did this decision come up?
**Options considered:** What were the alternatives?
**Decision:** What was chosen?
**Rationale:** Why?
**Implications:** What does this constrain or enable going forward?
```

---

## Decisions Log

### [DEC-001] Single Google AI provider for all generative features
- Date: 2026-03-07
- Made by: Avi (documented from requirements.md)
- Status: Decided

**Context:** Multiple AI providers could each excel at different tasks (e.g. DALL-E for images, OpenAI for text).

**Options considered:**
- A) Mixed providers — best-in-class per task
- B) Single Google AI platform (Gemini + Imagen + Lyria + Veo)

**Decision:** Option B — Google AI exclusively for MVP and Phase 2.

**Rationale:** Single API key, single billing, consistent safety filters across all modalities. Phase 2 music (Lyria) and video (Veo) are native extensions, not rebuilds. Simplifies server-side key management significantly.

**Implications:** Imagen 3 style constraints apply — abstract and illustration confirmed safe; photorealism not recommended. If Google AI has a service outage, the entire creation pipeline is affected.

---

### [DEC-002] No user accounts for ID creators
- Date: 2026-03-07
- Made by: Avi (documented from requirements.md)
- Status: Decided

**Context:** Standard platforms require accounts for personalisation and gallery persistence.

**Options considered:**
- A) Account creation for all users
- B) Facilitator accounts only; creators identified by session, no login required

**Decision:** Option B — creators need no account. Facilitators use magic link auth.

**Rationale:** Account creation (email, password, verification) is a cognitive barrier that violates the core design principle. Privacy by design — no PII required for ID individuals. Compliant with PDPA Singapore and Indonesia PDP Law.

**Implications:** Creator gallery is session-based unless a facilitator links sessions to a named creator. Cross-session gallery continuity for independent (non-facilitated) users is not supported in MVP.

---

### [DEC-003] ip_owner = 'creator' enforced at database level
- Date: 2026-03-07
- Made by: Avi (documented from requirements.md)
- Status: Decided

**Context:** Disability art platforms have historically claimed IP ownership over artist work. This is an ethical and commercial risk.

**Options considered:**
- A) IP ownership stated in terms of service only
- B) IP ownership enforced in the data model (DEFAULT 'creator' on every record)

**Decision:** Option B — data model enforcement, not just policy.

**Rationale:** Makes it structurally impossible for a code change or bug to accidentally assign IP to the platform. Demonstrates commitment to artists in a way that is auditable.

**Implications:** Phase 2 commercial licensing model must be structured as a revenue share on sales, not IP transfer. Legal documentation must reflect this.

---

### [DEC-004] Two-layer content moderation (SafeSearch + facilitator approval)
- Date: 2026-03-07
- Made by: Avi (documented from requirements.md)
- Status: Decided

**Context:** Platform serves vulnerable users including potentially minors in some care settings. Content safety is non-negotiable.

**Options considered:**
- A) Automated moderation only
- B) Human review only
- C) Automated (point of creation) + human (point of public listing)

**Decision:** Option C — two-layer approach.

**Rationale:** Automated layer protects the creator from ever seeing harmful output. Human facilitator layer protects buyers and the public from harmful content reaching the marketplace. Neither layer alone is sufficient.

**Implications:** No artwork can appear in the (mock or real) marketplace without facilitator approval. This must be enforced in code, not just policy. Facilitator approval status must be a boolean field on the artwork record.

---

### [DEC-005] PWA via Next.js — no native app
- Date: 2026-03-07
- Made by: Avi (documented from requirements.md)
- Status: Decided

**Context:** Mobile-first product for users who may not be able to navigate app store installation.

**Options considered:**
- A) Native iOS + Android apps
- B) Progressive Web App (PWA) via Next.js, runs in mobile browser

**Decision:** Option B — PWA.

**Rationale:** No app store required — facilitators can share a URL. Works on Android Chrome and iOS Safari. Faster to build. No review process delay risk before March 24 deadline.

**Implications:** Some device features (e.g. push notifications) are limited. Camera access via `getUserMedia` works in mobile browsers but must be tested on both platforms before pilot day.

---

### [DEC-006] Language stored in component state (not localStorage/cookie) for MVP
- Date: 2026-03-07
- Made by: Agent (based on requirements scope and platform constraints)
- Status: Decided

**Context:** Language selection (EN/ID) happens on onboarding. It needs to persist across the creation flow screens.

**Options considered:**
- A) localStorage
- B) Cookie
- C) React context / component state passed through flow
- D) URL param

**Decision:** Option C — React context for language, passed through creation flow.

**Rationale:** MVP is a single-session experience with no persistent login. localStorage adds complexity and is not needed. React context is clean, testable, and sufficient for the flow depth of MVP.

**Implications:** Language resets if the user refreshes mid-flow. Acceptable for MVP — the flow is under 2 minutes. Phase 2 can add persistence if needed.

---

### [DEC-007] Lyria 2 via Replicate as primary music generator; Gemini Audio as fallback
- Date: 2026-03-14
- Made by: Avi / Agent
- Status: Decided

**Context:** Initial music implementation used Gemini Audio as a stopgap. Lyria 2 (official Google music model) became available via Replicate.

**Options considered:**
- A) Gemini Audio only (already working)
- B) Lyria 2 via Replicate as primary, Gemini Audio as fallback when `REPLICATE_API_TOKEN` is unset

**Decision:** Option B.

**Rationale:** Lyria 2 produces 48kHz stereo WAV — significantly higher quality than Gemini Audio. Replicate handles the async prediction loop. Fallback preserves developer ergonomics (no Replicate account needed to run locally).

**Implications:** `REPLICATE_API_TOKEN` must be set in production env. `generateMusicFromPrompt()` in `lib/google-ai/index.ts` checks for token at runtime and branches accordingly.

---

### [DEC-008] Three named journeys as a typed union — not a generic string
- Date: 2026-03-15
- Made by: Agent
- Status: Decided

**Context:** The platform needed to support multiple distinct creation journeys (art, world-building, sound/music). The question was whether journey identity should be a free string or a constrained type.

**Options considered:**
- A) `journey: string` — extensible, no compile-time safety
- B) `journey: 'feelings' | 'world' | 'sounds'` — closed union enforced in TypeScript

**Decision:** Option B — `Journey` type exported from `types/index.ts`.

**Rationale:** Each journey has a distinct step sequence, canvas config, sticker set, and facilitator prompts all keyed by journey name. A free string would allow silent drift. The union makes invalid journeys a compile error, not a runtime bug.

**Implications:** Adding a new journey requires a `types/index.ts` change, a `JOURNEY_CONTENT` entry, and a `JOURNEY_META` entry. This is intentional — journeys are not dynamically extensible in MVP.

---

### [DEC-009] Dynamic step-2/3 options generated by Gemini per session; static fallbacks always present
- Date: 2026-03-15
- Made by: Agent
- Status: Decided

**Context:** Step 2 and step 3 options (colour/sound/location choices) needed to vary by journey and by the creator's step-1 answer to feel responsive and personalised.

**Options considered:**
- A) Hardcoded option lists per journey
- B) Fully AI-generated options (no fallback)
- C) AI-generated with static fallback arrays when Gemini fails or returns malformed JSON

**Decision:** Option C — `app/api/journey-options/route.ts` calls Gemini, parses JSON, validates shape; catches all errors and returns `FALLBACKS[journey][step]`.

**Rationale:** Personalisation improves experience without making the flow dependent on AI availability. The sounds journey always returns 6 options (not 3) to give enough chip variety for multi-select.

**Implications:** If Gemini is unavailable, the flow degrades gracefully to static options. Static fallbacks must be kept current if option schemas change.

---

### [DEC-010] Generated content (artwork URL, creation story) stored in sessionStorage — not React context
- Date: 2026-03-15
- Made by: Agent
- Status: Decided

**Context:** After AI generation, the artwork URL and creation story need to survive the route transition from the generating screen to the result screen in Next.js App Router.

**Options considered:**
- A) Pass via React context (CreationFlowState)
- B) Pass via URL query params
- C) Store in sessionStorage; read on mount of result page

**Decision:** Option C — `sessionStorage.setItem('generated_artwork_url', ...)` and `sessionStorage.setItem('generated_creation_story', ...)`.

**Rationale:** Context does not survive a full-page navigation in Next.js App Router. URL params would expose base64 data in the address bar. sessionStorage is cleared on tab close (appropriate for single-session privacy) and is guarded with `typeof window !== 'undefined'` everywhere it is accessed. `resetState()` in `CreationFlowContext` explicitly clears both keys.

**Implications:** All sessionStorage reads must be client-side only. Adding new generated assets to the flow requires adding a corresponding `sessionStorage.removeItem` call to `resetState()`.

---

### [DEC-011] Learning tags stored as comma-separated string in TEXT column — not as an array
- Date: 2026-03-15
- Made by: Agent
- Status: Decided

**Context:** Skills derived from a creator's choices needed to be persisted with each artwork and music track record.

**Options considered:**
- A) PostgreSQL array column (`TEXT[]`)
- B) JSONB column
- C) Comma-separated `TEXT` column with `DEFAULT ''`

**Decision:** Option C — `learning_tags TEXT DEFAULT ''`.

**Rationale:** Supabase's JavaScript client handles `TEXT[]` inconsistently in some select/filter operations. JSONB adds overhead for a simple list of short IDs. Comma-separated TEXT is trivially serialised/deserialised via `skillsToStorageString` / `storageStringToSkills` in `lib/learning/skills.ts`, and `storageStringToSkills('')` safely returns `[]`.

**Implications:** Skills cannot be queried individually at the SQL level without string parsing. Acceptable for MVP — aggregation is done in the client layer. Revisit if Phase 2 requires skill-based filtering in Supabase queries.

---

### [DEC-012] Facilitator prompts stored in JOURNEY_CONTENT — not in the database
- Date: 2026-03-15
- Made by: Agent
- Status: Decided

**Context:** Facilitators needed in-session guidance prompts for each step and journey to help them support creators without taking over.

**Options considered:**
- A) Prompts stored in Supabase, editable by admins
- B) Prompts hardcoded in component files
- C) Prompts in `lib/journey/content.ts` (JOURNEY_CONTENT), accessed via `useFacilitatorPrompt` hook

**Decision:** Option C.

**Rationale:** Prompts are short, stable, and bilingual. Storing in DB adds a network dependency to the facilitator overlay — which must appear instantly. `JOURNEY_CONTENT` is type-safe and co-located with all other journey data. The hook checks `sessionData.isActive` before returning anything, so the overlay never appears in non-facilitated sessions.

**Implications:** Updating facilitator prompts requires a code change and deploy, not a DB edit. Acceptable for MVP. Phase 2 could move prompts to a CMS if facilitator orgs need to customise them per programme.

---

*[AGENT: Add new decisions below this line as they arise during development]*
