import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { MusicFlowState } from "@/types";
import { deriveMusicSkills, skillsToStorageString } from "@/lib/learning/skills";

interface SaveMusicRequest {
    state: MusicFlowState;
    audioBase64: string;         // base64 WAV (no data URI prefix)
    coverBase64?: string;        // base64 image (data URI format)
    creationStory: string;
    musicPrompt: string;
    creatorName?: string;
    organisation?: string;
    facilitatorId?: string;
}

export async function POST(request: Request) {
    try {
        const body: SaveMusicRequest = await request.json();

        if (!body.audioBase64 || !body.state) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createSupabaseServiceClient();

        // 1. Create or reuse creator record
        const { data: creatorData, error: creatorError } = await supabase
            .from('creators')
            .insert({
                name: body.creatorName || body.state.nickname || null,
                organisation: body.organisation || '',
                language: 'en',
                facilitator_id: body.facilitatorId || null,
            })
            .select('id')
            .single();

        if (creatorError || !creatorData) {
            return NextResponse.json(
                { success: false, error: `Database error during creator setup: ${creatorError?.message || 'Unknown'}` },
                { status: 500 }
            );
        }

        const creatorId = creatorData.id;

        // 2. Upload WAV audio file to Supabase storage
        const audioBuffer = Buffer.from(body.audioBase64, 'base64');
        const audioFileName = `${creatorId}_${Date.now()}.wav`;

        const { error: audioStorageError } = await supabase.storage
            .from('music')
            .upload(audioFileName, new Uint8Array(audioBuffer).buffer, {
                contentType: 'audio/wav',
                upsert: false,
            });

        if (audioStorageError) {
            console.error("Audio storage upload failed:", audioStorageError);
            return NextResponse.json(
                { success: false, error: `Failed to upload audio: ${audioStorageError.message}` },
                { status: 500 }
            );
        }

        const { data: audioPublicUrl } = supabase.storage.from('music').getPublicUrl(audioFileName);

        // 3. Upload cover image (optional)
        let coverCdnUrl: string | null = null;
        if (body.coverBase64) {
            const matches = body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const mimeType = matches[1];
                const coverBuffer = Buffer.from(matches[2], 'base64');
                const coverFileName = `music_cover_${creatorId}_${Date.now()}.${mimeType.split('/')[1] || 'png'}`;

                const { error: coverStorageError } = await supabase.storage
                    .from('artworks')
                    .upload(coverFileName, new Uint8Array(coverBuffer).buffer, {
                        contentType: mimeType,
                        upsert: false,
                    });

                if (!coverStorageError) {
                    const { data: coverPublicUrl } = supabase.storage.from('artworks').getPublicUrl(coverFileName);
                    coverCdnUrl = coverPublicUrl.publicUrl;
                } else {
                    console.warn("Cover image upload failed (non-fatal):", coverStorageError.message);
                }
            }
        }

        // 4. Insert music_track record
        const skills = deriveMusicSkills(body.state.soundEffects ?? [], body.state.hasRecordedAudio ?? false);
        const learningTagsString = skillsToStorageString(skills);

        const { data: trackData, error: trackError } = await supabase
            .from('music_tracks')
            .insert({
                creator_id: creatorId,
                audio_url: audioPublicUrl.publicUrl,
                cover_image_url: coverCdnUrl,
                creation_mode: body.state.mode || 'from_scratch',
                source_artwork_id: body.state.sourceArtworkId || null,
                music_prompt: body.musicPrompt,
                sound_effects: body.state.soundEffects || [],
                has_recorded_audio: !!body.state.hasRecordedAudio,
                creation_story: body.creationStory,
                is_public: false,
                marketplace_status: 'private',
                ip_owner: 'creator',
                learning_tags: learningTagsString,
            })
            .select('id')
            .single();

        if (trackError) {
            console.error("Failed to save music track record:", trackError);
            return NextResponse.json(
                { success: false, error: "Database error saving music track" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                trackId: trackData?.id,
                audioUrl: audioPublicUrl.publicUrl,
                coverUrl: coverCdnUrl,
            }
        });

    } catch (error) {
        console.error("Save Music API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error during music save." },
            { status: 500 }
        );
    }
}
