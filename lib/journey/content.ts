import { Journey } from '@/types';

export interface StepOption {
  id: string;
  label_en: string;
  label_id: string;
  emoji: string;
  value: string;
}

export interface FacilitatorPrompt {
  en: string;
  id: string;
}

export interface CanvasConfig {
  prompt_en: string;
  prompt_id: string;
  stickers: StepOption[];
  free_draw: boolean;
}

export interface JourneyStepContent {
  question_en: string;
  question_id: string;
  options: StepOption[];
  facilitator_prompt: FacilitatorPrompt;
}

export interface JourneyContent {
  step1: JourneyStepContent;
  step2_prefix: string;
  step3_prefix: string;
  canvas: CanvasConfig;
  canvas_facilitator_prompt: FacilitatorPrompt;
  result_facilitator_prompt: FacilitatorPrompt;
  creation_story_template: string;
  skill_ids: string[];
}

export const JOURNEY_CONTENT: Record<Journey, JourneyContent> = {
  feelings: {
    step1: {
      question_en: 'How are you feeling today?',
      question_id: 'Bagaimana perasaanmu hari ini?',
      options: [
        { id: 'happy',   label_en: 'Happy',   label_id: 'Senang',       emoji: '😊', value: 'happy' },
        { id: 'calm',    label_en: 'Calm',    label_id: 'Tenang',       emoji: '😌', value: 'calm' },
        { id: 'excited', label_en: 'Excited', label_id: 'Bersemangat',  emoji: '🤩', value: 'excited' },
        { id: 'worried', label_en: 'Worried', label_id: 'Khawatir',     emoji: '😟', value: 'worried' },
        { id: 'sad',     label_en: 'Sad',     label_id: 'Sedih',        emoji: '😢', value: 'sad' },
        { id: 'confused',label_en: 'Confused',label_id: 'Bingung',      emoji: '😕', value: 'confused' },
      ],
      facilitator_prompt: {
        en: 'Ask them: How are you feeling right now? Point to the one that feels most like you.',
        id: 'Tanya mereka: Bagaimana perasaanmu sekarang? Tunjuk yang paling mewakili kamu.',
      },
    },
    step2_prefix: 'Generate exactly 3 context options for where someone feels {step1_value}. Examples: "At home", "With someone", "At a special place". Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id (string), label_en (string), label_id (string), emoji (string), value (string).',
    step3_prefix: 'Generate exactly 3 colour palette options for someone who feels {step1_value} at {step2_value}. Each palette should have a descriptive name. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
    canvas: {
      prompt_en: 'Draw what this feeling looks like. Use the stickers or draw freely.',
      prompt_id: 'Gambarkan perasaan ini. Gunakan stiker atau gambar bebas.',
      stickers: [
        { id: 'face',  label_en: 'Face',  label_id: 'Wajah',    emoji: '😊', value: 'face' },
        { id: 'heart', label_en: 'Heart', label_id: 'Hati',     emoji: '❤️', value: 'heart' },
        { id: 'sun',   label_en: 'Sun',   label_id: 'Matahari', emoji: '☀️', value: 'sun' },
        { id: 'rain',  label_en: 'Rain',  label_id: 'Hujan',    emoji: '🌧️', value: 'rain' },
        { id: 'home',  label_en: 'Home',  label_id: 'Rumah',    emoji: '🏠', value: 'home' },
        { id: 'tree',  label_en: 'Tree',  label_id: 'Pohon',    emoji: '🌳', value: 'tree' },
        { id: 'star',  label_en: 'Star',  label_id: 'Bintang',  emoji: '⭐', value: 'star' },
      ],
      free_draw: true,
    },
    canvas_facilitator_prompt: {
      en: 'Ask them: Is there anything you want to add — a person, a place, a feeling? Let them draw as long as they want. Tap Continue when they feel done.',
      id: 'Tanya mereka: Ada yang ingin ditambahkan? Biarkan mereka menggambar selama yang mereka mau. Tekan Lanjutkan jika sudah selesai.',
    },
    result_facilitator_prompt: {
      en: 'Ask them: Does this look like how you were feeling? What do you see in it? Tell them: this is yours — you made this.',
      id: 'Tanya mereka: Apakah ini menggambarkan perasaanmu? Apa yang kamu lihat? Katakan: ini milikmu — kamu yang membuatnya.',
    },
    creation_story_template: 'Made while exploring {step1} at {step2}. Created on {date}.',
    skill_ids: ['emotional_expression', 'colour_association', 'creative_choice'],
  },

  world: {
    step1: {
      question_en: 'Where do you want to explore?',
      question_id: 'Tempat mana yang ingin kamu jelajahi?',
      options: [
        { id: 'neighbourhood', label_en: 'My neighbourhood', label_id: 'Lingkunganku',    emoji: '🏘️', value: 'my neighbourhood' },
        { id: 'school',        label_en: 'My school',        label_id: 'Sekolahku',        emoji: '🏫', value: 'my school' },
        { id: 'favourite',     label_en: 'My favourite place',label_id: 'Tempat favoritku',emoji: '💛', value: 'my favourite place' },
      ],
      facilitator_prompt: {
        en: 'Ask them: Where do you go most days? Where do you feel comfortable?',
        id: 'Tanya mereka: Ke mana kamu pergi setiap hari? Di mana kamu merasa nyaman?',
      },
    },
    step2_prefix: 'Generate exactly 3 landmark category options for {step1_value}. Examples: Buildings, Nature, Transport. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
    step3_prefix: 'Generate exactly 3 colour palette options for {step2_value} at {step1_value}. Each palette should reflect the visual character of that environment. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
    canvas: {
      prompt_en: "Let's draw your journey. Where do you start? Place your first sticker.",
      prompt_id: 'Ayo gambar perjalananmu. Dari mana kamu mulai? Taruh stiker pertamamu.',
      stickers: [
        { id: 'home',      label_en: 'Home',           label_id: 'Rumah',           emoji: '🏠', value: 'home' },
        { id: 'bus',       label_en: 'Bus Stop',       label_id: 'Halte Bus',       emoji: '🚌', value: 'bus stop' },
        { id: 'mrt',       label_en: 'MRT',            label_id: 'MRT',             emoji: '🚇', value: 'MRT station' },
        { id: 'school',    label_en: 'School',         label_id: 'Sekolah',         emoji: '🏫', value: 'school' },
        { id: 'park',      label_en: 'Park',           label_id: 'Taman',           emoji: '🌳', value: 'park' },
        { id: 'shop',      label_en: 'Shop',           label_id: 'Toko',            emoji: '🏪', value: 'shop' },
        { id: 'favourite', label_en: 'Favourite Place',label_id: 'Tempat Favorit',  emoji: '⭐', value: 'favourite place' },
      ],
      free_draw: true,
    },
    canvas_facilitator_prompt: {
      en: 'Ask them: Where do you start from? Where do you go next? Help them build the route step by step. Tap Continue when the map feels complete.',
      id: 'Tanya mereka: Dari mana mulainya? Ke mana selanjutnya? Bantu mereka membangun rute langkah demi langkah. Tekan Lanjutkan jika peta sudah lengkap.',
    },
    result_facilitator_prompt: {
      en: 'Ask them: Can you see your journey in the picture? Point to where home is. Tell them: you just drew your own map.',
      id: 'Tanya mereka: Bisakah kamu melihat perjalananmu di gambar ini? Tunjuk di mana rumahmu. Katakan: kamu baru saja menggambar petamu sendiri.',
    },
    creation_story_template: 'A journey through {step1}. Created on {date}.',
    skill_ids: ['spatial_reasoning', 'wayfinding', 'creative_choice'],
  },

  sounds: {
    step1: {
      question_en: 'Where are these sounds from?',
      question_id: 'Dari mana suara-suara ini berasal?',
      options: [
        { id: 'neighbourhood', label_en: 'My neighbourhood', label_id: 'Lingkunganku',       emoji: '🏘️', value: 'my neighbourhood' },
        { id: 'home',          label_en: 'My home',          label_id: 'Rumahku',             emoji: '🏠', value: 'my home' },
        { id: 'favourite',     label_en: 'A place I love',   label_id: 'Tempat yang aku suka',emoji: '💛', value: 'a place I love' },
      ],
      facilitator_prompt: {
        en: 'Ask them: Close your eyes for a moment. What do you hear right now? Where does that sound come from?',
        id: 'Minta mereka: Tutup matamu sebentar. Apa yang kamu dengar sekarang? Dari mana suara itu?',
      },
    },
    step2_prefix: 'Generate 6 sound chip options for {step1_value}. Examples: Birds, Bus, Footsteps, Rain, Scooter, Music from a shop. Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields. This will be a multi-select step — max 3 selections allowed by the user.',
    step3_prefix: 'Generate exactly 3 emotional tone options for sounds from {step1_value}. Examples: "Busy and energetic", "Calm and quiet", "Happy and warm". Return ONLY a valid JSON array — no markdown, no explanation. Each object must have: id, label_en, label_id, emoji, value fields.',
    canvas: {
      prompt_en: 'Draw how the sounds move. Fast lines or slow? Big shapes or small?',
      prompt_id: 'Gambarkan bagaimana suara itu bergerak. Garis cepat atau lambat? Bentuk besar atau kecil?',
      stickers: [],
      free_draw: true,
    },
    canvas_facilitator_prompt: {
      en: 'Ask them: Show me with your hand how the sound moves. Now draw it. Is it fast or slow?',
      id: 'Tanya mereka: Tunjukkan dengan tanganmu bagaimana suara itu bergerak. Sekarang gambarkan. Cepat atau lambat?',
    },
    result_facilitator_prompt: {
      en: 'Play it to them. Ask them: Does this sound like your place? What do you hear in it? Tell them: you made this music.',
      id: 'Putar untuk mereka. Tanya: Apakah ini terdengar seperti tempatmu? Apa yang kamu dengar? Katakan: kamu yang membuat musik ini.',
    },
    creation_story_template: 'Composed from the sounds of {step1}. Created on {date}.',
    skill_ids: ['sound_discrimination', 'sequencing', 'creative_choice'],
  },
};
