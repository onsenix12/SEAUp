"use client";

interface FacilitatorPromptCardProps {
  prompt: string;
  language: 'en' | 'id';
  onContinue: () => void;
  stepLabel?: string;
}

export default function FacilitatorPromptCard({
  prompt,
  language,
  onContinue,
  stepLabel,
}: FacilitatorPromptCardProps) {
  return (
    <div className="fixed inset-0 bg-ink/80 z-50 flex flex-col items-center justify-center px-6">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm overflow-y-auto max-h-[90dvh]">

        {/* Badge */}
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
          🤝 {language === 'id' ? 'Panduan Fasilitator' : 'Facilitator Prompt'}
        </span>

        {/* Step label */}
        {stepLabel && (
          <p className="font-body text-xs text-muted mt-2">{stepLabel}</p>
        )}

        {/* Prompt text */}
        <p className="font-creator text-lg font-bold text-ink mt-3 leading-snug">
          {prompt}
        </p>

        {/* Divider + Continue button */}
        <div className="border-t border-ink/10 mt-4 pt-4">
          <button
            onClick={onContinue}
            className="w-full bg-signal text-ink font-body font-semibold py-3 rounded-xl text-base"
          >
            {language === 'id' ? 'Lanjutkan →' : 'Continue →'}
          </button>
        </div>

      </div>
    </div>
  );
}
