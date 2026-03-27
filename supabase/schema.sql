-- SEA-Up Creative: Supabase Initial Schema
-- Run this script in the Supabase SQL Editor

-- 1. Facilitators Table
CREATE TABLE facilitators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    organisation TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Creators Table
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT, -- optional
    organisation TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    facilitator_id UUID REFERENCES facilitators(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Artworks Table
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    prompt_used TEXT NOT NULL, -- internal
    title TEXT,
    price NUMERIC,
    creator_age INTEGER,
    creator_location TEXT,
    creation_story TEXT,
    mood TEXT NOT NULL,
    colour_palette TEXT NOT NULL,
    subject TEXT NOT NULL,
    style TEXT NOT NULL DEFAULT 'abstract_illustration',
    photo_used BOOLEAN NOT NULL DEFAULT false,
    moderation_pass BOOLEAN NOT NULL DEFAULT true,
    session_notes TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    marketplace_status TEXT,
    ip_owner TEXT NOT NULL DEFAULT 'creator', -- Product strict requirement
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sessions Table (MINDS pilot research tracking)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facilitator_id UUID REFERENCES facilitators(id) ON DELETE SET NULL,
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    artworks_created INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Music Tracks Table
CREATE TABLE music_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT,
    title TEXT,
    creation_mode TEXT NOT NULL DEFAULT 'from_scratch',
    source_artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
    music_prompt TEXT NOT NULL,
    sound_effects TEXT[],
    has_recorded_audio BOOLEAN NOT NULL DEFAULT false,
    creation_story TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    marketplace_status TEXT DEFAULT 'private',
    ip_owner TEXT NOT NULL DEFAULT 'creator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE facilitators ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- For MVP development without auth blocking requests:
-- CREATE POLICY "Enable read access for all users" ON artworks FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for all users" ON artworks FOR INSERT WITH CHECK (true);
-- (Repeat for other tables as needed based on your Supabase Auth setup)
