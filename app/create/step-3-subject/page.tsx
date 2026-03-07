"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";

// Base subjects. Note: This could be dynamically loaded from DB in the future.
const SUBJECTS = [
    { id: "nature", label_en: "Nature", label_id: "Alam", icon: "🍃" },
    { id: "city", label_en: "Cityscape", label_id: "Kota", icon: "🏙️" },
    { id: "abstract", label_en: "Abstract", label_id: "Abstrak", icon: "🎨" },
];

export default function Step3Subject() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const handleSelect = (subjectId: string) => {
        updateState({ subject: subjectId });
        router.push("/create/step-4-photo");
    };

    return (
        <StepLayout currentStep={3} totalSteps={7} title={t.subjectQuestion}>
            {/* 3 Choices */}
            <div className="flex flex-col gap-4 w-full">
                {SUBJECTS.map((subject) => (
                    <OptionCard
                        key={subject.id}
                        id={subject.id}
                        labelEn={subject.label_en}
                        labelId={subject.label_id}
                        icon={subject.icon}
                        onClick={handleSelect}
                        layout="row"
                    />
                ))}
            </div>
        </StepLayout>
    );
}
