// Server Component for fetching live Marketplace data
import MarketplaceClient from "./MarketplaceClient";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { Artwork } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketplacePage() {
    const supabase = await createSupabaseServiceClient();

    // Fetch artworks across all creators that are marked 'approved' (public)
    const { data: artworks, error } = await supabase
        .from('artworks')
        .select(`
            id,
            image_url,
            title,
            price,
            creator_age,
            creator_location,
            creation_story,
            journey,
            learning_tags,
            price_sgd,
            mood,
            colour_palette,
            subject,
            created_at,
            creators:creator_id (
                name,
                organisation
            )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching marketplace artworks:", error);
    }

    return <MarketplaceClient artworks={(artworks ?? []) as unknown as Artwork[]} />;
}
