import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JOURNEY_CONTENT } from '@/lib/journey/content';
import { Journey } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback options if Gemini fails
const FALLBACKS: Record<Journey, Record<2 | 3, Array<{id: string; label_en: string; label_id: string; emoji: string; value: string}>>> = {
  feelings: {
    2: [
      { id: 'home',    label_en: 'At home',         label_id: 'Di rumah',          emoji: '🏠', value: 'at home' },
      { id: 'someone', label_en: 'With someone',    label_id: 'Dengan seseorang',   emoji: '👫', value: 'with someone' },
      { id: 'special', label_en: 'A special place', label_id: 'Tempat istimewa',    emoji: '🌟', value: 'a special place' },
    ],
    3: [
      { id: 'warm',   label_en: 'Warm and bright', label_id: 'Hangat dan cerah',  emoji: '🌅', value: 'warm sunrise tones' },
      { id: 'soft',   label_en: 'Soft and calm',   label_id: 'Lembut dan tenang', emoji: '🌿', value: 'soft greens' },
      { id: 'bright', label_en: 'Bold and vivid',  label_id: 'Cerah dan hidup',   emoji: '✨', value: 'bright yellows' },
    ],
  },
  world: {
    2: [
      { id: 'buildings',  label_en: 'Buildings',  label_id: 'Bangunan',  emoji: '🏢', value: 'buildings' },
      { id: 'nature',     label_en: 'Nature',     label_id: 'Alam',      emoji: '🌳', value: 'nature' },
      { id: 'transport',  label_en: 'Transport',  label_id: 'Transportasi', emoji: '🚌', value: 'transport' },
    ],
    3: [
      { id: 'blue',  label_en: 'Steel blues',   label_id: 'Biru baja',  emoji: '🔵', value: 'steel blues and greys' },
      { id: 'green', label_en: 'Fresh greens',  label_id: 'Hijau segar',emoji: '🟢', value: 'bright greens' },
      { id: 'warm',  label_en: 'Warm evening',  label_id: 'Sore hangat',emoji: '🌇', value: 'warm evening tones' },
    ],
  },
  sounds: {
    2: [
      { id: 'birds',     label_en: 'Birds',      label_id: 'Burung',      emoji: '🐦', value: 'birds' },
      { id: 'traffic',   label_en: 'Traffic',    label_id: 'Lalu lintas', emoji: '🚗', value: 'traffic' },
      { id: 'footsteps', label_en: 'Footsteps',  label_id: 'Langkah kaki',emoji: '👣', value: 'footsteps' },
      { id: 'rain',      label_en: 'Rain',       label_id: 'Hujan',       emoji: '🌧️', value: 'rain' },
      { id: 'music',     label_en: 'Music',      label_id: 'Musik',       emoji: '🎶', value: 'music' },
      { id: 'scooter',   label_en: 'Scooter',    label_id: 'Skuter',      emoji: '🛵', value: 'scooter' },
    ],
    3: [
      { id: 'busy',  label_en: 'Busy and energetic', label_id: 'Sibuk dan energik', emoji: '⚡', value: 'busy and energetic' },
      { id: 'calm',  label_en: 'Calm and quiet',     label_id: 'Tenang dan sunyi',  emoji: '🌊', value: 'calm and quiet' },
      { id: 'happy', label_en: 'Happy and warm',     label_id: 'Senang dan hangat', emoji: '☀️', value: 'happy and warm' },
    ],
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    journey: Journey;
    step: 2 | 3;
    step1_value: string;
    step2_value?: string;
  };

  try {
    const { journey, step, step1_value, step2_value } = body;

    if (!journey || !step || !step1_value) {
      return NextResponse.json({ options: FALLBACKS[journey]?.[step] ?? [] });
    }

    const content = JOURNEY_CONTENT[journey];
    const prefix = step === 2 ? content.step2_prefix : content.step3_prefix;
    const filledPrefix = prefix
      .replace('{step1_value}', step1_value)
      .replace('{step2_value}', step2_value ?? '');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(filledPrefix);
    const text = result.response.text().trim();

    // Strip markdown fences if present
    const clean = text.replace(/```json|```/g, '').trim();
    const options = JSON.parse(clean);

    // Validate it's an array with the right shape
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error('Invalid options shape');
    }

    return NextResponse.json({ options: options.slice(0, journey === 'sounds' && step === 2 ? 6 : 3) });

  } catch (err) {
    console.error('journey-options error:', err);
    const fallback = FALLBACKS[body.journey]?.[body.step] ?? [];
    return NextResponse.json({ options: fallback });
  }
}
