import { createSupabaseServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Try mock data first
    const { mockArtworks } = await import("../../lib/mockMarketplaceData");
    const mockArtwork = mockArtworks.find((a) => a.id === id);

    if (mockArtwork) {
        return <MarketplaceClient artwork={mockArtwork as any} isMock={true} />;
    }

    // Server-side data fetch from Supabase
    const supabase = await createSupabaseServerClient();

    const { data: artwork, error } = await supabase
        .from('artworks')
        .select('*, creators (name, organisation, language)')
        .eq('id', id)
        .single();

    if (error || !artwork) {
        notFound();
    }

    return <MarketplaceClient artwork={artwork as any} isMock={false} />;
}
