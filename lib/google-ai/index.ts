import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreationFlowState, ApiResponse } from "@/types";

// Initialize the SDK. This runs ONLY server-side.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// ==========================================
// 1. Gemini 2.0 Flash (Prompt Construction)
// ==========================================
export async function buildArtPrompt(
    selections: CreationFlowState
): Promise<ApiResponse<string>> {
    try {
        // Stub: In Phase 2 this will call Gemini 2.0 Flash with multimodal input
        // combining the photo (if provided) and the text selections.
        // For now, it returns a simulated structured prompt.

        const basePrompt = `An artwork featuring ${selections.subject}. 
      The mood is ${selections.mood}. 
      The colour palette is ${selections.colour_palette}. 
      The style is ${selections.style || "abstract_illustration"}.`;

        return {
            success: true,
            data: basePrompt,
        };
    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            success: false,
            error: "Failed to construct prompt.",
        };
    }
}

// ==========================================
// 2. Imagen 3 (Image Generation)
// ==========================================
export async function generateImageFromPrompt(
    prompt: string
): Promise<ApiResponse<string>> {
    try {
        // Stub: In Phase 2 this will call the Imagen 3 API.
        // Returning a placeholder image URL for the MVP UI development.

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            success: true,
            data: "https://placehold.co/1024x1024/F4F3EF/1C1C1A.png?text=Imagen+3+Placeholder",
        };
    } catch (error) {
        console.error("Imagen Error:", error);
        return {
            success: false,
            error: "Failed to generate image.",
        };
    }
}

// ==========================================
// 3. Google SafeSearch (Moderation)
// ==========================================
export async function checkImageSafety(
    imageUrlOrBase64: string
): Promise<ApiResponse<boolean>> {
    try {
        // Stub: In Phase 2 this will call Google Cloud Vision SafeSearch API.
        // Returns true if the image passes all safety thresholds.

        return {
            success: true,
            data: true, // Simulate passing moderation
        };
    } catch (error) {
        console.error("SafeSearch Error:", error);
        return {
            success: false,
            error: "Failed to verify image safety.",
        };
    }
}
