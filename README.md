# SEA-Up Creative 🎨

SEA-Up Creative is an AI-powered creative platform built from the ground up for people with intellectual disabilities (ID) across ASEAN. It enables ID individuals to produce artworks through guided visual choices — without text prompts — and displays them in a personal gallery. A mock marketplace preview shows where the platform will lead in the future.

This project was built for a pilot at **MINDS Singapore**. 

## The Mission: Closing the Gap

Across ASEAN, an estimated 7 million people live with intellectual disabilities (2.8 million in Indonesia alone). While generative AI tools like Midjourney or DALL-E promise to democratise creativity, they have largely widened the gap by requiring high digital literacy, precise English text prompting, and abstract reasoning.

**SEA-Up Creative** solves this by providing a highly tactile, visual-first interface where creators choose moods, colours, and subjects. AI (Google Gemini 2.5 Flash + Imagen 4) acts purely as an amplifier, translating their intent into gallery-grade visual outputs. The goal? To close the gap between "art made" and "income earned", ensuring the digital creative economy includes everyone.

For deeper context, read our full documentation:
- 📖 [The Problem Document](problem.md) — Why 7 million people are excluded from the creative economy.
- 💡 [The Solution Document](solution.md) — How SEA-Up changes the journey from discovery to earning.
- ⚙️ [Product Requirements](requirements.md) — Detailed MVP scope, tech stack, data models, and Phase 2 roadmap.

## The User Journeys

SEA-Up Creative connects three distinct users in a unified ecosystem:

### 1. The Creator (Individuals with ID)
- **Discovery**: Accessing a welcoming platform in Bahasa Indonesia or English ("Let's make something").
- **Creating**: A guided visual journey with no text input required:
  - **Mood**: "How are you feeling today?" (e.g., Happy, Calm, Excited)
  - **Colour World**: "Pick your colours" (visual palettes)
  - **Subject**: "What do you want to draw?" (e.g., Nature, People, Shapes)
  - **Canvas & Photo Integration**: Draw, add stickers, or snap a photo from their environment as inspiration.
  - **Style Selection**: Choose an art style visually.
- **Seeing Yourself**: Artwork appears in a personal gallery, permanently attributed and immediately shareable.
- **Reaching the Market** *(Phase 2)*: Once approved, artworks are automatically listed on a marketplace as POD products (tote bags, prints).
- **Earning & Belonging** *(Phase 2)*: Earning real royalties that flow back to them, shifting their role from passive recipients to active economic participants.

### 2. The Facilitator (Caregivers & Disability Orgs)
- **Guiding**: Co-piloting the creation process if needed, without taking over the creator's agency.
- **Safeguarding**: Acting as a secondary human review layer before any artwork is published to the public marketplace.
- **Administering**: Managing creators, tracking sessions, and overseeing the payout and community fund loops for their organisation.

### 3. The Buyer (Individuals & Corporates)
- **Discovering**: Browsing a curated gallery of high-quality artwork created by ID individuals.
- **Purchasing** *(Phase 2)*: Buying physical products (via print-on-demand) handled entirely by the platform, with zero logistics burden on the creator.
- **Impacting** *(Phase 2)*: Knowing their purchase directly supports the creator and reinvests in the broader disabled community.

## Principles & Design Mode
- **No text input** required in the creation flow.
- **Large tap targets** (min 72x72px) for cognitive and motor accessibility.
- **Maximum 3 choices** per screen.
- **Visual-first** navigation.
- **Nothing's bones, HERALBONY's soul**: The UI structure borrows from Nothing's tech precision (dot grids, monospace), while the color and energy come from the artwork itself (inspired by HERALBONY).

## Tech Stack & Architecture
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Database / Auth / Storage**: Supabase (PostgreSQL)
- **AI Infrastructure**: Google AI Platform (Gemini 2.5 Flash for multimodal prompt construction and moderation, Imagen 4 for image generation)
- **Moderation**: Google SafeSearch API + Facilitator Approval Loop

### Project Structure
- `app/create`: The core creator flow (no account required).
- `app/facilitator`: The facilitator setup and dashboard (requires Magic Link login).
- `app/gallery`: The personalised gallery for creators to view and share their generated artworks.
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
- **Single AI Provider**: Utilising Google AI end-to-end easily supports multimodal creation (Images via Imagen 4; Music via Lyria and Video via Veo planned for Phase 2).

## Acknowledgements
Initial prototype built with the help of Google Antigravity.
