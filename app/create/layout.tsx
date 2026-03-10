import React from "react";
import { DM_Mono } from "next/font/google";

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
        <div className={`${mono.variable} min-h-screen bg-canvas flex flex-col relative`}>
            {/* Nothing dot grid texture background */}
            <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0" />

            {/* Content wrapper */}
            <div className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 sm:p-8">
                {children}
            </div>
        </div>
    );
}
