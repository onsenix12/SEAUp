"use client";

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function FacilitatorLoginClient() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Ensure this matches your localhost or production URL
                emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
            },
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Check your email for the magic link!');
        }

        setLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-12 px-4 pb-8">
            <button
                onClick={() => router.push('/')}
                className="self-start text-ink/70 active:scale-95 transition-transform mb-8 flex items-center gap-2"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="font-creator font-bold">Back to Welcome</span>
            </button>

            <h1 className="font-creator text-3xl font-bold text-ink mb-4">
                Facilitator Access
            </h1>
            <p className="text-ink/80 mb-8 font-creator text-lg">
                Sign in to guide creators through SEA-Up and track research metrics.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="email" className="block font-creator font-bold text-ink mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@organisation.org"
                        className="w-full bg-surface border-2 border-border rounded-creator px-6 py-4 font-creator text-xl placeholder:text-ink/30 focus:outline-none focus:border-brand"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[72px] bg-brand text-canvas font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                    {loading ? 'Sending link...' : 'Send Magic Link'}
                </button>
            </form>

            {message && (
                <div className={`mt-6 p-4 rounded-creator border-2 font-creator font-bold text-center ${message.startsWith('Error') ? 'bg-signal/20 border-signal text-signal' : 'bg-brand/20 border-brand text-brand'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
