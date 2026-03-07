import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OptionCardProps {
    id: string;
    labelEn: string;
    labelId: string;
    icon?: React.ReactNode;
    iconBgClass?: string;
    onClick: (id: string) => void;
    children?: React.ReactNode;
    layout?: 'row' | 'column' | 'square';
    activeColorClass?: string;
}

export function OptionCard({
    id,
    labelEn,
    labelId,
    icon,
    iconBgClass = "bg-canvas border border-border",
    onClick,
    children,
    layout = 'row',
    activeColorClass = "active:border-signal"
}: OptionCardProps) {
    const { language } = useLanguage();

    const baseClass = "w-full rounded-creator border-2 border-border bg-surface transition-all duration-100 touch-manipulation group active:scale-[0.96]";

    let layoutClass = "";
    let iconSizeClass = "";
    let textClass = "";

    if (layout === 'row') {
        layoutClass = "flex flex-row items-center gap-6 min-h-[100px] p-6";
        iconSizeClass = "w-12 h-12 text-2xl";
        textClass = "text-2xl text-left";
    } else if (layout === 'column') {
        layoutClass = "flex flex-col gap-4 min-h-[120px] p-6";
        textClass = "text-xl self-start";
    } else if (layout === 'square') {
        layoutClass = "flex flex-col items-center justify-center gap-4 aspect-square p-4";
        iconSizeClass = "w-16 h-16 text-3xl";
        textClass = "text-lg text-center leading-tight";
    }

    return (
        <button
            onClick={() => onClick(id)}
            className={`${baseClass} ${activeColorClass} ${layoutClass}`}
        >
            {icon && (layout === 'row' || layout === 'square') && (
                <div className={`${iconSizeClass} rounded-full flex items-center justify-center shadow-sm group-active:scale-110 transition-transform shrink-0 ${iconBgClass}`}>
                    {icon}
                </div>
            )}

            <span className={`font-creator font-bold text-ink ${textClass}`}>
                {language === 'en' ? labelEn : labelId}
            </span>

            {children}
        </button>
    );
}
