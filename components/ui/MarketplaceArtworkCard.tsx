import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { Artwork } from '@/types';

interface MarketplaceArtworkCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artwork: Artwork;
    gridSpan: string;
    aspectString: string;
    index: number;
    mounted: boolean;
}

// Maps an index to a creator-palette mood tag — brand-guideline compliant colours only
const MOOD_TAGS = [
    { label: 'Joyful', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
    { label: 'Curious', color: '#7B5EA7', bg: 'rgba(123,94,167,0.12)' },
    { label: 'Calm', color: '#4A90D9', bg: 'rgba(74,144,217,0.12)' },
    { label: 'Bold', color: '#E63946', bg: 'rgba(230,57,70,0.12)' },
    { label: 'Warm', color: '#F7A34B', bg: 'rgba(247,163,75,0.12)' },
    { label: 'Natural', color: '#3D9970', bg: 'rgba(61,153,112,0.12)' },
];

export function MarketplaceArtworkCard({
    artwork,
    gridSpan,
    aspectString,
    index,
    mounted,
}: MarketplaceArtworkCardProps) {
    const mood = MOOD_TAGS[index % MOOD_TAGS.length];

    return (
        <Link
            href={`/marketplace/${artwork.id}`}
            className={`group cursor-pointer flex flex-col ${gridSpan} break-inside-avoid`}
        >
            <motion.article
                initial={mounted ? false : { y: 20, opacity: 0 }}
                animate={mounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                className="w-full"
            >
                {/* Image container */}
                <div
                    className={`relative overflow-hidden w-full ${aspectString} bg-border transition-all duration-500 group-hover:shadow-2xl rounded-[4px]`}
                >
                    {/* Artwork image */}
                    <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
                        {artwork.image_url ? (
                            <NextImage
                                src={artwork.image_url}
                                alt={artwork.title || "Artwork"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-border" />
                        )}
                    </div>

                    {/* Dark Glass Reveal — fixed at bottom, always visible */}
                    <div className="absolute bottom-0 left-0 w-full h-[45%] md:h-[40%] z-10 p-4 md:p-6 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-ink/55 backdrop-blur-xl -z-10 border-t border-signal/40" />
                        <p className="font-body text-xs md:text-sm text-canvas/80 mb-1">
                            {artwork.creator_age || '??'} yrs · {artwork.creator_location || 'Unknown'}
                        </p>
                        <p className="font-body text-[10px] md:text-xs text-canvas/60 mb-2 md:mb-3 italic">
                            &quot;{artwork.creation_story || 'No story provided.'}&quot;
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="font-display text-xl md:text-2xl text-canvas truncate mr-2">
                                {artwork.title || 'Untitled'}
                            </span>
                            <span className="font-mono text-xs md:text-sm text-signal">
                                ${artwork.price || 0} SGD
                            </span>
                        </div>
                    </div>
                </div>

                {/* Below-card metadata + mood tag */}
                <div className="mt-3 md:mt-4 px-1 flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                        <div className="min-w-0">
                            <p className="font-mono text-[10px] md:text-xs text-muted tracking-[0.15em] uppercase truncate mb-1">
                                {artwork.creators?.name || 'Anonymous'}
                            </p>
                            <h3 className="font-display text-base md:text-xl leading-tight truncate text-ink">
                                {artwork.title || 'Untitled'}
                            </h3>
                        </div>
                        <div className="hidden md:block text-right shrink-0">
                            <span className="font-body text-sm text-muted whitespace-nowrap">View details →</span>
                        </div>
                    </div>

                    {/* Mood tag — creator palette, per brand guidelines */}
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: mood.color }}
                        />
                        <span
                            className="font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-[2px]"
                            style={{ color: mood.color, backgroundColor: mood.bg }}
                        >
                            {mood.label}
                        </span>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
