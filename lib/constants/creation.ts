export const TOTAL_STEPS = 7;

export const MOODS = [
    { id: "joy", label_en: "Happy", label_id: "Senang", color: "bg-joy", icon: "☀️" },
    { id: "calm", label_en: "Calm", label_id: "Tenang", color: "bg-calm", icon: "🌊" },
    { id: "wonder", label_en: "Dreamy", label_id: "Melamun", color: "bg-wonder", icon: "✨" },
];

export const PALETTES = [
    {
        id: "warm",
        label_en: "Warm Sunrise",
        label_id: "Matahari Terbit",
        colors: ["bg-joy", "bg-warmth", "bg-signal"]
    },
    {
        id: "cool",
        label_en: "Cool Ocean",
        label_id: "Lautan Tenang",
        colors: ["bg-calm", "bg-wonder", "bg-canvas"]
    },
    {
        id: "earth",
        label_en: "Earth & Nature",
        label_id: "Bumi & Alam",
        colors: ["bg-nature", "bg-ink", "bg-canvas"]
    },
];

export const SUBJECTS = [
    { id: "nature", label_en: "Nature", label_id: "Alam", icon: "🍃" },
    { id: "city", label_en: "Cityscape", label_id: "Kota", icon: "🏙️" },
    { id: "abstract", label_en: "Abstract", label_id: "Abstrak", icon: "🎨" },
];

export const STYLES = [
    { id: "3d", label_en: "3D Illustration", label_id: "Ilustrasi 3D", icon: "🧊" },
    { id: "watercolor", label_en: "Watercolor", label_id: "Cat Air", icon: "🖌️" },
    { id: "pixel", label_en: "Pixel Art", label_id: "Seni Piksel", icon: "👾" },
    { id: "sketch", label_en: "Pencil Sketch", label_id: "Sketsa Pensil", icon: "✏️" },
];

export const DEFAULT_STYLE = "abstract_illustration";
