import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

// Returns a signed upload URL so the browser can PUT audio directly to
// Supabase Storage without routing the large binary through Vercel (4.5 MB limit).
export async function GET() {
    try {
        const supabase = await createSupabaseServiceClient();
        const fileName = `music_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`;

        const { data, error } = await supabase.storage
            .from('music')
            .createSignedUploadUrl(fileName);

        if (error || !data) {
            return NextResponse.json(
                { success: false, error: error?.message || 'Failed to create upload URL' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            signedUrl: data.signedUrl,
            path: data.path,
        });
    } catch (err) {
        console.error("music-upload-url error:", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
