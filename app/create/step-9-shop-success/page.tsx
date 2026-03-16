"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COPY } from "@/lib/i18n/copy";
import Link from "next/link";

export default function Step9ShopSuccess() {
    const { language } = useLanguage();
    const t = COPY[language];

    const [creationStory, setCreationStory] = useState('');

    useEffect(() => {
        setCreationStory(sessionStorage.getItem("generated_creation_story") || "");
    }, []);

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-12 pb-8">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-signal rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-5xl">⚡</span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h2 className="font-creator text-4xl font-bold text-ink mb-4 leading-tight">
                    {language === 'en' ? 'Sent to Organizer!' : 'Terkirim ke Penyelenggara!'}
                </h2>
                <p className="font-body text-muted text-lg px-4">
                    {language === 'en' ? 'Your artwork looks great. A SEA-Up co-artist will review it before it goes live in the public shop.' : 'Karya Anda tampak hebat. Rekan seniman SEA-Up akan meninjaunya sebelum ditayangkan.'}
                </p>
            </div>

            {creationStory && (
                <p className="font-body text-sm text-muted italic text-center px-4 mt-2">
                    {creationStory}
                </p>
            )}

            <div className="bg-surface border-2 border-border rounded-creator p-6 text-center mb-12 shadow-sm">
                <p className="font-creator font-bold text-ink mb-2">
                    {language === 'en' ? 'What happens next?' : 'Apa selanjutnya?'}
                </p>
                <div className="flex flex-col gap-3 text-left mt-4 text-sm font-body text-ink/80">
                    <div className="flex items-start gap-3">
                        <span className="text-signal font-bold mt-0.5">1.</span>
                        <span>{language === 'en' ? 'A co-artist reviews for gallery standards.' : 'Rekan seniman meninjau untuk standar galeri.'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-signal font-bold mt-0.5">2.</span>
                        <span>{language === 'en' ? 'If approved, it is listed in the Marketplace.' : 'Jika disetujui, itu terdaftar di Marketplace.'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-signal font-bold mt-0.5">3.</span>
                        <span>{language === 'en' ? 'You start earning if it sells!' : 'Anda mulai menghasilkan jika terjual!'}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full mt-auto">
                <Link href="/gallery" className="w-full">
                    <button className="w-full min-h-[80px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform">
                        {language === 'en' ? 'Go to my Gallery' : 'Ke Galeri Saya'}
                    </button>
                </Link>
            </div>
        </div>
    );
}
