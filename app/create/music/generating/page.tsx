"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMusicFlow } from "@/contexts/MusicFlowContext";
import { useRouter } from "next/navigation";

// Fixed heights — stable on both server and client (no Math.random() in render)
const BAR_HEIGHTS = [38, 62, 45, 75, 30, 55, 48, 80, 25, 60, 70, 35];

export default function MusicGenerating() {
    const { language } = useLanguage();
    const { state, setMusicResult } = useMusicFlow();
    const router = useRouter();
    const hasCalled = useRef(false);

    const t = {
        title: language === 'en' ? 'Composing...' : 'Sedang Menyusun...',
        subtitle: language === 'en'
            ? 'Gemini is generating your music.'
            : 'Gemini sedang menghasilkan musikmu.',
        patience: language === 'en'
            ? 'This takes about 15–30 seconds'
            : 'Ini membutuhkan sekitar 15–30 detik',
    };

    useEffect(() => {
        // Guard: if no mode is set (e.g. user navigated directly or refreshed),
        // go back to the mode chooser
        if (!state.mode) {
            router.replace('/create/music');
            return;
        }

        if (hasCalled.current) return;
        hasCalled.current = true;

        const generate = async () => {
            try {
                const controller = new AbortController();
                // 55s client-side safety net (server is 60s max)
                const clientTimeout = setTimeout(() => controller.abort(), 55000);

                const response = await fetch('/api/create-music', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state),
                    signal: controller.signal,
                });

                clearTimeout(clientTimeout);
                const data = await response.json();

                if (!data.success) {
                    setMusicResult({
                        audioBase64: null,
                        coverBase64: null,
                        creationStory: '',
                        musicPrompt: '',
                        lyriaAvailable: false,
                        lyriaError: data.error || 'Generation failed.',
                    });
                    router.replace('/create/music/result');
                    return;
                }

                const { audioBase64, coverBase64, creationStory, musicPrompt, lyriaAvailable, lyriaError } = data.data;

                // Store large binary data in context (avoids sessionStorage 5MB quota)
                setMusicResult({
                    audioBase64: audioBase64 ?? null,
                    coverBase64: coverBase64 ?? null,
                    creationStory: creationStory ?? '',
                    musicPrompt: musicPrompt ?? '',
                    lyriaAvailable: !!lyriaAvailable,
                    lyriaError: lyriaError ?? null,
                });

                router.replace('/create/music/result');
            } catch (err: unknown) {
                console.error("Music generation failed:", err);
                const isAbort = err instanceof Error && err.name === 'AbortError';
                setMusicResult({
                    audioBase64: null,
                    coverBase64: null,
                    creationStory: '',
                    musicPrompt: '',
                    lyriaAvailable: false,
                    lyriaError: isAbort
                        ? 'Music generation timed out. The audio model may not be available on this API key.'
                        : 'Network error during music generation.',
                });
                router.replace('/create/music/result');
            }
        };

        generate();
    }, [state, router]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-12 px-5 pb-10 items-center justify-center gap-8">

            {/* Waveform animation — uses CSS keyframe defined in globals.css */}
            <div className="flex items-end gap-1.5 h-20">
                {BAR_HEIGHTS.map((heightPct, i) => (
                    <div
                        key={i}
                        className="w-3 rounded-full bg-signal music-bar-anim"
                        style={{
                            height: `${heightPct}%`,
                            animationDelay: `${i * 0.08}s`,
                        }}
                    />
                ))}
            </div>

            <div className="text-center flex flex-col gap-3">
                <h1 className="font-creator text-4xl font-bold text-ink">{t.title}</h1>
                <p className="font-creator text-lg text-ink/60 px-4">{t.subtitle}</p>
                <p className="font-creator text-sm text-ink/40">{t.patience}</p>
            </div>
        </div>
    );
}
