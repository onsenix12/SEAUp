import { NextRequest, NextResponse } from "next/server";
import { CreationFlowState, ApiResponse } from "@/types";
import { buildArtPrompt, generateImageFromPrompt, checkImageSafety } from "@/lib/google-ai";
import { createSupabaseServiceClient } from "@/lib/supabase";

const FALLBACK_FLAG_IMAGE = "https://placehold.co/1024x1024/FFD1D1/D8000C.png?text=Content+Policy+Flag";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as CreationFlowState & { creatorId?: string };

        // 1. Strict Input Validation
        if (typeof body !== 'object' || body === null || !body.mood || !body.colour_palette || !body.subject || !body.style) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Missing or invalid required creation fields: mood, colour_palette, subject, and style." },
                { status: 400 }
            );
        }

        // 2. Build Prompt via Gemini
        const promptResult = await buildArtPrompt(body);
        if (!promptResult.success || !promptResult.data) {
            console.error("Failed to build prompt:", promptResult.error);
            return NextResponse.json<ApiResponse>(
                { success: false, error: promptResult.error || "Failed to build prompt." },
                { status: 500 }
            );
        }

        const artPrompt = promptResult.data.prompt;
        const creationStory = promptResult.data.creation_story;

        // 3. Generate Image via Imagen (with automatic retry on safety fail)
        let finalImageUrl = "";
        let moderationPass = false;

        // Allowed 1 silent regeneration attempt
        for (let attempt = 1; attempt <= 2; attempt++) {
            const imageResult = await generateImageFromPrompt(artPrompt);

            if (!imageResult.success || !imageResult.data) {
                console.error(`Imagen generation failed on attempt ${attempt}. Error:`, imageResult.error);
                console.error(`Prompt used for failed generation:`, artPrompt);

                if (attempt === 2) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: `Image generation failed twice. Final error: ${imageResult.error}` },
                        { status: 500 }
                    );
                }
                continue; // Silently retry
            }

            const candidateImage = imageResult.data;

            // 4. Safety Check via Gemini Vision Model
            const safetyResult = await checkImageSafety(candidateImage);

            if (safetyResult.success && safetyResult.data === true) {
                finalImageUrl = candidateImage;
                moderationPass = true;
                break; // Safe!
            } else {
                console.warn(`Self-moderation failed on attempt ${attempt}. Retrying.`);
            }
        }

        // 5. Fallback logic if both generation/moderation attempts fail
        if (!moderationPass) {
            console.error("Critical: Safesearch failed twice. Delivering fallback image.");
            finalImageUrl = FALLBACK_FLAG_IMAGE;

            // Phase 4: Notify facilitator via DB
            if (body.creatorId) {
                try {
                    const supabase = await createSupabaseServiceClient();
                    await supabase.from('artworks').insert({
                        creator_id: body.creatorId,
                        image_url: finalImageUrl,
                        prompt_used: artPrompt,
                        creation_story: creationStory, // added
                        mood: body.mood,
                        colour_palette: body.colour_palette,
                        subject: body.subject,
                        style: body.style,
                        photo_used: !!body.photo_base64,
                        moderation_pass: false,
                        is_public: false,
                        ip_owner: 'creator' // constraint
                    });
                } catch (dbError) {
                    console.error("Failed to write moderation failure back to DB:", dbError);
                }
            }
        }

        // 6. Return payload
        // Also returning the creation_story so step-7 can save it to session
        return NextResponse.json({
            success: true,
            data: {
                imageUrl: finalImageUrl,
                creationStory: creationStory
            },
        });

    } catch (error) {
        console.error("Create API Error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error instanceof Error ? error.message : "Internal server error during creation." },
            { status: 500 }
        );
    }
}
