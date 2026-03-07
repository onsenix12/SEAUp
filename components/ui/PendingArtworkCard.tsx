import React from 'react';

interface PendingArtworkCardProps {
    id: string;
    imageUrl: string;
    creatorName: string;
    organisation?: string;
    mood: string;
    colourPalette: string;
    subject: string;
    isUpdating: boolean;
    onAction: (id: string, action: 'approved' | 'rejected') => void;
}

export function PendingArtworkCard({
    id,
    imageUrl,
    creatorName,
    organisation,
    mood,
    colourPalette,
    subject,
    isUpdating,
    onAction
}: PendingArtworkCardProps) {
    return (
        <div className="bg-surface rounded-creator border-2 border-border overflow-hidden flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Pending Artwork" className="w-full aspect-square object-cover bg-border" />

            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-creator font-bold text-lg leading-tight uppercase">
                        {creatorName || "Anonymous Creator"}
                    </h3>
                    {organisation && (
                        <p className="font-mono text-xs text-muted mt-1 tracking-wider uppercase">
                            {organisation}
                        </p>
                    )}
                </div>

                <div className="text-sm font-body text-ink/80 mb-6 bg-canvas p-3 rounded-xl border border-border">
                    Made with: {mood}, {colourPalette}, {subject}
                </div>

                <div className="mt-auto flex gap-3">
                    <button
                        onClick={() => onAction(id, 'rejected')}
                        disabled={isUpdating}
                        className="flex-1 min-h-[56px] border-2 border-border text-ink font-bold rounded-creator hover:bg-canvas disabled:opacity-50"
                    >
                        Keep Private
                    </button>
                    <button
                        onClick={() => onAction(id, 'approved')}
                        disabled={isUpdating}
                        className="flex-1 min-h-[56px] bg-ink text-surface font-bold rounded-creator hover:opacity-90 disabled:opacity-50"
                    >
                        Approve Shop
                    </button>
                </div>
            </div>
        </div>
    );
}
