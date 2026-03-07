"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Artwork, mockArtworks } from "../lib/mockMarketplaceData";
import { MarketplaceArtworkCard } from "@/components/ui/MarketplaceArtworkCard";

const DotMarker = () => (
    <span className="inline-flex gap-1 mr-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5C800]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
    </span>
);

export default function MarketplacePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const featured = mockArtworks[0];

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
                        <span className="cursor-pointer hover:opacity-70 transition-opacity">About</span>
                        <span className="cursor-pointer hover:opacity-70 transition-opacity">For Corporates</span>
                    </div>
                </div>
            </div>

            {/* 1. HERO — Full-bleed, story-first */}
            <section className="relative w-full h-screen overflow-hidden">
                {/* Placeholder Artwork Background */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: `linear-gradient(135deg, ${featured.gradient_from}, ${featured.gradient_to})`,
                    }}
                />

                {/* Glass Card positioned bottom-left */}
                <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-[480px]">
                    <div className="glass-card rounded-[4px] p-8 md:p-10 flex flex-col items-start">
                        <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70 mb-4">
                            Featured Creator
                        </div>
                        <h1 className="font-display text-5xl md:text-6xl mb-4 leading-tight">
                            {featured.artist_name}
                        </h1>
                        <p className="font-body text-lg text-ink/80 mb-8 leading-relaxed">
                            {featured.artist_age} years old · {featured.artist_city} · {featured.creation_story}
                        </p>
                        <button className="bg-signal text-ink font-semibold text-sm tracking-wide px-6 h-[48px] min-w-[48px] hover:bg-signal/90 active:scale-[0.98] transition-all duration-150 rounded-[4px]">
                            Explore this artwork →
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. CREATION STORY STRIP */}
            <section className="w-full bg-ink text-canvas py-10 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-shrink-0">
                        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                            How this was made
                        </h2>
                    </div>

                    <div className="flex-grow flex items-center justify-center w-full overflow-x-auto py-2 hide-scrollbar">
                        <div className="flex items-center gap-4 min-w-max px-4">
                            {/* Tile 1 */}
                            <div className="w-12 h-12 rounded-[8px] bg-[#333] flex items-center justify-center border border-white/10 text-xl">
                                🟡
                            </div>
                            <div className="h-[1px] w-6 bg-white/20 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-solid border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-white/20"></div>
                            </div>
                            {/* Tile 2 */}
                            <div className="w-12 h-12 rounded-[8px] bg-[#333] flex items-center justify-center border border-white/10">
                                <div className="w-6 h-6 rounded-full bg-[#E63946]" />
                            </div>
                            <div className="h-[1px] w-6 bg-white/20 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-solid border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-white/20"></div>
                            </div>
                            {/* Tile 3 */}
                            <div className="w-12 h-12 rounded-[8px] bg-[#333] flex items-center justify-center border border-white/10 text-xl">
                                🦋
                            </div>
                            <div className="h-[1px] w-6 bg-white/20 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-solid border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-white/20"></div>
                            </div>
                            {/* Final Artwork */}
                            <div
                                className="w-16 h-16 rounded-[4px] border border-white/20"
                                style={{ background: `linear-gradient(135deg, ${featured.gradient_from}, ${featured.gradient_to})` }}
                            />
                        </div>
                    </div>

                    <div className="flex-shrink-0 max-w-[280px]">
                        <p className="font-body text-sm text-muted">
                            Every artwork on this platform was made through choices, not text prompts. The creator&apos;s journey IS the art.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. GALLERY GRID */}
            <section className="py-12 md:py-20 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto">
                <div className="flex items-center mb-12">
                    <DotMarker />
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                        All Works
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-8 md:gap-y-16">
                    {mockArtworks.map((artwork, i) => {
                        // Create editorial layout variation based on the hardcoded size/aspect
                        let gridSpan = "md:col-span-4"; // small/default
                        let aspectString = "aspect-[4/5]";
                        let alignment = "self-center"; // vertical placement

                        if (artwork.size === "large") {
                            gridSpan = artwork.aspect_ratio === "wide" ? "md:col-span-12" : "md:col-span-8";
                        } else if (artwork.size === "medium") {
                            gridSpan = "md:col-span-6";
                        }

                        if (artwork.aspect_ratio === "square") {
                            aspectString = "aspect-square";
                        } else if (artwork.aspect_ratio === "landscape" || artwork.aspect_ratio === "wide") {
                            aspectString = "aspect-[16/9]";
                        }

                        // Stagger placements deliberately
                        if (i === 1) alignment = "md:mt-24";
                        if (i === 3) alignment = "md:-mt-12 md:ml-auto";
                        if (i === 4) alignment = "md:mt-32";
                        if (i === 6) alignment = "md:-mt-20 flex justify-center w-full";

                        return (
                            <MarketplaceArtworkCard
                                key={artwork.id}
                                artwork={artwork}
                                gridSpan={gridSpan}
                                aspectString={aspectString}
                                alignment={alignment}
                                index={i}
                                mounted={mounted}
                            />
                        );
                    })}
                </div>
            </section>

            {/* 4. THE CO-CREATION EXPLANATION */}
            <section className="relative py-20 px-6 md:px-12 lg:px-24 border-y border-border overflow-hidden">
                <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
                    <div className="lg:col-span-6 lg:pr-12">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-ink">
                            "AI was the brush.<br />She was the artist."
                        </h2>
                    </div>
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">Every artwork begins with a choice</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Creators don't type text prompts. They make selections through a simplified, highly tactile interface — choosing moods, colours, and forms that resonate with them.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">AI amplifies intention, not replaces it</h3>
                            <p className="font-body text-muted leading-relaxed">
                                We use AI as a translator. It takes their raw, emotional choices and renders them into gallery-grade visual outputs, acting purely as an amplifier for their authentic voice.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-mono text-sm tracking-widest uppercase text-ink mb-2">Verified by a facilitator</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Every piece is guided and attested by a verified facilitator, ensuring the creator's agency is front and centre, and capturing the human story behind the pixels.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOR CORPORATES */}
            <section className="py-20 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto">
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="flex items-center mb-6">
                        <DotMarker />
                        <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                            For Organisations
                        </span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl text-ink">
                        Make your brand mean something
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="relative rounded-[4px] p-8 min-h-[280px] flex flex-col justify-end overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#F5C800] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-ink/10 mix-blend-overlay" />
                        <div className="relative z-10 glass-card rounded-[4px] p-6 w-full">
                            <h3 className="font-display text-2xl text-ink mb-2">Corporate Gifts</h3>
                            <p className="font-body text-ink/80 text-sm">Every product shipped with a creator's story.</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="relative rounded-[4px] p-8 min-h-[280px] flex flex-col justify-end overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4A90D9] to-[#7B5EA7] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-ink/10 mix-blend-overlay" />
                        <div className="relative z-10 glass-card rounded-[4px] p-6 w-full">
                            <h3 className="font-display text-2xl text-ink mb-2">DE&I Partnerships</h3>
                            <p className="font-body text-ink/80 text-sm">License artwork. Fund livelihoods.</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="relative rounded-[4px] p-8 min-h-[280px] flex flex-col justify-end overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3D9970] to-[#E63946] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-ink/10 mix-blend-overlay" />
                        <div className="relative z-10 glass-card rounded-[4px] p-6 w-full">
                            <h3 className="font-display text-2xl text-ink mb-2">Custom Commissions</h3>
                            <p className="font-body text-ink/80 text-sm">Work directly with our creators.</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-12 text-center md:text-left">
                    <button className="bg-signal text-ink font-semibold text-sm tracking-wide px-8 h-[48px] hover:bg-signal/90 active:scale-[0.98] transition-all duration-150 rounded-[4px]">
                        Talk to us →
                    </button>
                </div>
            </section>

            {/* 6. FOOTER */}
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
                            Every purchase funds a creator's income
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
