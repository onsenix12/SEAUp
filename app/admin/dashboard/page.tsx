// Server Component for the Dashboard route bypassing auth rate limit
import FacilitatorDashboardClient, { PendingArtwork } from "@/app/facilitator/dashboard/FacilitatorDashboardClient";
import { createSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // We fetch pending artworks server-side to pass as initial data
    const supabase = await createSupabaseServiceClient();

    // Fetch artworks across all creators that are marked 'pending_review'
    const { data: pendingArtworks, error } = await supabase
        .from('artworks')
        .select(`
            id,
            image_url,
            mood,
            colour_palette,
            subject,
            created_at,
            marketplace_status,
            session_notes,
            journey,
            learning_tags,
            creation_story,
            price_sgd,
            creators:creator_id (
                name,
                organisation,
                facilitator_id
            )
        `)
        .eq('marketplace_status', 'pending_review')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching pending artworks:", error);
    }

    return <FacilitatorDashboardClient initialArtworks={(pendingArtworks ?? []) as unknown as PendingArtwork[]} isAdminBypass={true} />;
}
