"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function VideoPlaceholder() {
    const { language } = useLanguage();
    const router = useRouter();

    const text = {
        title: language === 'en' ? 'Video Creation' : 'Pembuatan Video',
        desc: language === 'en' ? 'This feature will use Google Veo to turn your ideas into moving videos. Coming in Phase 2!' : 'Fitur ini akan menggunakan Google Veo untuk mengubah ide Anda menjadi video bergerak. Hadir pada Fase 2!',
        back: language === 'en' ? 'Back to Welcome' : 'Kembali ke Beranda'
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-12 px-4 pb-8 items-center justify-center text-center gap-8">
            <div className="w-32 h-32 rounded-full bg-ink/5 flex items-center justify-center mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/60">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
            </div>

            <h1 className="font-creator text-4xl font-bold text-ink">
                {text.title}
            </h1>

            <p className="text-ink/60 font-creator text-xl leading-relaxed px-4">
                {text.desc}
            </p>

            <button
                onClick={() => router.push('/')}
                className="mt-12 min-h-[72px] px-8 bg-surface border-2 border-border text-ink font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform"
            >
                {text.back}
            </button>
        </div>
    );
}
