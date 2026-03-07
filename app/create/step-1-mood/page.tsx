"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

// Simulated Mood options (these match the 3 choices requirement)
const MOODS = [
    { id: "joy", label_en: "Happy", label_id: "Senang", color: "bg-joy", icon: "☀️" }, // Replace emojies with SVGs when available
    { id: "calm", label_en: "Calm", label_id: "Tenang", color: "bg-calm", icon: "🌊" },
    { id: "wonder", label_en: "Dreamy", label_id: "Melamun", color: "bg-wonder", icon: "✨" },
];

export default function Step1Mood() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const handleSelect = (moodId: string) => {
        updateState({ mood: moodId });
        router.push("/create/step-2-colour");
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-8">

            {/* Step Counter (Nothing Mono style) */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    01 / 06
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="font-creator text-3xl font-bold text-ink">
                    {t.moodQuestion}
                </h2>
            </div>

            {/* 3 Choices - Vertical Stack for immediate accessibility */}
            <div className="flex flex-col gap-4 w-full">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => handleSelect(mood.id)}
                        className={`
              min-h-[100px] w-full
              rounded-creator border-2 border-border
              flex items-center p-6 gap-6
              bg-surface
              active:scale-[0.96] active:border-signal active:${mood.color}
              transition-all duration-100
              touch-manipulation
              group
            `}
                    >
                        {/* Temporary Placeholder for Icon (To be replaced with SVG) */}
                        <div className={`w-12 h-12 rounded-full ${mood.color} flex items-center justify-center text-2xl shadow-sm group-active:scale-110 transition-transform`}>
                            {mood.icon}
                        </div>

                        <span className="font-creator font-bold text-2xl text-ink">
                            {language === 'en' ? mood.label_en : mood.label_id}
                        </span>
                    </button>
                ))}
            </div>

        </div>
    );
}
