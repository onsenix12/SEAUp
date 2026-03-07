import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MarketplaceArtworkCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artwork: any; // Using generic any to bypass import type issues for now
    gridSpan: string;
    aspectString: string;
    alignment: string;
    index: number;
    mounted: boolean;
}

export function MarketplaceArtworkCard({
    artwork,
    gridSpan,
    aspectString,
    alignment,
    index,
    mounted
}: MarketplaceArtworkCardProps) {
    return (
        <Link
            href={`/marketplace/${artwork.id}`}
            className={`group cursor-pointer flex flex-col ${gridSpan} ${alignment} break-inside-avoid`}
        >
            <motion.article
                initial={mounted ? false : { y: 20, opacity: 0 }}
                animate={mounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                className="w-full"
            >
                <div
                    className={`relative overflow-hidden w-full ${aspectString} bg-border transition-all duration-500 group-hover:shadow-2xl rounded-[4px]`}
                >
                    <div
                        className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                        style={{ background: `linear-gradient(135deg, ${artwork.gradient_from}, ${artwork.gradient_to})` }}
                    />

                    {/* Dark Glass Reveal on Hover */}
                    <div className="absolute bottom-0 left-0 w-full h-[45%] md:h-[40%] translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 p-4 md:p-6 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-ink/50 backdrop-blur-xl -z-10 border-t border-white/10" />
                        <p className="font-body text-xs md:text-sm text-canvas/80 mb-1">{artwork.artist_age} yrs · {artwork.artist_city} · {artwork.step_count} choices</p>
                        <p className="font-body text-[10px] md:text-xs text-canvas/60 mb-2 md:mb-3 italic">&quot;{artwork.creation_story}&quot;</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="font-display text-xl md:text-2xl text-canvas truncate mr-2">{artwork.title}</span>
                            <span className="font-mono text-xs md:text-sm text-canvas">${artwork.price_sgd}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-6 px-1 flex flex-col md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="font-mono text-[10px] md:text-xs text-muted tracking-[0.15em] uppercase truncate mb-1 md:mb-2">
                            {artwork.artist_name}
                        </p>
                        <h3 className="font-display text-lg md:text-2xl leading-tight truncate text-ink">{artwork.title}</h3>
                    </div>
                    <div className="hidden md:block text-right">
                        <span className="font-body text-sm text-muted">View details →</span>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
