"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMusicFlow } from "@/contexts/MusicFlowContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface ArtworkItem {
    id: string;
    image_url: string;
    title?: string;
    creation_story?: string;
    created_at: string;
}

export default function MusicFromArtwork() {
    const { language } = useLanguage();
    const { updateState } = useMusicFlow();
    const router = useRouter();

    const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);

    const t = {
        title: language === 'en' ? 'Choose an Artwork' : 'Pilih Karya Seni',
        subtitle: language === 'en'
            ? "Pick one of your creations — we'll turn its story into music"
            : "Pilih salah satu karyamu — kami akan mengubah ceritanya menjadi musik",
        empty: language === 'en'
            ? "No artworks found. Create some visual art first!"
            : "Tidak ada karya ditemukan. Buat seni visual terlebih dahulu!",
        next: language === 'en' ? 'Generate Music' : 'Buat Musik',
        back: language === 'en' ? 'Back' : 'Kembali',
        noStory: language === 'en' ? 'No story available' : 'Tidak ada cerita',
    };

    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        supabase
            .from('artworks')
            .select('id, image_url, title, creation_story, created_at')
            .eq('is_public', false)
            .order('created_at', { ascending: false })
            .limit(30)
            .then(({ data }) => {
                setArtworks(data || []);
                setLoading(false);
            });
    }, []);

    const handleSelect = (artwork: ArtworkItem) => {
        setSelected(artwork.id);
        updateState({
            sourceArtworkId: artwork.id,
            sourceArtworkStory: artwork.creation_story || artwork.title || t.noStory,
            sourceArtworkImageUrl: artwork.image_url,
        });
    };

    const handleNext = () => {
        if (!selected) return;
        router.push('/create/music/generating');
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-8 px-5 pb-6 gap-6">

            {/* Header */}
            <div>
                <h1 className="font-creator text-3xl font-bold text-ink mb-1">{t.title}</h1>
                <p className="font-creator text-base text-ink/60">{t.subtitle}</p>
            </div>

            {/* Artwork Grid */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-creator bg-ink/5 animate-pulse" />
                        ))}
                    </div>
                ) : artworks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4">
                        <p className="font-creator text-xl text-ink/50">{t.empty}</p>
                        <button
                            onClick={() => router.push('/create/start')}
                            className="font-creator text-signal font-bold text-lg underline"
                        >
                            {language === 'en' ? 'Create artwork now' : 'Buat karya sekarang'}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        {artworks.map((artwork) => {
                            const isSelected = selected === artwork.id;
                            return (
                                <button
                                    key={artwork.id}
                                    onClick={() => handleSelect(artwork)}
                                    className={`relative aspect-square rounded-creator overflow-hidden border-4 transition-all duration-150 active:scale-[0.96] touch-manipulation ${isSelected ? 'border-signal shadow-md scale-[1.02]' : 'border-transparent'
                                        }`}
                                >
                                    <Image
                                        src={artwork.image_url}
                                        alt={artwork.title || 'Artwork'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 400px) 45vw, 180px"
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-signal/20 flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-signal flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    {artwork.creation_story && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-ink/60 backdrop-blur-sm px-2 py-1">
                                            <p className="font-creator text-xs text-surface truncate">{artwork.creation_story}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleNext}
                    disabled={!selected}
                    className="w-full min-h-[72px] bg-signal text-ink font-creator font-bold text-2xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-40 touch-manipulation"
                >
                    {t.next}
                </button>
                <button
                    onClick={() => router.back()}
                    className="font-creator text-muted text-lg hover:text-ink active:scale-95 transition-all text-center"
                >
                    {t.back}
                </button>
            </div>
        </div>
    );
}
