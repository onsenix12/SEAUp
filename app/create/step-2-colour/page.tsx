"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

// Base colour palette choices matching brand-guidelines.md
const PALETTES = [
    {
        id: "warm",
        label_en: "Warm Sunrise",
        label_id: "Matahari Terbit",
        colors: ["bg-joy", "bg-warmth", "bg-signal"]
    },
    {
        id: "cool",
        label_en: "Cool Ocean",
        label_id: "Lautan Tenang",
        colors: ["bg-calm", "bg-wonder", "bg-canvas"]
    },
    {
        id: "earth",
        label_en: "Earth & Nature",
        label_id: "Bumi & Alam",
        colors: ["bg-nature", "bg-ink", "bg-canvas"]
    },
];

export default function Step2Colour() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const handleSelect = (paletteId: string) => {
        updateState({ colour_palette: paletteId });
        router.push("/create/step-3-subject");
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-8">

            {/* Step Counter */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    02 / 06
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="font-creator text-3xl font-bold text-ink">
                    {t.colourQuestion}
                </h2>
            </div>

            {/* 3 Choices - Colour Swatches */}
            <div className="flex flex-col gap-4 w-full">
                {PALETTES.map((palette) => (
                    <button
                        key={palette.id}
                        onClick={() => handleSelect(palette.id)}
                        className="min-h-[120px] w-full rounded-creator border-2 border-border flex flex-col p-6 gap-4 bg-surface active:scale-[0.96] active:border-signal transition-all duration-100 touch-manipulation group"
                    >
                        <span className="font-creator font-bold text-xl text-ink self-start">
                            {language === 'en' ? palette.label_en : palette.label_id}
                        </span>

                        {/* Visual Swatch Row */}
                        <div className="flex w-full h-12 rounded-xl overflow-hidden shadow-sm group-active:scale-[1.02] transition-transform">
                            {palette.colors.map((colorClass, i) => (
                                <div key={i} className={`h-full flex-1 ${colorClass}`} />
                            ))}
                        </div>
                    </button>
                ))}
            </div>

        </div>
    );
}
