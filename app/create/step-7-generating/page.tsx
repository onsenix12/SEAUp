"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { TOTAL_STEPS } from "@/lib/constants/creation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Step6Generating() {
    const { language } = useLanguage();
    const { state } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    useEffect(() => {
        let isMounted = true;

        const generateArtwork = async () => {
            console.log("Generating with choices:", state);
            try {
                // Ensure we don't double fire in React Strict Mode
                const response = await fetch("/api/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(state),
                });

                const result = await response.json();

                if (result.success && isMounted) {
                    // Save both url and story to state so Step 8 and the DB can read it
                    sessionStorage.setItem("generated_artwork_url", result.data.imageUrl);
                    sessionStorage.setItem("generated_creation_story", result.data.creationStory);
                    router.push("/create/step-8-result");
                } else if (!result.success && isMounted) {
                    console.error("Generation failed:", result.error);
                }

            } catch (err) {
                console.error("Fetch execution error:", err);
            }
        };

        generateArtwork();

        return () => {
            isMounted = false;
        };
    }, [router, state]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative pt-8 pb-8">

            {/* Step Counter */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    {TOTAL_STEPS.toString().padStart(2, '0')} / {TOTAL_STEPS.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Main Animation Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[400px]">
                {/* Pixel Breath Animation - 3x3 Grid of pulsing dots */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 bg-ink rounded-sm pixel-dot"
                            style={{ animationDelay: `${i * 0.15}s` }} // Stagger the pulses
                        />
                    ))}
                </div>

                <h2 className="font-creator text-2xl font-bold text-ink text-center animate-pulse">
                    {t.generating}
                </h2>

                <p className="font-body text-muted text-center mt-4 max-w-[250px]">
                    {language === 'en'
                        ? 'Our AI is mixing your choices into something beautiful.'
                        : 'AI kami sedang memadukan pilihanmu menjadi sesuatu yang indah.'}
                </p>
            </div>

        </div>
    );
}
