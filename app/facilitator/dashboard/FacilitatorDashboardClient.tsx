"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PendingArtworkCard } from "@/components/ui/PendingArtworkCard";
import { ApprovalModal } from "@/components/ui/ApprovalModal";

interface PendingArtwork {
    id: string;
    image_url: string;
    mood: string;
    colour_palette: string;
    subject: string;
    created_at: string;
    marketplace_status: string;
    session_notes: string | null;
    creators?: {
        name: string | null;
        organisation: string;
    };
}

export default function FacilitatorDashboardClient({ initialArtworks, isAdminBypass = false }: { initialArtworks: PendingArtwork[], isAdminBypass?: boolean }) {
    const { sessionData, endSession } = useFacilitator();
    const { language } = useLanguage();
    const router = useRouter();

    const [artworks, setArtworks] = useState<PendingArtwork[]>(initialArtworks);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [approvingArtwork, setApprovingArtwork] = useState<PendingArtwork | null>(null);

    // Basic protection (in a real app, use middleware)
    if (!sessionData.isActive && !isAdminBypass) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="font-creator text-2xl font-bold mb-4">Please log in first</h1>
                    <button onClick={() => router.push('/facilitator/login')} className="bg-ink text-canvas px-6 py-3 rounded-creator font-bold">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleAction = async (artworkId: string, action: 'approved' | 'rejected', metadata?: any) => {
        if (action === 'approved' && !metadata) {
            const artwork = artworks.find(a => a.id === artworkId);
            if (artwork) setApprovingArtwork(artwork);
            return;
        }

        setIsUpdating(artworkId);
        try {
            const response = await fetch('/api/facilitator/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ artworkId, status: action, ...metadata })
            });

            const data = await response.json();

            if (data.success) {
                // Remove out of queue locally
                setArtworks(prev => prev.filter(a => a.id !== artworkId));
                setApprovingArtwork(null);
            } else {
                alert("Failed to update status: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleLogout = () => {
        if (!isAdminBypass) {
            endSession();
        }
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-canvas text-ink pt-6 pb-20 px-4 md:px-8">
            <header className="max-w-5xl mx-auto flex items-center justify-between mb-12">
                <div>
                    <h1 className="font-creator text-3xl font-bold">Organizer Queue</h1>
                    <p className="font-body text-muted mt-1">
                        Logged in: <span className="font-bold text-ink">{isAdminBypass ? "Admin (Bypass Mode)" : `${sessionData.organisation} Facilitator`}</span>
                    </p>
                </div>
                <button onClick={handleLogout} className="text-sm font-bold text-signal px-4 py-2 border-2 border-signal rounded-creator hover:bg-signal/10 transition-colors">
                    Log out
                </button>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-creator text-xl font-bold">Pending Review</h2>
                    <span className="bg-ink text-canvas px-3 py-1 rounded-full text-sm font-bold">{artworks.length}</span>
                </div>

                {artworks.length === 0 ? (
                    <div className="bg-surface rounded-creator border-2 border-border p-12 text-center flex flex-col items-center">
                        <span className="text-4xl mb-4">✨</span>
                        <h3 className="font-creator text-xl font-bold mb-2">Queue is empty</h3>
                        <p className="font-body text-muted">No pending artworks to review right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artworks.map(art => (
                            <PendingArtworkCard
                                key={art.id}
                                id={art.id}
                                imageUrl={art.image_url}
                                creatorName={art.creators?.name || "Anonymous Creator"}
                                organisation={art.creators?.organisation}
                                mood={art.mood}
                                colourPalette={art.colour_palette}
                                subject={art.subject}
                                isUpdating={isUpdating === art.id}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </main>

            {approvingArtwork && (
                <ApprovalModal
                    artwork={approvingArtwork}
                    onClose={() => setApprovingArtwork(null)}
                    onSubmit={async (id, metadata) => {
                        await handleAction(id, 'approved', metadata);
                    }}
                />
            )}
        </div>
    );
}
