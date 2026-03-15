import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { CreationFlowState, MusicFlowState, ApiResponse } from "@/types";
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

// ==========================================
// 4. Gemini — Music Prompt Construction
// ==========================================
export async function buildMusicPrompt(
    state: MusicFlowState
): Promise<ApiResponse<{ prompt: string; creation_story: string }>> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a world-class music director. Given an artwork description or sound palette choices, craft an evocative music AI prompt capturing mood, instrumentation, tempo, and texture. Also write a 1-sentence creation story (max 10 words). Return ONLY valid JSON — no markdown, no extra text: {\"prompt\": \"...\", \"creation_story\": \"...\"}",
        });

        let userPrompt = "Create the JSON response for a music composition based on these inputs:\n";

        if (state.mode === 'from_artwork' && state.sourceArtworkStory) {
            userPrompt += `- Artwork Creation Story: "${state.sourceArtworkStory}"\n`;
            userPrompt += `- Inspiration: Translate the visual feeling of this artwork into sound.\n`;
        }

        if (state.soundEffects && state.soundEffects.length > 0) {
            userPrompt += `- Sound Palette: ${state.soundEffects.join(', ')}\n`;
        }

        if (state.hasRecordedAudio) {
            userPrompt += `- The creator also recorded their own sounds as an additional sonic layer.\n`;
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                responseMimeType: "application/json",
            },
        });

        let responseText = result.response.text().trim();
        // Strip markdown code fences if model wraps response
        responseText = responseText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

        let parsed: { prompt?: string; creation_story?: string } = {};
        try {
            parsed = JSON.parse(responseText);
        } catch {
            // Regex fallback if JSON is malformed
            const pm = responseText.match(/"prompt"\s*:\s*"([^"]+)"/);
            const sm = responseText.match(/"creation_story"\s*:\s*"([^"]+)"/);
            if (pm) parsed.prompt = pm[1];
            if (sm) parsed.creation_story = sm[1];
        }

        // Sensible defaults so the pipeline never hard-blocks
        const finalPrompt = parsed.prompt ||
            (state.soundEffects?.length
                ? `Instrumental music with ${state.soundEffects.join(', ')} elements, expressive and layered.`
                : `Ambient music inspired by: ${state.sourceArtworkStory || 'a vibrant artwork'}.`);
        const finalStory = parsed.creation_story || "A sound born from colour and feeling.";

        return {
            success: true,
            data: { prompt: finalPrompt, creation_story: finalStory },
        };
    } catch (error) {
        console.error("Music Prompt Build Error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to construct music prompt.",
        };
    }
}

// ==========================================
// 5. Music Generation — Lyria 2 (Replicate) or Gemini Audio fallback
//    Lyria 2: 48 kHz stereo WAV via Replicate (google/lyria-2)
//    Gemini: 24 kHz mono WAV from raw PCM (stopgap)
// ==========================================

/** Convert raw PCM base64 (16-bit signed, 24 kHz, mono) to WAV base64 */
function pcmBase64ToWavBase64(pcmBase64: string, sampleRate = 24000): string {
    const pcm = Buffer.from(pcmBase64, 'base64');
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const wav = Buffer.alloc(44 + pcm.length);

    wav.write('RIFF', 0, 'ascii');
    wav.writeUInt32LE(36 + pcm.length, 4);
    wav.write('WAVE', 8, 'ascii');
    wav.write('fmt ', 12, 'ascii');
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);          // PCM
    wav.writeUInt16LE(numChannels, 22);
    wav.writeUInt32LE(sampleRate, 24);
    wav.writeUInt32LE(byteRate, 28);
    wav.writeUInt16LE(blockAlign, 32);
    wav.writeUInt16LE(bitsPerSample, 34);
    wav.write('data', 36, 'ascii');
    wav.writeUInt32LE(pcm.length, 40);
    pcm.copy(wav, 44);

    return wav.toString('base64');
}

/** Lyria 2 via Replicate — 48 kHz stereo WAV, ~30s. Returns base64 WAV. */
async function generateMusicViaLyria(prompt: string): Promise<ApiResponse<string>> {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token?.trim()) {
        return { success: false, error: "REPLICATE_API_TOKEN is not set. Set it to use Lyria 2 (48kHz) music generation." };
    }

    try {
        const Replicate = (await import("replicate")).default;
        const replicate = new Replicate({ auth: token });

        // Replicate API expects Prefer: wait=x in seconds (1–60)
        const output = await replicate.run("google/lyria-2", {
            input: { prompt },
            wait: { mode: "block", timeout: 60 },
            signal: AbortSignal.timeout(65000),
        }) as { url?: () => URL; toString?: () => string };

        const url = typeof output?.url === "function"
            ? output.url().href
            : typeof output === "string"
                ? output
                : (output?.toString?.() ?? null);

        if (!url || !url.startsWith("http")) {
            return {
                success: false,
                error: "Lyria 2 returned no audio URL.",
            };
        }

        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) {
            return {
                success: false,
                error: `Failed to fetch Lyria audio: ${res.status} ${res.statusText}`,
            };
        }

        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        return { success: true, data: base64 };
    } catch (error) {
        console.error("Lyria 2 Error:", error);
        return {
            success: false,
            error: error instanceof Error ? `Lyria 2: ${error.message}` : "Lyria 2 music generation failed.",
        };
    }
}

/** Gemini Audio fallback — 24 kHz mono WAV from PCM (when Replicate not configured). */
async function generateMusicViaGemini(prompt: string): Promise<ApiResponse<string>> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const body = {
            contents: [{
                parts: [{
                    text: `You are a creative audio composer. Based on the following musical concept, generate a short expressive audio piece (around 10–15 seconds). Be evocative and musical — use dynamics, texture, and rhythm. Musical concept: ${prompt}`
                }]
            }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Aoede" }
                    }
                }
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(25000), // 25s max
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: `Gemini Audio API error (${response.status}): ${errData?.error?.message || response.statusText}`,
            };
        }

        const data = await response.json();
        const part = data?.candidates?.[0]?.content?.parts?.[0];

        if (!part?.inlineData?.data) {
            return {
                success: false,
                error: "Gemini audio model returned no audio data. The model may not support audio output on this API key tier.",
            };
        }

        const wavBase64 = pcmBase64ToWavBase64(part.inlineData.data);

        return {
            success: true,
            data: wavBase64,
        };
    } catch (error) {
        console.error("Gemini Audio Error:", error);
        return {
            success: false,
            error: error instanceof Error ? `Audio generation error: ${error.message}` : "Failed to generate audio.",
        };
    }
}

/** Generate music from a text prompt. Uses Lyria 2 (Replicate) if REPLICATE_API_TOKEN is set, else Gemini Audio. */
export async function generateMusicFromPrompt(
    prompt: string
): Promise<ApiResponse<string>> {
    if (process.env.REPLICATE_API_TOKEN?.trim()) {
        return generateMusicViaLyria(prompt);
    }
    return generateMusicViaGemini(prompt);
}


