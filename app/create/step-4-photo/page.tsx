"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { TOTAL_STEPS } from "@/lib/constants/creation";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { StepLayout } from "@/components/ui/StepLayout";

export default function Step4Photo() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local state to show selected image before proceeding
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleSkip = () => {
        router.push("/create/step-5-canvas");
    };

    const handleNext = () => {
        // In Phase 2, this base64 string will be sent to the backend.
        if (selectedImage) {
            updateState({ photo_base64: selectedImage });
        }
        router.push("/create/step-5-canvas");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert file to Base64 immediately for preview and backend
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <StepLayout currentStep={4} totalSteps={TOTAL_STEPS} title={t.photoQuestion}>
            {/* Main Interaction Area */}
            <div className="flex-1 flex flex-col items-center w-full min-h-[300px]">
                {selectedImage ? (
                    // Image Preview State
                    <div className="relative w-full aspect-square max-h-[400px] rounded-creator overflow-hidden border-2 border-border shadow-sm bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedImage} alt="Selected" className="object-cover w-full h-full" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-ink text-surface rounded-full p-2 text-sm font-bold shadow-md hover:scale-105 transition-transform"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    // Upload Prompt State
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex-1 min-h-[300px] border-2 border-dashed border-muted rounded-creator bg-surface flex flex-col items-center justify-center gap-6 active:bg-canvas transition-colors group touch-manipulation"
                    >
                        <div className="w-16 h-16 rounded-full bg-signal flex items-center justify-center text-3xl group-active:scale-95 transition-transform shadow-sm text-ink">
                            📸
                        </div>
                        <span className="font-body text-xl text-ink font-medium">
                            {language === 'en' ? 'Tap to take or choose photo' : 'Ketuk untuk mengambil/memilih foto'}
                        </span>
                    </button>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment" // Suggest rear camera on mobile
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full mt-8">
                {selectedImage ? (
                    <button
                        onClick={handleNext}
                        className="w-full min-h-[72px] bg-signal text-ink font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform"
                    >
                        {language === 'en' ? 'Use this photo' : 'Gunakan foto ini'}
                    </button>
                ) : (
                    <button
                        onClick={handleSkip}
                        className="w-full min-h-[72px] bg-surface text-ink font-creator font-bold text-xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform"
                    >
                        {language === 'en' ? 'Skip for now' : 'Lewati dulu'}
                    </button>
                )}
            </div>
        </StepLayout>
    );
}
