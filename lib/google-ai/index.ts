import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { CreationFlowState, ApiResponse } from "@/types";
import "server-only";

// Initialize the SDK. This runs ONLY server-side.
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ==========================================
// 1. Gemini 2.0 Flash (Prompt Construction & Story Generation)
// ==========================================
export async function buildArtPrompt(
    selections: CreationFlowState
): Promise<ApiResponse<{ prompt: string; creation_story: string }>> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are an expert creative director and curator. Your job is twofold: 1) Take the user's simple visual choices and construct a highly detailed, evocative prompt for an image generation model (English ONLY, focus on visual aesthetics). 2) Write a short, poetic, 1-sentence 'creation story' (max 10 words) that sounds like an artist explaining their piece based on their choices and actions. Do not mention UI buttons. Return ONLY a valid JSON object in the exact format: {\"prompt\": \"your detailed prompt here\", \"creation_story\": \"your short story here\"}",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
                responseMimeType: "application/json",
            }
        });

        const promptParts: Part[] = [];

        let userPrompt = "Create the JSON response based on the following creative choices and actions:\n";
        if (selections.subject) userPrompt += `- Subject: ${selections.subject}\n`;
        if (selections.mood) userPrompt += `- Mood: ${selections.mood}\n`;
        if (selections.colour_palette) userPrompt += `- Color Palette: ${selections.colour_palette}\n`;
        if (selections.style) userPrompt += `- Art Style: ${selections.style}\n`;

        // Add canvas actions for the story context
        const actions: string[] = [];
        if (selections.has_drawn) actions.push("drew on the canvas with a brush");
        if (selections.photo_taken) actions.push("used a photo as inspiration");
        if (selections.stickers_used && selections.stickers_used > 0) actions.push(`added ${selections.stickers_used} sticker${selections.stickers_used > 1 ? 's' : ''}`);

        if (actions.length > 0) {
            userPrompt += `- User Actions: The creator ${actions.join(", ")}.\n`;
        }

        promptParts.push({ text: userPrompt });

        // If a photo or canvas was provided (data URL format)
        const referenceImage = selections.canvas_base64 || selections.photo_base64;
        if (referenceImage) {
            try {
                const matches = referenceImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    promptParts.push({
                        inlineData: {
                            mimeType: matches[1],
                            data: matches[2]
                        }
                    });
                    promptParts.push({ text: "\nUse the provided image as a strong structural and thematic reference, but reinterpret it entirely through the requested Art Style, Mood, and Colors." });
                } else {
                    console.warn("Invalid image format provided to buildArtPrompt.");
                }
            } catch (e) {
                console.error("Failed to parse reference image:", e);
            }
        }

        const result = await model.generateContent(promptParts);
        const responseText = result.response.text().trim();

        try {
            const parsed = JSON.parse(responseText);
            if (!parsed.prompt || !parsed.creation_story) {
                throw new Error("Missing required fields in Gemini JSON response.");
            }
            return {
                success: true,
                data: {
                    prompt: parsed.prompt,
                    creation_story: parsed.creation_story
                },
            };
        } catch (jsonError) {
            console.error("Failed to parse Gemini JSON:", responseText, jsonError);
            // Fallback if structured generation fails
            return {
                success: true,
                data: {
                    prompt: responseText, // Might be raw text if json failed
                    creation_story: "Created through visual choices."
                }
            }
        }

    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            success: false,
            error: error instanceof Error ? `Gemini Error: ${error.message}` : "Failed to construct prompt.",
        };
    }
}

// ==========================================
// 2. Imagen (Image Generation)
// ==========================================
export async function generateImageFromPrompt(
    prompt: string
): Promise<ApiResponse<string>> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

        const payload = {
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Imagen API Error: ${data.error?.message || response.statusText}`);
        }

        let imageUrl = "";

        // Imagen 4 via predict returns predictions array with mimeType and bytesBase64Encoded
        if (data.predictions && data.predictions.length > 0) {
            const prediction = data.predictions[0];
            if (prediction.bytesBase64Encoded) {
                imageUrl = `data:${prediction.mimeType || 'image/png'};base64,${prediction.bytesBase64Encoded}`;
            }
        }

        if (!imageUrl) {
            throw new Error("No valid image data returned from Imagen");
        }

        return {
            success: true,
            data: imageUrl,
        };
    } catch (error) {
        console.error("Imagen Error:", error);
        return {
            success: false,
            error: error instanceof Error ? `Imagen Error: ${error.message}` : "Failed to generate image.",
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
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a content safety moderator. You must analyze the provided image and reply ONLY with 'PASS' if the image is safe for general audiences including children, or 'FAIL' if it contains explicit, violent, shocking, or inappropriate content.",
        });

        // Parse the base64 string
        const parts: Part[] = [];
        parts.push({ text: "Analyze this image for safety." });

        try {
            const matches = imageUrlOrBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                parts.push({
                    inlineData: {
                        mimeType: matches[1],
                        data: matches[2]
                    }
                });
            } else {
                throw new Error("Invalid image format provided for safety check.");
            }
        } catch (e) {
            throw new Error("Failed to parse image data for safety check.");
        }

        const result = await model.generateContent(parts);
        const responseText = result.response.text().trim().toUpperCase();

        if (responseText === 'FAIL') {
            return {
                success: true,
                data: false, // Explicitly failed moderation
            };
        }

        return {
            success: true,
            data: true, // Passed moderation
        };
    } catch (error) {
        console.error("SafeSearch Error:", error);
        return {
            success: false,
            error: "Failed to verify image safety.",
        };
    }
}
