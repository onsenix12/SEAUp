import { createSupabaseServerClient } from "@/lib/supabase";
import ArtworkDetailClient from "./ArtworkDetailClient";
import { Artwork } from "@/types";
import { notFound } from "next/navigation";

export const revalidate = 0; // Disable caching for MVP so we see latest state

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: artwork, error } = await supabase
        .from('artworks')
        .select('*, creators ( name, organisation )')
        .eq('id', id)
        .single();

    if (error || !artwork) {
        console.error("Error fetching artwork:", error);
        notFound();
    }

    return (
        <ArtworkDetailClient artwork={artwork as Artwork & { creators: { name?: string, organisation: string } }} />
    );
}
