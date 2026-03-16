import React, { useState } from 'react';
import { JOURNEY_META, Journey } from '@/types';
import { storageStringToSkills } from '@/lib/learning/skills';

interface PendingArtworkCardProps {
    id: string;
    imageUrl: string;
    creatorName: string;
    organisation?: string;
    mood: string;
    colourPalette: string;
    subject: string;
    journey?: string;
    learningTags?: string;
    creationStory?: string;
    priceSgd?: number;
    facilitatorId?: string;
    isUpdating: boolean;
    onAction: (id: string, action: 'approved' | 'rejected', metadata?: { creation_story: string; price_sgd: number }) => void;
}

export function PendingArtworkCard({
    id,
    imageUrl,
    creatorName,
    organisation,
    mood,
    colourPalette,
    subject,
    journey,
    learningTags,
    creationStory,
    priceSgd,
    facilitatorId,
    isUpdating,
    onAction
}: PendingArtworkCardProps) {
    const skills = storageStringToSkills(learningTags ?? '').slice(0, 3);
    const [editedStory, setEditedStory] = useState(creationStory ?? '');
    const [price, setPrice] = useState(priceSgd ?? 0);
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

                <div className="text-sm font-body text-ink/80 mb-4 bg-canvas p-3 rounded-xl border border-border">
                    Made with: {mood}, {colourPalette}, {subject}
                </div>

                {/* Journey badge */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {journey && JOURNEY_META[journey as Journey] && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                            {JOURNEY_META[journey as Journey].emoji}
                            {JOURNEY_META[journey as Journey].label_en}
                        </span>
                    )}

                    {/* Facilitator status badge */}
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        facilitatorId
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-amber-50 text-amber-600'
                    }`}>
                        {facilitatorId ? '✅ Facilitator approved' : '⚠️ No facilitator'}
                    </span>
                </div>

                {/* Skills chips */}
                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-ink/5 text-ink/70"
                            >
                                {skill.emoji} {skill.label_en}
                            </span>
                        ))}
                    </div>
                )}

                {/* Creation story editor */}
                <div className="mb-4">
                    <label className="font-mono text-xs text-muted tracking-widest uppercase mb-1 block">
                        Creation Story
                    </label>
                    <textarea
                        rows={3}
                        value={editedStory}
                        onChange={e => setEditedStory(e.target.value)}
                        placeholder="No story yet..."
                        className="w-full px-3 py-2 bg-canvas border border-border rounded-xl font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors resize-none"
                    />
                    <p className="font-mono text-xs text-muted text-right mt-0.5">{editedStory.length} chars</p>
                </div>

                {/* Pricing */}
                <div className="mt-3 mb-4">
                    <p className="font-body text-xs text-muted uppercase tracking-wide mb-1">Set Price (SGD)</p>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        min={5}
                        max={500}
                        step={5}
                        className="font-body text-sm text-ink border border-ink/10 rounded-xl p-3 w-32 bg-surface"
                    />
                    <p className="font-body text-xs text-muted mt-1">Prints: $25–80 · Tote bags: $35–55 · Digital: $50–200</p>
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
                        onClick={() => onAction(id, 'approved', { creation_story: editedStory, price_sgd: price })}
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
