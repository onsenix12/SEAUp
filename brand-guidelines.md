# brand-guidelines.md — SEA-Up Creative

> **Read this before building any UI component.**
> Every visual decision — colour, type, spacing, motion — traces back to this document.
> When in doubt: does this feel like a gallery that came alive? If yes, proceed.

---

## 1. Design Philosophy

SEA-Up Creative exists at a precise intersection: the rigour of technology and the soul of human creativity. The visual language must hold both without contradiction.

The structural reference is **Nothing Phone's Playground** — a product that treats technology itself as beautiful. Precise grids. Dot-matrix textures. Monospace as decoration. Off-white as the universal canvas. A single electric accent that cuts through everything.

The colour reference is **HERALBONY** — a platform where the art is the only thing with permission to be loud. The chrome is always quiet. The artwork always explodes. Negative space is not absence — it is the frame that makes the art impossible to ignore.

The synthesis: **Nothing's bones. HERALBONY's soul.**

---

## 2. Two Design Modes (Critical Distinction)

This platform has two distinct audiences. Their interfaces share a DNA but serve it differently.

### Mode A — Marketplace (Buyers, Corporates, Gift Purchasers)
**Tone:** Gallery-grade. Editorial. Restrained luxury.
**Principle:** The artwork is the only colour allowed to be loud. Every UI element serves as a quiet frame. A corporate buyer from Singapore or Jakarta should feel they are browsing something that belongs next to HERALBONY and MoMA.
- Base is near-white. Chrome is minimal.
- Art bleeds full-width. No borders around images.
- Typography is editorial — large, confident headings; small precise body text.
- Colour accent (Signal Yellow) appears only on interactive CTAs.
- Pixel/dot textures appear as subtle background detail only.

### Mode B — Creator App (ID Individuals, Facilitated Sessions)
**Tone:** Warm. Tactile. Joyful without being childish.
**Principle:** Colour IS the interface, but anchored on a unified gallery frame. The screen remains grounded on the universal Canvas off-white and dot texture. Selected colours fill the large interactive cards and essential UI elements, bringing the screen to life while keeping the background consistent. The app should feel like picking up a paint brush — responsive, immediate, alive.
- Background uses the same universal Canvas and dot-grid as the Marketplace. High-energy colours are expressed through foreground interactives (cards, buttons, swatches).
- Large, rounded tap targets. Nothing requires reading. Minimum tap target is rigorously 72px.
- The pixel dot texture becomes animated — it breathes during generation.
- Typography rests entirely on `Outfit` — bolded for friendly, accessible headings without needing a completely different font family.
- Every completed artwork feels like a poster, not a screenshot.
- Primary CTA buttons use the same Signal Yellow as the marketplace to build global continuity.

---

## 3. Colour Palette

### Foundation (Both Modes)
```
--color-canvas:     #F4F3EF   /* Nothing's off-white — the universal base */
--color-ink:        #1C1C1A   /* Near-black — headlines, primary text */
--color-ink-muted:  #6B6B65   /* Secondary text, labels, metadata */
--color-border:     #E2E1DC   /* Dividers, subtle containers */
--color-surface:    #FFFFFF   /* Cards, elevated surfaces */
```

### Signal Accent (Use Sparingly — CTAs, Key Interactions Only)
```
--color-signal:     #F5C800   /* Nothing Yellow — electric, precise */
--color-signal-dim: #F5C80026 /* 15% opacity — hover states, backgrounds */
```

### Creator Palette (Mode B — Each fills the screen when selected)
These are the colours an ID creator chooses from. They map to Mood/Colour selections.

```
--color-joy:        #FF6B35   /* Warm coral-orange — Happy / Energetic */
--color-calm:       #4A90D9   /* Sky blue — Calm / Peaceful */
--color-wonder:     #7B5EA7   /* Soft violet — Curious / Dreamy */
--color-nature:     #3D9970   /* Forest green — Nature / Grounded */
--color-warmth:     #F7A34B   /* Amber — Cosy / Loved */
--color-bold:       #E63946   /* Vivid red — Excited / Bold */
```

### Marketplace Accent Dots (HERALBONY signature — section markers only)
```
--dot-blue:   #2563EB
--dot-yellow: #F5C800
--dot-red:    #E63946
```
Used exclusively as the `●●●` three-dot section markers. Never as fill, never as background.

### Tailwind Config Extension
```javascript
// tailwind.config.js
extend: {
  colors: {
    canvas:  '#F4F3EF',
    ink:     '#1C1C1A',
    muted:   '#6B6B65',
    border:  '#E2E1DC',
    signal:  '#F5C800',
    joy:     '#FF6B35',
    calm:    '#4A90D9',
    wonder:  '#7B5EA7',
    nature:  '#3D9970',
    warmth:  '#F7A34B',
    bold:    '#E63946',
  }
}
```

