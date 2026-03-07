"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

// Optional styles. The prompt engineering (Phase 2) will map these to Imagen styles.
const STYLES = [
    { id: "3d", label_en: "3D Illustration", label_id: "Ilustrasi 3D", icon: "🧊" },
    { id: "watercolor", label_en: "Watercolor", label_id: "Cat Air", icon: "🖌️" },
    { id: "pixel", label_en: "Pixel Art", label_id: "Seni Piksel", icon: "👾" },
    { id: "sketch", label_en: "Pencil Sketch", label_id: "Sketsa Pensil", icon: "✏️" },
];

export default function Step5Style() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const handleSelect = (styleId: string) => {
        updateState({ style: styleId });
        router.push("/create/step-7-generating");
    };

    const handleSkip = () => {
        // Keep default from CreationFlowContext
        router.push("/create/step-7-generating");
    };

    return (
        <StepLayout currentStep={6} totalSteps={7} title={t.styleQuestion}>
            {/* Style Choices Grid - 2 columns for better fit if many options */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full content-start">
                {STYLES.map((style) => (
                    <OptionCard
                        key={style.id}
                        id={style.id}
                        labelEn={style.label_en}
                        labelId={style.label_id}
                        icon={style.icon}
                        onClick={handleSelect}
                        layout="square"
                    />
                ))}
            </div>

            {/* Skip Action */}
            <div className="w-full mt-8">
                <button
                    onClick={handleSkip}
                    className="w-full min-h-[72px] bg-surface text-ink font-creator font-bold text-xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Surprise me' : 'Kejutkan saya'}
                </button>
            </div>
        </StepLayout>
    );
}
