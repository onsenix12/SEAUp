# BUILD_STATE.md — Current Build Status

> **Updated by the agent at the end of every session.**
> This is the single source of truth for where the build is right now.

---

## Last Updated
- Date: 2026-03-27
- Session duration: N/A
- Updated by: Agent

---

## Active Task
> What is being worked on RIGHT NOW or should be started NEXT.

```
[ ] 7.8 End-to-end music flow verification (Mobile + Desktop)
[ ] 8.8 Verify learning_tags populated in Supabase after live artwork + music save
```

---

## Build Queue (Ordered)

### Phase 0 — Foundation
- [x] **0.1** Initialise Next.js project
- [x] **0.2** Configure Supabase project
- [x] **0.3** Set up environment variables
- [x] **0.4** Configure Vercel deployment
- [x] **0.5** Create `/types/index.ts`
- [x] **0.6** Create Supabase client wrapper
- [x] **0.7** Create Google AI wrapper stubs

... [Existing Phases 1-5 marked as complete] ...

### Phase 6 — Pre-Pilot Checklist
- [ ] **6.1** End-to-end test on physical Android device (Chrome)
- [ ] **6.2** End-to-end test on physical iOS device (Safari)
- [ ] **6.3** Edge-case content moderation test
- [ ] **6.4** Minimum 3 internal test sessions completed
- [ ] **6.5** WiFi-only dependency confirmed
- [ ] **6.6** All MINDS Pilot Readiness Checklist items in requirements.md ticked

### Phase 7 — Music Creation (Real Audio)
- [x] **7.1** Music Mode Chooser — Artwork vs Scratch modes
- [x] **7.2** Artwork Picker — Grid view of saved artworks
- [x] **7.3** Sound Builder — 10-chip sound palette + microphone recording (10s)
- [x] **7.4** Generating Screen — Responsive waveform animation + stable hydration
- [x] **7.5** Result Page — Cover art support, audio playback, creation story
- [x] **7.6** Database & Storage — `music_tracks` table and `music` bucket integration
- [x] **7.7** Lyria 2 Integration — Switching to Replicate API for official 48kHz audio
- [ ] **7.8** End-to-end music flow verification (Mobile + Desktop)

### Phase 8 — Learning Path Feature
- [x] **8.1** Create `lib/learning/skills.ts` — SKILL_MAP, deriveImageSkills, deriveMusicSkills, skillsToStorageString, storageStringToSkills
- [x] **8.2** DB migration — `learning_tags TEXT DEFAULT ''` added to `artworks` and `music_tracks` tables (run manually in Supabase SQL Editor)
- [x] **8.3** `types/index.ts` — `learning_tags?` added to Artwork and MusicTrack; `learning_domains?` added to Session
- [x] **8.4** `app/api/save/route.ts` — deriveImageSkills + skillsToStorageString called before artwork insert; `learning_tags` persisted
- [x] **8.5** Create `components/learning/SkillsCard.tsx` — bilingual (EN/ID), domain-coloured chips, optional creator name subline
- [x] **8.6** `app/create/step-9-print/page.tsx` — SkillsCard inserted above action buttons
- [x] **8.6** `app/create/step-9-shop-success/page.tsx` — SkillsCard inserted above action buttons
- [x] **8.7** `app/gallery/GalleryClient.tsx` — mini skill chips on ArtworkCard (max 2 + overflow badge); ArtworkCard restructured to flex-col so chips render outside image overflow
- [x] **8.7** `app/facilitator/dashboard/FacilitatorDashboardClient.tsx` — Session in Progress card with creator name, org, duration, artwork count, and aggregated skill chips; fetches via creators join on facilitator_id
- [x] **8.8** `app/create/music/result/page.tsx` — SkillsCard inserted above CTAs; skills derived from soundEffects + hasRecordedAudio
- [x] **8.8** `app/api/save-music/route.ts` — deriveMusicSkills + skillsToStorageString called before music_tracks insert; `learning_tags` persisted
- [x] **8.9** `app/create/step-8-result/page.tsx` — SkillsCard added to primary "Your Masterpiece" screen between artwork and action buttons (missed in initial spec, caught during QA)

---

## Completed
- 2026-03-10: **Music Creation Feature (UI & API Foundation)** (Built full music section including mode chooser, artwork picker, sound builder, generating screen, and result page. Initial implementation used Gemini Audio as a stopgap.)
- 2026-03-11: **Lyria 2 / Replicate Integration** (In progress. Switching from Gemini Audio to official `google/lyria-2` on Replicate for high-fidelity 48kHz music generation. Resolved hydration bugs and API timeout issues on the generating screen.)
- 2026-03-14: **Lyria 2 Integration Complete** (`lib/google-ai/index.ts` now uses Replicate `google/lyria-2` when `REPLICATE_API_TOKEN` is set; returns 48kHz stereo WAV. Falls back to Gemini Audio when token is not set.)
- 2026-03-14: **Homepage CTAs** (Removed "Make a Video" button. "Make a Picture" and "Make Music" now same size, white by default, yellow on hover.)

---

## Session Notes
[Session 5 — 2026-03-10]
- [x] Refined marketplace UI (hover blur, navigation links, typewriter speed).
- [x] Redesigned co-creation quote with static hover interaction.
- [x] Initial Music Creation Feature implementation (UI, Context, API stubs, DB Schema).