---

## 4. Typography

### Display / Headings — `DM Serif Display`
```
import { DM_Serif_Display } from 'next/font/google'
```
- Use for: Hero headlines, artwork titles, gallery headings
- Weights: 400 (regular) only — this font doesn't need bold
- Character: Editorial, confident, slightly literary. The HERALBONY headline feeling.
- Sizes: `text-5xl` (48px) hero / `text-3xl` (30px) section / `text-xl` (20px) card title

### UI / Body — `Outfit`
```
import { Outfit } from 'next/font/google'
```
- Use for: All navigation, body copy, labels, buttons, metadata
- Weights: 300 (light), 400 (regular), 600 (semibold)
- Character: Geometric, clean, slightly rounded. Modern without being cold.
- Sizes: `text-base` (16px) body / `text-sm` (14px) labels / `text-xs` (12px) metadata

### Mono Accent — `DM Mono`
```
import { DM_Mono } from 'next/font/google'
```
- Use for: Technical labels, step counters (`01 / 06`), timestamp displays, section tags (the `■ ABOUT` HERALBONY style)
- Weight: 400 only
- Character: The Nothing Phone tech DNA. Signals precision and authenticity.
- Sizes: `text-xs` (12px) to `text-sm` (14px) only — never large

### Creator App Typography Override (Mode B)
- Headings: `Outfit` (700 bold) — Highly legible for ID users, but shares the same visual family as the rest of the brand. (We dropped Nunito to unify the design).
- Body: `Outfit` 400 — same, maintains consistency.
- No monospace in creator flow — it reads as cold for ID users.

```javascript
// Use className conditionally:
// Marketplace: font-display (DM Serif Display)
// Creator app: font-creator (Outfit, mapped explicitly)
```

---

## 5. Grid & Spacing

### The Nothing Grid
Borrowed directly from Nothing Playground: a precise dot-cross grid as background texture on key surfaces.

```css
/* Dot grid background — subtle, 2% opacity */
.bg-dot-grid {
  background-image: radial-gradient(circle, #1C1C1A 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.04;
}

/* Crosshair corner markers — Nothing's signature + marks */
.corner-mark::before {
  content: '+';
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: var(--color-ink-muted);
  opacity: 0.3;
}
```

### Spacing Scale
Follow Tailwind's default scale. Key values:
- Section padding: `py-20` (80px) desktop / `py-12` (48px) mobile
- Card padding: `p-6` (24px)
- Tap target minimum: `min-h-[72px] min-w-[72px]` (non-negotiable for Creator App)
- Gallery gutter: `gap-3` (12px) — tight, editorial

### Layout
- Max content width: `max-w-5xl` (1024px) — narrower than typical, forces elegant density
- Mobile base: 390px, single column always
- No sidebars in Creator App — ever

---

## 6. Iconography & Visual Marks

### The Section Marker (HERALBONY-inspired)
```tsx
// Used before every section label — marketplace only
<span className="inline-flex gap-1 mr-2">
  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C800]" />
  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
</span>
```

### Step Counter (Creator App — Nothing-inspired)
```tsx
// Progress through creation steps
<span className="font-mono text-xs text-muted tracking-widest">
  {String(currentStep).padStart(2, '0')} / 06
</span>
```

### Loading Animation — The Pixel Breath
The dot-matrix grid animates during AI generation. Individual dots pulse in a wave pattern — referencing both Nothing's Glyph lights and HERALBONY's artwork being "painted" into existence.

```css
@keyframes pixel-pulse {
  0%, 100% { opacity: 0.08; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.4); }
}

/* Apply with staggered animation-delay across dot grid */
.pixel-dot {
  animation: pixel-pulse 1.8s ease-in-out infinite;
}
```

### Artwork Cards
- No border. No shadow. Art bleeds to card edge.
- On hover (marketplace): `scale(1.01)` + `shadow-lg` — subtle lift, gallery reveal feeling
- Creator gallery: slight rotation offset (`rotate-[-0.5deg]`) on every other card — feels hand-placed, not digital

---

## 7. Motion Principles

### Marketplace
- Entrance: staggered fade-up on scroll (`translateY(20px)` → `translateY(0)`, `opacity: 0` → `1`, 400ms, `ease-out`)
- Art reveal: artwork images load with a brief desaturate-to-colour transition (400ms) — the painting "coming alive"
- CTA hover: Signal Yellow button gets a pixel-ripple fill effect

