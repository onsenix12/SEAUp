"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

import { MOODS, TOTAL_STEPS } from "@/lib/constants/creation";

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
        <StepLayout currentStep={1} totalSteps={TOTAL_STEPS} title={t.moodQuestion}>
            {/* 3 Choices - Vertical Stack for immediate accessibility */}
            <div className="flex flex-col gap-4 w-full">
                {MOODS.map((mood) => (
                    <OptionCard
                        key={mood.id}
                        id={mood.id}
                        labelEn={mood.label_en}
                        labelId={mood.label_id}
                        icon={mood.icon}
                        iconBgClass={mood.color}
                        onClick={handleSelect}
                        activeColorClass={`active:border-signal active:${mood.color}`}
                    />
                ))}
            </div>
        </StepLayout>
    );
}
