"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";
import { StepOption } from '@/lib/journey/content';
import { Journey } from '@/types';

import { TOTAL_STEPS } from "@/lib/constants/creation";

const STEP2_QUESTIONS: Record<Journey, { en: string; id: string }> = {
    feelings: { en: 'Where do you feel this?',  id: 'Di mana kamu merasakan ini?' },
    world:    { en: 'What do you see there?',   id: 'Apa yang kamu lihat di sana?' },
    sounds:   { en: 'Pick your sounds',         id: 'Pilih suaramu' },
};

export default function Step2Colour() {
    const { language } = useLanguage();
    const { state, updateState } = useCreationFlow();
    const router = useRouter();

    const journey = (state.journey ?? 'feelings') as Journey;
    const question = language === 'id' ? STEP2_QUESTIONS[journey].id : STEP2_QUESTIONS[journey].en;

    const [options, setOptions] = useState<StepOption[]>([]);
    const [loading, setLoading] = useState(true);
    const isMultiSelect = journey === 'sounds';
    const [selected, setSelected] = useState<string[]>([]);

    // Clear chip selections whenever the flow is reset (colour_palette becomes undefined)
    useEffect(() => {
        if (!state.colour_palette) setSelected([]);
    }, [state.colour_palette]);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/journey-options', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ journey, step: 2, step1_value: state.mood ?? '' }),
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
    }, [journey, state.mood]);

    const handleSingleSelect = (opt: StepOption) => {
        updateState({ colour_palette: opt.value });
        router.push("/create/step-3-subject");
    };

    const handleChipToggle = (value: string) => {
        setSelected(prev => {
            if (prev.includes(value)) return prev.filter(v => v !== value);
            if (prev.length >= 3) return prev;
            return [...prev, value];
        });
    };

    const handleMultiDone = () => {
        updateState({ colour_palette: selected.join(',') });
        router.push("/create/step-3-subject");
    };

    return (
        <StepLayout currentStep={2} totalSteps={TOTAL_STEPS} title={question}>
            <div className="flex flex-col gap-4 w-full">
                {loading ? (
                    <>
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                        <div className="bg-ink/5 animate-pulse rounded-2xl h-16 w-full" />
                    </>
                ) : isMultiSelect ? (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            {options.map((opt) => {
                                const isOn = selected.includes(opt.value);
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleChipToggle(opt.value)}
                                        className={`min-h-[72px] rounded-2xl font-creator font-bold text-base transition-all duration-150 active:scale-[0.96] touch-manipulation border-2 flex items-center justify-center gap-2 px-3 ${
                                            isOn
                                                ? 'border-teal-500 bg-teal-50 text-ink'
                                                : 'border-border bg-surface text-ink/70 hover:border-ink/30'
                                        }`}
                                    >
                                        <span>{opt.emoji}</span>
                                        <span>{language === 'id' ? opt.label_id : opt.label_en}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {selected.length > 0 && (
                            <button
                                onClick={handleMultiDone}
                                className="bg-signal text-ink font-semibold py-3 rounded-xl w-full mt-4 font-creator text-lg"
                            >
                                {language === 'id' ? 'Selesai →' : 'Done →'}
                            </button>
                        )}
                    </>
                ) : (
                    options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSingleSelect(opt)}
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
