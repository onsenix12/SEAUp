import { createSupabaseServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Server-side data fetch
    const supabase = await createSupabaseServerClient();

    const { data: artwork, error } = await supabase
        .from('artworks')
        .select('*, creators (name, organisation)')
        .eq('id', id)
        .single();

    if (error || !artwork) {
        notFound();
    }

    return <MarketplaceClient artwork={artwork} />;
}
