"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step7Result() {
    const { language } = useLanguage();
    const { state, resetState } = useCreationFlow();
    const { sessionData } = useFacilitator();
    const router = useRouter();
    const t = COPY[language];

    const getCachedArtwork = () => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("generated_artwork_url") || "https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Loading...";
        }
        return "https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Loading...";
    };

    const artworkUrl = getCachedArtwork();
    const [isSaving, setIsSaving] = useState(false);

    // Facilitator-only state
    const [sessionNotes, setSessionNotes] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleTryAgain = () => {
        resetState();
        sessionStorage.removeItem("generated_artwork_url");
        router.replace("/create/step-1-mood");
    };

    const handleSaveToGallery = async () => {
        setIsSaving(true);
        try {
            const savePayload = {
                state,
                artworkUrl,
                facilitatorData: sessionData.isActive ? {
                    facilitatorId: sessionData.facilitatorId,
                    creatorName: sessionData.creatorName,
                    organisation: sessionData.organisation,
                    sessionStartTime: sessionData.sessionStartTime,
                    sessionNotes,
                    isPublic
                } : null
            };

            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savePayload)
            });
            const data = await response.json();

            if (!data.success) {
                console.error("Save failed:", data.error);
                alert(`Failed to save to gallery: ${data.error}`);
                return;
            }

            sessionStorage.removeItem("generated_artwork_url");
            router.push("/gallery");

        } catch (error) {
            console.error("Error saving to gallery:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
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

            {/* Facilitator Override Block */}
            {sessionData.isActive && (
                <div className="w-full bg-signal/20 border-2 border-signal rounded-creator p-4 mb-6 flex flex-col gap-4">
                    <h3 className="font-creator font-bold text-ink/80 text-sm tracking-wide">FACILITATOR REVIEW</h3>

                    <div>
                        <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="Session notes (optional)..."
                            className="w-full bg-surface border-2 border-border rounded-creator px-4 py-3 font-creator text-sm focus:outline-none focus:border-ink min-h-[80px]"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-6 h-6 rounded-md border-2 border-ink text-ink focus:ring-ink cursor-pointer"
                        />
                        <span className="font-creator font-bold text-ink/80">Approve for Public Gallery</span>
                    </label>
                </div>
            )}

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
