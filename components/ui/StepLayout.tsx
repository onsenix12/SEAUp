import React from 'react';

interface StepLayoutProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function StepLayout({ currentStep, totalSteps, title, subtitle, children }: StepLayoutProps) {
    // Format steps with leading zeros
    const formattedCurrent = currentStep.toString().padStart(2, '0');
    const formattedTotal = totalSteps.toString().padStart(2, '0');

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-8 pb-8">
            {/* Step Counter */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    {formattedCurrent} / {formattedTotal}
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="font-creator text-3xl font-bold text-ink">
                    {title}
                </h2>
                {subtitle && (
                    <p className="font-body text-muted mt-2">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 flex flex-col w-full relative">
                {children}
            </div>
        </div>
    );
}
