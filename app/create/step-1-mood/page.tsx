"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

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
        <StepLayout currentStep={1} totalSteps={7} title={t.moodQuestion}>
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
