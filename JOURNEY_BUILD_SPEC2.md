# SEA-Up Creative — Journey Build Spec v2
# Journey Redesign + Facilitator Prompt Cards + Organizer Dashboard Upgrades
> Drop this file in your repo root as `JOURNEY_BUILD_SPEC.md`
> Codebase audit already completed. All file paths are confirmed below.
> Work through phases in strict order. Confirm each phase before proceeding.

---

## Confirmed File Paths (Audit Complete — Do Not Re-Check)

| Purpose | Confirmed Path |
|---|---|
| Canvas step | `app/create/step-5-canvas/page.tsx` |
| Canvas component | `components/CanvasEditor` (dynamic import, ssr: false) |
| Music mode chooser | `app/create/music/page.tsx` |
| Music layout | `app/create/music/layout.tsx` |
| Music from artwork | `app/create/music/from-artwork/page.tsx` |
| Music from scratch | `app/create/music/from-scratch/page.tsx` |
| Music generating | `app/create/music/generating/page.tsx` |
| Music result | `app/create/music/result/page.tsx` |
| Facilitator dashboard | `app/facilitator/dashboard/FacilitatorDashboardClient.tsx` |
| Organizer queue | `app/admin/dashboard/page.tsx` |
| Gallery | `app/gallery/GalleryClient.tsx` |
| Google AI wrapper | `lib/google-ai/index.ts` |
| Skills utility | `lib/learning/skills.ts` |
| Types | `types/index.ts` |

## Confirmed Context Facts (Do Not Re-Check)

- `CreationFlowState` in `types/index.ts` lines 79–90 contains: `nickname`, `mood`, `colour_palette`, `subject`, `photo_base64`, `canvas_base64`, `has_drawn`, `photo_taken`, `stickers_used`, `style`. No `journey` field yet.
- Facilitator active state is accessed as `sessionData.isActive` — there is no standalone `isFacilitated` boolean. Use `sessionData.isActive` everywhere in this spec.
- `buildArtPrompt()` in `lib/google-ai/index.ts` already returns `{ prompt: string, creation_story: string }` from Gemini. This is confirmed.
- `buildMusicPrompt()` returns the same shape.

## SQL Migrations — Run These Manually Before Starting Phase 1

Open Supabase SQL Editor. Run each in a separate new query tab:

```sql
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS creation_story TEXT DEFAULT '';
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS journey TEXT DEFAULT '';
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS price_sgd INTEGER DEFAULT 0;
ALTER TABLE music_tracks ADD COLUMN IF NOT EXISTS creation_story TEXT DEFAULT '';
```

Confirm all four columns exist in Supabase Table Editor before starting Phase 1.

---

## Phase 1 — Journey Types and Content Library

### PROMPT 1.1 — Add journey to CreationFlowState

> Read `types/index.ts` in full. Find the `CreationFlowState` interface (lines 79–90).
>
> Add `journey` to the existing interface — do not create a new interface:
>
> ```typescript
> journey?: 'feelings' | 'world' | 'sounds';
> ```
>
> Then add these two new exports at the bottom of `types/index.ts`, after all existing exports:
>
> ```typescript
> export type Journey = 'feelings' | 'world' | 'sounds';
>
> export const JOURNEY_META: Record<Journey, {
>   label_en: string;
>   label_id: string;
>   emoji: string;
>   tagline_en: string;
>   tagline_id: string;
> }> = {
>   feelings: {
>     label_en: 'My Feelings',
>     label_id: 'Perasaan Saya',
>     emoji: '😊',
>     tagline_en: 'Express how you feel today',
>     tagline_id: 'Ungkapkan perasaanmu hari ini',
>   },
>   world: {
>     label_en: 'My World',
>     label_id: 'Dunia Saya',
>     emoji: '🗺️',
>     tagline_en: 'Draw the places you know',
>     tagline_id: 'Gambarkan tempat yang kamu kenal',
>   },
>   sounds: {
>     label_en: 'My Sounds',
>     label_id: 'Suara Saya',
>     emoji: '🎵',
>     tagline_en: 'Turn your sounds into music',
>     tagline_id: 'Ubah suaramu menjadi musik',
>   },
> };
> ```
>
> Also add `journey?: string` to the `Artwork` interface and `MusicTrack` interface in the same file.
>
> Do not change anything else. Confirm before 1.2.

---

### PROMPT 1.2 — Create journey content library

