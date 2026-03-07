"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Artwork } from "@/types";
import { useRouter } from "next/navigation";

interface MarketplaceClientProps {
    artwork: Artwork & { creators: { name?: string, organisation: string } };
}

export default function MarketplaceClient({ artwork }: MarketplaceClientProps) {
    const { language } = useLanguage();
    const router = useRouter();

    const t = {
        back: language === 'en' ? 'Back' : 'Kembali',
        banner: language === 'en' ? 'This could be in a shop. Coming soon.' : 'Karya ini bisa berada di toko. Segera hadir.',
        products: {
            tote: language === 'en' ? 'Canvas Tote Bag' : 'Tas Kanvas',
            case: language === 'en' ? 'Phone Case' : 'Casing Ponsel',
            print: language === 'en' ? 'Framed Print' : 'Cetak Bingkai'
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto relative pt-4 pb-8 overflow-y-auto hide-scrollbar">

            {/* Header Navigation */}
            <div className="flex items-center mb-6 pl-2 shrink-0">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-ink active:scale-95 transition-transform flex items-center gap-2"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span className="font-creator font-bold text-lg">{t.back}</span>
                </button>
            </div>

            {/* Coming Soon Banner */}
            <div className="bg-signal/20 border-2 border-signal rounded-creator p-4 mb-8 text-center shrink-0">
                <p className="font-creator font-bold text-ink text-sm uppercase tracking-wider">{t.banner}</p>
            </div>

            <div className="flex flex-col gap-12 w-full pb-8">
                {/* 1. Tote Bag Mockup */}
                <div className="flex flex-col gap-3">
                    <div className="w-full aspect-square bg-[#E5E3D8] rounded-creator relative overflow-hidden flex items-center justify-center border-2 border-border shadow-sm">
                        {/* Static CSS Mockup: A simple representation of a tote bag */}
                        <div className="absolute top-4 w-24 h-12 border-4 border-[#C4C1B3] rounded-t-full rounded-b-none z-0"></div>
                        <div className="w-[70%] h-[80%] bg-[#F2F0E6] rounded-md shadow-inner flex items-center justify-center z-10 relative mt-8">
                            {/* The Artwork Overlay */}
                            <div className="w-[60%] aspect-square rounded overflow-hidden shadow">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={artwork.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="font-creator font-bold text-ink text-lg">{t.products.tote}</span>
                        <span className="font-mono text-ink/60">$24.00</span>
                    </div>
                </div>

                {/* 2. Phone Case Mockup */}
                <div className="flex flex-col gap-3">
                    <div className="w-full aspect-[4/3] bg-[#E8E8E8] rounded-creator relative overflow-hidden flex items-center justify-center border-2 border-border shadow-sm">
                        <div className="w-[35%] h-[85%] bg-[#1c1c1a] rounded-[24px] shadow-xl flex items-center justify-center z-10 p-1 relative">
                            {/* Camera module */}
                            <div className="absolute top-3 left-3 w-8 h-8 bg-black/40 rounded-lg backdrop-blur z-20"></div>
                            {/* The Artwork Overlay acting as the case back */}
                            <div className="w-full h-full rounded-[20px] overflow-hidden bg-white">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={artwork.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="font-creator font-bold text-ink text-lg">{t.products.case}</span>
                        <span className="font-mono text-ink/60">$18.00</span>
                    </div>
                </div>

                {/* 3. Framed Print Mockup */}
                <div className="flex flex-col gap-3">
                    <div className="w-full aspect-[4/3] bg-[#D6DCE5] rounded-creator relative overflow-hidden flex items-center justify-center border-2 border-border shadow-sm">
                        <div className="w-[60%] aspect-square bg-[#1C1C1A] p-2 shadow-2xl flex items-center justify-center z-10 transform origin-bottom border-b-8 border-r-8 border-[#0d0d0c]">
                            {/* The white matting */}
                            <div className="w-full h-full bg-white p-4">
                                {/* The Artwork Overlay */}
                                <div className="w-full h-full shadow-inner overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={artwork.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                        {/* Shadow to make it look like a wall */}
                        <div className="absolute top-0 right-0 w-full h-[150%] bg-gradient-to-br from-transparent to-black/10 transform rotate-12 -translate-y-12"></div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="font-creator font-bold text-ink text-lg">{t.products.print}</span>
                        <span className="font-mono text-ink/60">$45.00</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
