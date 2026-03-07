import { NextRequest, NextResponse } from "next/server";
import { CreationFlowState } from "@/types";
import { buildArtPrompt, generateImageFromPrompt, checkImageSafety } from "@/lib/google-ai";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as CreationFlowState;

        // 1. Validate input
        if (!body.mood || !body.colour_palette || !body.subject) {
            return NextResponse.json(
                { success: false, error: "Missing required creation fields." },
                { status: 400 }
            );
        }

        // 2. Build Prompt via Gemini
        const promptResult = await buildArtPrompt(body);
        if (!promptResult.success || !promptResult.data) {
            return NextResponse.json(
                { success: false, error: promptResult.error || "Failed to build prompt." },
                { status: 500 }
            );
        }

        const artPrompt = promptResult.data;

        // 3. Generate Image via Imagen (with automatic retry on safety fail)
        let finalImageUrl = "";
        let moderationPass = false;

        // Allowed 1 silent regeneration attempt
        for (let attempt = 1; attempt <= 2; attempt++) {
            const imageResult = await generateImageFromPrompt(artPrompt);

            if (!imageResult.success || !imageResult.data) {
                if (attempt === 2) throw new Error("Image generation failed twice.");
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
                console.log(`Self-moderation failed on attempt ${attempt}. Retrying.`);
            }
        }

        // 5. Fallback logic if both generation/moderation attempts fail
        if (!moderationPass) {
            console.error("Critical: Safesearch failed twice. Delivering fallback image.");
            // Notify facilitator via DB in Phase 4
            finalImageUrl = "https://placehold.co/1024x1024/FFD1D1/D8000C.png?text=Content+Policy+Flag";
        }

        // 6. Return payload
        return NextResponse.json({
            success: true,
            data: finalImageUrl,
        });

    } catch (error) {
        console.error("Create API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error during creation." },
            { status: 500 }
        );
    }
}