> Create new file: `lib/journey/content.ts`
>
> This is a pure data file — no React, no API calls, no side effects.
>
> ```typescript
> import { Journey } from '@/types';
>
> export interface StepOption {
>   id: string;
>   label_en: string;
>   label_id: string;
>   emoji: string;
>   value: string;
> }
>
> export interface FacilitatorPrompt {
>   en: string;
>   id: string;
> }
>
> export interface CanvasConfig {
>   prompt_en: string;
>   prompt_id: string;
>   stickers: StepOption[];
>   free_draw: boolean;
> }
>
> export interface JourneyStepContent {
>   question_en: string;
>   question_id: string;
>   options: StepOption[];
>   facilitator_prompt: FacilitatorPrompt;
> }
>
> export interface JourneyContent {
>   step1: JourneyStepContent;
>   step2_prefix: string;
>   step3_prefix: string;
>   canvas: CanvasConfig;
>   canvas_facilitator_prompt: FacilitatorPrompt;
>   result_facilitator_prompt: FacilitatorPrompt;
>   creation_story_template: string;
>   skill_ids: string[];
> }
>
> export const JOURNEY_CONTENT: Record<Journey, JourneyContent> = {
>   feelings: {
>     step1: {
>       question_en: 'How are you feeling today?',
>       question_id: 'Bagaimana perasaanmu hari ini?',
>       options: [
>         { id: 'happy',   label_en: 'Happy',   label_id: 'Senang',       emoji: '😊', value: 'happy' },
>         { id: 'calm',    label_en: 'Calm',    label_id: 'Tenang',       emoji: '😌', value: 'calm' },
>         { id: 'excited', label_en: 'Excited', label_id: 'Bersemangat',  emoji: '🤩', value: 'excited' },
>         { id: 'worried', label_en: 'Worried', label_id: 'Khawatir',     emoji: '😟', value: 'worried' },
>         { id: 'sad',     label_en: 'Sad',     label_id: 'Sedih',        emoji: '😢', value: 'sad' },
>         { id: 'confused',label_en: 'Confused',label_id: 'Bingung',      emoji: '😕', value: 'confused' },
>       ],
>       facilitator_prompt: {
>         en: 'Ask them: How are you feeling right now? Point to the one that feels most like you.',
>         id: 'Tanya mereka: Bagaimana perasaanmu sekarang? Tunjuk yang paling mewakili kamu.',
>       },
>     },
>     step2_prefix: 'Generate exactly 3 context options for where someone feels {step1_value}. Examples: "At home", "With someone", "At a special place". Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id (string), label_en (string), label_id (string), emoji (string), value (string).',
>     step3_prefix: 'Generate exactly 3 colour palette options for someone who feels {step1_value} at {step2_value}. Each palette should have a descriptive name. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
>     canvas: {
>       prompt_en: 'Draw what this feeling looks like. Use the stickers or draw freely.',
>       prompt_id: 'Gambarkan perasaan ini. Gunakan stiker atau gambar bebas.',
>       stickers: [
>         { id: 'face',  label_en: 'Face',  label_id: 'Wajah',    emoji: '😊', value: 'face' },
>         { id: 'heart', label_en: 'Heart', label_id: 'Hati',     emoji: '❤️', value: 'heart' },
>         { id: 'sun',   label_en: 'Sun',   label_id: 'Matahari', emoji: '☀️', value: 'sun' },
>         { id: 'rain',  label_en: 'Rain',  label_id: 'Hujan',    emoji: '🌧️', value: 'rain' },
>         { id: 'home',  label_en: 'Home',  label_id: 'Rumah',    emoji: '🏠', value: 'home' },
>         { id: 'tree',  label_en: 'Tree',  label_id: 'Pohon',    emoji: '🌳', value: 'tree' },
>         { id: 'star',  label_en: 'Star',  label_id: 'Bintang',  emoji: '⭐', value: 'star' },
>       ],
>       free_draw: true,
>     },
>     canvas_facilitator_prompt: {
>       en: 'Ask them: Is there anything you want to add — a person, a place, a feeling? Let them draw as long as they want. Tap Continue when they feel done.',
>       id: 'Tanya mereka: Ada yang ingin ditambahkan? Biarkan mereka menggambar selama yang mereka mau. Tekan Lanjutkan jika sudah selesai.',
>     },
>     result_facilitator_prompt: {
>       en: 'Ask them: Does this look like how you were feeling? What do you see in it? Tell them: this is yours — you made this.',
>       id: 'Tanya mereka: Apakah ini menggambarkan perasaanmu? Apa yang kamu lihat? Katakan: ini milikmu — kamu yang membuatnya.',
>     },
>     creation_story_template: 'Made while exploring {step1} at {step2}. Created on {date}.',
>     skill_ids: ['emotional_expression', 'colour_association', 'creative_choice'],
>   },
>
>   world: {
>     step1: {
>       question_en: 'Where do you want to explore?',
>       question_id: 'Tempat mana yang ingin kamu jelajahi?',
>       options: [
>         { id: 'neighbourhood', label_en: 'My neighbourhood', label_id: 'Lingkunganku',    emoji: '🏘️', value: 'my neighbourhood' },
>         { id: 'school',        label_en: 'My school',        label_id: 'Sekolahku',        emoji: '🏫', value: 'my school' },
>         { id: 'favourite',     label_en: 'My favourite place',label_id: 'Tempat favoritku',emoji: '💛', value: 'my favourite place' },
>       ],
>       facilitator_prompt: {
>         en: 'Ask them: Where do you go most days? Where do you feel comfortable?',
>         id: 'Tanya mereka: Ke mana kamu pergi setiap hari? Di mana kamu merasa nyaman?',
>       },
>     },
>     step2_prefix: 'Generate exactly 3 landmark category options for {step1_value}. Examples: Buildings, Nature, Transport. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
>     step3_prefix: 'Generate exactly 3 colour palette options for {step2_value} at {step1_value}. Each palette should reflect the visual character of that environment. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
>     canvas: {
>       prompt_en: "Let's draw your journey. Where do you start? Place your first sticker.",
>       prompt_id: 'Ayo gambar perjalananmu. Dari mana kamu mulai? Taruh stiker pertamamu.',
>       stickers: [
>         { id: 'home',      label_en: 'Home',           label_id: 'Rumah',           emoji: '🏠', value: 'home' },
>         { id: 'bus',       label_en: 'Bus Stop',       label_id: 'Halte Bus',       emoji: '🚌', value: 'bus stop' },
>         { id: 'mrt',       label_en: 'MRT',            label_id: 'MRT',             emoji: '🚇', value: 'MRT station' },
>         { id: 'school',    label_en: 'School',         label_id: 'Sekolah',         emoji: '🏫', value: 'school' },
>         { id: 'park',      label_en: 'Park',           label_id: 'Taman',           emoji: '🌳', value: 'park' },
>         { id: 'shop',      label_en: 'Shop',           label_id: 'Toko',            emoji: '🏪', value: 'shop' },
>         { id: 'favourite', label_en: 'Favourite Place',label_id: 'Tempat Favorit',  emoji: '⭐', value: 'favourite place' },
>       ],
>       free_draw: true,
>     },
>     canvas_facilitator_prompt: {
>       en: 'Ask them: Where do you start from? Where do you go next? Help them build the route step by step. Tap Continue when the map feels complete.',
>       id: 'Tanya mereka: Dari mana mulainya? Ke mana selanjutnya? Bantu mereka membangun rute langkah demi langkah. Tekan Lanjutkan jika peta sudah lengkap.',
>     },
>     result_facilitator_prompt: {
>       en: 'Ask them: Can you see your journey in the picture? Point to where home is. Tell them: you just drew your own map.',
>       id: 'Tanya mereka: Bisakah kamu melihat perjalananmu di gambar ini? Tunjuk di mana rumahmu. Katakan: kamu baru saja menggambar petamu sendiri.',
>     },
>     creation_story_template: 'A journey through {step1}. Created on {date}.',
>     skill_ids: ['spatial_reasoning', 'wayfinding', 'creative_choice'],
>   },
>
>   sounds: {
>     step1: {
>       question_en: 'Where are these sounds from?',
>       question_id: 'Dari mana suara-suara ini berasal?',
>       options: [
>         { id: 'neighbourhood', label_en: 'My neighbourhood', label_id: 'Lingkunganku',       emoji: '🏘️', value: 'my neighbourhood' },
>         { id: 'home',          label_en: 'My home',          label_id: 'Rumahku',             emoji: '🏠', value: 'my home' },
>         { id: 'favourite',     label_en: 'A place I love',   label_id: 'Tempat yang aku suka',emoji: '💛', value: 'a place I love' },
>       ],
>       facilitator_prompt: {
>         en: 'Ask them: Close your eyes for a moment. What do you hear right now? Where does that sound come from?',
>         id: 'Minta mereka: Tutup matamu sebentar. Apa yang kamu dengar sekarang? Dari mana suara itu?',
>       },
>     },
>     step2_prefix: 'Generate 6 sound chip options for {step1_value}. Examples: Birds, Bus, Footsteps, Rain, Scooter, Music from a shop. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields. This will be a multi-select step — max 3 selections allowed by the user.',
>     step3_prefix: 'Generate exactly 3 emotional tone options for sounds from {step1_value}. Examples: "Busy and energetic", "Calm and quiet", "Happy and warm". Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
>     canvas: {
>       prompt_en: 'Draw how the sounds move. Fast lines or slow? Big shapes or small?',
>       prompt_id: 'Gambarkan bagaimana suara itu bergerak. Garis cepat atau lambat? Bentuk besar atau kecil?',
>       stickers: [],
>       free_draw: true,
>     },
>     canvas_facilitator_prompt: {
>       en: 'Ask them: Show me with your hand how the sound moves. Now draw it. Is it fast or slow?',
>       id: 'Tanya mereka: Tunjukkan dengan tanganmu bagaimana suara itu bergerak. Sekarang gambarkan. Cepat atau lambat?',
>     },
>     result_facilitator_prompt: {
>       en: 'Play it to them. Ask them: Does this sound like your place? What do you hear in it? Tell them: you made this music.',
>       id: 'Putar untuk mereka. Tanya: Apakah ini terdengar seperti tempatmu? Apa yang kamu dengar? Katakan: kamu yang membuat musik ini.',
>     },
>     creation_story_template: 'Composed from the sounds of {step1}. Created on {date}.',
>     skill_ids: ['sound_discrimination', 'sequencing', 'creative_choice'],
>   },
> };
> ```
>
> Confirm file created before 1.3.

