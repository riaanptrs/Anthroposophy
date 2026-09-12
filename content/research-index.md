# Research and course development record

This folder keeps the source analysis, teaching decisions and implementation plans under Git version control. Begin here when adding a book, lecture or illustration. The website is generated into `docs/`; editorial notes remain in `content/`.

## Chapter 2 update — 12 September 2026

[Chapter 2 review and bilingual lesson draft](philosophy-of-freedom-brian-chapter-2.md) maps the complete lecture to Basis 12–16 and Essential 11–12. Theosophy Lessons 1 and 2 now distinguish observation from explanation and experienced differences from absolute separation. Lesson 1 includes a three-step inquiry comparison. The review restores the book’s closing methodological qualification, omitted from the lecture, and records the missing board images.

## Chapter 1 update — 12 September 2026

[Chapter 1 review and bilingual lesson draft](philosophy-of-freedom-brian-chapter-1.md) records the full lecture, book comparisons and visual plans. Theosophy Lessons 19 and 21 now use its clarifications; Lesson 21 includes a three-question comparison. The separate GA 4 course remains in preparation.

## Research by source

| Material | Reading and source analysis | Teaching plan / implementation |
| --- | --- | --- |
| Theosophy, GA 9 | [Edition comparison](theosophy-edition-comparison.md) | [Chapter teaching plan](theosophy-chapter-teaching-plan.md), [course outline](course-outline.md) |
| What Is Anthroposophy?, GA 225 | [Introduction review and replacement-source findings](anthroposophy-introduction-review.md) | `introduction.mjs`, `anthroposophy-connections.mjs` |
| How to Know Higher Worlds, GA 10 | [Reading review](higher-worlds-reading-review.md) | [Course plan](higher-worlds-course-plan.md), `higher-worlds.mjs`, `higher-worlds-connections.mjs` |
| The Philosophy of Freedom, GA 4 | [Initial reading review](philosophy-of-freedom-reading-review.md), [three-text comparison and recovered passages](philosophy-of-freedom-edition-comparison.md) | [Provisional course plan](philosophy-of-freedom-course-plan.md), `philosophy-of-freedom-connections.mjs` |
| Brian's chapter lectures | [Chapter 1](philosophy-of-freedom-brian-chapter-1.md), [Chapter 2](philosophy-of-freedom-brian-chapter-2.md) | Bilingual drafts, source comparisons, implemented changes and visual plans |
| Brian's preface lectures | [Timestamped review of both prefaces](philosophy-of-freedom-brian-prefaces.md) | Original examples, lesson destinations, transcription issues and six visual storyboards in that review |

## Implementation record — 12 September 2026

- Theosophy and Higher Worlds are implemented as two bilingual courses, with 88 generated HTML pages in total.
- GA 4 findings and Brian's preface teaching method now inform GA 9 Lessons 0, 1, 5, 7, 18–21 and GA 10 Lessons 0–4, 7, 14, 18, in both languages.
- The introduction includes a knowing/acting map and expandable inquiry steps. The GA 9 Lesson 18 exercise asks the learner to reconstruct and check reasoning.
- The separate Philosophy of Freedom course remains a plan. Chapter lectures and board drawings will inform its next revision. The other proposed illustrations have not been produced.
- The site checker validates all 88 pages, local links, language pairs, lesson structure, GA 4 connections and introductory diagram controls.

Commit history records each saved revision. Later reviews should add a dated update rather than silently erase earlier source limitations or decisions that explain how the course developed.

## Source traceability and storage

[Source register](source-register.json) records filenames, byte sizes and SHA-256 fingerprints of available inputs. A fingerprint identifies the exact file reviewed; it is not a copy of its contents. Page markers and lecture timestamps are recorded in the corresponding review.

Full book transcriptions, lecture transcripts and extracted page images are **not uploaded to this repository**. The supplied files remain in the user's Downloads or Documents folders; private preparation files are under the ignored `.sources/` folder. These originals need their own backup. GitHub retains our original analysis, bibliographic information, references, missing-passage findings, teaching decisions, examples, plans and implementation history.

Do not treat an editorial note as proof that a source is complete. Keep Steiner's text, translator/editor commentary, Brian's explanations and our course examples separately attributed. Uncertain transcription repairs remain identified as uncertain.

## For each new lecture or drawing

1. Record the source filename and fingerprint; identify chapter, speaker and edition where available.
2. Read the lecture, map its timestamps to the book, and record important transcription problems.
3. Add a chapter review with useful explanations, original examples, lesson destinations and visual briefs.
4. Update the cumulative course plan and this index to distinguish proposed work from implemented work.
5. For implemented changes, rebuild and run the site checks, then commit and push the content, research records and generated pages together. Check the Pages deployment before describing changes as live.
