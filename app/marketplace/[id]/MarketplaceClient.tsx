"use client";

import React, { useEffect, useState } from "react";
import { Artwork as MockArtwork } from "../../lib/mockMarketplaceData";
import { Artwork as SupabaseArtwork } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";

interface MarketplaceClientProps {
    artwork: any; // We accept either MockArtwork or SupabaseArtwork here
    isMock?: boolean;
}

export default function MarketplaceClient({ artwork, isMock = false }: MarketplaceClientProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Normalize Data Representation
    const displayData = {
        title: isMock ? artwork.title : (artwork.subject || "Untitled Creation"),
        artist_name: isMock ? artwork.artist_name : (artwork.creators?.name || "Anonymous Creator"),
        artist_age: isMock ? artwork.artist_age : 24, // Hardcoded fallback for now
        artist_city: isMock ? artwork.artist_city : "SEA Creator",
        creation_story: isMock ? artwork.creation_story : `Created exploring ${artwork.mood} and ${artwork.colour_palette}.`,
        step_count: isMock ? artwork.step_count : 6,
        gradient_from: isMock ? artwork.gradient_from : "#A4A4A4",
        gradient_to: isMock ? artwork.gradient_to : "#232323",
        price_sgd: isMock ? artwork.price_sgd : 85,
        image_url: isMock ? null : artwork.image_url
    };

    // Helper to generate the small swatch tiles based on the step count
    const generateSwatches = () => {
        const swatches = [];
        for (let i = 0; i < displayData.step_count; i++) {
            // Pick a random color from the palette for the mock story
            const colors = ['#FF6B35', '#4A90D9', '#7B5EA7', '#3D9970', '#F7A34B', '#E63946', '#F5C800'];
            const randomColor = colors[i % colors.length];
            swatches.push(
                <div key={i} className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex-shrink-0 border border-white/10"
                        style={{ backgroundColor: randomColor }}
                    />
                    {i < artwork.step_count - 1 && (
                        <div className="h-[1px] w-8 md:w-16 bg-ink/20"></div>
                    )}
                </div>
            );
        }
        return swatches;
    };

    return (
        <main className="w-full bg-canvas text-ink min-h-screen">

            {/* 1. HERO IMAGE (Large, Immersive) */}
            <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-end justify-center pb-24 px-6">
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                    style={{ background: `linear-gradient(135deg, ${artwork.gradient_from}, ${artwork.gradient_to})` }}
                />

                {/* Large overlapping Title */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative z-10 text-center w-full max-w-5xl mix-blend-overlay"
                >
                    <h1 className="font-display text-6xl md:text-9xl text-white opacity-90 leading-none">
                        {artwork.title}
                    </h1>
                </motion.div>
            </section>

            {/* 2. SPECIFICATION STRIP */}
            <section className="w-full border-b border-border py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted bg-canvas">
                <div className="flex items-center gap-8">
                    <span>{displayData.artist_name}</span>
                    <span className="hidden md:inline">{displayData.artist_age} YEARS OLD</span>
                    <span className="hidden md:inline">{displayData.artist_city}</span>
                </div>
                <div>
                    <span>{displayData.step_count} CREATIVE CHOICES</span>
                    <span className="mx-4">|</span>
                    <span className="text-ink">${displayData.price_sgd} SGD</span>
                </div>
            </section>

            {/* 3. NARRATIVE BLOCK (Asymmetrical text) */}
            <section className="max-w-[1440px] mx-auto py-24 px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
                <div className="md:col-span-5 md:col-start-2">
                    <p className="font-display text-4xl md:text-5xl leading-tight text-ink mb-8">
                        "{artwork.creation_story}"
                    </p>
                </div>
                <div className="md:col-span-4 flex flex-col justify-center">
                    <p className="font-body text-lg text-muted leading-relaxed mb-6">
                        Every piece produced by SEA-Up creators begins with a fundamental human choice—a mood, an emotion, a sound. This piece is the direct culmination of navigating {displayData.step_count} distinct creative prompts on the canvas.
                    </p>
                    <p className="font-body text-lg text-muted leading-relaxed">
                        The AI engine acts only as a facilitator, rendering the creator's emotional landscape into visual form. {displayData.artist_name} selected the underlying palettes that generated these exact wavelengths of light.
                    </p>

                    <div className="mt-12">
                        <button className="bg-signal text-ink font-semibold text-sm tracking-wide px-8 h-[48px] hover:bg-signal/90 active:scale-[0.98] transition-all duration-150 rounded-[4px]">
                            Acquire this piece
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. CREATION FLOW (Horizontal Swatches) */}
            <section className="w-full py-24 overflow-hidden bg-ink text-canvas border-y border-white/10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                    <h3 className="font-mono text-xs tracking-widest uppercase text-muted mb-16">
                        The Palette Journey
                    </h3>

                    <div className="flex flex-col md:flex-row items-center justify-start gap-3 w-full overflow-x-auto hide-scrollbar">
                        <div className="flex items-center">
                            {generateSwatches()}
                        </div>

                        <div className="ml-8 md:ml-16 h-[1px] w-24 bg-white/20 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 border-solid border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-white/20"></div>
                        </div>

                        <div
                            className="ml-8 md:ml-16 w-32 md:w-48 aspect-square rounded-[2px]"
                            style={{ background: displayData.image_url ? `url(${displayData.image_url}) center/cover` : `linear-gradient(135deg, ${displayData.gradient_from}, ${displayData.gradient_to})` }}
                        />
                    </div>
                </div>
            </section>

            {/* 5. EDITORIAL TYPOGRAPHY BLOCK (Plasticbionic Yellow style) */}
            <section className="w-full bg-[#f4f3ef] border-b border-border relative">
                <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10 w-full aspect-[3/4] md:aspect-square bg-white shadow-2xl p-6 md:p-12 transform -rotate-1">
                        <div
                            className="w-full h-full shadow-inner"
                            style={{ background: displayData.image_url ? `url(${displayData.image_url}) center/cover` : `linear-gradient(45deg, ${displayData.gradient_to}, ${displayData.gradient_from})` }}
                        />
                    </div>
                    <div className="relative z-10 px-0 md:px-12">
                        <h2 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.85] text-ink uppercase break-words">
                            {displayData.artist_name.split(' ')[0]}
                        </h2>
                        <p className="font-mono text-sm tracking-widest text-muted mt-8 uppercase">
                            Made in {displayData.artist_city}
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. NEXT ARTWORK FOOTER */}
            <section className="w-full py-32 px-6 flex flex-col items-center justify-center text-center">
                <p className="font-mono text-xs tracking-widest uppercase text-muted mb-6">
                    Continue browsing
                </p>
                <Link href="/marketplace" className="group">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink transition-colors group-hover:text-signal">
                        Return to Gallery
                    </h2>
                </Link>
            </section>

        </main>
    );
}
