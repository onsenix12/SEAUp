export type Artwork = {
    id: string;
    title: string;
    artist_name: string;
    artist_age: number;
    artist_city: string;
    creation_story: string;
    step_count: number;
    gradient_from: string;
    gradient_to: string;
    price_sgd: number;
    // New fields for the editorial layout variety
    aspect_ratio?: "square" | "portrait" | "landscape" | "wide";
    size?: "small" | "medium" | "large";
};

export const mockArtworks: Artwork[] = [
    {
        id: "art-1",
        title: "Morning in Menteng",
        artist_name: "Budi Santoso",
        artist_age: 19,
        artist_city: "Jakarta",
        creation_story: "Made this by choosing 7 colours.",
        step_count: 7,
        gradient_from: "#FF6B35", // joy
        gradient_to: "#7B5EA7",   // wonder
        price_sgd: 120,
        aspect_ratio: "landscape",
        size: "large"
    },
    {
        id: "art-2",
        title: "Solar Eclipse",
        artist_name: "Sari",
        artist_age: 24,
        artist_city: "Bandung",
        creation_story: "Drew a circle, saw the sun.",
        step_count: 4,
        gradient_from: "#F7A34B", // warmth
        gradient_to: "#E63946",   // bold
        price_sgd: 95,
        aspect_ratio: "portrait",
        size: "medium"
    },
    {
        id: "art-3",
        title: "Quiet Afternoon",
        artist_name: "Eko",
        artist_age: 17,
        artist_city: "Surabaya",
        creation_story: "Chose yellow, then everything was warm.",
        step_count: 5,
        gradient_from: "#F5C800", // signal
        gradient_to: "#F7A34B",   // warmth
        price_sgd: 150,
        aspect_ratio: "square",
        size: "small"
    },
    {
        id: "art-4",
        title: "Mother's Hand",
        artist_name: "Maya",
        artist_age: 22,
        artist_city: "Medan",
        creation_story: "Her mother guided her hand once.",
        step_count: 8,
        gradient_from: "#4A90D9", // calm
        gradient_to: "#3D9970",   // nature
        price_sgd: 200,
        aspect_ratio: "portrait",
        size: "large"
    },
    {
        id: "art-5",
        title: "Rain on Tin Roof",
        artist_name: "Arief",
        artist_age: 21,
        artist_city: "Yogyakarta",
        creation_story: "Pressed blue three times while it rained.",
        step_count: 3,
        gradient_from: "#4A90D9", // calm
        gradient_to: "#1C1C1A",   // ink
        price_sgd: 85,
        aspect_ratio: "square",
        size: "medium"
    },
    {
        id: "art-6",
        title: "Traffic at Night",
        artist_name: "Dian",
        artist_age: 26,
        artist_city: "Jakarta",
        creation_story: "Wanted to draw the noise of the city.",
        step_count: 12,
        gradient_from: "#E63946", // bold
        gradient_to: "#F5C800",   // signal
        price_sgd: 110,
        aspect_ratio: "wide",
        size: "large"
    },
    {
        id: "art-7",
        title: "Ocean Breeze",
        artist_name: "Rizky",
        artist_age: 18,
        artist_city: "Bali",
        creation_story: "Looking at the sea from the window.",
        step_count: 6,
        gradient_from: "#3D9970", // nature
        gradient_to: "#4A90D9",   // calm
        price_sgd: 135,
        aspect_ratio: "portrait",
        size: "small"
    },
    {
        id: "art-8",
        title: "Sunset over Volcano",
        artist_name: "Putri",
        artist_age: 20,
        artist_city: "Malang",
        creation_story: "Felt the heat and painted it.",
        step_count: 9,
        gradient_from: "#7B5EA7", // wonder
        gradient_to: "#FF6B35",   // joy
        price_sgd: 180,
        aspect_ratio: "square",
        size: "large"
    },
];
