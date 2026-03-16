"use client";

import { useState } from 'react';
import { useFacilitator } from '@/contexts/FacilitatorContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
    const { language } = useLanguage();
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();

        // Inject the research metrics into the global Context
        startSession(userId, creatorName, organisation);

        // Hand device to creator to choose their journey
        router.push('/');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const t = language === 'id' ? {
        heading: 'Persiapan Sesi',
        signOut: 'Keluar',
        loggedInAs: 'Masuk sebagai:',
        creatorNameLabel: 'Nama Kreator (Opsional)',
        creatorNameHint: 'Ini akan dicetak pada karya akhir mereka.',
        creatorNamePlaceholder: 'mis. Wei Jie',
        orgLabel: 'Organisasi',
        startButton: 'Mulai Alur Kreasi',
        handoff: 'Berikan perangkat ke kreator untuk memilih perjalanan hari ini.',
        cleanUiNote: 'Ini menyembunyikan semua pengaturan teknis dan menampilkan antarmuka yang bersih untuk kreator.',
    } : {
        heading: 'Session Setup',
        signOut: 'Sign Out',
        loggedInAs: 'Logged in as:',
        creatorNameLabel: 'Creator Name (Optional)',
        creatorNameHint: 'This will be printed on their final artwork.',
        creatorNamePlaceholder: 'e.g. Wei Jie',
        orgLabel: 'Organisation',
        startButton: 'Start Creation Flow',
        handoff: "Hand the device to the creator to choose today's journey.",
        cleanUiNote: 'This hides all technical settings and provides a clean UI for the creator.',
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-8 px-4 pb-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-creator text-2xl font-bold text-ink">
                    {t.heading}
                </h1>
                <button
                    onClick={handleLogout}
                    className="text-signal text-sm font-creator font-bold underline underline-offset-4"
                >
                    {t.signOut}
                </button>
            </div>

            <p className="text-ink/60 mb-8 font-creator">
                {t.loggedInAs} <span className="font-bold text-ink">{userEmail}</span>
            </p>

            <form onSubmit={handleStart} className="flex flex-col gap-6 flex-1">

                {/* Creator Name (Optional but encouraged for MINDS pilot) */}
                <div>
                    <label htmlFor="creatorName" className="block font-creator font-bold text-ink mb-2">
                        {t.creatorNameLabel}
                    </label>
                    <p className="text-sm text-ink/60 mb-2">{t.creatorNameHint}</p>
                    <input
                        id="creatorName"
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder={t.creatorNamePlaceholder}
                        className="w-full bg-surface border-2 border-border rounded-creator px-6 py-4 font-creator text-xl focus:outline-none focus:border-brand"
                    />
                </div>

                {/* Organisation (Required) */}
                <div>
                    <label htmlFor="org" className="block font-creator font-bold text-ink mb-2">
                        {t.orgLabel}
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
                        {t.startButton}
                    </button>
                    <p className="font-body text-xs text-muted text-center mt-2">
                        {t.handoff}
                    </p>
                    <p className="text-center text-sm text-ink/60 mt-4 font-creator">
                        {t.cleanUiNote}
                    </p>
                </div>
            </form>

        </div>
    );
}