---

### PROMPT 1.3 — Add journey to CreationFlowContext default state

> Read `contexts/CreationFlowContext.tsx` in full.
>
> The `initialState` object sets default values for `CreationFlowState`. Add `journey: undefined` to `initialState`.
>
> Ensure `resetState()` sets `journey` back to `undefined` — confirm this happens automatically since `resetState` sets state back to `initialState`.
>
> Do not change anything else in this file. Confirm before Phase 2.

---

## Phase 2 — Journey Selection Screen

### PROMPT 2.1 — Replace home screen CTAs with journey selection

> Read `app/page.tsx` in full. Understand the current layout: language selector at top, "Make a Picture" and "Make Music" CTA buttons, "I'm helping someone create" link at bottom.
>
> Replace ONLY the two CTA buttons with a journey selection section. Keep the language selector, the "I'm helping someone create" link, and all other elements exactly as-is.
>
> The new section:
>
> Heading above the cards:
> ```jsx
> <p className="font-creator text-xl font-bold text-ink text-center mb-4">
>   {language === 'id' ? 'Apa yang ingin kamu jelajahi hari ini?' : 'What do you want to explore today?'}
> </p>
> ```
>
> Three journey cards, full-width, stacked vertically:
> ```jsx
> // Import at top of file:
> import { JOURNEY_META, Journey } from '@/types';
> import { useCreationFlow } from '@/contexts/CreationFlowContext';
>
> // Inside component:
> const { updateState } = useCreationFlow();
>
> const handleJourneySelect = (journey: Journey) => {
>   updateState({ journey });
>   router.push('/create/step-1-mood');
> };
>
> // Card JSX (repeat for each journey):
> {(['feelings', 'world', 'sounds'] as Journey[]).map((j) => (
>   <button
>     key={j}
>     onClick={() => handleJourneySelect(j)}
>     className="bg-surface border border-ink/10 rounded-2xl px-5 py-4 flex items-center gap-4 w-full min-h-[80px] hover:bg-signal hover:border-signal transition-colors"
>   >
>     <span className="text-4xl" aria-hidden="true">{JOURNEY_META[j].emoji}</span>
>     <div className="text-left">
>       <p className="font-creator text-lg font-bold text-ink leading-tight">
>         {language === 'id' ? JOURNEY_META[j].label_id : JOURNEY_META[j].label_en}
>       </p>
>       <p className="font-body text-sm text-muted">
>         {language === 'id' ? JOURNEY_META[j].tagline_id : JOURNEY_META[j].tagline_en}
>       </p>
>     </div>
>   </button>
> ))}
> ```
>
> Confirm renders correctly at 390px mobile width. All three cards visible without scrolling past the language selector. Confirm before 2.2.

---

### PROMPT 2.2 — Update facilitator Session Setup routing

> Read the facilitator session setup page (check `app/facilitator/setup/page.tsx` or `app/facilitator/dashboard/page.tsx` — find wherever the "Start Creation Flow" button lives).
>
> The "Start Creation Flow" button currently routes directly into the creation flow. Change it to route to `/` (home screen) so the facilitator hands the device to the creator to choose their journey.
>
> Add a small instructional line directly below the button:
> ```jsx
> <p className="font-body text-xs text-muted text-center mt-2">
>   {language === 'id'
>     ? 'Berikan perangkat ke kreator untuk memilih perjalanan hari ini.'
>     : 'Hand the device to the creator to choose today\'s journey.'}
> </p>
> ```
>
> Do not change anything else on this screen. Confirm before Phase 3.

---

## Phase 3 — Facilitator Prompt Card System

### PROMPT 3.1 — Create FacilitatorPromptCard component

