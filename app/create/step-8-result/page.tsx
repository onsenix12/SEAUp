"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step8Decision() {
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
    const [choice, setChoice] = useState<'print' | 'shop' | null>(null);

    const handleTryAgain = () => {
        resetState();
        sessionStorage.removeItem("generated_artwork_url");
        sessionStorage.removeItem("existing_artwork_id");
        router.replace("/create/step-1-mood");
    };

    const handleSaveDecision = async (decision: 'printed' | 'pending_review') => {
        setIsSaving(true);
        setChoice(decision === 'printed' ? 'print' : 'shop');

        const existingId = sessionStorage.getItem("existing_artwork_id");

        try {
            if (existingId) {
                const response = await fetch('/api/update-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: existingId,
                        marketplaceStatus: decision
                    })
                });
                const data = await response.json();

                if (!data.success) {
                    console.error("Update failed:", data.error);
                    alert(`Failed to update: ${data.error}`);
                    setIsSaving(false);
                    setChoice(null);
                    return;
                }

                sessionStorage.removeItem("generated_artwork_url");
                sessionStorage.removeItem("existing_artwork_id");

                if (decision === 'printed') {
                    router.push("/create/step-9-print");
                } else {
                    router.push("/create/step-9-shop-success");
                }
                return;
            }

            const savePayload = {
                state,
                artworkUrl,
                marketplaceStatus: decision,
                facilitatorData: sessionData.isActive ? {
                    facilitatorId: sessionData.facilitatorId,
                    creatorName: sessionData.creatorName,
                    organisation: sessionData.organisation,
                    sessionStartTime: sessionData.sessionStartTime,
                    // Passing empty notes as they are now done in the Dashboard later
                    sessionNotes: "",
                    isPublic: false // Always starts false until organizer approves
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
                alert(`Failed to save: ${data.error}`);
                setIsSaving(false);
                setChoice(null);
                return;
            }

            sessionStorage.removeItem("generated_artwork_url");

            // Route based on decision
            if (decision === 'printed') {
                router.push("/create/step-9-print");
            } else {
                router.push("/create/step-9-shop-success");
            }

        } catch (error) {
            console.error("Error saving decision:", error);
            alert("An error occurred while saving.");
            setIsSaving(false);
            setChoice(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8">

            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="font-creator text-3xl font-bold text-ink mb-2">
                    {language === 'en' ? 'Your Masterpiece' : 'Karya Utama Anda'}
                </h2>
                <p className="font-body text-muted text-lg">
                    {language === 'en' ? 'What do you want to do with it?' : 'Apa yang ingin Anda lakukan karyanya?'}
                </p>
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

            {/* The Decision Layer */}
            <div className="flex flex-col gap-4 w-full mt-auto">
                <button
                    onClick={() => handleSaveDecision('printed')}
                    disabled={isSaving}
                    className="w-full min-h-[80px] bg-canvas text-ink font-creator font-bold text-2xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70 flex flex-col items-center justify-center p-4 hover:border-signal group"
                >
                    <span>{choice === 'print' ? (language === 'en' ? 'Preparing...' : 'Siap-siap...') : (language === 'en' ? 'Print for Myself' : 'Cetak untuk Saya')}</span>
                    <span className="text-sm font-body font-normal text-muted group-hover:text-ink">Put on a bag, phone case, and more</span>
                </button>

                <button
                    onClick={() => handleSaveDecision('pending_review')}
                    disabled={isSaving}
                    className="w-full min-h-[80px] bg-signal text-ink font-creator font-bold text-2xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70 flex flex-col items-center justify-center p-4"
                >
                    <span>{choice === 'shop' ? (language === 'en' ? 'Submitting...' : 'Mengirim...') : (language === 'en' ? 'Sell in the Shop' : 'Jual di Toko')}</span>
                    <span className="text-sm font-body font-normal text-ink/80">Share with the world and organizers</span>
                </button>

                {/* Secondary Actions Row */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleTryAgain}
                        disabled={isSaving}
                        className="font-creator font-bold text-muted hover:text-ink active:scale-[0.96] transition-transform p-4 text-lg"
                    >
                        {t.tryAgain}
                    </button>
                </div>
            </div>

        </div>
    );
}
