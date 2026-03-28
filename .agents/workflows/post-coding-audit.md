---
description: Code Review and Documentation Sync
---

This workflow must be executed by the AI agent immediately after any code is created or modified. It ensures that technical debt is caught early and that the project's complex documentation ecosystem (`build_state.md`, `decisions.md`, `requirements.md`, `user_journey.md`) remains perfectly aligned with the codebase.

1. **Conduct Code Quality Review**
   - Review the modified files for code smells, performance issues, state management bugs, and Next.js App Router hydration issues (e.g., dynamic client boundaries vs server borders).
   - Ensure the code strictly adheres to the cognitive accessibility design principles defined in `brand-guidelines.md` (e.g., minimum 72x72px tap targets, high contrast, visual-first prompts).
   - If technical debt or bugs are found, fix them immediately. Do not leave broken code.

2. **Sync the Execution Tracker (`build_state.md`)**
   - Update `build_state.md` with a concise summary of the changes made.
   - Move completed tasks from the active queue into the completed lists, and add a session note explaining the work done.

3. **Audit System Architecture (`requirements.md`)**
   - Check if the recent code changes mandate an update to the system architecture (e.g., extending the Supabase database schema, adding a new AI API provider, or moving a feature from Phase 2 into MVP).
   - If the architecture or product scope evolved, update `requirements.md` accordingly so it remains a definitive reference.

4. **Log Architectural Decisions (`decisions.md`)**
   - If the code update involved choosing a specific technical or product path over another (e.g., how data is stored, why a UI pattern was chosen over an alternative), append a new `[DEC-XXX]` record to the bottom of `decisions.md`. Explain the context, the options considered, and the final rationale. This prevents future agents from re-litigating settled debates.

5. **Sync User Experience Documentation (`user_journey.md`)**
   - Check if the changes altered UI copy, step-by-step user flow interactions, or facilitator prompts.
   - If the human experience changed, reflect these changes in `user_journey.md` so it remains an accurate blueprint of exactly what the creator and facilitator see and do.

6. **Sync the Design System (`brand-guidelines.md`)**
   - Review if the recent code updates introduced new UX components, typography adjustments, animations, or CSS conventions that should become part of the platform's core aesthetic.
   - If a new baseline design standard was established, document it in `brand-guidelines.md` to ensure future frontend changes remain visually cohesive.

7. **Sync Project Elevator Pitch (`README.md`)**
   - Review if the high-level tech stack, environment variable requirements (e.g., adding a new API key to `.env`), or core feature summaries have fundamentally changed.
   - If so, update `README.md` to ensure that it correctly guides newly onboarded developers.
