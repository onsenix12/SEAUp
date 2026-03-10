import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { artworkId, status, title, description, price, creator_age, creator_location } = body;

        if (!artworkId || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        const supabase = await createSupabaseServiceClient();

        const isPublic = status === 'approved';

        const updateData: any = {
            marketplace_status: status,
            is_public: isPublic
        };

        if (isPublic) {
            updateData.title = title;
            updateData.description = description;
            updateData.price = price;
            updateData.creator_age = creator_age;
            updateData.creator_location = creator_location;
        }

        const { error } = await supabase
            .from('artworks')
            .update(updateData)
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
