"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { COPY, Language } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

export default function OnboardingScreen() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const t = COPY[language];

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

        {/* CTA */}
        <button
          onClick={handleStart}
          className="bg-signal text-ink font-creator font-bold text-2xl tracking-wide w-full min-h-[80px] rounded-creator hover:bg-signal/90 active:scale-[0.96] transition-all duration-150 touch-manipulation shadow-sm"
        >
          {t.cta}
        </button>

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
