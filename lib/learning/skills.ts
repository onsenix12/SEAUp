import { CreationFlowState } from "@/types";

export interface LearningSkill {
  id: string;
  label_en: string;
  label_id: string;
  emoji: string;
  domain: "emotional" | "spatial" | "auditory" | "creative";
}

export const SKILL_MAP: Record<string, LearningSkill> = {
  emotional_expression: {
    id: "emotional_expression",
    label_en: "Emotional Expression",
    label_id: "Ekspresi Emosi",
    emoji: "😊",
    domain: "emotional",
  },
  colour_association: {
    id: "colour_association",
    label_en: "Colour Association",
    label_id: "Asosiasi Warna",
    emoji: "🎨",
    domain: "creative",
  },
  spatial_reasoning: {
    id: "spatial_reasoning",
    label_en: "Spatial Reasoning",
    label_id: "Penalaran Spasial",
    emoji: "🗺️",
    domain: "spatial",
  },
  wayfinding: {
    id: "wayfinding",
    label_en: "Wayfinding",
    label_id: "Navigasi",
    emoji: "📍",
    domain: "spatial",
  },
  sound_discrimination: {
    id: "sound_discrimination",
    label_en: "Sound Discrimination",
    label_id: "Diskriminasi Suara",
    emoji: "🎵",
    domain: "auditory",
  },
  sequencing: {
    id: "sequencing",
    label_en: "Sequencing",
    label_id: "Pengurutan",
    emoji: "🔢",
    domain: "spatial",
  },
  creative_choice: {
    id: "creative_choice",
    label_en: "Creative Choice",
    label_id: "Pilihan Kreatif",
    emoji: "✨",
    domain: "creative",
  },
};

/** Derive skills from an image creation session */
export function deriveImageSkills(state: CreationFlowState): LearningSkill[] {
  const skills: LearningSkill[] = [];

  if (state.mood) skills.push(SKILL_MAP.emotional_expression);
  if (state.colour_palette) skills.push(SKILL_MAP.colour_association);
  if (state.canvas_base64) {
    skills.push(SKILL_MAP.spatial_reasoning);
    skills.push(SKILL_MAP.wayfinding);
  }
  if (state.subject) {
    if (!skills.find((s) => s.id === "creative_choice")) {
      skills.push(SKILL_MAP.creative_choice);
    }
  }
  if (state.photo_base64) {
    if (!skills.find((s) => s.id === "creative_choice")) {
      skills.push(SKILL_MAP.creative_choice);
    }
  }

  // Fallback — always return at least one skill
  if (skills.length === 0) return [SKILL_MAP.creative_choice];

  return skills;
}

// hasRhythm maps to hasRecordedAudio in MusicFlowState (MVP approximation).
// In Phase 2, when a dedicated rhythm-tap interaction is added,
// update this parameter to reflect that directly.
/** Derive skills from a music creation session */
export function deriveMusicSkills(
  soundChoices: string[],
  hasRhythm: boolean
): LearningSkill[] {
  const skills: LearningSkill[] = [SKILL_MAP.creative_choice];

  if (soundChoices.length > 0) skills.push(SKILL_MAP.sound_discrimination);
  if (hasRhythm) skills.push(SKILL_MAP.sequencing);

  return skills;
}

/** Convert skill array to comma-separated string for DB storage */
export function skillsToStorageString(skills: LearningSkill[]): string {
  return skills.map((s) => s.id).join(",");
}

/** Parse comma-separated skill IDs back to LearningSkill objects */
export function storageStringToSkills(stored: string): LearningSkill[] {
  if (!stored || stored.trim() === "") return [];
  return stored
    .split(",")
    .map((id) => SKILL_MAP[id.trim()])
    .filter(Boolean);
}