> Create file: `components/facilitator/FacilitatorPromptCard.tsx`
>
> ```typescript
> "use client";
>
> interface FacilitatorPromptCardProps {
>   prompt: string;
>   language: 'en' | 'id';
>   onContinue: () => void;
>   stepLabel?: string;
> }
>
> export default function FacilitatorPromptCard({
>   prompt,
>   language,
>   onContinue,
>   stepLabel,
> }: FacilitatorPromptCardProps) {
>   return (
>     <div className="fixed inset-0 bg-ink/80 z-50 flex flex-col items-center justify-center px-6">
>       <div className="bg-surface rounded-2xl p-6 w-full max-w-sm">
>
>         {/* Badge */}
>         <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
>           🤝 {language === 'id' ? 'Panduan Fasilitator' : 'Facilitator Prompt'}
>         </span>
>
>         {/* Step label */}
>         {stepLabel && (
>           <p className="font-body text-xs text-muted mt-2">{stepLabel}</p>
>         )}
>
>         {/* Prompt text */}
>         <p className="font-creator text-lg font-bold text-ink mt-3 leading-snug">
>           {prompt}
>         </p>
>
>         {/* Divider + Continue button */}
>         <div className="border-t border-ink/10 mt-4 pt-4">
>           <button
>             onClick={onContinue}
>             className="w-full bg-signal text-ink font-body font-semibold py-3 rounded-xl text-base"
>           >
>             {language === 'id' ? 'Lanjutkan →' : 'Continue →'}
>           </button>
>         </div>
>
>       </div>
>     </div>
>   );
> }
> ```
>
> The card is NOT dismissible by tapping outside — only the Continue button works. Confirm before 3.2.

---

### PROMPT 3.2 — Create useFacilitatorPrompt hook

> Create file: `hooks/useFacilitatorPrompt.ts`
>
> ```typescript
> import { useFacilitator } from '@/contexts/FacilitatorContext';
> import { useCreationFlow } from '@/contexts/CreationFlowContext';
> import { useLanguage } from '@/contexts/LanguageContext';
> import { JOURNEY_CONTENT } from '@/lib/journey/content';
> import { Journey } from '@/types';
>
> type PromptStep = 'step1' | 'canvas' | 'result';
>
> export function useFacilitatorPrompt(step: PromptStep) {
>   const { sessionData } = useFacilitator();
>   const { state } = useCreationFlow();
>   const { language } = useLanguage();
>
>   const isActive = sessionData.isActive;
>   const journey = state.journey as Journey | undefined;
>
>   if (!isActive || !journey) {
>     return { shouldShow: false, prompt: null, language };
>   }
>
>   const content = JOURNEY_CONTENT[journey];
>   let rawPrompt: { en: string; id: string } | null = null;
>
>   if (step === 'step1') rawPrompt = content.step1.facilitator_prompt;
>   if (step === 'canvas') rawPrompt = content.canvas_facilitator_prompt;
>   if (step === 'result') rawPrompt = content.result_facilitator_prompt;
>
>   const prompt = rawPrompt ? (language === 'id' ? rawPrompt.id : rawPrompt.en) : null;
>
>   return {
>     shouldShow: !!prompt,
>     prompt,
>     language,
>   };
> }
> ```
>
> Confirm before 3.3.

---

### PROMPT 3.3 — Add facilitator prompt card to Step 1

> Read `app/create/step-1-mood/page.tsx` in full.
>
> Add these imports at the top:
> ```typescript
> import { useState } from 'react';
> import FacilitatorPromptCard from '@/components/facilitator/FacilitatorPromptCard';
> import { useFacilitatorPrompt } from '@/hooks/useFacilitatorPrompt';
> ```
>
> Inside the component, after the existing hook calls:
> ```typescript
> const { shouldShow, prompt, language: promptLanguage } = useFacilitatorPrompt('step1');
> const [promptDismissed, setPromptDismissed] = useState(false);
> const showCard = shouldShow && !promptDismissed;
> ```
>
> In the JSX, add this BEFORE the return's main content wrapper (so it overlays everything):
> ```jsx
> {showCard && prompt && (
>   <FacilitatorPromptCard
>     prompt={prompt}
>     language={promptLanguage}
>     onContinue={() => setPromptDismissed(true)}
>     stepLabel={promptLanguage === 'id' ? 'Sebelum Langkah 1' : 'Before Step 1'}
>   />
> )}
> ```
>
> Do NOT change any existing step logic — only add the overlay. Confirm before 3.4.

---

### PROMPT 3.4 — Add facilitator prompt card to Canvas, Result, and Music Result

> Apply the exact same pattern from PROMPT 3.3 to these four files:
>
> 1. `app/create/step-5-canvas/page.tsx` — use `useFacilitatorPrompt('canvas')`, stepLabel "Before Canvas" / "Sebelum Kanvas"
> 2. `app/create/step-8-result/page.tsx` — use `useFacilitatorPrompt('result')`, stepLabel "After Creation" / "Setelah Membuat"
> 3. `app/create/step-9-print/page.tsx` — use `useFacilitatorPrompt('result')`, stepLabel "After Creation" / "Setelah Membuat"
> 4. `app/create/music/result/page.tsx` — use `useFacilitatorPrompt('result')`, stepLabel "After Creation" / "Setelah Membuat"
>
> Same pattern every time:
> - Add three imports
> - Add `shouldShow`, `prompt`, `promptDismissed` state
> - Render `<FacilitatorPromptCard>` before the main content
>
> Do NOT change any existing logic in any of these files. Confirm all four updated before Phase 4.

---

## Phase 4 — Journey-Adaptive Step Content

### PROMPT 4.1 — Adapt Step 1 content to journey

> Read `app/create/step-1-mood/page.tsx` in full again (it was modified in Phase 3).
>
> Currently the step shows hardcoded mood options. Update it to read from the journey content library.
>
> Add these imports:
> ```typescript
> import { JOURNEY_CONTENT } from '@/lib/journey/content';
> import { Journey } from '@/types';
> ```
>
> Inside the component, derive the content from the current journey:
> ```typescript
> const journey = (state.journey ?? 'feelings') as Journey;
> const stepContent = JOURNEY_CONTENT[journey].step1;
> const question = language === 'id' ? stepContent.question_id : stepContent.question_en;
> const options = stepContent.options.slice(0, 3); // always show max 3
> ```
>
> Replace the hardcoded question text with `{question}`.
> Replace the hardcoded options array with `options` from above.
>
> When an option is tapped, store `option.value` in `state.mood` exactly as before — no change to the save logic.
>
> The visual layout stays identical — same components, same tap target sizes. Only the data changes.
>
> Confirm before 4.2.

---

### PROMPT 4.2 — Create journey-options API route

