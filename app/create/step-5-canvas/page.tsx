"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { StepLayout } from "@/components/ui/StepLayout";

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
    const router = useRouter();
    const t = COPY[language];

    const [shouldExport, setShouldExport] = useState(false);

    const handleSkip = () => {
        router.push("/create/step-6-style");
    };

    const handleNext = () => {
        // Trigger export on the canvas
        setShouldExport(true);
    };

    const handleCanvasExport = (base64: string) => {
        // Called by CanvasEditor after it finishes generating toDataURL
        updateState({ canvas_base64: base64 });
        router.push("/create/step-6-style");
    };

    return (
        <StepLayout
            currentStep={5}
            totalSteps={7}
            // @ts-ignore
            title={t.canvasQuestion}
            // @ts-ignore
            subtitle={t.canvasSubtitle}
        >
            {/* Main Interaction Area */}
            <div className="flex-1 flex flex-col items-center w-full">
                <CanvasEditor
                    backgroundImageBase64={state.photo_base64}
                    shouldExport={shouldExport}
                    onExport={handleCanvasExport}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full mt-8">
                <button
                    onClick={handleNext}
                    className="w-full min-h-[72px] bg-signal text-ink font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Done drawing' : 'Selesai menggambar'}
                </button>
                <button
                    onClick={handleSkip}
                    className="w-full min-h-[72px] bg-surface text-ink font-creator font-bold text-xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Skip for now' : 'Lewati dulu'}
                </button>
            </div>
        </StepLayout>
    );
}
