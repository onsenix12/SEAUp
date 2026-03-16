"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useMusicFlow } from "@/contexts/MusicFlowContext";
import { TOTAL_STEPS } from "@/lib/constants/creation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import FacilitatorPromptCard from '@/components/facilitator/FacilitatorPromptCard';
import { useFacilitatorPrompt } from '@/hooks/useFacilitatorPrompt';
import { StepLayout } from "@/components/ui/StepLayout";
import { JOURNEY_CONTENT } from '@/lib/journey/content';
import { Journey } from '@/types';

// Dynamically import CanvasEditor to avoid SSR issues with Konva
const CanvasEditor = dynamic(() => import("@/components/CanvasEditor"), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-square bg-canvas border-2 border-border rounded-creator flex items-center justify-center">
            <span className="font-creator text-muted">Loading Canvas...</span>
        </div>
    ),
});

export default function Step5Canvas() {
    const { language } = useLanguage();
    const { state, updateState } = useCreationFlow();
    const { updateState: musicUpdateState } = useMusicFlow();
    const router = useRouter();

    const journey = (state.journey ?? 'feelings') as Journey;
    const canvasConfig = JOURNEY_CONTENT[journey].canvas;
    const canvasPrompt = language === 'id' ? canvasConfig.prompt_id : canvasConfig.prompt_en;

    const { shouldShow, prompt, language: promptLanguage, dismiss } = useFacilitatorPrompt('canvas');
    const showCard = shouldShow;

    const [shouldExport, setShouldExport] = useState(false);

    const handleSkip = () => {
        if (journey === 'sounds') {
            // Sounds journey skips canvas entirely — bridge to music flow with existing choices
            const soundEffects = state.colour_palette?.split(',').filter(Boolean) ?? [];
            musicUpdateState({ mode: 'from_scratch', soundEffects, journey: 'sounds', nickname: state.nickname });
            router.push("/create/music/generating");
        } else {
            router.push("/create/step-6-style");
        }
    };

    const handleNext = () => {
        // Trigger export on the canvas
        setShouldExport(true);
    };

    const handleCanvasExport = (base64: string, hasDrawn: boolean, stickersUsed: number) => {
        // Called by CanvasEditor after it finishes generating toDataURL
        updateState({
            canvas_base64: base64,
            has_drawn: hasDrawn,
            stickers_used: stickersUsed,
            photo_taken: !!state.photo_base64
        });

        if (journey === 'sounds') {
            // Bridge sound choices into MusicFlowContext and generate music
            const soundEffects = state.colour_palette?.split(',').filter(Boolean) ?? [];
            // Include emotional tone (subject) as extra context for the music prompt
            const allEffects = state.subject ? [...soundEffects, state.subject] : soundEffects;
            musicUpdateState({ mode: 'from_scratch', soundEffects: allEffects, journey: 'sounds', nickname: state.nickname });
            router.push("/create/music/generating");
        } else {
            router.push("/create/step-6-style");
        }
    };

    return (
        <>
        {showCard && prompt && (
            <FacilitatorPromptCard
                prompt={prompt}
                language={promptLanguage}
                onContinue={dismiss}
                stepLabel={promptLanguage === 'id' ? 'Sebelum Kanvas' : 'Before Canvas'}
            />
        )}
        <StepLayout currentStep={5} totalSteps={TOTAL_STEPS} title={canvasPrompt}>
            {/* Main Interaction Area */}
            <div className="flex flex-col items-center w-full pb-48">
                <CanvasEditor
                    backgroundImageBase64={state.photo_base64}
                    shouldExport={shouldExport}
                    onExport={handleCanvasExport}
                    stickers={canvasConfig.stickers}
                    showStickers={canvasConfig.stickers.length > 0}
                />
            </div>

            {/* Action Buttons — sticky so they're always reachable */}
            <div className="fixed bottom-0 left-0 right-0 flex flex-col gap-3 p-4 bg-canvas border-t border-border z-10">
                <button
                    onClick={handleNext}
                    className="w-full min-h-[64px] bg-signal text-ink font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Done drawing' : 'Selesai menggambar'}
                </button>
                <button
                    onClick={handleSkip}
                    className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Skip for now' : 'Lewati dulu'}
                </button>
            </div>
        </StepLayout>
        </>
    );
}
