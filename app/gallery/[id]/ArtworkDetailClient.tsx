"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Artwork } from "@/types";
import { useRouter } from "next/navigation";

interface ArtworkDetailProps {
    artwork: Artwork & { creators: { name?: string, organisation: string } };
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailProps) {
    const { language } = useLanguage();
    const router = useRouter();

    const t = {
        back: language === 'en' ? 'Back' : 'Kembali',
        share: language === 'en' ? 'Share Artwork' : 'Bagikan Karya',
        create: language === 'en' ? 'Create Your Own' : 'Buat Karyamu Sendiri',
        by: language === 'en' ? 'Created by' : 'Dibuat oleh',
        unknown: language === 'en' ? 'Creator at' : 'Kreator di'
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SEA-Up Artwork',
                    text: 'Check out this amazing artwork created at MINDS!',
                    url: window.location.href, // Current URL
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'en' ? "Link copied to clipboard!" : "Tautan disalin ke papan klip!");
        }
    };

    const creatorNameText = artwork.creators?.name
        ? `${t.by} ${artwork.creators.name}`
        : `${t.unknown} ${artwork.creators?.organisation || 'SEA-Up'}`;

    const dateText = new Date(artwork.created_at).toLocaleDateString(language === 'en' ? 'en-SG' : 'id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8">

            {/* Header Navigation */}
            <div className="flex items-center mb-6 pl-2">
                <button
                    onClick={() => router.push('/gallery')}
                    className="p-2 -ml-2 text-ink active:scale-95 transition-transform flex items-center gap-2"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span className="font-creator font-bold text-lg">{t.back}</span>
                </button>
            </div>

            {/* Artwork Display Area with Attribution Overlay */}
            <div className="w-full aspect-square rounded-creator overflow-hidden border-2 border-border shadow-md bg-canvas mb-8 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={artwork.image_url}
                    alt={`Artwork by ${artwork.creators?.name || 'Unknown'}`}
                    className="w-full h-full object-cover"
                />

                {/* Attribution Overlay (Phase 3.5) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
                    <p className="text-canvas font-creator font-bold text-xl drop-shadow-md">
                        {creatorNameText}
                    </p>
                    <p className="text-canvas/80 font-mono text-sm tracking-wide mt-1">
                        {dateText}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full mt-auto">
                <button
                    onClick={handleShare}
                    className="w-full min-h-[72px] bg-brand text-canvas font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform"
                >
                    {t.share}
                </button>

                <button
                    onClick={() => router.push('/create/step-1-mood')}
                    className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border active:scale-[0.96] transition-transform"
                >
                    {t.create}
                </button>
            </div>

        </div>
    );
}
