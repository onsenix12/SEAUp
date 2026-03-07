"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step7Result() {
    const { language } = useLanguage();
    const { state, resetState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    // Use the actual generated image from SessionStorage (temp persistence for MVP until DB integration in Phase 3)
    // Safe read for SSR context
    const getCachedArtwork = () => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("generated_artwork_url") || "https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Loading...";
        }
        return "https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Loading...";
    };

    const artworkUrl = getCachedArtwork();
    const [isSaving, setIsSaving] = useState(false);

    const handleTryAgain = () => {
        console.log("Previous final state was:", state);
        // Reset flow and go back to step 1
        resetState();
        sessionStorage.removeItem("generated_artwork_url");
        router.replace("/create/step-1-mood");
    };

    const handleSaveToGallery = async () => {
        // Phase 2: Save to Supabase and trigger public gallery display
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate save
        setIsSaving(false);
        // router.push("/gallery");
        console.log("Saved to gallery");
    };

    const handleShare = async () => {
        // Phase 2: Open native share tray or copy link
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My SEA-Up Artwork',
                    text: 'Check out what I made!',
                    url: window.location.href, // Or the specific artwork URL
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            console.log("Native share not supported. Copying link instead.");
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8">

            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="font-creator text-2xl font-bold text-ink">
                    {language === 'en' ? 'Your Creation' : 'Karya Kamu'}
                </h2>
            </div>

            {/* Artwork Display Area */}
            <div className="w-full aspect-square rounded-creator overflow-hidden border-2 border-border shadow-md bg-canvas mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={artworkUrl}
                    alt="Generated Artwork"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full mt-auto">

                {/* Primary Action: Save to Gallery */}
                <button
                    onClick={handleSaveToGallery}
                    disabled={isSaving}
                    className="w-full min-h-[72px] bg-signal text-ink font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
                >
                    {isSaving ? (language === 'en' ? 'Saving...' : 'Menyimpan...') : t.saveToGallery}
                </button>

                {/* Secondary Actions Row */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                        onClick={handleShare}
                        className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border active:scale-[0.96] transition-transform"
                    >
                        {t.share}
                    </button>

                    <button
                        onClick={handleTryAgain}
                        className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border active:scale-[0.96] transition-transform"
                    >
                        {t.tryAgain}
                    </button>
                </div>

            </div>

        </div>
    );
}
