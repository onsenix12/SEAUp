"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

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
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-8">

            {/* Step Counter */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    03 / 06
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="font-creator text-3xl font-bold text-ink">
                    {t.subjectQuestion}
                </h2>
            </div>

            {/* 3 Choices */}
            <div className="flex flex-col gap-4 w-full">
                {SUBJECTS.map((subject) => (
                    <button
                        key={subject.id}
                        onClick={() => handleSelect(subject.id)}
                        className="min-h-[100px] w-full rounded-creator border-2 border-border flex items-center p-6 gap-6 bg-surface active:scale-[0.96] active:border-signal transition-all duration-100 touch-manipulation group"
                    >
                        <div className="w-12 h-12 rounded-full bg-canvas border border-border flex items-center justify-center text-2xl shadow-sm group-active:scale-110 transition-transform">
                            {subject.icon}
                        </div>

                        <span className="font-creator font-bold text-2xl text-ink">
                            {language === 'en' ? subject.label_en : subject.label_id}
                        </span>
                    </button>
                ))}
            </div>

        </div>
    );
}
