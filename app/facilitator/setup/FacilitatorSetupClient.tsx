"use client";

import { useState } from 'react';
import { useFacilitator } from '@/contexts/FacilitatorContext';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface SetupProps {
    userEmail: string;
    userId: string;
}

export default function FacilitatorSetupClient({ userEmail, userId }: SetupProps) {
    const [creatorName, setCreatorName] = useState('');
    const [organisation, setOrganisation] = useState('MINDS'); // Default for the pilot
    const { startSession } = useFacilitator();
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();

        // Inject the research metrics into the global Context
        startSession(userId, creatorName, organisation);

        // Route to Step 1 of the Creator Flow
        router.push('/create/step-1-mood');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-8 px-4 pb-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-creator text-2xl font-bold text-ink">
                    Session Setup
                </h1>
                <button
                    onClick={handleLogout}
                    className="text-signal text-sm font-creator font-bold underline underline-offset-4"
                >
                    Sign Out
                </button>
            </div>

            <p className="text-ink/60 mb-8 font-creator">
                Logged in as: <span className="font-bold text-ink">{userEmail}</span>
            </p>

            <form onSubmit={handleStart} className="flex flex-col gap-6 flex-1">

                {/* Creator Name (Optional but encouraged for MINDS pilot) */}
                <div>
                    <label htmlFor="creatorName" className="block font-creator font-bold text-ink mb-2">
                        Creator Name (Optional)
                    </label>
                    <p className="text-sm text-ink/60 mb-2">This will be printed on their final artwork.</p>
                    <input
                        id="creatorName"
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="e.g. Wei Jie"
                        className="w-full bg-surface border-2 border-border rounded-creator px-6 py-4 font-creator text-xl focus:outline-none focus:border-brand"
                    />
                </div>

                {/* Organisation (Required) */}
                <div>
                    <label htmlFor="org" className="block font-creator font-bold text-ink mb-2">
                        Organisation
                    </label>
                    <input
                        id="org"
                        type="text"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        className="w-full bg-surface border-2 border-border rounded-creator px-6 py-4 font-creator text-xl focus:outline-none focus:border-brand"
                        required
                    />
                </div>

                <div className="mt-auto pt-8">
                    <button
                        type="submit"
                        disabled={!organisation}
                        className="w-full min-h-[80px] bg-signal text-ink font-creator font-bold text-2xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                        Start Creation Flow
                    </button>
                    <p className="text-center text-sm text-ink/60 mt-4 font-creator">
                        This hides all technical settings and provides a clean UI for the creator.
                    </p>
                </div>
            </form>

        </div>
    );
}
