"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY, Language } from "@/lib/i18n/copy";
import { JOURNEY_META, Journey } from "@/types";
import { useRouter } from "next/navigation";

export default function OnboardingScreen() {
  const { language, setLanguage } = useLanguage();
  const { updateState } = useCreationFlow();
  const router = useRouter();

  const handleJourneySelect = (journey: Journey) => {
    updateState({ journey });
    router.push('/create/start');
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

        {/* Journey Selection */}
        <div className="flex flex-col gap-3 w-full">
          <p className="font-creator text-xl font-bold text-ink text-center mb-4">
            {language === 'id' ? 'Apa yang ingin kamu jelajahi hari ini?' : 'What do you want to explore today?'}
          </p>
          {(['feelings', 'world', 'sounds'] as Journey[]).map((j) => (
            <button
              key={j}
              onClick={() => handleJourneySelect(j)}
              className="bg-surface border border-ink/10 rounded-2xl px-5 py-4 flex items-center gap-4 w-full min-h-[80px] hover:bg-signal hover:border-signal transition-colors"
            >
              <span className="text-4xl" aria-hidden="true">{JOURNEY_META[j].emoji}</span>
              <div className="text-left">
                <p className="font-creator text-lg font-bold text-ink leading-tight">
                  {language === 'id' ? JOURNEY_META[j].label_id : JOURNEY_META[j].label_en}
                </p>
                <p className="font-body text-sm text-muted">
                  {language === 'id' ? JOURNEY_META[j].tagline_id : JOURNEY_META[j].tagline_en}
                </p>
              </div>
            </button>
          ))}
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
