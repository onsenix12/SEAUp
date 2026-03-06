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

*[AGENT: Add new decisions below this line as they arise during development]*
