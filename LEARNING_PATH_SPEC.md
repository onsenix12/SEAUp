# LEARNING_PATH_SPEC.md
> This file is the single source of truth for the Learning Path feature build.
> Read this entire file before writing any code.
> Work through tasks in strict numerical order.
> After completing each task, confirm what was done before moving to the next.

---

## What We Are Building

Every step in the SEA-Up creation flow already captures data that maps to a cognitive skill. We are not changing the creation flow. We are making the educational value **visible** — to the creator, to the facilitator, and to the artwork record in the database.

**Five surfaces to update:**
1. A pure skill-mapping utility (`lib/learning/skills.ts`)
2. The database — add `learning_tags` column to `artworks` and `music_tracks`
3. The image result screens — show "Skills Practiced Today" card
4. The creator gallery — show mini skill chips on each artwork card
5. The facilitator dashboard — show session summary with aggregate skills
6. The music result screen — same skills card as image result

---

## Before You Start

Run these checks first and report back:

```bash
# Confirm the file structure we are working with
ls app/create/
ls app/music/
ls app/facilitator/
ls app/gallery/
ls lib/
ls components/
ls contexts/
```

Then read these files in full before touching anything:
- `types/index.ts`
- `contexts/CreationFlowContext.tsx`
- `contexts/FacilitatorContext.tsx`
- `app/create/step-9-print/page.tsx`
- `app/create/step-9-shop-success/page.tsx`
- `app/api/save/route.ts`

Report the actual file paths for:
- The music result/success page
- The music save API route
- The creator gallery page
- The facilitator dashboard page

Do not proceed until you have confirmed all paths above.

---

## Task 1 — Create the Skill Mapping Utility

**Create file:** `lib/learning/skills.ts`

This is a pure TypeScript module. No React imports. No side effects. No API calls.

```typescript
import { CreationFlowState } from "@/types";

export interface LearningSkill {
  id: string;
  label_en: string;
  label_id: string;
  emoji: string;
  domain: "emotional" | "spatial" | "auditory" | "creative";
}

export const SKILL_MAP: Record<string, LearningSkill> = {
  emotional_expression: {
    id: "emotional_expression",
    label_en: "Emotional Expression",
    label_id: "Ekspresi Emosi",
    emoji: "😊",
    domain: "emotional",
  },
  colour_association: {
    id: "colour_association",
    label_en: "Colour Association",
    label_id: "Asosiasi Warna",
    emoji: "🎨",
    domain: "creative",
  },
  spatial_reasoning: {
    id: "spatial_reasoning",
    label_en: "Spatial Reasoning",
    label_id: "Penalaran Spasial",
    emoji: "🗺️",
    domain: "spatial",
  },
  wayfinding: {
    id: "wayfinding",
    label_en: "Wayfinding",
    label_id: "Navigasi",
    emoji: "📍",
    domain: "spatial",
  },
  sound_discrimination: {
    id: "sound_discrimination",
    label_en: "Sound Discrimination",
    label_id: "Diskriminasi Suara",
    emoji: "🎵",
    domain: "auditory",
  },
  sequencing: {
    id: "sequencing",
    label_en: "Sequencing",
    label_id: "Pengurutan",
    emoji: "🔢",
    domain: "spatial",
  },
  creative_choice: {
    id: "creative_choice",
    label_en: "Creative Choice",
    label_id: "Pilihan Kreatif",
    emoji: "✨",
    domain: "creative",
  },
};

/** Derive skills from an image creation session */
export function deriveImageSkills(state: CreationFlowState): LearningSkill[] {
  const skills: LearningSkill[] = [];

  if (state.mood) skills.push(SKILL_MAP.emotional_expression);
  if (state.colour_palette) skills.push(SKILL_MAP.colour_association);
  if (state.canvas_base64) {
    skills.push(SKILL_MAP.spatial_reasoning);
    skills.push(SKILL_MAP.wayfinding);
  }
  if (state.subject) {
    // Only add if not already included
    if (!skills.find((s) => s.id === "creative_choice")) {
      skills.push(SKILL_MAP.creative_choice);
    }
  }
  if (state.photo_base64) {
    if (!skills.find((s) => s.id === "creative_choice")) {
      skills.push(SKILL_MAP.creative_choice);
    }
  }

  // Fallback — always return at least one skill
  if (skills.length === 0) return [SKILL_MAP.creative_choice];

  return skills;
}

/** Derive skills from a music creation session */
export function deriveMusicSkills(
  soundChoices: string[],
  hasRhythm: boolean
): LearningSkill[] {
  const skills: LearningSkill[] = [SKILL_MAP.creative_choice];

  if (soundChoices.length > 0) skills.push(SKILL_MAP.sound_discrimination);
  if (hasRhythm) skills.push(SKILL_MAP.sequencing);

  return skills;
}

/** Convert skill array to comma-separated string for DB storage */
export function skillsToStorageString(skills: LearningSkill[]): string {
  return skills.map((s) => s.id).join(",");
}

/** Parse comma-separated skill IDs back to LearningSkill objects */
export function storageStringToSkills(stored: string): LearningSkill[] {
  if (!stored || stored.trim() === "") return [];
  return stored
    .split(",")
    .map((id) => SKILL_MAP[id.trim()])
    .filter(Boolean);
}
```

