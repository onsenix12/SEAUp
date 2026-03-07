import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, marketplaceStatus } = body;

        if (!id || !marketplaceStatus) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createSupabaseServiceClient();

        const { error } = await supabase
            .from('artworks')
            .update({ marketplace_status: marketplaceStatus })
            .eq('id', id);

        if (error) {
            console.error("Failed to update artwork status:", error);
            return NextResponse.json({ success: false, error: "Database error updating artwork" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Update Status API Error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error during update."
        }, { status: 500 });
    }
}
