import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { artworkId, status } = body;

        if (!artworkId || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        const supabase = await createSupabaseServiceClient();

        // If approved, it is public in the marketplace. If rejected, it remains private.
        const isPublic = status === 'approved';

        const { error } = await supabase
            .from('artworks')
            .update({
                marketplace_status: status,
                is_public: isPublic
            })
            .eq('id', artworkId);

        if (error) {
            console.error("Failed to update artwork status:", error);
            return NextResponse.json({ success: false, error: "Database error updating artwork" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Review API Error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error during review."
        }, { status: 500 });
    }
}
