// SEA-Up Creative: Shared TypeScript Interfaces

// ==========================================
// 1. API Response Wrapper
// ==========================================
// agent.md constraint: Every route returns { success: boolean, data?: ..., error?: string }
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// ==========================================
// 2. Database Table Shapes (Supabase mapping)
// ==========================================

export interface Facilitator {
    id: string; // UUID
    name: string;
    organisation: string;
    email: string;
    created_at: string; // ISO date string
}

export interface Creator {
    id: string; // UUID
    name?: string; // optional
    organisation: string;
    language: 'en' | 'id';
    facilitator_id?: string; // UUID, nullable
    created_at: string;
}

export interface Artwork {
    id: string; // UUID
    creator_id: string; // UUID
    image_url: string;
    prompt_used: string; // internal
    title?: string;
    price?: number;
    creator_age?: number;
    creator_location?: string;
    description?: string;  // Facilitator-written marketplace description
    creation_story?: string; // AI-generated story based on choices
    mood: string;
    colour_palette: string;
    subject: string;
    style: string; // defaults to 'abstract_illustration'
    photo_used: boolean;
    moderation_pass: boolean;
    session_notes?: string;
    is_public: boolean;
    marketplace_status?: 'private' | 'pending_review' | 'approved' | 'rejected';
    ip_owner: string; // strictly 'creator'
    creators?: {
        name: string | null;
        organisation?: string;
    };
    created_at: string;
}

export interface Session {
    id: string; // UUID
    facilitator_id?: string; // UUID, nullable
    creator_id: string; // UUID
    artworks_created: number;
    duration_minutes: number;
    notes?: string;
    created_at: string;
}

// ==========================================
// 3. Creation Flow State (Frontend)
// ==========================================
// Tracks user selections exactly as required by MVP

export interface CreationFlowState {
    nickname?: string;
    mood?: string;
    colour_palette?: string;
    subject?: string;
    photo_base64?: string; // Optional camera input
    canvas_base64?: string; // Optional user drawing/collage
    has_drawn?: boolean; // Tracking if user used brush
    photo_taken?: boolean; // Tracking if user took a photo
    stickers_used?: number; // Tracking how many stickers were used
    style: string; // Optional, defaults to 'abstract_illustration'
}

// Data shape sent to /api/create
export interface CreateArtworkRequest {
    creatorId: string; // ID of the creator context
    selections: CreationFlowState;
}