**Confirm Task 1 complete** before moving to Task 2.

---

## Task 2 — Database Migration

### 2a — Add column to artworks table

Run this in the **Supabase SQL Editor** (not via code — do it manually and confirm):

```sql
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS learning_tags TEXT DEFAULT '';
```

### 2b — Add column to music_tracks table

```sql
ALTER TABLE music_tracks ADD COLUMN IF NOT EXISTS learning_tags TEXT DEFAULT '';
```

### 2c — Update TypeScript types

Edit `types/index.ts`:

In the `Artwork` interface, add:
```typescript
learning_tags?: string;
```

In the `Session` interface, add:
```typescript
learning_domains?: string;
```

Check whether a `MusicTrack` interface exists in `types/index.ts`. If it does, add `learning_tags?: string` to it. If it does not exist yet, do not create it now — we will handle it in Task 6.

**Confirm Task 2 complete** — verify in Supabase table editor that both columns exist.

---

## Task 3 — Save Skills at Image Creation Time

**Edit file:** `app/api/save/route.ts`

Read the current file first. Find the section where the artwork record is built before being inserted into Supabase.

Add the following:
1. Import at the top of the file:
```typescript
import { deriveImageSkills, skillsToStorageString } from "@/lib/learning/skills";
```

2. Before the Supabase insert, derive and convert the skills:
```typescript
const skills = deriveImageSkills(body.state ?? {});
const learningTagsString = skillsToStorageString(skills);
```

3. Add `learning_tags: learningTagsString` to the Supabase insert payload alongside the other artwork fields.

**Do not change anything else in this file.** Only add what is listed above.

**Confirm Task 3 complete** — create one test artwork via the live app and verify the `learning_tags` column is populated in the Supabase artworks table.

---

## Task 4 — Create the SkillsCard Component

**Create file:** `components/learning/SkillsCard.tsx`

```typescript
"use client";

import { LearningSkill } from "@/lib/learning/skills";

interface SkillsCardProps {
  skills: LearningSkill[];
  language: "en" | "id";
  creatorName?: string;
}

const DOMAIN_STYLES: Record<string, string> = {
  emotional: "bg-amber-100 text-amber-800",
  spatial: "bg-teal-100 text-teal-800",
  auditory: "bg-purple-100 text-purple-800",
  creative: "bg-yellow-100 text-yellow-800",
};

export default function SkillsCard({
  skills,
  language,
  creatorName,
}: SkillsCardProps) {
  const heading =
    language === "id" ? "Keterampilan hari ini" : "Skills practiced today";
  const subline =
    creatorName
      ? language === "id"
        ? `Sesi yang bagus, ${creatorName}!`
        : `Great session, ${creatorName}!`
      : null;
  const footer =
    language === "id"
      ? "Setiap pilihan yang kamu buat membangun keterampilan nyata."
      : "Each choice you made built a real skill.";

  return (
    <div
      role="region"
      aria-label="Learning outcomes"
      className="w-full bg-surface border border-ink/10 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🏆</span>
        <div>
          <p className="font-creator text-lg font-bold text-ink leading-tight">
            {heading}
          </p>
          {subline && (
            <p className="font-body text-sm text-muted">{subline}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((skill) => (
          <span
            key={skill.id}
            aria-label={`${skill.label_en} skill practiced`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              DOMAIN_STYLES[skill.domain] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            <span aria-hidden="true">{skill.emoji}</span>
            {language === "id" ? skill.label_id : skill.label_en}
          </span>
        ))}
      </div>

      <p className="font-body text-xs text-muted mt-3">{footer}</p>
    </div>
  );
}
```

