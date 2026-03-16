"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCreationFlow } from "@/contexts/CreationFlowContext";
import { useFacilitator } from "@/contexts/FacilitatorContext";
import { COPY } from "@/lib/i18n/copy";
import { deriveImageSkills } from "@/lib/learning/skills";
import SkillsCard from "@/components/learning/SkillsCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FacilitatorPromptCard from '@/components/facilitator/FacilitatorPromptCard';
import { useFacilitatorPrompt } from '@/hooks/useFacilitatorPrompt';

export default function Step9Print() {
    const { language } = useLanguage();
    const { state } = useCreationFlow();
    const { sessionData } = useFacilitator();
    const skills = deriveImageSkills(state);
    const router = useRouter();
    const t = COPY[language];

    const { shouldShow, prompt, language: promptLanguage } = useFacilitatorPrompt('result');
    const [promptDismissed, setPromptDismissed] = useState(false);
    const showCard = shouldShow && !promptDismissed;

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [creationStory, setCreationStory] = useState('');

    useEffect(() => {
        const storedUrl = sessionStorage.getItem("generated_artwork_url");
        if (storedUrl) {
            setArtworkUrl(storedUrl);
        } else {
            // Elegant placeholder instead of broken text snippet
            setArtworkUrl("https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80");
        }
        setCreationStory(sessionStorage.getItem("generated_creation_story") || "");
    }, []);

    return (
        <>
        {showCard && prompt && (
            <FacilitatorPromptCard
                prompt={prompt}
                language={promptLanguage}
                onContinue={() => setPromptDismissed(true)}
                stepLabel={promptLanguage === 'id' ? 'Setelah Membuat' : 'After Creation'}
            />
        )}
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
                <div className="bg-surface rounded-creator border-2 border-border p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-canvas opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center mt-2">
                        {/* Tote Straps mock */}
                        <div className="w-[52px] h-8 border-[5px] border-[#EBE9E1] rounded-t-[20px] border-b-0 -mb-[2px] z-0 shadow-sm"></div>
                        {/* Tote Body */}
                        <div className="w-24 h-[104px] bg-gradient-to-b from-[#FAF9F6] to-[#EBE9E1] rounded-b-xl rounded-t-sm shadow-md border border-black/10 flex flex-col items-center justify-center relative z-10 overflow-hidden">
                            {/* Fabric Texture (subtle) */}
                            <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

                            {/* Artwork placement */}
                            <div className="w-14 h-14 bg-white shadow-sm mt-1 mb-2 relative overflow-hidden border border-black/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={artworkUrl || undefined} alt="Artwork on Tote" className="w-full h-full object-cover mix-blend-multiply opacity-95" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product 2: Phone Case */}
                <div className="bg-surface rounded-creator border-2 border-border p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-canvas opacity-50"></div>
                    <div className="relative z-10 w-[68px] h-[136px] bg-[#1C1C1A] rounded-[22px] shadow-lg flex items-center justify-center overflow-hidden border-[3px] border-[#2A2A28] ring-1 ring-black/20">
                        {/* Camera bump */}
                        <div className="absolute top-[8px] left-[8px] w-6 h-[22px] bg-black/60 rounded-[8px] backdrop-blur-md z-20 border border-white/5 shadow-inner flex flex-col gap-[2px] items-center justify-center py-1">
                            <div className="w-[6px] h-[6px] rounded-full bg-black shadow-inner"></div>
                            <div className="w-[6px] h-[6px] rounded-full bg-black shadow-inner"></div>
                        </div>
                        {/* Shadow Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 z-10 pointer-events-none mix-blend-overlay"></div>

                        {/* Artwork placement */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={artworkUrl || undefined} alt="Artwork on Phone" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                    </div>
                </div>
            </div>

            {creationStory && (
                <p className="font-body text-sm text-muted italic text-center px-4 mt-2">
                    {creationStory}
                </p>
            )}

            <div className="bg-signal/10 border-2 border-signal rounded-creator p-6 text-center mb-8">
                <p className="font-creator font-bold text-ink mb-2">
                    {language === 'en' ? 'Phase 2 Feature' : 'Fitur Tahap 2'}
                </p>
                <p className="font-body text-ink/80 text-sm">
                    {language === 'en' ? 'In the full version of SEA-Up, you will be able to order these physical products directly.' : 'Dalam versi lengkap SEA-Up, Anda dapat memesan produk fisik ini secara langsung.'}
                </p>
            </div>

            <SkillsCard
                skills={skills}
                language={language}
                creatorName={sessionData.isActive ? sessionData.creatorName : undefined}
            />

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full mt-auto">
                <Link href="/gallery" className="w-full">
                    <button className="w-full min-h-[80px] bg-ink text-surface font-creator font-bold text-xl rounded-creator shadow-sm active:scale-[0.98] transition-transform">
                        {language === 'en' ? 'Go to my Gallery' : 'Ke Galeri Saya'}
                    </button>
                </Link>
            </div>
        </div>
        </>
    );
}
