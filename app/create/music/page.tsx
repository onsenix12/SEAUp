"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMusicFlow } from "@/contexts/MusicFlowContext";
import { useRouter } from "next/navigation";

export default function MusicModeChooser() {
    const { language } = useLanguage();
    const { updateState, resetState } = useMusicFlow();
    const router = useRouter();

    const t = {
        title: language === 'en' ? 'Make Music' : 'Buat Musik',
        subtitle: language === 'en'
            ? 'How do you want to create?'
            : 'Bagaimana Anda ingin berkarya?',
        fromArtwork: language === 'en' ? 'From an Artwork' : 'Dari Karya Seni',
        fromArtworkDesc: language === 'en'
            ? 'Turn your visual artwork into a soundscape'
            : 'Ubah karya seni visualmu menjadi suasana suara',
        fromScratch: language === 'en' ? 'From Scratch' : 'Dari Awal',
        fromScratchDesc: language === 'en'
            ? 'Pick sounds and record your voice to compose'
            : 'Pilih suara dan rekam suaramu untuk berkomposisi',
        back: language === 'en' ? 'Back' : 'Kembali',
    };

    const handleFromArtwork = () => {
        resetState();
        updateState({ mode: 'from_artwork' });
        router.push('/create/music/from-artwork');
    };

    const handleFromScratch = () => {
        resetState();
        updateState({ mode: 'from_scratch' });
        router.push('/create/music/from-scratch');
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-10 px-5 pb-10 gap-8">

            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-signal/20 flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </div>
                <h1 className="font-creator text-4xl font-bold text-ink mb-2">{t.title}</h1>
                <p className="font-creator text-lg text-ink/60">{t.subtitle}</p>
            </div>

            {/* Mode Cards */}
            <div className="flex flex-col gap-4 w-full flex-1 justify-center">

                {/* From Artwork */}
                <button
                    onClick={handleFromArtwork}
                    className="w-full min-h-[130px] bg-signal text-ink font-creator rounded-creator shadow-sm active:scale-[0.97] transition-all duration-150 touch-manipulation flex flex-col items-start justify-center px-6 py-5 gap-2 hover:bg-signal/90"
                >
                    <div className="flex items-center gap-3">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-2xl font-bold">{t.fromArtwork}</span>
                    </div>
                    <p className="text-base font-normal opacity-80 text-left pl-[38px]">{t.fromArtworkDesc}</p>
                </button>

                {/* From Scratch */}
                <button
                    onClick={handleFromScratch}
                    className="w-full min-h-[130px] bg-surface text-ink font-creator border-2 border-border rounded-creator shadow-sm active:scale-[0.97] transition-all duration-150 touch-manipulation flex flex-col items-start justify-center px-6 py-5 gap-2 hover:border-ink/30"
                >
                    <div className="flex items-center gap-3">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                        <span className="text-2xl font-bold">{t.fromScratch}</span>
                    </div>
                    <p className="text-base font-normal opacity-60 text-left pl-[38px]">{t.fromScratchDesc}</p>
                </button>
            </div>

            {/* Back */}
            <button
                onClick={() => router.push('/')}
                className="font-creator text-muted text-lg hover:text-ink active:scale-95 transition-all text-center"
            >
                {t.back}
            </button>
        </div>
    );
}
