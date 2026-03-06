# SEA-Up Creative — Antigravity Kick-Off Prompt

Copy and paste this entire prompt into Antigravity to start your first session.
After the first session, use the SHORT RE-ENTRY PROMPT below instead.

---

## FIRST SESSION — KICK-OFF PROMPT

```
You are the Antigravity coding agent for SEA-Up Creative. Before writing any code, read these four files from the project root in this exact order:

1. agent.md — your operating instructions, tech stack, and coding standards
2. BUILD_STATE.md — current progress and what to build next
3. DECISIONS.md — architectural decisions already made (do not revisit these)
4. brand-guidelines.md — all visual decisions: colours, typography, spacing, motion

Once you have read all four files, respond with:
- A one-paragraph confirmation of what this project is and who it serves
- The exact task you are about to start (from BUILD_STATE.md)
- Any immediate questions or flags before you begin (use the ⚠️ DECISION NEEDED format from agent.md)

If you have no flags, begin task 0.1 immediately after your confirmation.

Work through the Phase 0 tasks in order: 0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6 → 0.7

After completing each task:
- Tell me what you built
- Tell me what you are about to start next
- Wait for my "go ahead" before starting the next task

Do not jump ahead. Do not start Phase 1 until all Phase 0 tasks are confirmed complete by me.

At the end of this session, update BUILD_STATE.md with:
- Which tasks are now complete
- Session notes (what was done, any discoveries, any flags)
- The updated Active Task for next session
```

---

## SUBSEQUENT SESSIONS — RE-ENTRY PROMPT

Use this at the start of every session after the first.

```
Read agent.md, BUILD_STATE.md, DECISIONS.md, and brand-guidelines.md.
Confirm the active task from BUILD_STATE.md and begin.
Flag anything before you start.
```

That's it. The files carry all the context.

---

## PHASE-SPECIFIC PROMPTS

Use these when starting a new phase to give the agent the right framing.

### Starting Phase 1 (Creation Flow)
```
Phase 0 is complete. Read BUILD_STATE.md and begin Phase 1.

Important context for Phase 1:
- You are building the creator-facing UI — Mode B from brand-guidelines.md
- No text input anywhere in this flow. Ever.
- Every screen: one action, one decision, three choices maximum.
- Tap targets: min-h-[72px] min-w-[72px] on every interactive element.
- Use font-creator (Nunito), rounded-creator (20px), and the creator colour palette.
- Build each step as a separate component in /components/creation/
- State flows forward only — no back button in MVP.

Start with task 1.1 (Onboarding screen). Show me the component before moving to 1.2.
```

### Starting Phase 2 (AI Integration)
```
Phase 1 UI is complete. Read BUILD_STATE.md and begin Phase 2.

Important context for Phase 2:
- All Google AI calls go in /lib/google-ai/ — never in components
- All calls are server-side only via Next.js API routes — never expose API keys to client
- The pixel-breath animation (from brand-guidelines.md) must already be running
  BEFORE the API call is made — not after the call starts
- Moderation flow is sacred — see agent.md Section 6. Do not simplify it.
- Target: artwork appears within 15 seconds. Measure and report actual latency.

Start with task 2.1 (Gemini prompt construction). Show me the wrapper function before moving to 2.2.
```

### Starting Phase 3 (Gallery & Storage)
```
Phase 2 AI integration is complete. Read BUILD_STATE.md and begin Phase 3.

Important context for Phase 3:
- Every artwork record must have ip_owner = 'creator' — this is non-negotiable (DEC-003)
- Creator name is optional — never required
- Images are private by default — is_public = false until facilitator approves
- The gallery should feel like a personal exhibition, not a feed
- Use the artwork card pattern from brand-guidelines.md Section 8
- Slight rotation offset (rotate-[-0.5deg]) on every other card — hand-placed feeling

Start with task 3.1 (Supabase Storage save).
```

### Starting Phase 4 (Facilitator Mode)
```
Phase 3 is complete. Read BUILD_STATE.md and begin Phase 4.

Important context for Phase 4:
- Facilitator mode is a toggle on the onboarding screen — not a separate login page
- Magic link auth only (Supabase Auth) — no passwords
- The creation flow for the ID creator must be IDENTICAL whether facilitated or not
  — facilitator mode only adds: naming, session notes, artwork approval
- Facilitator UI uses Mode A design language (marketplace style), not creator style
- Privacy: no PII of ID individuals is ever required — only facilitator email

Start with task 4.1 (Facilitator toggle on onboarding).
```

### Starting Phase 5 (Mock Marketplace + Polish)
```
Phase 4 is complete. Read BUILD_STATE.md and begin Phase 5.

Important context for Phase 5:
- The mock marketplace is Mode A design — marketplace style, not creator style
- It is STATIC. No real commerce. Product mockups are images only.
- The message is: "This could be in a shop. Coming soon."
- Full Bahasa Indonesia audit: every string in every screen needs the ID translation
- The mobile audit matters most — test on 390px width, Android Chrome, iOS Safari
- Tap target audit: go through every interactive element and confirm min 72x72px

Start with task 5.1 (Mock marketplace preview screen).
```

---

## WHEN SOMETHING BREAKS

If the agent gets stuck, produces wrong output, or goes off-track:

```
Stop. Read agent.md and BUILD_STATE.md again.
The last completed task was: [DESCRIBE WHAT WAS LAST WORKING]
The problem is: [DESCRIBE WHAT'S WRONG]
Do not attempt to fix it yet — explain your diagnosis first.
```

## WHEN YOU WANT A DESIGN REVIEW

```
Stop coding. Review the last component you built against brand-guidelines.md.
Check specifically:
1. Which mode is this — marketplace or creator app?
2. Are all tap targets min 72x72px?
3. Are the correct fonts being used for this mode?
4. Is the pixel-breath animation in place for any loading state?
5. Does the colour usage follow the guidelines?
Report what passes and what needs changing.
```