> Create new file: `app/api/journey-options/route.ts`
>
> This route generates contextual step options using Gemini based on prior selections.
>
> ```typescript
> import { NextRequest, NextResponse } from 'next/server';
> import { GoogleGenerativeAI } from '@google/generative-ai';
> import { JOURNEY_CONTENT } from '@/lib/journey/content';
> import { Journey } from '@/types';
>
> const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
>
> // Fallback options if Gemini fails
> const FALLBACKS: Record<Journey, Record<2 | 3, Array<{id: string; label_en: string; label_id: string; emoji: string; value: string}>>> = {
>   feelings: {
>     2: [
>       { id: 'home',    label_en: 'At home',         label_id: 'Di rumah',          emoji: '🏠', value: 'at home' },
>       { id: 'someone', label_en: 'With someone',    label_id: 'Dengan seseorang',   emoji: '👫', value: 'with someone' },
>       { id: 'special', label_en: 'A special place', label_id: 'Tempat istimewa',    emoji: '🌟', value: 'a special place' },
>     ],
>     3: [
>       { id: 'warm',   label_en: 'Warm and bright', label_id: 'Hangat dan cerah',  emoji: '🌅', value: 'warm sunrise tones' },
>       { id: 'soft',   label_en: 'Soft and calm',   label_id: 'Lembut dan tenang', emoji: '🌿', value: 'soft greens' },
>       { id: 'bright', label_en: 'Bold and vivid',  label_id: 'Cerah dan hidup',   emoji: '✨', value: 'bright yellows' },
>     ],
>   },
>   world: {
>     2: [
>       { id: 'buildings',  label_en: 'Buildings',  label_id: 'Bangunan',  emoji: '🏢', value: 'buildings' },
>       { id: 'nature',     label_en: 'Nature',     label_id: 'Alam',      emoji: '🌳', value: 'nature' },
>       { id: 'transport',  label_en: 'Transport',  label_id: 'Transportasi', emoji: '🚌', value: 'transport' },
>     ],
>     3: [
>       { id: 'blue',  label_en: 'Steel blues',   label_id: 'Biru baja',  emoji: '🔵', value: 'steel blues and greys' },
>       { id: 'green', label_en: 'Fresh greens',  label_id: 'Hijau segar',emoji: '🟢', value: 'bright greens' },
>       { id: 'warm',  label_en: 'Warm evening',  label_id: 'Sore hangat',emoji: '🌇', value: 'warm evening tones' },
>     ],
>   },
>   sounds: {
>     2: [
>       { id: 'birds',     label_en: 'Birds',      label_id: 'Burung',      emoji: '🐦', value: 'birds' },
>       { id: 'traffic',   label_en: 'Traffic',    label_id: 'Lalu lintas', emoji: '🚗', value: 'traffic' },
>       { id: 'footsteps', label_en: 'Footsteps',  label_id: 'Langkah kaki',emoji: '👣', value: 'footsteps' },
>       { id: 'rain',      label_en: 'Rain',       label_id: 'Hujan',       emoji: '🌧️', value: 'rain' },
>       { id: 'music',     label_en: 'Music',      label_id: 'Musik',       emoji: '🎶', value: 'music' },
>       { id: 'scooter',   label_en: 'Scooter',    label_id: 'Skuter',      emoji: '🛵', value: 'scooter' },
>     ],
>     3: [
>       { id: 'busy',  label_en: 'Busy and energetic', label_id: 'Sibuk dan energik', emoji: '⚡', value: 'busy and energetic' },
>       { id: 'calm',  label_en: 'Calm and quiet',     label_id: 'Tenang dan sunyi',  emoji: '🌊', value: 'calm and quiet' },
>       { id: 'happy', label_en: 'Happy and warm',     label_id: 'Senang dan hangat', emoji: '☀️', value: 'happy and warm' },
>     ],
>   },
> };
>
> export async function POST(req: NextRequest) {
>   try {
>     const body = await req.json();
>     const { journey, step, step1_value, step2_value } = body as {
>       journey: Journey;
>       step: 2 | 3;
>       step1_value: string;
>       step2_value?: string;
>     };
>
>     if (!journey || !step || !step1_value) {
>       return NextResponse.json({ options: FALLBACKS[journey]?.[step] ?? [] });
>     }
>
>     const content = JOURNEY_CONTENT[journey];
>     const prefix = step === 2 ? content.step2_prefix : content.step3_prefix;
>     const filledPrefix = prefix
>       .replace('{step1_value}', step1_value)
>       .replace('{step2_value}', step2_value ?? '');
>
>     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
>     const result = await model.generateContent(filledPrefix);
>     const text = result.response.text().trim();
>
>     // Strip markdown fences if present
>     const clean = text.replace(/```json|```/g, '').trim();
>     const options = JSON.parse(clean);
>
>     // Validate it's an array with the right shape
>     if (!Array.isArray(options) || options.length === 0) {
>       throw new Error('Invalid options shape');
>     }
>
>     return NextResponse.json({ options: options.slice(0, journey === 'sounds' && step === 2 ? 6 : 3) });
>
>   } catch (err) {
>     console.error('journey-options error:', err);
>     const body = await req.json().catch(() => ({}));
>     const fallback = FALLBACKS[(body as any).journey]?.[(body as any).step] ?? [];
>     return NextResponse.json({ options: fallback });
>   }
> }
> ```
>
> Confirm route created before 4.3.

---

### PROMPT 4.3 — Adapt Step 2 to use journey-options API

