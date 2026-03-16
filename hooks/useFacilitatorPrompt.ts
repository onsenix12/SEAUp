import { useFacilitator } from '@/contexts/FacilitatorContext';
import { useCreationFlow } from '@/contexts/CreationFlowContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { JOURNEY_CONTENT } from '@/lib/journey/content';
import { Journey } from '@/types';

type PromptStep = 'step1' | 'canvas' | 'result';

export function useFacilitatorPrompt(step: PromptStep) {
  const { sessionData } = useFacilitator();
  const { state } = useCreationFlow();
  const { language } = useLanguage();

  const isActive = sessionData.isActive;
  const journey = state.journey as Journey | undefined;

  if (!isActive || !journey) {
    return { shouldShow: false, prompt: null, language };
  }

  const content = JOURNEY_CONTENT[journey];
  let rawPrompt: { en: string; id: string } | null = null;

  if (step === 'step1') rawPrompt = content.step1.facilitator_prompt;
  if (step === 'canvas') rawPrompt = content.canvas_facilitator_prompt;
  if (step === 'result') rawPrompt = content.result_facilitator_prompt;

  const prompt = rawPrompt ? (language === 'id' ? rawPrompt.id : rawPrompt.en) : null;

  return {
    shouldShow: !!prompt,
    prompt,
    language,
  };
}
