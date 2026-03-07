# SEA-Up Creative 🎨

SEA-Up Creative is an AI-powered creative platform built from the ground up for people with intellectual disabilities (ID) across ASEAN. It enables ID individuals to produce artworks through guided visual choices — without text prompts — and displays them in a personal gallery. A mock marketplace preview shows where the platform will lead in the future.

This project was built for a pilot at **MINDS Singapore**. 

## The Problem & Solution
Across ASEAN, an estimated 7 million people live with intellectual disabilities. In Indonesia alone, there are 2.8 million. The current creative tools powered by Generative AI (like Midjourney or DALL-E) are inaccessible to them due to complex text-prompting interfaces and high cognitive barriers. 

SEA-Up Creative solves this by providing a highly tactile, visual-first interface where creators choose moods, colours, and subjects. AI (Google Gemini + Imagen 3) acts purely as an amplifier, translating their intent into gallery-grade visual outputs.

## Principles & Design Mode
- **No text input** required in the creation flow.
- **Large tap targets** (min 72x72px).
- **Maximum 3 choices** per screen.
- **Visual-first** navigation.
- **Nothing's bones, HERALBONY's soul**: The UI structure borrows from Nothing's tech precision (dot grids, monospace), while the color and energy come from the artwork itself (inspired by HERALBONY).

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Database / Auth / Storage**: Supabase (PostgreSQL)
- **AI Infrastructure**: Google AI Platform (Gemini 2.0 Flash for prompting, Imagen 3 for image generation)
- **Moderation**: Google SafeSearch API + Facilitator Approval Loop

## Project Architecture
- `app/(creator)`: The core creator flow (no account required).
- `app/(facilitator)`: The facilitator setup and dashboard (requires Magic Link login).
- `app/marketplace`: The public-facing (mock) storefront for approved artworks.
- `components/ui`: Shared primitive components (`StepLayout`, `OptionCard`, `MarketplaceArtworkCard`).
- `lib/google-ai`: API wrappers for interacting with Gemini and Imagen server-side.

## Getting Started

First, copy `.env.example` to `.env.local` and fill in your Supabase and Google AI API keys.

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Architectural Decisions
- **IP Ownership**: Every artwork's IP belongs solely to the creator (`ip_owner = 'creator'` enforced at the DB level). The platform operates on a revenue-share model on sales.
- **Two-Layer Moderation**: Google SafeSearch acts as a frontline filter to ensure the creator never sees harmful content. Facilitators act as the secondary review layer before artworks are shown publicly.
- **Single AI Provider**: Utilizing Google AI end-to-end to easily support multimodal creation (Images via Imagen, Music via Lyria, Video via Veo) in future phases.

## Acknowledgements
Initial prototype built with the help of Google Antigravity.