> Read `app/create/step-2-colour/page.tsx` in full.
>
> Replace the hardcoded colour swatches with options fetched from `/api/journey-options`.
>
> Add these imports:
> ```typescript
> import { useEffect, useState } from 'react';
> import { JOURNEY_CONTENT } from '@/lib/journey/content';
> import { Journey } from '@/types';
> import { StepOption } from '@/lib/journey/content';
> ```
>
> Inside the component:
> ```typescript
> const journey = (state.journey ?? 'feelings') as Journey;
> const [options, setOptions] = useState<StepOption[]>([]);
> const [loading, setLoading] = useState(true);
> const isMultiSelect = journey === 'sounds'; // sounds step 2 is multi-select
> const [selected, setSelected] = useState<string[]>([]);
>
> useEffect(() => {
>   const fetchOptions = async () => {
>     setLoading(true);
>     try {
>       const res = await fetch('/api/journey-options', {
>         method: 'POST',
>         headers: { 'Content-Type': 'application/json' },
>         body: JSON.stringify({ journey, step: 2, step1_value: state.mood ?? '' }),
>       });
>       const data = await res.json();
>       setOptions(data.options);
>     } catch {
>       // Fallback handled by the API route itself
>     } finally {
>       setLoading(false);
>     }
>   };
>   fetchOptions();
> }, [journey, state.mood]);
> ```
>
> Loading state: show 3 skeleton buttons (`bg-ink/5 animate-pulse rounded-2xl h-16 w-full`) while loading.
>
> For non-multi-select (feelings, world step 2): tap option → `updateState({ colour_palette: option.value })` → advance to next step. Same behaviour as before.
>
> For multi-select (sounds step 2):
> - Tapping a chip toggles selection (max 3)
> - Selected chips: `border-2 border-teal-500 bg-teal-50`
> - A "Done →" button appears after at least 1 selection: `bg-signal text-ink font-semibold py-3 rounded-xl w-full mt-4`
> - On Done: `updateState({ colour_palette: selected.join(',') })` → advance to next step
>
> Replace hardcoded question text with journey-appropriate question from `JOURNEY_CONTENT[journey]`.
> For step 2, use a generic prompt since it's dynamically generated — use:
> - feelings: "Where do you feel this?"
> - world: "What do you see there?"
> - sounds: "Pick your sounds" (multi-select)
>
> Add these strings to `lib/journey/content.ts` as `step2_question_en` and `step2_question_id` fields on `JourneyContent` if not already present. If easier, hardcode them inline in this step file only.
>
> Confirm before 4.4.

---

### PROMPT 4.4 — Adapt Step 3 to use journey-options API

> Read `app/create/step-3-subject/page.tsx` in full.
>
> Apply the same pattern as PROMPT 4.3 but for Step 3:
> - Call `/api/journey-options` with `step: 3`, `step1_value: state.mood`, `step2_value: state.colour_palette`
> - Loading skeleton while fetching
> - On selection: `updateState({ subject: option.value })` → advance to next step
> - No multi-select for step 3 in any journey
>
> Step 3 questions:
> - feelings: "Pick your colours"
> - world: "Pick your colours"
> - sounds: "How do these sounds feel?"
>
> Confirm before 4.5.

---

### PROMPT 4.5 — Adapt Canvas step to journey sticker set

> Read `app/create/step-5-canvas/page.tsx` in full.
>
> Add these imports:
> ```typescript
> import { JOURNEY_CONTENT } from '@/lib/journey/content';
> import { Journey } from '@/types';
> ```
>
> Inside the component:
> ```typescript
> const journey = (state.journey ?? 'feelings') as Journey;
> const canvasConfig = JOURNEY_CONTENT[journey].canvas;
> const canvasPrompt = language === 'id' ? canvasConfig.prompt_id : canvasConfig.prompt_en;
> ```
>
> Make two changes:
> 1. Replace the hardcoded canvas prompt heading with `{canvasPrompt}` — display it as a large heading at the top of the canvas screen: `font-creator text-xl font-bold text-ink text-center mb-4`
> 2. Replace the hardcoded sticker array with `canvasConfig.stickers` — if `canvasConfig.stickers.length === 0` (sounds journey), hide the sticker panel entirely, show only the free-draw tools
>
> Do NOT change canvas drawing logic, save logic, or the Konva setup. Only change the prompt text and sticker data source.
>
> Confirm before Phase 5.

---

## Phase 5 — AI Prompt Builder Update

### PROMPT 5.1 — Check if creation_story is already being saved and displayed

> Before making any changes, answer these two questions:
>
> 1. In `app/api/save/route.ts` — is `creation_story` from the Gemini response currently being saved to the artworks table? Search for `creation_story` in this file.
>
> 2. In `app/create/step-8-result/page.tsx` — is `creation_story` currently being retrieved and displayed anywhere? Search for `creation_story` in this file.
>
> Report findings. Do not change anything yet.

---

### PROMPT 5.2 — Save creation_story if not already saved

> Only perform this step if PROMPT 5.1 confirmed `creation_story` is NOT being saved.
>
> Read `app/api/save/route.ts` in full. Find where the artwork insert payload is assembled.
>
> Add `creation_story` to the insert payload — it should come from `body.creation_story` (the save endpoint should already be receiving this from the create flow, or it will after this change).
>
> Also check `app/api/create/route.ts` or wherever the Gemini response is processed and the result is returned to the frontend. Confirm `creation_story` is included in the response to the client. If not, add it.
>
> Confirm before 5.3.

---

### PROMPT 5.3 — Display creation_story on result screens if not already shown

> Only perform this step if PROMPT 5.1 confirmed `creation_story` is NOT being displayed.
>
> In `app/create/step-8-result/page.tsx`, retrieve the `creation_story` from sessionStorage (it should be stored alongside the artwork URL) or from the API response.
>
> Add below the artwork image:
> ```jsx
> {creationStory && (
>   <p className="font-body text-sm text-muted italic text-center px-4 mt-2">
>     {creationStory}
>   </p>
> )}
> ```
>
> Apply the same to `app/create/step-9-print/page.tsx` and `app/create/step-9-shop-success/page.tsx`.
>
> Confirm before 5.4.

---

### PROMPT 5.4 — Add journey-specific system prompt prefix to Gemini image builder

> Read `lib/google-ai/index.ts` in full. Find `buildArtPrompt()`.
>
> Add a `JOURNEY_SYSTEM_PROMPTS` constant above the function:
> ```typescript
> const JOURNEY_SYSTEM_PROMPTS: Record<string, string> = {
>   feelings: 'Generate a gallery-grade abstract artwork that visually represents a personal emotional experience. Style: expressive, warm, emotionally resonant — like a visual diary entry. Personal and meaningful.',
>   world: 'Generate a neighbourhood heritage print — a stylised illustration of a familiar local environment. Style: clean and graphic, like a hand-illustrated city guide or travel poster. Include visual references to the landmarks described.',
>   sounds: 'Generate abstract visual cover art for an ambient music track. Style: flowing, rhythmic, abstract. The visual rhythm should mirror the described sound rhythm — fast and chaotic if energetic, slow and sweeping if calm.',
> };
> ```
>
> Inside `buildArtPrompt()`, prepend the journey system prompt to the existing user prompt:
> ```typescript
> const journeyPrefix = JOURNEY_SYSTEM_PROMPTS[selections.journey ?? 'feelings'];
> // Add journeyPrefix as the first line of the prompt string sent to Gemini
> ```
>
> Do not change any other part of `buildArtPrompt()`. The function signature, return type, and all other logic stay identical.
>
> Confirm before Phase 6.

