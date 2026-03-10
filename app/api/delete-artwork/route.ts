import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function DELETE(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ success: false, error: "Missing artwork ID" }, { status: 400 });
        }

        const supabase = await createSupabaseServiceClient();

        // Optional: In a production app with Auth, you would verify the user owns the artwork here.
        // For MVP, anyone with the ID can trigger this route, but the UI only shows the button to the "owner" in Local Storage.

        const { error } = await supabase
            .from('artworks')
            .delete()
            .eq('id', body.id);

        if (error) {
            console.error("Failed to delete artwork:", error);
            return NextResponse.json({ success: false, error: "Database error during deletion" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete API Error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error during deletion."
        }, { status: 500 });
    }
}
