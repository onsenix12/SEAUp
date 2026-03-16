import { createSupabaseServerClient } from "@/lib/supabase";
import GalleryClient from "./GalleryClient";
import { Artwork, MusicTrack } from "@/types";

export const revalidate = 0; // Disable caching for MVP so we see new artworks immediately

export default async function GalleryPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch artworks
    const { data: artworks, error: artworkError } = await supabase
        .from('artworks')
        .select('*, creators (name)')
        .order('created_at', { ascending: false });

    if (artworkError) {
        console.error("Error fetching gallery:", artworkError);
    }

    // Fetch music tracks
    const { data: musicTracks, error: musicError } = await supabase
        .from('music_tracks')
        .select('*')
        .order('created_at', { ascending: false });

    if (musicError) {
        // Non-fatal — table might not exist yet if migration hasn't been run
        console.warn("Music tracks fetch failed (run schema migration?):", musicError.message);
    }

    return (
        <GalleryClient
            initialArtworks={(artworks ?? []) as unknown as Artwork[]}
            initialMusicTracks={(musicTracks ?? []) as unknown as MusicTrack[]}
        />
    );
}

