"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Artwork } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreationFlow } from "@/contexts/CreationFlowContext";

interface ArtworkDetailProps {
    artwork: Artwork & { creators: { name?: string, organisation: string } };
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailProps) {
    const { language } = useLanguage();
    const router = useRouter();
    const { state } = useCreationFlow();
    const [isSaving, setIsSaving] = useState(false);
    const [savingAction, setSavingAction] = useState<string | null>(null);

    const isOwner = state.nickname === artwork.creators?.name;
    const isSentToOrganizer = artwork.marketplace_status === 'pending_review' || artwork.marketplace_status === 'approved' || artwork.marketplace_status === 'rejected';

    const handleAction = async (decision: 'printed' | 'pending_review') => {
        setIsSaving(true);
        setSavingAction(decision);
        try {
            const response = await fetch('/api/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: artwork.id,
                    marketplaceStatus: decision
                })
            });
            const data = await response.json();

            if (!data.success) {
                console.error("Update failed:", data.error);
                alert(language === 'en' ? `Failed to update: ${data.error}` : `Gagal memperbarui: ${data.error}`);
                setIsSaving(false);
                setSavingAction(null);
                return;
            }

            sessionStorage.setItem("generated_artwork_url", artwork.image_url);
            sessionStorage.setItem("existing_artwork_id", artwork.id);

            if (decision === 'printed') {
                router.push("/create/step-9-print");
            } else {
                router.push("/create/step-9-shop-success");
            }
        } catch (error) {
            console.error("Error saving decision:", error);
            alert(language === 'en' ? "An error occurred while saving." : "Terjadi kesalahan saat menyimpan.");
            setIsSaving(false);
            setSavingAction(null);
        }
    };

    const t = {
        back: language === 'en' ? 'Back' : 'Kembali',
        share: language === 'en' ? 'Share Artwork' : 'Bagikan Karya',
        create: language === 'en' ? 'Create Your Own' : 'Buat Karyamu Sendiri',
        by: language === 'en' ? 'Created by' : 'Dibuat oleh',
        unknown: language === 'en' ? 'Creator at' : 'Kreator di',
        delete: language === 'en' ? 'Delete Artwork' : 'Hapus Karya',
        confirmDelete: language === 'en' ? 'Are you sure you want to delete this artwork?' : 'Apakan Anda yakin ingin menghapus karya ini?',
        storyTitle: language === 'en' ? 'The Story' : 'Ceritanya',
    };

    const handleDelete = async () => {
        if (!confirm(t.confirmDelete)) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/delete-artwork', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: artwork.id })
            });
            const data = await response.json();

            if (!data.success) {
                alert(language === 'en' ? `Failed to delete: ${data.error}` : `Gagal menghapus: ${data.error}`);
                setIsSaving(false);
                return;
            }

            router.push('/gallery');
        } catch (error) {
            console.error("Error deleting:", error);
            alert(language === 'en' ? "An error occurred." : "Terjadi kesalahan.");
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SEA-Up Artwork',
                    text: 'Check out this amazing artwork created at MINDS!',
                    url: window.location.href, // Current URL
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'en' ? "Link copied to clipboard!" : "Tautan disalin ke papan klip!");
        }
    };

    const creatorNameText = artwork.creators?.name
        ? `${t.by} ${artwork.creators.name}`
        : `${t.unknown} ${artwork.creators?.organisation || 'SEA-Up'}`;

    const dateText = new Date(artwork.created_at).toLocaleDateString(language === 'en' ? 'en-SG' : 'id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8">

            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-6 px-2">
                <button
                    onClick={() => router.push('/gallery')}
                    className="p-2 -ml-2 text-ink active:scale-95 transition-transform flex items-center gap-2"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span className="font-creator font-bold text-lg">{t.back}</span>
                </button>

                {isOwner && (
                    <button
                        onClick={handleDelete}
                        disabled={isSaving}
                        className="text-red-500 font-body text-sm font-bold active:scale-95 transition-transform disabled:opacity-50"
                    >
                        {t.delete}
                    </button>
                )}
            </div>

            {/* Artwork Display Area with Attribution Overlay */}
            <div className="w-full aspect-square rounded-creator overflow-hidden border-2 border-border shadow-md bg-canvas mb-8 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={artwork.image_url}
                    alt={`Artwork by ${artwork.creators?.name || 'Unknown'}`}
                    className="w-full h-full object-cover"
                />

                {/* Attribution Overlay (Phase 3.5) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
                    <p className="text-canvas font-creator font-bold text-xl drop-shadow-md">
                        {creatorNameText}
                    </p>
                    <p className="text-canvas/80 font-mono text-sm tracking-wide mt-1">
                        {dateText}
                    </p>
                </div>
            </div>

            {/* Story Display */}
            {artwork.creation_story && (
                <div className="bg-surface border border-border rounded-creator p-5 mb-8 w-full shadow-sm">
                    <h3 className="font-creator font-bold text-ink mb-2">
                        {t.storyTitle}
                    </h3>
                    <p className="font-body text-ink/80 text-sm leading-relaxed">
                        {artwork.creation_story}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full mt-auto">
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleAction('printed')}
                        disabled={isSaving}
                        className="w-full min-h-[64px] bg-canvas text-ink font-creator font-bold text-xl rounded-creator border-2 border-ink shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-surface"
                    >
                        {savingAction === 'printed' ? (language === 'en' ? 'Preparing...' : 'Siap-siap...') : (language === 'en' ? 'Print Artwork' : 'Cetak Karya')}
                    </button>
                    <button
                        onClick={() => handleAction('pending_review')}
                        disabled={isSentToOrganizer || isSaving}
                        className="w-full min-h-[64px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-muted"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {isSentToOrganizer
                            ? (language === 'en' ? 'Sent to Shop' : 'Dikirim ke Toko')
                            : (savingAction === 'pending_review' ? (language === 'en' ? 'Sending...' : 'Mengirim...') : (language === 'en' ? 'Sell in Shop' : 'Jual di Toko'))}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                        onClick={handleShare}
                        className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border active:scale-[0.96] transition-transform"
                    >
                        {t.share}
                    </button>

                    <button
                        onClick={() => router.push('/create/step-1-mood')}
                        className="w-full min-h-[64px] bg-surface text-ink font-creator font-bold text-lg rounded-creator border-2 border-border active:scale-[0.96] transition-transform"
                    >
                        {t.create}
                    </button>
                </div>
            </div>

        </div>
    );
}