---

## Phase 6 — Save Journey to Database

### PROMPT 6.1 — Save journey field on artwork and music track save

> Read `app/api/save/route.ts` in full.
>
> The SQL migration already added a `journey` column to `artworks`. Now add `journey: body.state?.journey ?? ''` to the Supabase insert payload alongside the other artwork fields.
>
> Read `app/api/save-music/route.ts` in full.
> Add `journey: body.journey ?? ''` to the music_tracks insert payload (check what field names are available in the music save body).
>
> Update `types/index.ts` if not already done in PROMPT 1.1: confirm `journey?: string` is present on both `Artwork` and `MusicTrack` interfaces.
>
> Confirm before Phase 7.

---

## Phase 7 — Organizer Dashboard Upgrades

### PROMPT 7.1 — Show journey, skills, and facilitator status in organizer queue

> Read `app/admin/dashboard/page.tsx` in full.
>
> For each pending submission in the queue, add three new display elements below the artwork image:
>
> 1. Journey badge — read `artwork.journey`, look up in `JOURNEY_META`:
> ```jsx
> import { JOURNEY_META, Journey } from '@/types';
>
> {artwork.journey && JOURNEY_META[artwork.journey as Journey] && (
>   <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
>     {JOURNEY_META[artwork.journey as Journey].emoji}
>     {JOURNEY_META[artwork.journey as Journey].label_en}
>   </span>
> )}
> ```
>
> 2. Skills chips — parse `artwork.learning_tags` using `storageStringToSkills` from `lib/learning/skills`:
> ```jsx
> import { storageStringToSkills } from '@/lib/learning/skills';
>
> const skills = storageStringToSkills(artwork.learning_tags ?? '').slice(0, 3);
> // Render each as a small pill — same mini chip style as gallery
> ```
>
> 3. Facilitator status badge:
> ```jsx
> <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
>   artwork.facilitator_id
>     ? 'bg-teal-100 text-teal-700'
>     : 'bg-amber-50 text-amber-600'
> }`}>
>   {artwork.facilitator_id ? '✅ Facilitator approved' : '⚠️ No facilitator'}
> </span>
> ```
>
> Confirm before 7.2.

---

### PROMPT 7.2 — Add Creation Story editor to organizer queue

> In the organizer queue item view, add a Creation Story editing section below the journey/skills badges.
>
> Use local component state for the textarea value:
> ```typescript
> const [editedStory, setEditedStory] = useState(artwork.creation_story ?? '');
> ```
>
> JSX:
> ```jsx
> <div className="mt-4">
>   <p className="font-body text-xs text-muted uppercase tracking-wide mb-1">Creation Story</p>
>   <textarea
>     value={editedStory}
>     onChange={(e) => setEditedStory(e.target.value)}
>     rows={3}
>     className="w-full font-body text-sm text-ink border border-ink/10 rounded-xl p-3 resize-none bg-surface"
>   />
>   <p className="font-body text-xs text-muted text-right mt-1">{editedStory.length} chars</p>
> </div>
> ```
>
> The textarea does NOT auto-save. The value is submitted when the organizer approves. Update the approve action to send `editedStory` to the server and save it to `artworks.creation_story` before setting `marketplace_status = 'approved'`.
>
> Confirm before 7.3.

---

### PROMPT 7.3 — Add pricing field to organizer queue

> In the same organizer queue item view, add a pricing section below the Creation Story editor.
>
> ```typescript
> const [price, setPrice] = useState(artwork.price_sgd ?? 0);
> ```
>
> JSX:
> ```jsx
> <div className="mt-3">
>   <p className="font-body text-xs text-muted uppercase tracking-wide mb-1">Set Price (SGD)</p>
>   <input
>     type="number"
>     value={price}
>     onChange={(e) => setPrice(Number(e.target.value))}
>     min={5}
>     max={500}
>     step={5}
>     className="font-body text-sm text-ink border border-ink/10 rounded-xl p-3 w-32 bg-surface"
>   />
>   <p className="font-body text-xs text-muted mt-1">Prints: $25–80 · Tote bags: $35–55 · Digital: $50–200</p>
> </div>
> ```
>
> Update the approve action to save `price` to `artworks.price_sgd` alongside the creation story update.
>
> Confirm before Phase 8.

---

## Phase 8 — Marketplace Listing Upgrades

### PROMPT 8.1 — Update marketplace listing cards

> Find the marketplace listing page — check `app/marketplace/page.tsx` or equivalent. Read it in full.
>
> For each approved artwork listing, add below the artwork image:
>
> 1. Creator attribution: `font-body text-sm font-medium text-ink` — "[First name] · [Organisation]"
>
> 2. Creation Story (if present): `font-body text-sm text-muted italic mt-1` — full text of `creation_story`
>
> 3. Journey + Skills row:
> ```jsx
> <div className="flex flex-wrap gap-1 mt-2">
>   {artwork.journey && JOURNEY_META[artwork.journey as Journey] && (
>     <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
>       {JOURNEY_META[artwork.journey as Journey].emoji} {JOURNEY_META[artwork.journey as Journey].label_en}
>     </span>
>   )}
>   {storageStringToSkills(artwork.learning_tags ?? '').slice(0, 2).map(skill => (
>     <span key={skill.id} className="bg-teal-50 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
>       {skill.emoji} {skill.label_en}
>     </span>
>   ))}
> </div>
> ```
>
> 4. Support badge:
> ```jsx
> <p className="font-body text-xs text-muted mt-2">
>   ❤️ This purchase supports {artwork.creator_name || 'a creator'}'s creative journey
> </p>
> ```
>
> 5. Price display — read `artwork.price_sgd`:
> ```jsx
> <p className="font-creator text-lg font-bold text-ink mt-2">
>   {artwork.price_sgd > 0 ? `SGD $${artwork.price_sgd}` : 'Price on request'}
> </p>
> ```
>
> Confirm before 8.2.

---

### PROMPT 8.2 — Add DE&I impact statement toggle on listing detail page

> Find the individual listing detail page — check `app/marketplace/[id]/page.tsx` or equivalent.
>
> Add a collapsible section at the bottom of the listing, below the purchase button:
>
> ```typescript
> const [impactOpen, setImpactOpen] = useState(false);
> ```
>
> ```jsx
> <div className="mt-6 border-t border-ink/10 pt-4">
>   <button
>     onClick={() => setImpactOpen(!impactOpen)}
>     className="font-body text-sm font-medium text-ink underline cursor-pointer"
>   >
>     {impactOpen ? '▲' : '▼'} About this artwork's impact
>   </button>
>
>   {impactOpen && (
>     <div className="mt-3 space-y-2">
>       <p className="font-body text-sm text-muted">
>         This artwork was created by an individual with an intellectual disability using SEA-Up Creative — an AI-powered learning platform that builds real vocational skills through creative expression.
>       </p>
>       <p className="font-body text-sm text-muted">
>         60% of this purchase goes directly to the creator. 20% supports the SEA-Up Community Fund, which onboards new creators across ASEAN.
>       </p>
>       <a
>         href="mailto:hello@sea-up.com"
>         className="font-body text-sm font-medium text-teal-600 underline"
>       >
>         Enquire about bulk licensing →
>       </a>
>     </div>
>   )}
> </div>
> ```
>
> Default: collapsed. Confirm before Phase 9.

---

## Phase 9 — End-to-End QA

### PROMPT 9.1 — Test: My Feelings, creator alone

> Without facilitator mode active, complete the full My Feelings journey end-to-end:
> 1. Home screen shows three journey cards (My Feelings / My World / My Sounds)
> 2. Tap "My Feelings" → routes to step 1
> 3. Step 1 shows "How are you feeling today?" with feelings-specific options
> 4. NO facilitator prompt card appears at any step
> 5. Step 2 shows Gemini-generated context options based on step 1 selection
> 6. Step 3 shows Gemini-generated colour options based on steps 1+2
> 7. Canvas opens with feelings sticker set (Face, Heart, Sun, Rain, Home, Tree, Star) and prompt "Draw what this feeling looks like"
> 8. Generation produces artwork within 15 seconds
> 9. Result screen shows artwork + creation story text + Skills Practiced card
> 10. Check Supabase artworks table — confirm `journey = 'feelings'`, `learning_tags` populated, `creation_story` populated
>
> Report any failures with exact step and error before proceeding.

---

### PROMPT 9.2 — Test: My World, facilitator mode

> Log in as facilitator, complete session setup, tap "Start Creation Flow".
> 1. Home screen appears — journey cards visible
> 2. Tap "My World"
> 3. At EVERY step before creator content loads, a facilitator prompt card appears with amber badge
> 4. Tap "Continue" on each card → creator content loads correctly
> 5. Step 1: "Where do you want to explore?" with world-specific options
> 6. Canvas shows world sticker set (Home, Bus Stop, MRT, School, Park, Shop, Favourite Place) and prompt "Let's draw your journey"
> 7. Result shows artwork + creation story + facilitator prompt card
> 8. Tap "Send to Shop" → submission appears in facilitator dashboard with journey badge, skills chips, and facilitator status badge
> 9. Facilitator approves → submission appears in organizer queue with Creation Story editor and pricing field populated
> 10. Organizer edits story, sets price, approves → listing goes live in marketplace with full display (story, journey, skills, support badge, price)
>
> Report any failures before proceeding.

---

### PROMPT 9.3 — Test: My Sounds, creator alone

> Complete the full My Sounds journey without facilitator:
> 1. Tap "My Sounds" → step 1 shows "Where are these sounds from?" with sounds-specific options
> 2. Step 2 shows 6 sound chips — tap 2–3, confirm multi-select works, "Done →" button appears
> 3. Step 3 shows emotional tone options (Busy / Calm / Happy)
> 4. Canvas opens with free-draw only — NO sticker panel visible
> 5. Generation produces music track + cover art within 55 seconds
> 6. Result screen shows music player + creation story + Skills Practiced card
> 7. Check Supabase music_tracks table — confirm `journey = 'sounds'`, `learning_tags` populated, `creation_story` populated
>
> Report any failures before proceeding.

---

### PROMPT 9.4 — Mobile QA at 390px

> Using browser devtools mobile emulation at 390px width, verify:
> - Journey selection cards do not overflow horizontally
> - All tap targets are minimum 72px height
> - Facilitator prompt card overlay covers full screen with no overflow
> - Canvas is usable with simulated touch
> - Step 2 multi-select chips for sounds journey wrap cleanly
> - Result screen Skills card does not overflow
> - Marketplace listing displays correctly on mobile
>
> Report any visual issues.

---

### PROMPT 9.5 — Bahasa Indonesia QA

> Switch language to Bahasa Indonesia on the home screen. Verify every new string shows correct ID translation:
> - Journey card labels ("Perasaan Saya", "Dunia Saya", "Suara Saya") and taglines
> - Step 1 questions per journey
> - Canvas prompt text per journey
> - Facilitator prompt card ("Panduan Fasilitator", "Lanjutkan →")
> - Facilitator session setup instructional line
> - Skills Practiced card strings
>
> Report any English strings appearing in ID mode.

---

### PROMPT 9.6 — Update BUILD_STATE.md

> Update `BUILD_STATE.md` to mark all tasks from this build spec as complete.
>
> Add a new Phase 9 (future) to the Build Queue:
> ```
> ### Phase 9 — Phase 2 Features (Post-Contest)
> - [ ] 9.1 Print for myself — Printful POD API integration
> - [ ] 9.2 Real marketplace payments — Stripe (Singapore) + Xendit (Indonesia)
> - [ ] 9.3 Creator payout system — 60/20/20 automated distribution
> - [ ] 9.4 Voice input — Bahasa Indonesia Speech-to-Text
> - [ ] 9.5 Video creation — Google Veo integration
> - [ ] 9.6 Two-device facilitator mode (Option B) — real-time Supabase sync
> ```
>
> Add session notes documenting:
> - Journey content library created at `lib/journey/content.ts`
> - Journey-options API route created at `app/api/journey-options/route.ts`
> - FacilitatorPromptCard component created at `components/facilitator/FacilitatorPromptCard.tsx`
> - `useFacilitatorPrompt` hook created at `hooks/useFacilitatorPrompt.ts`
> - SQL migrations run: creation_story, journey, price_sgd columns on artworks; creation_story on music_tracks
