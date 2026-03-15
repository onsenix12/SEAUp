"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { Artwork, MusicTrack } from "@/types";
import { storageStringToSkills } from "@/lib/learning/skills";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";

interface GalleryClientProps {
    initialArtworks: Artwork[];
    initialMusicTracks: MusicTrack[];
}

export default function GalleryClient({ initialArtworks, initialMusicTracks }: GalleryClientProps) {
    const { language } = useLanguage();
    const { state } = useCreationFlow();
    const router = useRouter();
    const { sessionData } = useFacilitator();

    const activeName = sessionData.isActive && sessionData.creatorName
        ? sessionData.creatorName
        : state.nickname;

    const myArtworks = useMemo(() => {
        if (!activeName) return [];
        return initialArtworks.filter(a => a.creators?.name === activeName);
    }, [initialArtworks, activeName]);

    const t = {
        title: language === 'en' ? 'My Gallery' : 'Galeri Saya',
        emptyNickname: language === 'en' ? 'Who are you? Enter your nickname to see your artworks.' : 'Siapa namamu? Masukkan nama panggilanmu untuk melihat karyamu.',
        emptyArtworks: language === 'en' ? 'No artworks yet. Create your first masterpiece!' : 'Belum ada karya. Buat mahakarya pertamamu!',
        createBtn: language === 'en' ? 'Create Something New' : 'Buat Sesuatu yang Baru',
        startBtn: language === 'en' ? 'Set Nickname' : 'Tetapkan Nama',
        backBtn: language === 'en' ? 'Back Home' : 'Kembali',
        musicSection: language === 'en' ? 'My Music' : 'Musik Saya',
        makeMusicBtn: language === 'en' ? 'Make Music' : 'Buat Musik',
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-6 pb-8 px-4">

            {/* Header */}
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
                <div className="w-10"></div>
            </div>

            {!activeName ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="font-creator text-xl text-ink/60 mb-8">{t.emptyNickname}</p>
                    <Link
                        href="/create/start"
                        className="w-full min-h-[72px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm flex items-center justify-center active:scale-[0.98] transition-transform"
                    >
                        {t.startBtn}
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-8 overflow-y-auto pb-20">

                    {/* Visual Artworks Section */}
                    {myArtworks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                            <p className="font-creator text-xl text-ink/60">{t.emptyArtworks}</p>
                            <Link
                                href="/create/step-1-mood"
                                className="w-full min-h-[72px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm flex items-center justify-center active:scale-[0.98] transition-transform"
                            >
                                {t.createBtn}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 auto-rows-max scrollbar-hide">
                                {myArtworks.map((artwork) => (
                                    <ArtworkCard key={artwork.id} artwork={artwork} />
                                ))}
                            </div>
                            <Link
                                href="/create/step-1-mood"
                                className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border shadow-sm flex items-center justify-center active:scale-[0.98] transition-transform"
                            >
                                {t.createBtn}
                            </Link>
                        </>
                    )}

                    {/* Music Tracks Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-creator text-xl font-bold text-ink">{t.musicSection}</h3>
                            <Link
                                href="/create/music"
                                className="font-creator text-sm text-signal font-bold hover:underline"
                            >
                                + {t.makeMusicBtn}
                            </Link>
                        </div>

                        {initialMusicTracks.length === 0 ? (
                            <div className="border-2 border-dashed border-border rounded-creator p-8 flex flex-col items-center gap-3 text-center">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                                    <path d="M9 18V5l12-2v13" />
                                    <circle cx="6" cy="18" r="3" />
                                    <circle cx="18" cy="16" r="3" />
                                </svg>
                                <p className="font-creator text-base text-ink/50">
                                    {language === 'en' ? 'No music created yet' : 'Belum ada musik yang dibuat'}
                                </p>
                                <Link href="/create/music" className="font-creator text-signal font-bold text-base hover:underline">
                                    {t.makeMusicBtn}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {initialMusicTracks.map((track) => (
                                    <MusicTrackCard key={track.id} track={track} language={language} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Sub-components ──────────────────────────────────

const MINI_DOMAIN_STYLES: Record<string, string> = {
    emotional: "bg-amber-100 text-amber-800",
    spatial: "bg-teal-100 text-teal-800",
    auditory: "bg-purple-100 text-purple-800",
    creative: "bg-yellow-100 text-yellow-800",
};

function ArtworkCard({ artwork }: { artwork: Artwork }) {
    const miniSkills = storageStringToSkills(artwork.learning_tags ?? "");
    const displaySkills = miniSkills.slice(0, 2);
    const remaining = miniSkills.length - 2;

    return (
        <Link
            href={`/gallery/${artwork.id}`}
            className="bg-surface rounded-creator overflow-hidden shadow-sm active:scale-95 transition-transform border border-border relative group flex flex-col"
        >
            <div className="aspect-square relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={artwork.image_url}
                    alt={`Artwork created on ${new Date(artwork.created_at).toLocaleDateString()}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    suppressHydrationWarning
                />
                {artwork.creators?.name && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-6">
                        <p className="font-creator text-white text-sm font-medium line-clamp-1">
                            By {artwork.creators.name}
                        </p>
                    </div>
                )}
            </div>

            {displaySkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 px-2 pb-2">
                    {displaySkills.map((skill) => (
                        <span
                            key={skill.id}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                MINI_DOMAIN_STYLES[skill.domain] ?? "bg-gray-100 text-gray-700"
                            }`}
                        >
                            <span aria-hidden="true">{skill.emoji}</span>
                            {skill.label_en}
                        </span>
                    ))}
                    {remaining > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-ink/5 text-muted">
                            +{remaining}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}

function MusicTrackCard({ track, language }: { track: MusicTrack; language: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) { audio.pause(); setIsPlaying(false); }
        else { audio.play(); setIsPlaying(true); }
    };

    const modeLabel = track.creation_mode === 'from_artwork'
        ? (language === 'en' ? 'From Artwork' : 'Dari Karya')
        : (language === 'en' ? 'From Scratch' : 'Dari Awal');

    return (
        <div className="aspect-square bg-surface rounded-creator overflow-hidden shadow-sm border border-border relative group flex flex-col">
            {/* Cover Image */}
            <div className="relative flex-1">
                {track.cover_image_url ? (
                    <Image
                        src={track.cover_image_url}
                        alt="Music cover"
                        fill
                        className="object-cover"
                        sizes="(max-width: 400px) 45vw, 180px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ink/5">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                            <path d="M9 18V5l12-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="18" cy="16" r="3" />
                        </svg>
                    </div>
                )}

                {/* Music badge */}
                <div className="absolute top-2 right-2 bg-ink/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="font-creator text-white text-xs">♪</span>
                </div>

                {/* Play button overlay */}
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-ink/0 hover:bg-ink/20 transition-all active:scale-95"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    <div className="w-12 h-12 rounded-full bg-surface/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {isPlaying ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink ml-0.5">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </div>
                </button>
            </div>

            {/* Mode label */}
            <div className="px-2 py-1.5 bg-surface">
                <p className="font-creator text-xs text-ink/50 truncate">{modeLabel}</p>
                {track.creation_story && (
                    <p className="font-creator text-xs text-ink font-medium truncate">{track.creation_story}</p>
                )}
            </div>

            {track.audio_url && (
                <audio
                    ref={audioRef}
                    src={track.audio_url}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                />
            )}
        </div>
    );
}
