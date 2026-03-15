"use client";

import { MusicFlowProvider } from "@/contexts/MusicFlowContext";

export default function MusicLayout({ children }: { children: React.ReactNode }) {
    return (
        <MusicFlowProvider>
            {children}
        </MusicFlowProvider>
    );
}