**Confirm Task 4 complete** before moving to Task 5.

---

## Task 5 — Insert SkillsCard into Image Result Screens

We need to add the SkillsCard to both post-creation screens. Read each file before editing.

### 5a — Edit `app/create/step-9-print/page.tsx`

Add these imports:
```typescript
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { deriveImageSkills } from "@/lib/learning/skills";
import SkillsCard from "@/components/learning/SkillsCard";
```

In the component body, after the existing hook calls, add:
```typescript
const { state } = useCreationFlow();
const { language } = useLanguage();
const { sessionData } = useFacilitator();
const skills = deriveImageSkills(state);
```

In the JSX, place `<SkillsCard>` **below the artwork image** and **above the action buttons**:
```jsx
<SkillsCard
  skills={skills}
  language={language}
  creatorName={sessionData.isActive ? sessionData.creatorName : undefined}
/>
```

### 5b — Repeat the same pattern for `app/create/step-9-shop-success/page.tsx`

Identical imports and identical JSX insertion — below the artwork, above the buttons.

**Check for conflicts:** If either file already imports any of these hooks, do not add duplicate imports. Just add what is missing.

**Confirm Task 5 complete** — visually verify on mobile (390px) that the card renders without overflow on both screens.

---

## Task 6 — Skill Tags on Gallery Artwork Cards

Read the gallery page file first to understand the current artwork card structure.

Find where artworks are fetched from Supabase. Ensure `learning_tags` is included in the select query. If the query uses `select('*')` it is already included. If it selects specific columns, add `learning_tags`.

Find the artwork card JSX. After the artwork image, add mini skill chips:

```typescript
import { storageStringToSkills } from "@/lib/learning/skills";

// Inside the card render:
const miniSkills = storageStringToSkills(artwork.learning_tags ?? "");
const displaySkills = miniSkills.slice(0, 2);
const remaining = miniSkills.length - 2;

const MINI_DOMAIN_STYLES: Record<string, string> = {
  emotional: "bg-amber-100 text-amber-800",
  spatial: "bg-teal-100 text-teal-800",
  auditory: "bg-purple-100 text-purple-800",
  creative: "bg-yellow-100 text-yellow-800",
};
```

JSX to add below the artwork image, inside each card:
```jsx
{displaySkills.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-2">
    {displaySkills.map((skill) => (
      <span
        key={skill.id}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          MINI_DOMAIN_STYLES[skill.domain] ?? "bg-gray-100 text-gray-700"
        }`}
      >
        <span aria-hidden="true">{skill.emoji}</span>
        {skill.label_en}
      </span>
    ))}
    {remaining > 0 && (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-ink/5 text-muted">
        +{remaining}
      </span>
    )}
  </div>
)}
```

**Confirm Task 6 complete.**

---

## Task 7 — Facilitator Session Summary

Read `app/facilitator/dashboard/page.tsx` in full before editing.

Add a Session Summary card **at the top of the dashboard**, above the existing Organizer Queue. Only render it when `sessionData.isActive === true`.

### Fetch artworks for the session

Add a Supabase query to get artworks created in the current session. Use `sessionData.sessionStartTime` converted to ISO string as a `created_at` filter:

```typescript
const sessionStartISO = new Date(sessionData.sessionStartTime).toISOString();

const { data: sessionArtworks } = await supabase
  .from("artworks")
  .select("learning_tags, created_at")
  .eq("facilitator_id", sessionData.facilitatorId)
  .gte("created_at", sessionStartISO);
```

If this is inside a client component, use a `useEffect` with `useState` to hold the data. If the dashboard is a server component, restructure appropriately based on the current file pattern.

### Aggregate skills

```typescript
import { storageStringToSkills } from "@/lib/learning/skills";

