# Guided study implementation

13 September 2026

The earlier [review](teaching-method-review.md) and [130-lesson map](teaching-method-lesson-map.md) are the rationale. The implemented common sequence covers all 145 lessons in nine courses, in English and Brazilian Portuguese:

1. An everyday situation and a lesson-specific opening question, before the explanation.
2. A first attempt, optional hint, and an expandable complete explanation preserving the original examples and reading assignments.
3. Return to the assigned source, paraphrase a relevant claim and cite the passage.
4. Apply the idea, compare with the opening attempt, revise and retain an open question.

This adapts teaching moves studied in Brian’s supplied lecture reviews. It uses original wording and authored feedback, not a simulated Brian or generated tutor responses. Original suggested answers and rubrics remain available. Reasoned disagreement can demonstrate understanding.

## Exercises beyond the common sequence

- GA 4 Lesson 04 and GA 9 Lesson 18: arithmetic input distinguishes the result from reconstructing operations; 9.5 receives grouping-specific feedback. GA 4 adds a changed timetable case.
- GA 9 Lesson 06: reveal two groupings that explain nine members as seven groups without deleting labels.
- Colour Lesson 02: swap centre/edge intensity and change hue independently, with captions and no prescribed emotional answer.
- According to Luke Lessons 04, 05 and 07: reveal an attributed map of lineages, the event at twelve and baptism; distinguish Steiner’s interpretation from Gospel statements.
- Encountering the Self Lesson 03: three possible adult responses, authored feedback and new information about an unclear materials label.
- Encountering the Self Lesson 15: predict three points and reveal their geometrical reflection, with equivalent coordinate descriptions.

## Notes and accessibility

Saving is opt-in and uses localStorage in this browser on this origin only. English and Portuguese notes are separate within one lesson identity; the study mark is shared. Resume links point to the last visited lesson after saving is enabled. There is no account, server submission, analytics, AI grading or device sync. Learners may export the current lesson’s notes as text or delete that lesson’s notes in both languages. Browser data clearing removes saved work.

Native details keep explanations, hints and answers available without JavaScript. The notebook then requires copying or paper. Interactive-only controls are hidden without JavaScript. Visual exercises include captions or verbal alternatives. Inputs have labels, keyboard focus and status announcements.

## Maintenance and verification

`node scripts/build-all.mjs` generates all courses before adding guided study. The postprocessor is idempotent and retains all original content checks. `node scripts/check-site.mjs` validates 308 pages and links; `node scripts/check-guided-study.mjs` checks all 145 language pairs, note controls and lab coverage. The lesson-specific prompts live in `guided-prompts.mjs`, specialist activities in `guided-labs.mjs`, and the source course in `mystery-temperaments.mjs`.

Not every lesson has a custom interactive diagram or branching case. All lessons use the guided sequence and retain their existing source-specific activity. Audio/video, a server-backed account, a glossary overlay and automatic reminders are outside this implementation.
