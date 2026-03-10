import React from "react";

/**
 * Brand-specific dot pattern marker (ASEAN colors).
 */
export const DotMarker = () => (
    <span className="inline-flex gap-1 mr-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5C800]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
    </span>
);

/**
 * Signal Yellow highlight effect for text.
 */
export const Highlight = ({ children }: { children: React.ReactNode }) => (
    <span
        className="relative inline cursor-default"
        style={{
            backgroundImage: 'linear-gradient(#F5C800, #F5C800)',
            backgroundSize: '0% 3px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 100%',
            paddingBottom: '1px',
            transition: 'background-size 250ms ease, color 150ms ease',
        }}
        onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundSize = '100% 100%';
            el.style.color = '#1C1C1A';
            el.style.fontWeight = '600';
        }}
        onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundSize = '0% 3px';
            el.style.color = '';
            el.style.fontWeight = '';
        }}
    >
        {children}
    </span>
);

/**
 * Creator palette step icons
 */
export const StepDot = ({ color }: { color: string }) => (
    <div
        className="w-12 h-12 rounded-[8px] flex items-center justify-center border border-white/10"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
    >
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
    </div>
);

/**
 * Connector arrow between steps
 */
export const Connector = () => (
    <div className="h-[1px] w-6 bg-signal/40 relative flex-shrink-0">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 border-solid border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-signal/40" />
    </div>
);
