"use client";

import React, { useEffect, useState } from "react";
import { Artwork as MockArtwork } from "../../lib/mockMarketplaceData";
import { Artwork as SupabaseArtwork } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { DotMarker } from "@/components/ui/BrandElements";

interface MarketplaceClientProps {
    artwork: SupabaseArtwork | any; // We still need any or a combined type for mock vs real, but SupabaseArtwork is preferred
    isMock?: boolean;
}

export default function MarketplaceClient({ artwork, isMock = false }: MarketplaceClientProps) {
    const [mounted, setMounted] = useState(false);
    const [impactOpen, setImpactOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Normalize Data Representation
    const displayData = {
        title: isMock ? artwork.title : (artwork.title || artwork.subject || "Untitled Creation"),
        artist_name: isMock ? artwork.artist_name : (artwork.creators?.name || "Anonymous Creator"),
        artist_age: isMock ? artwork.artist_age : (artwork.creator_age || "??"),
        artist_city: isMock ? artwork.artist_city : (artwork.creator_location || "Unknown"),
        creation_story: isMock ? artwork.creation_story : (artwork.creation_story || `A piece created through ${artwork.mood} energy and ${artwork.colour_palette} tones.`),
        description: isMock ? (artwork.description || '') : (artwork.description || ''),
        price_sgd: isMock ? artwork.price_sgd : (artwork.price || 85),
        image_url: isMock ? null : artwork.image_url,
        gradient_from: isMock ? artwork.gradient_from : "#1C1C1A",
        gradient_to: isMock ? artwork.gradient_to : "#F4F3EF",
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
                >
                    {displayData.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <NextImage src={displayData.image_url} alt={displayData.title} fill className="object-cover" priority />
                    ) : (
                        <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${displayData.gradient_from}, ${displayData.gradient_to})` }} />
                    )}
                    <div className="absolute inset-0 bg-ink/30 mix-blend-multiply" />
                </motion.div>

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
                    <span className="text-ink">${displayData.price_sgd} SGD</span>
                </div>
            </section>

            {/* 3. NARRATIVE BLOCK (Asymmetrical text) */}
            <section className="max-w-[1440px] mx-auto py-24 px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
                <div className="md:col-span-5 md:col-start-2">
                    {/* Large quote = AI's generated creation story */}
                    <p className="font-display text-4xl md:text-5xl leading-tight text-ink mb-8">
                        &ldquo;{displayData.creation_story}&rdquo;
                    </p>
                </div>
                <div className="md:col-span-4 flex flex-col justify-center">
                    {/* Right body text = facilitator's additional description */}
                    {displayData.description ? (
                        <p className="font-body text-lg text-muted leading-relaxed mb-6">
                            {displayData.description}
                        </p>
                    ) : (
                        <>
                            <p className="font-body text-lg text-muted leading-relaxed mb-6">
                                Every piece produced by SEA-Up creators begins with a fundamental human choice—a mood, an emotion, a sound. This piece is the direct culmination of navigating distinct creative prompts on the canvas.
                            </p>
                            <p className="font-body text-lg text-muted leading-relaxed">
                                The AI engine acts as the brush, while a SEA-Up co-artist surfaces the intent behind the work, ensuring the creator&apos;s vision is presented with gallery-grade precision. {displayData.artist_name} selected the underlying palettes and ideas that generated these exact wavelengths of light.
                            </p>
                        </>
                    )}

                    <div className="mt-12">
                        <button className="bg-signal text-ink font-semibold text-sm tracking-wide px-8 h-[48px] hover:bg-signal/90 active:scale-[0.98] transition-all duration-150 rounded-[4px]">
                            Acquire this piece
                        </button>

                        <div className="mt-6 border-t border-ink/10 pt-4">
                            <button
                                onClick={() => setImpactOpen(!impactOpen)}
                                className="font-body text-sm font-medium text-ink underline cursor-pointer"
                            >
                                {impactOpen ? '▲' : '▼'} About this artwork&apos;s impact
                            </button>

                            {impactOpen && (
                                <div className="mt-3 space-y-2">
                                    <p className="font-body text-sm text-muted">
                                        This artwork was created by an individual with an intellectual disability using SEA-Up Creative — an AI-powered learning platform that builds real vocational skills through creative expression.
                                    </p>
                                    <p className="font-body text-sm text-muted">
                                        60% of this purchase goes directly to the creator. 20% supports the SEA-Up Community Fund, which onboards new creators across ASEAN.
                                    </p>
                                    <a
                                        href="mailto:hello@sea-up.com"
                                        className="font-body text-sm font-medium text-teal-600 underline"
                                    >
                                        Enquire about bulk licensing →
                                    </a>
                                </div>
                            )}
                        </div>
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
                        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-ink uppercase break-words hyphens-auto">
                            {displayData.artist_name.split(' ')[0]}
                        </h2>
                        <p className="font-mono text-sm tracking-widest text-muted mt-8 uppercase">
                            Made in {displayData.artist_city}
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. PHYSICAL PRODUCTS MOCKUPS */}
            <section className="w-full py-32 bg-canvas border-t border-border">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                    <div className="flex items-center gap-2 mb-12">
                        <DotMarker />
                        <span className="font-mono text-xs tracking-widest uppercase text-muted">
                            Available Exclusively As
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Tote Bag */}
                        <div className="bg-surface rounded-market border border-border p-12 flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
                            <div className="absolute inset-0 bg-dot-grid opacity-50"></div>
                            <div className="relative z-10 flex flex-col items-center mt-2 group-hover:scale-105 transition-transform duration-700">
                                {/* Tote Straps mock */}
                                <div className="w-[82px] h-12 border-[6px] border-[#EBE9E1] rounded-t-[30px] border-b-0 -mb-[3px] z-0 shadow-sm"></div>
                                {/* Tote Body */}
                                <div className="w-40 h-[174px] bg-gradient-to-b from-[#FAF9F6] to-[#EBE9E1] rounded-b-xl rounded-t-sm shadow-xl border border-black/10 flex flex-col items-center justify-center relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
                                    {/* Artwork placement */}
                                    <div className="w-24 h-24 bg-white shadow-sm mt-2 mb-3 relative overflow-hidden border border-black/5">
                                        <div className="absolute inset-0" style={{ background: displayData.image_url ? `url(${displayData.image_url}) center/cover` : `linear-gradient(45deg, ${displayData.gradient_to}, ${displayData.gradient_from})` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="font-display text-2xl text-ink">Premium Tote</span>
                                <span className="font-mono text-sm text-ink font-bold">+$25</span>
                            </div>
                        </div>

                        {/* Phone Case */}
                        <div className="bg-surface rounded-market border border-border p-12 flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
                            <div className="absolute inset-0 bg-dot-grid opacity-50"></div>
                            <div className="relative z-10 w-[110px] h-[220px] bg-[#1C1C1A] rounded-[36px] shadow-2xl flex items-center justify-center overflow-hidden border-[4px] border-[#2A2A28] ring-1 ring-black/20 group-hover:scale-105 transition-transform duration-700">
                                {/* Camera bump */}
                                <div className="absolute top-[12px] left-[12px] w-10 h-[36px] bg-black/60 rounded-[12px] backdrop-blur-md z-20 border border-white/5 shadow-inner flex flex-col gap-[3px] items-center justify-center py-1">
                                    <div className="w-[10px] h-[10px] rounded-full bg-black shadow-inner"></div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-black shadow-inner"></div>
                                </div>
                                {/* Shadow Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 z-10 pointer-events-none mix-blend-overlay"></div>
                                {/* Artwork placement */}
                                <div className="absolute inset-0 opacity-90 transition-transform duration-700 group-hover:scale-110" style={{ background: displayData.image_url ? `url(${displayData.image_url}) center/cover` : `linear-gradient(45deg, ${displayData.gradient_from}, ${displayData.gradient_to})` }} />
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="font-display text-2xl text-ink">Impact Case</span>
                                <span className="font-mono text-sm text-ink font-bold">+$32</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. NEXT ARTWORK FOOTER */}
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