[Session 6 — 2026-03-11]
- [x] **Music Generation Upgrade**: Switched from Gemini Audio to `google/lyria-2` on Replicate for real 48kHz music.
- [x] **Hydration Fix**: Resolved hydration mismatch on generating screen by moving animations to `globals.css` and using stable bar heights.
- [x] **API Resilience**: Added `maxDuration: 60` and 500-level error handling for robust generation.
- [x] **Dependency**: Installed `replicate` npm package.
- [x] **Replicate in lib/google-ai**: `generateMusicFromPrompt()` uses Lyria 2 when `REPLICATE_API_TOKEN` is set; fetches WAV from prediction URL and returns base64. Gemini Audio remains fallback when token is unset.

[Session 7 — 2026-03-14]
- [x] **7.7 Lyria 2 Integration**: Implemented `generateMusicViaLyria()` in `lib/google-ai/index.ts` — runs `google/lyria-2` via Replicate with 55s timeout, fetches output WAV URL, returns base64. `generateMusicFromPrompt()` prefers Lyria when token present, else Gemini.
- [x] **Homepage CTAs**: Removed "Make a Video" button for now. "Make a Picture" and "Make Music" unified — same size (`min-h-[80px]`, `text-2xl`, 28×28 icons), white default (`bg-surface` + border), yellow on hover (`hover:bg-signal`).
- [ ] **Next**: 7.8 End-to-end music flow verification (Mobile + Desktop); optionally add `REPLICATE_API_TOKEN` to env example/docs.

[Session 8 — 2026-03-15]
- [x] **Learning Path Feature (Phase 8)**: Full implementation across all 6 surfaces.
  - `lib/learning/skills.ts` — pure skill-mapping utility with 7 skills across 4 domains (emotional, spatial, auditory, creative).
  - DB migration run manually: `learning_tags TEXT DEFAULT ''` on `artworks` and `music_tracks`.
  - `types/index.ts` updated: `learning_tags?` on Artwork + MusicTrack, `learning_domains?` on Session.
  - `app/api/save/route.ts` — skills derived and persisted on every image save.
  - `components/learning/SkillsCard.tsx` — reusable bilingual card component with domain-coloured chips.
  - `step-9-print` + `step-9-shop-success` — SkillsCard shown post-creation with optional facilitator name.
  - Gallery `ArtworkCard` — mini skill chips (max 2 + overflow badge); card restructured to flex-col.
  - Facilitator dashboard — live Session in Progress card with aggregated skills queried via creators join.
  - Music result page — SkillsCard above CTAs; skills from `soundEffects` + `hasRecordedAudio`.
  - Music save route — `learning_tags` persisted to `music_tracks`.
- **Architectural decision**: `hasRhythm` in `deriveMusicSkills` maps to `hasRecordedAudio` as MVP approximation. Comment added in `skills.ts` for Phase 2 update when rhythm-tap interaction is added.
- **QA fix**: SkillsCard added to `step-8-result` (primary result screen) after visual QA revealed it was missing — spec had only listed step-9 screens.

[Session 9 — 2026-03-16]
- [x] **Mobile audit (390px)**: Audited all creation flow screens, facilitator overlay, marketplace, and canvas step at 390px viewport.
  - Fixed `min-h-[64px]` → `min-h-[72px]` on Step 2 multi-select chips (sounds journey) to meet 72px tap target minimum.
  - Fixed `FacilitatorPromptCard` inner card: added `overflow-y-auto max-h-[90dvh]` to prevent clipping on short viewports and iOS address-bar collapse.
  - Fixed `step-5-canvas`: added `max-h-[55vh]` to canvas wrapper so action buttons remain visible without scrolling.
  - Fixed `MarketplaceArtworkCard` hover overlay: replaced `md:` breakpoints with `sm:` intermediates; title now steps `text-lg → text-xl → text-2xl` instead of jumping directly at 768px.
- [x] **Bahasa Indonesia audit**: Verified all new strings across journey cards, step questions, canvas prompts, facilitator prompt card, and SkillsCard. All pass. Identified `FacilitatorSetupClient.tsx` as entirely untranslated — added `t` translation object covering all 9 strings (heading, sign out, logged in as, creator name label/hint/placeholder, organisation, start button, handoff note, clean UI note).
- [x] **Code review & fixes** (pre-BUILD_STATE update):
  - `MusicFlowState.journey` retyped from `string` to `Journey` union (`types/index.ts`).
  - `app/api/save/route.ts`: journey fallback changed from `?? ''` to `?? 'feelings'` to prevent empty-string journey on older saves.
  - `MarketplaceArtworkCard` hover overlay: `price || 0` → `(price ?? 0) > 0 ? ... : 'Price on request'` — eliminates `$0 SGD` display.
  - `step-2-colour`: `useEffect` on `state.colour_palette` resets local `selected[]` when flow resets — was not cleared by `resetState()`.
  - `CreationFlowContext.resetState()`: now also clears `sessionStorage` keys `generated_creation_story` and `generated_artwork_url` — previously scattered across component handlers.
  - Removed `as any` casts: `PendingArtwork` exported from `FacilitatorDashboardClient` and imported in admin page; `Artwork` imported in marketplace page.
- [x] **Documentation consolidation**: `problem.md`, `solution.md`, `kickoff_prompt.md` absorbed into `README.md` and deleted. `decisions.md` updated with DEC-007 through DEC-012 (Lyria 2, Journey union, dynamic options, sessionStorage pattern, learning tags schema, facilitator prompts in content).

[Session 10 — 2026-03-27]
- [x] **UI Polish**: Fixed CTA buttons ("Done drawing" / "Skip for now") on the Canvas step (`step-5-canvas`). They are now properly constrained to `max-w-md` width while keeping the action bar background and top border spanning the full width of the screen.
- [x] **Cleanup**: Removed the "Skills practiced today" section from the Print Result page (`step-9-print`).
- [x] **Cleanup**: Removed the generated creation story display from the Shop Success page (`step-9-shop-success`).
