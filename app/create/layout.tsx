"use client";

import React from "react";
import Link from "next/link";
import { DM_Mono } from "next/font/google";
import { MusicFlowProvider } from "@/contexts/MusicFlowContext";

const mono = DM_Mono({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-mono",
});

export default function CreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MusicFlowProvider>
            <div className={`${mono.variable} min-h-screen bg-canvas flex flex-col relative overflow-y-auto`}>
                {/* Nothing dot grid texture background */}
                <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0" />

                {/* Home button */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-ink/40 hover:text-ink transition-colors text-sm font-creator"
                        aria-label="Go to home"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                            <polyline points="9 21 9 12 15 12 15 21" />
                        </svg>
                        Home
                    </Link>
                </div>

                {/* Content wrapper */}
                <div className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 sm:px-8 pb-6 sm:pb-8">
                    {children}
                </div>
            </div>
        </MusicFlowProvider>
    );
}
