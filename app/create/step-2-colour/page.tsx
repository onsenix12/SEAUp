"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

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
        <StepLayout currentStep={2} totalSteps={7} title={t.colourQuestion}>
            {/* 3 Choices - Colour Swatches */}
            <div className="flex flex-col gap-4 w-full">
                {PALETTES.map((palette) => (
                    <OptionCard
                        key={palette.id}
                        id={palette.id}
                        labelEn={palette.label_en}
                        labelId={palette.label_id}
                        onClick={handleSelect}
                        layout="column"
                    >
                        {/* Visual Swatch Row */}
                        <div className="flex w-full h-12 rounded-xl overflow-hidden shadow-sm group-active:scale-[1.02] transition-transform">
                            {palette.colors.map((colorClass, i) => (
                                <div key={i} className={`h-full flex-1 ${colorClass}`} />
                            ))}
                        </div>
                    </OptionCard>
                ))}
            </div>
        </StepLayout>
    );
}
