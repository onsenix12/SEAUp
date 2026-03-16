import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { MusicFlowState } from "@/types";
import { deriveMusicSkills, skillsToStorageString } from "@/lib/learning/skills";

interface SaveMusicRequest {
    state: MusicFlowState;
    audioStoragePath: string;    // path in Supabase 'music' bucket (uploaded directly by client)
    coverBase64?: string;        // base64 image (data URI format)
    creationStory: string;
    musicPrompt: string;
    creatorName?: string;
    organisation?: string;
    facilitatorId?: string;
    journey?: string;
}

export async function POST(request: Request) {
    try {
        const body: SaveMusicRequest = await request.json();

        if (!body.audioStoragePath || !body.state) {
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

        // 2. Audio was uploaded directly from the browser to Supabase Storage —
        //    just resolve the public URL from the path.
        const { data: audioPublicUrl } = supabase.storage.from('music').getPublicUrl(body.audioStoragePath);

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
                    .upload(coverFileName, coverBuffer, {
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
                { success: false, error: `DB error saving music track: ${trackError.message}` },
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
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Save Music API Error:", msg);
        return NextResponse.json(
            { success: false, error: msg },
            { status: 500 }
        );
    }
}
