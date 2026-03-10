"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/ui/StepLayout";

export default function StartPage() {
    const { language } = useLanguage();
    const { updateState, state } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const [nickname, setNickname] = useState(state.nickname || "");

    const handleNext = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Save nickname (can be empty string for anonymous flow)
        updateState({ nickname: nickname.trim() });
        router.push("/create/step-1-mood");
    };

    return (
        <StepLayout currentStep={0} totalSteps={7} title={t.nicknameQuestion}>
            <form onSubmit={handleNext} className="flex flex-col gap-8 w-full h-full flex-1">

                <div className="flex-1 flex flex-col justify-center items-center">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t.nicknamePlaceholder}
                        maxLength={20}
                        className="w-full max-w-sm bg-transparent border-b-4 border-ink/20 focus:border-ink text-center text-4xl md:text-5xl font-creator font-bold text-ink placeholder:text-ink/20 focus:outline-none transition-colors pb-4"
                        autoFocus
                    />
                    <p className="font-mono text-xs text-muted/60 tracking-widest mt-3">
                        {nickname.length} / 20 characters
                    </p>
                </div>

                {/* Sticky Bottom Actions */}
                <div className="mt-auto hidden md:flex justify-between items-center pt-8 border-t border-ink/10">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="font-body text-ink/60 font-medium hover:text-ink transition-colors px-4 py-2"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!nickname.trim()}
                        className="bg-signal text-ink font-semibold text-lg tracking-wide px-10 h-[56px] rounded-full hover:bg-signal/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>

                {/* Mobile FAB style Next button */}
                <button
                    type="submit"
                    disabled={!nickname.trim()}
                    className="md:hidden fixed bottom-8 right-8 bg-signal text-ink font-bold text-lg h-16 w-16 rounded-full shadow-lg flex items-center justify-center hover:bg-signal/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-50"
                >
                    →
                </button>
            </form>
        </StepLayout>
    );
}
