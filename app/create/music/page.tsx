"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function MusicPlaceholder() {
    const { language } = useLanguage();
    const router = useRouter();

    const text = {
        title: language === 'en' ? 'Music Creation' : 'Pembuatan Musik',
        desc: language === 'en' ? 'This feature will use Google Lyria to let you compose original music pieces. Coming in Phase 2!' : 'Fitur ini akan menggunakan Google Lyria yang memungkinkan Anda membuat karya musik orisinal. Hadir pada Fase 2!',
        back: language === 'en' ? 'Back to Welcome' : 'Kembali ke Beranda'
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-12 px-4 pb-8 items-center justify-center text-center gap-8">
            <div className="w-32 h-32 rounded-full bg-ink/5 flex items-center justify-center mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/60">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
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
