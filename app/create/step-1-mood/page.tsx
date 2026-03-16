"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useRouter } from "next/navigation";
import FacilitatorPromptCard from '@/components/facilitator/FacilitatorPromptCard';
import { useFacilitatorPrompt } from '@/hooks/useFacilitatorPrompt';
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";
import { JOURNEY_CONTENT } from '@/lib/journey/content';
import { Journey } from '@/types';

import { TOTAL_STEPS } from "@/lib/constants/creation";

export default function Step1Mood() {
    const { language } = useLanguage();
    const { state, updateState } = useCreationFlow();
    const router = useRouter();

    const journey = (state.journey ?? 'feelings') as Journey;
    const stepContent = JOURNEY_CONTENT[journey].step1;
    const question = language === 'id' ? stepContent.question_id : stepContent.question_en;
    const options = stepContent.options.slice(0, 3);

    const { shouldShow, prompt, language: promptLanguage, dismiss } = useFacilitatorPrompt('step1');
    const showCard = shouldShow;

    const handleSelect = (moodId: string) => {
        updateState({ mood: moodId });
        router.push("/create/step-2-colour");
    };

    return (
        <>
        {showCard && prompt && (
            <FacilitatorPromptCard
                prompt={prompt}
                language={promptLanguage}
                onContinue={dismiss}
                stepLabel={promptLanguage === 'id' ? 'Sebelum Langkah 1' : 'Before Step 1'}
            />
        )}
        <StepLayout currentStep={1} totalSteps={TOTAL_STEPS} title={question}>
            {/* 3 Choices - Vertical Stack for immediate accessibility */}
            <div className="flex flex-col gap-4 w-full">
                {options.map((opt) => (
                    <OptionCard
                        key={opt.id}
                        id={opt.value}
                        labelEn={opt.label_en}
                        labelId={opt.label_id}
                        icon={opt.emoji}
                        onClick={handleSelect}
                    />
                ))}
            </div>
        </StepLayout>
        </>
    );
}