const allTags = (sessionArtworks ?? [])
  .flatMap((a) => storageStringToSkills(a.learning_tags ?? ""))
  .filter(
    (skill, index, self) =>
      index === self.findIndex((s) => s.id === skill.id)
  ); // deduplicate by id
```

### Session Summary card JSX

```jsx
{sessionData.isActive && (
  <div className="bg-surface border border-ink/10 rounded-2xl p-5 mb-6">
    <p className="font-creator text-xl font-bold text-ink mb-4">
      {language === "id" ? "Sesi Sedang Berlangsung" : "Session in Progress"}
    </p>

    <div className="space-y-2 font-body text-sm text-ink">
      <div className="flex justify-between">
        <span className="text-muted">Creator</span>
        <span className="font-medium">{sessionData.creatorName || "—"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted">Organisation</span>
        <span className="font-medium">{sessionData.organisation || "—"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted">Duration</span>
        <span className="font-medium">
          {Math.floor((Date.now() - sessionData.sessionStartTime) / 60000)} min
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted">Artworks made</span>
        <span className="font-medium">{sessionArtworks?.length ?? 0}</span>
      </div>
    </div>

    {allTags.length > 0 && (
      <div className="mt-4">
        <p className="font-body text-xs text-muted mb-2">
          {language === "id" ? "Keterampilan sesi ini" : "Skills this session"}
        </p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
            >
              {skill.emoji} {language === "id" ? skill.label_id : skill.label_en}
            </span>
          ))}
        </div>
      </div>
    )}

    <button
      onClick={endSession}
      className="mt-5 bg-ink text-canvas font-body font-semibold px-4 py-2 rounded-xl text-sm"
    >
      {language === "id" ? "Akhiri Sesi" : "End Session"}
    </button>
  </div>
)}
```

**Confirm Task 7 complete.**

---

## Task 8 — Music Flow: Derive and Save Skills

### 8a — Find the music result page

From the file listing you did at the start, identify the music result/success page path. Read it in full.

Identify what state is available on that page:
- The list of selected sound chip IDs (likely from context or sessionStorage)
- Whether a rhythm was tapped (boolean)

If this data is not available on the result page, check the music context or the API response — find where it lives and pass it through.

### 8b — Add SkillsCard to music result page

Same pattern as Task 5:
```typescript
import { deriveMusicSkills } from "@/lib/learning/skills";
import SkillsCard from "@/components/learning/SkillsCard";

// Derive from available state — adjust variable names to match actual code
const skills = deriveMusicSkills(soundChoices ?? [], hasRhythm ?? false);
```

Insert `<SkillsCard skills={skills} language={language} creatorName={...} />` below the audio player, above the action buttons.

### 8c — Save skills in music save API route

Find the music save API route. Read it in full.

Add:
```typescript
import { deriveMusicSkills, skillsToStorageString } from "@/lib/learning/skills";
```

Before the Supabase insert, add:
```typescript
const skills = deriveMusicSkills(body.soundChoices ?? [], body.hasRhythm ?? false);
const learningTagsString = skillsToStorageString(skills);
```

Add `learning_tags: learningTagsString` to the insert payload.

**Check:** Does the music save API receive `soundChoices` and `hasRhythm` in the request body? If not, check what data is sent and adjust the derivation accordingly — use whatever sound-related data is available.

**Confirm Task 8 complete.**

---

## Final Checklist

Run through every item before ending the session:

```
[ ] lib/learning/skills.ts — created, all exports present
[ ] artworks table — learning_tags column confirmed in Supabase
[ ] music_tracks table — learning_tags column confirmed in Supabase
[ ] types/index.ts — Artwork and Session interfaces updated
[ ] app/api/save/route.ts — skills saved on image creation
[ ] components/learning/SkillsCard.tsx — created
[ ] step-9-print/page.tsx — SkillsCard inserted
[ ] step-9-shop-success/page.tsx — SkillsCard inserted
[ ] Gallery page — mini skill chips on artwork cards
[ ] Facilitator dashboard — session summary with aggregate skills
[ ] Music result page — SkillsCard inserted
[ ] Music save route — learning_tags saved
[ ] All UI renders without overflow at 390px
[ ] Bahasa Indonesia strings render correctly on all new components
```

Update `BUILD_STATE.md` when done — mark tasks 8.1–8.8 as complete and note any architectural decisions made during this session.
