"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";

// Optional styles. The prompt engineering (Phase 2) will map these to Imagen styles.
const STYLES = [
    { id: "3d", label_en: "3D Illustration", label_id: "Ilustrasi 3D", icon: "🧊" },
    { id: "watercolor", label_en: "Watercolor", label_id: "Cat Air", icon: "🖌️" },
    { id: "pixel", label_en: "Pixel Art", label_id: "Seni Piksel", icon: "👾" },
    { id: "sketch", label_en: "Pencil Sketch", label_id: "Sketsa Pensil", icon: "✏️" },
];

export default function Step5Style() {
    const { language } = useLanguage();
    const { updateState } = useCreationFlow();
    const router = useRouter();
    const t = COPY[language];

    const handleSelect = (styleId: string) => {
        updateState({ style: styleId });
        router.push("/create/step-7-generating");
    };

    const handleSkip = () => {
        // Keep default from CreationFlowContext
        router.push("/create/step-7-generating");
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-8 pb-8">

            {/* Step Counter */}
            <div className="absolute top-0 right-0">
                <span className="font-mono text-xs text-muted tracking-widest">
                    06 / 07
                </span>
            </div>

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="font-creator text-3xl font-bold text-ink">
                    {t.styleQuestion}
                </h2>
            </div>

            {/* Style Choices Grid - 2 columns for better fit if many options */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full content-start">
                {STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => handleSelect(style.id)}
                        className="aspect-square w-full rounded-creator border-2 border-border flex flex-col items-center justify-center p-4 gap-4 bg-surface active:scale-[0.96] active:border-signal transition-all duration-100 touch-manipulation group"
                    >
                        <div className="w-16 h-16 rounded-full bg-canvas border border-border flex items-center justify-center text-3xl shadow-sm group-active:scale-110 transition-transform">
                            {style.icon}
                        </div>

                        <span className="font-creator font-bold text-lg text-ink text-center leading-tight">
                            {language === 'en' ? style.label_en : style.label_id}
                        </span>
                    </button>
                ))}
            </div>

            {/* Skip Action */}
            <div className="w-full mt-8">
                <button
                    onClick={handleSkip}
                    className="w-full min-h-[72px] bg-surface text-ink font-creator font-bold text-xl rounded-creator border-2 border-border shadow-sm active:scale-[0.98] transition-transform"
                >
                    {language === 'en' ? 'Surprise me' : 'Kejutkan saya'}
                </button>
            </div>

        </div>
    );
}
