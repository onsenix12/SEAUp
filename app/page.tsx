"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { COPY, Language } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

export default function OnboardingScreen() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleStart = () => {
    // Navigates to the first step of the Creation Flow
    router.push("/create/step-1-mood");
  };

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-16">

        {/* Header - Using Nunito (font-creator) as specified for Creator App Mode B */}
        <div className="text-center">
          <h1 className="font-creator text-5xl mb-4 text-ink font-bold">SEA-Up Creative</h1>
        </div>

        {/* Language Selector */}
        <div className="w-full flex-col flex items-center gap-6">
          <div className="flex gap-4 w-full justify-center">
            {(['en', 'id'] as Language[]).map((lang) => {
              const isActive = language === lang;
              const baseC = "flex-1 min-h-[72px] rounded-creator font-body text-lg font-medium tracking-wide transition-all duration-150 touch-manipulation active:scale-[0.96]";
              const activeC = isActive ? "bg-ink text-surface shadow-sm border-2 border-ink" : "bg-surface text-muted border-2 border-border";
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`${baseC} ${activeC}`}
                >
                  {COPY[lang].languageName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multimodal Entry CTAs */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleStart}
            className="bg-signal text-ink font-creator font-bold text-2xl tracking-wide w-full min-h-[80px] rounded-creator hover:bg-signal/90 active:scale-[0.96] transition-all duration-150 touch-manipulation shadow-sm flex items-center justify-center gap-3"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            {language === 'en' ? 'Make a Picture' : 'Buat Gambar'}
          </button>

          <button
            onClick={() => router.push('/create/music')}
            className="bg-surface text-ink font-creator font-bold text-xl tracking-wide w-full min-h-[72px] rounded-creator active:scale-[0.96] transition-all duration-150 touch-manipulation border-2 border-border flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            {language === 'en' ? 'Make Music' : 'Buat Musik'}
          </button>

          <button
            onClick={() => router.push('/create/video')}
            className="bg-surface text-ink font-creator font-bold text-xl tracking-wide w-full min-h-[72px] rounded-creator active:scale-[0.96] transition-all duration-150 touch-manipulation border-2 border-border flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            {language === 'en' ? 'Make a Video' : 'Buat Video'}
          </button>
        </div>

        {/* Facilitator Mode Access */}
        <button
          onClick={() => router.push('/facilitator/login')}
          className="mt-8 text-ink/60 font-creator text-lg underline underline-offset-4 decoration-ink/30 hover:text-ink active:scale-95 transition-all"
        >
          {language === 'en' ? "I'm helping someone create" : "Saya mendampingi seseorang berkarya"}
        </button>

      </div>
    </main >
  );
}
