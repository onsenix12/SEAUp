import { NextRequest, NextResponse } from "next/server";
import { MusicFlowState, ApiResponse } from "@/types";
import { buildMusicPrompt, generateMusicFromPrompt, generateImageFromPrompt } from "@/lib/google-ai";

// Extend serverless function timeout to 60s — Lyria needs ~20-30s
export const maxDuration = 60;


export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as MusicFlowState & { creatorId?: string };

        // Validate: need either source artwork story or at least one sound effect
        const hasArtworkInput = body.mode === 'from_artwork' && !!body.sourceArtworkStory;
        const hasScratchInput = body.mode === 'from_scratch' && body.soundEffects && body.soundEffects.length > 0;

        if (!hasArtworkInput && !hasScratchInput) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Missing input: provide an artwork story or at least one sound effect." },
                { status: 400 }
            );
        }

        // 1. Build music prompt via Gemini
        const promptResult = await buildMusicPrompt(body);
        if (!promptResult.success || !promptResult.data) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: promptResult.error || "Failed to build music prompt." },
                { status: 500 }
            );
        }

        const { prompt: musicPrompt, creation_story: creationStory } = promptResult.data;

        // 2. Generate music via Lyria (30-second WAV, base64)
        const musicResult = await generateMusicFromPrompt(musicPrompt);

        // NOTE: If Lyria is not enabled, we still return a result with lyriaAvailable: false
        // so the frontend can show a graceful fallback instead of a crash.
        const lyriaAvailable = musicResult.success;
        const audioBase64 = musicResult.success ? musicResult.data : null;

        // 3. Generate cover art via Imagen (using the same music prompt description)
        const coverPrompt = `Abstract album cover art for music described as: ${musicPrompt}. Vibrant, artistic, no text, no words.`;
        const coverResult = await generateImageFromPrompt(coverPrompt);
        const coverBase64 = coverResult.success ? coverResult.data : null;

        return NextResponse.json({
            success: true,
            data: {
                audioBase64,
                coverBase64,
                creationStory,
                musicPrompt,
                lyriaAvailable,
                lyriaError: musicResult.success ? null : musicResult.error,
            },
        });

    } catch (error) {
        console.error("Create Music API Error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error instanceof Error ? error.message : "Internal server error." },
            { status: 500 }
        );
    }
}
