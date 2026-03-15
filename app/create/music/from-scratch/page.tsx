"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMusicFlow } from "@/contexts/MusicFlowContext";
import { useRouter } from "next/navigation";

const SOUND_CATEGORIES = [
    { id: 'nature', en: '🌿 Nature', id_: '🌿 Alam' },
    { id: 'urban', en: '🏙️ Urban', id_: '🏙️ Perkotaan' },
    { id: 'percussion', en: '🥁 Percussion', id_: '🥁 Perkusi' },
    { id: 'strings', en: '🎸 Strings', id_: '🎸 Senar' },
    { id: 'electronic', en: '🎛️ Electronic', id_: '🎛️ Elektronik' },
    { id: 'ambient', en: '🌊 Ambient', id_: '🌊 Ambient' },
    { id: 'piano', en: '🎹 Piano', id_: '🎹 Piano' },
    { id: 'traditional', en: '🪘 Traditional', id_: '🪘 Tradisional' },
    { id: 'world', en: '🌏 World', id_: '🌏 World Music' },
    { id: 'cinematic', en: '🎬 Cinematic', id_: '🎬 Sinematik' },
];

export default function MusicFromScratch() {
    const { language } = useLanguage();
    const { updateState } = useMusicFlow();
    const router = useRouter();

    const [selected, setSelected] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const t = {
        title: language === 'en' ? 'Build Your Sound' : 'Bangun Suaramu',
        subtitle: language === 'en' ? 'Pick at least one sound palette' : 'Pilih setidaknya satu palet suara',
        recordTitle: language === 'en' ? 'Add Your Voice' : 'Tambahkan Suaramu',
        recordHint: language === 'en' ? 'Optional · up to 10 seconds' : 'Opsional · hingga 10 detik',
        recording: language === 'en' ? 'Recording...' : 'Merekam...',
        stopRecord: language === 'en' ? 'Stop Recording' : 'Hentikan Rekaman',
        startRecord: language === 'en' ? 'Tap to Record' : 'Ketuk untuk Merekam',
        recorded: language === 'en' ? '✓ Recording saved' : '✓ Rekaman tersimpan',
        reRecord: language === 'en' ? 'Re-record' : 'Rekam Ulang',
        next: language === 'en' ? 'Generate Music' : 'Buat Musik',
        back: language === 'en' ? 'Back' : 'Kembali',
    };

    const toggleSound = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordedBlob(blob);
                setRecordedUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(t => t.stop());
            };

            recorder.start();
            setIsRecording(true);
            setRecordingSeconds(0);

            // Auto-stop after 10 seconds
            timerRef.current = setInterval(() => {
                setRecordingSeconds(prev => {
                    if (prev >= 9) {
                        stopRecording();
                        return 10;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (err) {
            console.error("Microphone access denied:", err);
            alert(language === 'en' ? 'Microphone access denied.' : 'Akses mikrofon ditolak.');
        }
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const handleGenerate = async () => {
        if (selected.length === 0) return;

        let recordedAudioBase64: string | undefined;
        if (recordedBlob) {
            const buffer = await recordedBlob.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = '';
            bytes.forEach(b => binary += String.fromCharCode(b));
            recordedAudioBase64 = btoa(binary);
        }

        updateState({
            soundEffects: selected,
            hasRecordedAudio: !!recordedBlob,
            recordedAudioBase64,
        });

        router.push('/create/music/generating');
    };

    return (
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto pt-8 px-5 pb-6 gap-6">

            {/* Header */}
            <div>
                <h1 className="font-creator text-3xl font-bold text-ink mb-1">{t.title}</h1>
                <p className="font-creator text-base text-ink/60">{t.subtitle}</p>
            </div>

            {/* Sound Categories Grid */}
            <div className="grid grid-cols-2 gap-3">
                {SOUND_CATEGORIES.map((cat) => {
                    const isOn = selected.includes(cat.id);
                    const label = language === 'en' ? cat.en : cat.id_;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => toggleSound(cat.id)}
                            className={`min-h-[64px] rounded-creator font-creator font-bold text-lg transition-all duration-150 active:scale-[0.96] touch-manipulation border-2 ${isOn
                                    ? 'bg-signal border-signal text-ink shadow-sm'
                                    : 'bg-surface border-border text-ink/70 hover:border-ink/30'
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Microphone Section */}
            <div className="bg-surface border-2 border-border rounded-creator p-5 flex flex-col gap-3">
                <div>
                    <p className="font-creator font-bold text-xl text-ink">{t.recordTitle}</p>
                    <p className="font-creator text-sm text-ink/50">{t.recordHint}</p>
                </div>

                {recordedUrl ? (
                    <div className="flex flex-col gap-2">
                        <audio src={recordedUrl} controls className="w-full h-10 rounded-creator" />
                        <p className="font-creator text-sm text-signal font-bold">{t.recorded}</p>
                        <button
                            onClick={() => { setRecordedBlob(null); setRecordedUrl(null); }}
                            className="font-creator text-sm text-muted underline"
                        >
                            {t.reRecord}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-full min-h-[72px] rounded-creator font-creator font-bold text-xl flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.97] touch-manipulation border-2 ${isRecording
                                ? 'bg-red-500/10 border-red-500 text-red-600 animate-pulse'
                                : 'bg-surface border-border text-ink hover:border-ink/30'
                            }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={isRecording ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                        {isRecording ? `${t.recording} ${recordingSeconds}s` : t.startRecord}
                    </button>
                )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 mt-auto">
                <button
                    onClick={handleGenerate}
                    disabled={selected.length === 0}
                    className="w-full min-h-[72px] bg-signal text-ink font-creator font-bold text-2xl rounded-creator shadow-sm active:scale-[0.98] transition-transform disabled:opacity-40 touch-manipulation"
                >
                    {t.next}
                </button>
                <button
                    onClick={() => router.back()}
                    className="font-creator text-muted text-lg hover:text-ink active:scale-95 transition-all text-center"
                >
                    {t.back}
                </button>
            </div>
        </div>
    );
}
