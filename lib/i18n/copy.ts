export const COPY = {
    en: {
        languageName: "English",
        cta: "Let's make something",
        generating: "We're making your artwork...",
        moodQuestion: "How are you feeling today?",
        colourQuestion: "Pick your colours",
        subjectQuestion: "What do you want to draw?",
        photoQuestion: "Want to add something from your world?",
        styleQuestion: "What kind of art?",
        tryAgain: "Try Again",
        share: "Share",
        saveToGallery: "Save to Gallery",
    },
    id: {
        languageName: "Bahasa Indonesia",
        cta: "Ayo berkarya",
        generating: "Kami sedang membuat karya kamu...",
        moodQuestion: "Bagaimana perasaanmu hari ini?",
        colourQuestion: "Pilih warnamu",
        subjectQuestion: "Apa yang ingin kamu gambar?",
        photoQuestion: "Ingin menambahkan sesuatu dari duniamu?",
        styleQuestion: "Gaya seni seperti apa?",
        tryAgain: "Coba Lagi",
        share: "Bagikan",
        saveToGallery: "Simpan ke Galeri",
    }
};

export type Language = keyof typeof COPY;
