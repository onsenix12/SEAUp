"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { MarketplaceArtworkCard } from "@/components/ui/MarketplaceArtworkCard";
import { DotMarker, Highlight as H, StepDot, Connector } from "@/components/ui/BrandElements";
import { useTypewriterOnScroll } from "@/hooks/useTypewriterOnScroll";



import { Artwork } from "@/types";

export default function MarketplaceClient({ artworks }: { artworks: Artwork[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const quoteLines = ["“AI was the brush.", "She was the artist.”"];
    const { ref: quoteRef, displayed: quoteDisplayed, done: quoteDone } = useTypewriterOnScroll(quoteLines, 50);

    const featured = artworks.length > 0 ? artworks[0] : null;
    const remainingWorks = artworks.slice(1);

    return (
        <div className="bg-canvas min-h-screen text-ink pb-0">

            {/* Navigation Pill */}
            <div className="fixed top-6 right-6 z-50">
                <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between gap-8">
                    <Link href="/" className="font-display text-xl leading-none tracking-tight">
                        SEA-Up<span className="text-signal ml-1">.</span>
                    </Link>
                    <div className="flex items-center gap-6 font-body text-sm text-ink font-medium">
                        <span className="cursor-pointer hover:opacity-70 transition-opacity">Marketplace</span>
                    </div>
                </div>
            </div>

            {/* ── 1. HERO — Full-bleed, story-first ── */}
            <section className="relative w-full h-screen overflow-hidden bg-ink">
                {/* Animated ASEAN colour ambient — behind the artwork */}
                <div className="absolute inset-0 bg-gradient-art opacity-70 z-0" />

                {featured ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <NextImage
                            src={featured.image_url}
                            alt={featured.title || "Featured Artwork"}
                            fill
                            className="object-cover opacity-80 z-10"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent z-20" />

                        <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-2xl z-30">
                            {/* Hero info card — using glass-card-vivid for signal-yellow top accent */}
                            <div className="glass-card-vivid rounded-[4px] p-8 md:p-10 flex flex-col items-start">
                                <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70 mb-4">
                                    Featured Creator
                                </div>
                                <h1 className="font-display text-5xl md:text-6xl mb-4 leading-tight">
                                    {featured.title || "Untitled"}
                                </h1>
                                <p className="font-body text-lg text-ink/80 mb-8 leading-relaxed">
                                    {featured.creators?.name || "Anonymous"}
                                    {featured.creator_age ? `, ${featured.creator_age} years old` : ""}
                                    {featured.creator_location ? ` · ${featured.creator_location}` : ""}
                                    <br />
                                    <span className="italic opacity-80 mt-2 block">&quot;{featured.creation_story || "No story provided."}&quot;</span>
                                </p>
                                <Link
                                    href={`/marketplace/${featured.id}`}
                                    className="bg-signal text-ink font-semibold text-sm tracking-wide px-6 py-4 hover:bg-signal/90 active:scale-[0.98] transition-all duration-150 rounded-[4px]"
                                >
                                    Explore this artwork →
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full w-full relative z-10">
                        <p className="font-display text-4xl text-canvas">No artworks available right now.</p>
                    </div>
                )}
            </section>

            {/* ── 2. CREATION STORY STRIP ── */}
            <section className="w-full bg-ink text-canvas py-10 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-shrink-0">
                        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                            How this was made
                        </h2>
                    </div>

                    <div className="flex-grow flex items-center justify-center w-full overflow-x-auto py-2 hide-scrollbar">
                        <div className="flex items-center gap-4 min-w-max px-4">
                            {/* Step 1 — Mood choice (joy coral) */}
                            <StepDot color="#FF6B35" />
                            <Connector />
                            {/* Step 2 — Colour choice (calm blue) */}
                            <StepDot color="#4A90D9" />
                            <Connector />
                            {/* Step 3 — Form choice (wonder violet) */}
                            <StepDot color="#7B5EA7" />
                            <Connector />
                            {/* Result — thumbnail */}
                            <div className="relative w-16 h-16 rounded-[4px] border border-white/20 bg-muted flex items-center justify-center overflow-hidden">
                                {featured && featured.image_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <NextImage src={featured.image_url} alt="Result" fill className="object-cover" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 max-w-[280px]">
                        <p className="font-body text-sm text-muted">
                            Every artwork on this platform was made through choices, not text prompts. The creator&apos;s journey IS the art.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 3. GALLERY GRID ── */}
            {/*
                Repeating editorial row pattern (cycles every 7 artworks):
                  Row A: [8col wide 16:9] + [4col portrait 4:5]
                  Row B: [4col sq]  + [4col sq]  + [4col sq]
                  Row C: [4col portrait 4:5] + [8col wide 16:9]
                  → then repeats
                This scales cleanly to any number of artworks.
            */}
            <section
                className="py-12 md:py-20 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto"
                style={{ background: 'linear-gradient(180deg, #F4F3EF 0%, #EEE9E0 100%)' }}
            >
                <div className="flex items-center mb-12">
                    <DotMarker />
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                        All Works
                    </span>
                </div>

                {remainingWorks.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="font-body text-muted">No other works currently available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                        {remainingWorks.map((artwork, i) => {
                            // Position within the repeating 7-item cycle
                            const pos = i % 7;

                            // Row A: item 0 → dominant wide, item 1 → portrait accent
                            // Row B: items 2, 3, 4 → three equal squares
                            // Row C: item 5 → portrait accent, item 6 → dominant wide
                            let gridSpan: string;
                            let aspectString: string;

                            if (pos === 0) {
                                gridSpan = 'md:col-span-8';
                                aspectString = 'aspect-[16/9]';
                            } else if (pos === 1) {
                                gridSpan = 'md:col-span-4';
                                aspectString = 'aspect-[4/5]';
                            } else if (pos === 2 || pos === 3 || pos === 4) {
                                gridSpan = 'md:col-span-4';
                                aspectString = 'aspect-square';
                            } else if (pos === 5) {
                                gridSpan = 'md:col-span-4';
                                aspectString = 'aspect-[4/5]';
                            } else {
                                // pos === 6
                                gridSpan = 'md:col-span-8';
                                aspectString = 'aspect-[16/9]';
                            }

                            return (
                                <MarketplaceArtworkCard
                                    key={artwork.id}
                                    artwork={artwork}
                                    gridSpan={gridSpan}
                                    aspectString={aspectString}
                                    index={i}
                                    mounted={mounted}
                                />
                            );
                        })}
                    </div>
                )}
            </section>


            {/* ── 4. CO-CREATION EXPLANATION ── */}
            <section className="relative py-20 px-6 md:px-12 lg:px-24 border-y border-border overflow-hidden">
                <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
                    <div className="lg:col-span-6 lg:pr-12">
                        <h2
                            ref={quoteRef as React.RefObject<HTMLHeadingElement>}
                            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-ink"
                        >
                            <span style={{ display: 'block' }}>
                                {quoteDisplayed[0] || <span className="opacity-0 select-none">{quoteLines[0]}</span>}
                            </span>
                            <span style={{ display: 'block' }}>
                                {quoteDisplayed[1]}
                                {!quoteDone && (
                                    <span
                                        className="font-mono text-signal"
                                        style={{
                                            animation: 'blink-cursor 0.7s step-end infinite',
                                            display: 'inline-block',
                                            marginLeft: '2px',
                                            lineHeight: 1,
                                            verticalAlign: 'middle',
                                        }}
                                    >|</span>
                                )}
                            </span>
                        </h2>
                    </div>
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">Every artwork begins with a choice</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Creators don&apos;t type text prompts. They make selections through a simplified, <H>highly tactile interface</H> — choosing <H>moods, colours,</H> and forms that resonate with them.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">AI amplifies intention, not replaces it</h3>
                            <p className="font-body text-muted leading-relaxed">
                                We use AI as a <H>translator</H>. It takes their raw, <H>emotional choices</H> and renders them into gallery-grade visual outputs, acting purely as an <H>amplifier</H> for their authentic voice.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">Shaped by an in-house co-artist</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Every work is presented by a <H>SEA-Up co-artist</H> — a trained artist who frames the creator&apos;s vision for the marketplace. They <H>never alter the visual</H>. They surface the <H>intent behind it</H>, so every piece lands with the weight it deserves.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* ── 6. FOOTER ── */}
            <footer className="w-full bg-canvas py-12 px-6 md:px-12 lg:px-24 border-t border-border mt-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="font-display text-3xl">
                            SEA-Up<span className="text-signal">.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                            <span className="font-mono text-xs tracking-[0.2em] uppercase text-ink font-medium">Made in ASEAN</span>
                        </div>
                        <div className="font-body text-muted italic">
                            Every purchase funds a creator&apos;s income
                        </div>
                    </div>

                    <div className="w-full h-px bg-border mb-6" />

                    <div className="text-center font-mono text-[10px] sm:text-xs text-muted/60 uppercase tracking-widest">
                        A SEA-Up Initiative · Singapore · Indonesia · ASEAN
                    </div>
                </div>
            </footer>
        </div>
    );
}
