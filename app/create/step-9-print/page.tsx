"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { COPY } from "@/lib/i18n/copy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Step9Print() {
    const { language } = useLanguage();
    const router = useRouter();
    const t = COPY[language];

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);

    useEffect(() => {
        // Since we cleared the session storage after saving, we pass it down via state or we just show a placeholder if refreshed.
        // For the MVP, if they land here, we'll try to get it, otherwise fallback.
        // Ideally we'd have passed the ID in the URL, but for this demo step:
        setArtworkUrl("https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Your+Artwork");
    }, []);

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8">
            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="font-creator text-3xl font-bold text-ink mb-2">
                    {language === 'en' ? 'Ready for You' : 'Siap untuk Anda'}
                </h2>
                <p className="font-body text-muted text-lg">
                    {language === 'en' ? 'Here is how your art looks on real items.' : 'Inilah tampilan seni Anda di barang asli.'}
                </p>
            </div>

            {/* Mock Products Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Product 1: Tote Bag */}
                <div className="bg-surface rounded-creator border-2 border-border p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
                    <div className="absolute inset-0 bg-canvas opacity-50"></div>
                    <div className="relative z-10 w-24 h-28 bg-[#EBE9E1] rounded-b-xl rounded-t-sm shadow-inner flex items-center justify-center border border-black/5">
                        {/* Tote Straps mock */}
                        <div className="absolute -top-6 w-12 h-8 rounded-t-full border-4 border-[#EBE9E1] border-b-0"></div>
                        {/* Artwork placement */}
                        <div className="w-16 h-16 bg-white overflow-hidden shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={artworkUrl || undefined} alt="Artwork on Tote" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                        </div>
                    </div>
                </div>

                {/* Product 2: Phone Case */}
                <div className="bg-surface rounded-creator border-2 border-border p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
                    <div className="absolute inset-0 bg-canvas opacity-50"></div>
                    <div className="relative z-10 w-16 h-32 bg-ink rounded-[20px] shadow-lg flex items-center justify-center overflow-hidden border-2 border-ink">
                        {/* Camera bump */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-black/40 rounded-lg backdrop-blur-sm z-20"></div>
                        {/* Artwork placement */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={artworkUrl || undefined} alt="Artwork on Phone" className="w-full h-full object-cover opacity-90" />
                    </div>
                </div>
            </div>

            <div className="bg-signal/10 border-2 border-signal rounded-creator p-6 text-center mb-8">
                <p className="font-creator font-bold text-ink mb-2">
                    {language === 'en' ? 'Phase 2 Feature' : 'Fitur Tahap 2'}
                </p>
                <p className="font-body text-ink/80 text-sm">
                    {language === 'en' ? 'In the full version of SEA-Up, you will be able to order these physical products directly.' : 'Dalam versi lengkap SEA-Up, Anda dapat memesan produk fisik ini secara langsung.'}
                </p>
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
