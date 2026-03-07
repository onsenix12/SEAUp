"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Artwork } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GalleryClientProps {
    initialArtworks: Artwork[];
}

export default function GalleryClient({ initialArtworks }: GalleryClientProps) {
    const { language } = useLanguage();
    const router = useRouter();

    // Fallback dictionary for gallery since it wasn't extensively defined in copy.ts
    const t = {
        title: language === 'en' ? 'Creator Gallery' : 'Galeri Kreator',
        empty: language === 'en' ? 'No artworks yet. Be the first!' : 'Belum ada karya. Jadilah yang pertama!',
        createBtn: language === 'en' ? 'Create Something New' : 'Buat Sesuatu yang Baru',
        backBtn: language === 'en' ? 'Back Home' : 'Kembali',
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-6 pb-8 px-4">

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/')}
                    className="p-2 -ml-2 text-ink/70 active:scale-95 transition-transform"
                    aria-label={t.backBtn}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h2 className="font-creator text-2xl font-bold text-ink text-center flex-1">
                    {t.title}
                </h2>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            {initialArtworks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="font-creator text-xl text-ink/60 mb-8">{t.empty}</p>
                    <Link
                        href="/create/step-1-mood"
                        className="w-full min-h-[72px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm flex items-center justify-center active:scale-[0.98] transition-transform"
                    >
                        {t.createBtn}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 auto-rows-max overflow-y-auto pb-20 scrollbar-hide">
                    {initialArtworks.map((artwork) => (
                        <Link
                            key={artwork.id}
                            href={`/gallery/${artwork.id}`}
                            className="aspect-square bg-surface rounded-creator overflow-hidden shadow-sm active:scale-95 transition-transform border border-border"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={artwork.image_url}
                                alt={`Artwork created on ${new Date(artwork.created_at).toLocaleDateString()}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                suppressHydrationWarning
                            />
                        </Link>
                    ))}
                </div>
            )}

            {initialArtworks.length > 0 && (
                <div className="mt-8">
                    <Link
                        href="/create/step-1-mood"
                        className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border shadow-sm flex items-center justify-center active:scale-[0.98] transition-transform"
                    >
                        {t.createBtn}
                    </Link>
                </div>
            )}

        </div>
    );
}
