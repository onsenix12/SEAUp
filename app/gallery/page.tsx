import { createSupabaseServerClient } from "@/lib/supabase";
import GalleryClient from "./GalleryClient";
import { Artwork } from "@/types";

export const revalidate = 0; // Disable caching for MVP so we see new artworks immediately

export default async function GalleryPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch artworks. For MVP, we'll just fetch all of them, ordered by newest.
    // In production, we'd paginate or filter by public status.
    const { data: artworks, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching gallery:", error);
    }

    return (
        <GalleryClient initialArtworks={artworks as Artwork[] || []} />
    );
}
