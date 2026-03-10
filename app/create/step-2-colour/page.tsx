"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

import { PALETTES, TOTAL_STEPS } from "@/lib/constants/creation";

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
        <StepLayout currentStep={2} totalSteps={TOTAL_STEPS} title={t.colourQuestion}>
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