### Creator App
- Step transitions: slide-up + cross-fade (200ms) — fast, responsive, never sluggish
- Choice tap: immediate scale-down `scale(0.96)` on tap + colour fill of selected state (instant feedback matters for ID users — 0ms delay)
- Generation screen: pixel-breath animation starts immediately — never a blank screen
- Artwork reveal: fade-in over 800ms with a very subtle scale from `scale(0.98)` — feels like a Polaroid developing

### Rules
- No animations longer than 800ms in the creator flow
- All animations respect `prefers-reduced-motion`
- Never animate text — only containers and images

---

## 8. Component Patterns

### Glass Surface — Marketplace only, over artwork backgrounds
```css
.glass-card {
  background: rgba(244, 243, 239, 0.72);   /* canvas at 72% */
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 
    0 4px 24px rgba(28, 28, 26, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.6);
}

/* Glass Dark — for overlays on colourful artwork */
.glass-card-dark {
  background: rgba(28, 28, 26, 0.55);
  backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

**When to use glass:**
- Creator story card overlaid on hero artwork ✅
- "Buy this piece" CTA floating over artwork detail ✅
- Navigation bar on scroll (subtle) ✅
- Base page background ❌
- Creator app tap targets ❌
- Any surface not over an image ❌

### Primary Button (Signal Yellow CTA)
```tsx
<button className="
  bg-signal text-ink font-semibold text-sm tracking-wide
  px-6 h-[48px] min-w-[48px]
  hover:bg-signal/90 active:scale-[0.98]
  transition-all duration-150
">
  Let's make something
</button>
```

### Creator Choice Card (Mode B — tap target)
```tsx
<button className="
  min-h-[72px] min-w-[72px] w-full
  rounded-2xl border-2 border-border
  flex flex-col items-center justify-center gap-2
  bg-surface
  active:scale-[0.96] active:border-signal
  transition-all duration-100
  touch-manipulation
">
  {/* Icon + label — always image first, text optional */}
</button>
```

### Artwork Card (Marketplace)
```tsx
<article className="group cursor-pointer">
  <div className="overflow-hidden aspect-square bg-border">
    <img className="
      w-full h-full object-cover
      group-hover:scale-[1.02] transition-transform duration-500
    " />
  </div>
  <div className="mt-3">
    <p className="font-mono text-xs text-muted tracking-widest uppercase">
      {artistName}
    </p>
    <h3 className="font-display text-lg mt-0.5">{title}</h3>
  </div>
</article>
```

### Section Label (Marketplace — HERALBONY style)
```tsx
<div className="flex items-center gap-2 mb-6">
  <DotMarker /> {/* ●●● three dots */}
  <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
    {label}
  </span>
</div>
```

---

## 9. Do Not

| ❌ Never | ✅ Instead |
|---|---|
| Purple or pink gradients | Signal yellow on near-white |
| Drop shadows on artwork | Full-bleed, borderless images |
| Rounded pill buttons in marketplace | Sharp-cornered or minimal-rounded (4px max) |
| All-caps body text | All-caps ONLY in mono labels, max 12px |
| Text prompts or inputs in creator flow | Visual cards, icons, colour swatches only |
| Skeleton loaders | Pixel-breath dot animation |
| Generic spinner (circle) | Nothing-style glyph/dot matrix animation |
| Emojis in UI | Custom SVG icons or Lucide |
| Coloured backgrounds replacing the screen | `#F4F3EF` canvas only — art and tap targets provide colour |

---

## 10. Tailwind Configuration Summary

```javascript
// tailwind.config.js — full extension block
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas:  '#F4F3EF',
        ink:     '#1C1C1A',
        muted:   '#6B6B65',
        border:  '#E2E1DC',
        surface: '#FFFFFF',
        signal:  '#F5C800',
        // Creator palette
        joy:     '#FF6B35',
        calm:    '#4A90D9',
        wonder:  '#7B5EA7',
        nature:  '#3D9970',
        warmth:  '#F7A34B',
        bold:    '#E63946',
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
        creator: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'creator': '20px', // Creator app cards — accessible, strict minimum 72px targets
        'market':  '4px',  // Marketplace — editorial, precise
      },
    },
  },
}
```

---

## 11. The Antigravity Agent Summary

When building UI components, the agent should answer these three questions before writing a single className:

1. **Which mode?** Marketplace (`font-display`, `rounded-market`, no colour except Signal) or Creator App (`font-creator`, `rounded-creator`, full colour palette)?
2. **Is this a tap target?** If yes: `min-h-[72px] min-w-[72px]`, `touch-manipulation`, `active:scale-[0.96]`
3. **Does this replace a blank screen?** If yes: pixel-breath animation must be running before any async call completes

When unsure about a visual decision, ask: *does this let the artwork speak, or does it compete with it?* If it competes — simplify.
