"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { StepOption } from '@/lib/journey/content';
import { Journey } from '@/types';

import { TOTAL_STEPS } from "@/lib/constants/creation";

const STEP3_QUESTIONS: Record<Journey, { en: string; id: string }> = {
    feelings: { en: 'Pick your colours',        id: 'Pilih warnamu' },
    world:    { en: 'Pick your colours',        id: 'Pilih warnamu' },
    sounds:   { en: 'How do these sounds feel?',id: 'Bagaimana rasanya suara-suara ini?' },
};

export default function Step3Subject() {
    const { language } = useLanguage();
    const { state, updateState } = useCreationFlow();
    const router = useRouter();

    const journey = (state.journey ?? 'feelings') as Journey;
    const question = language === 'id' ? STEP3_QUESTIONS[journey].id : STEP3_QUESTIONS[journey].en;

    const [options, setOptions] = useState<StepOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/journey-options', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        journey,
                        step: 3,
                        step1_value: state.mood ?? '',
                        step2_value: state.colour_palette ?? '',
                    }),
                });
                const data = await res.json();
                setOptions(data.options);
            } catch {
                // Fallback handled by the API route itself
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [journey, state.mood, state.colour_palette]);

    const handleSelect = (opt: StepOption) => {
        updateState({ subject: opt.value });
        router.push("/create/step-4-photo");
    };

    return (
        <StepLayout currentStep={3} totalSteps={TOTAL_STEPS} title={question}>
            <div className="flex flex-col gap-4 w-full">
                {loading ? (
                    <>
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                    </>
                ) : (
                    options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt)}
                            className="w-full min-h-[72px] bg-surface border-2 border-border rounded-2xl px-5 flex items-center gap-4 active:scale-[0.98] transition-transform touch-manipulation hover:border-ink/30"
                        >
                            <span className="text-3xl">{opt.emoji}</span>
                            <span className="font-creator font-bold text-lg text-ink">
                                {language === 'id' ? opt.label_id : opt.label_en}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </StepLayout>
    );
}
