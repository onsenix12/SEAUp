import React, { useState } from 'react';

interface ApprovalModalProps {
    artwork: {
        id: string;
        image_url: string;
        creators?: {
            name: string | null;
            organisation: string;
        };
        subject: string;
        mood: string;
        colour_palette: string;
    };
    onClose: () => void;
    onSubmit: (id: string, metadata: { title: string; description: string; price: number; creator_age: number | null; creator_location: string }) => Promise<void>;
}

export function ApprovalModal({ artwork, onClose, onSubmit }: ApprovalModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(artwork.id, {
                title,
                description,
                price: price ? parseFloat(price) : 0,
                creator_age: age ? parseInt(age, 10) : null,
                creator_location: location
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
            <div className="bg-canvas rounded-creator w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl relative">
                <div className="sticky top-0 bg-canvas/90 backdrop-blur-md p-6 border-b border-border flex items-center justify-between z-10">
                    <h2 className="font-creator text-2xl font-bold text-ink">Marketplace Listing Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-ink hover:bg-border transition-colors disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Artwork Preview */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={artwork.image_url}
                            alt="Preview"
                            className="w-full aspect-square object-cover rounded-md bg-border border border-border"
                        />
                        <div className="mt-4 p-4 bg-surface rounded-xl border border-border text-sm font-body">
                            <p className="font-bold text-ink mb-1">Creator: {artwork.creators?.name || "Anonymous"}</p>
                            <p className="text-muted">Made with: {artwork.mood}, {artwork.colour_palette}, {artwork.subject}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full md:w-2/3 flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs text-muted tracking-widest uppercase">Creator Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                    placeholder="e.g. 21"
                                    className="px-4 py-3 bg-surface border border-border rounded-xl font-body text-ink focus:outline-none focus:border-ink transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs text-muted tracking-widest uppercase">Creator Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="e.g. Jakarta"
                                    className="px-4 py-3 bg-surface border border-border rounded-xl font-body text-ink focus:outline-none focus:border-ink transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-muted tracking-widest uppercase">Artwork Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Rain on Tin Roof"
                                className="px-4 py-3 bg-surface border border-border rounded-xl font-body text-ink focus:outline-none focus:border-ink transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-muted tracking-widest uppercase">Pricing (SGD)</label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="85"
                                className="px-4 py-3 bg-surface border border-border rounded-xl font-body text-ink focus:outline-none focus:border-ink transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-xs text-muted tracking-widest uppercase">Artwork Description</label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Write additional context, background or meaning to be shown in the marketplace..."
                                className="px-4 py-3 bg-surface border border-border rounded-xl font-body text-ink focus:outline-none focus:border-ink transition-colors resize-none"
                            />
                        </div>

                        <div className="mt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-4 flex-1 font-bold text-ink border-2 border-border rounded-creator hover:bg-surface disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-4 flex-1 font-bold text-ink bg-signal rounded-creator hover:bg-signal/90 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? "Approving..." : "Approve & Publish"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
