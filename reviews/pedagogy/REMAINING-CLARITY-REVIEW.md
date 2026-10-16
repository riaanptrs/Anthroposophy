# Three-course clarity batch

Local review branch: `review/remaining-course-clarity`. Baseline: `386bca2`. No push, merge or deployment performed.

## Delivered

- Theosophy reading companion: all 28 units, in its existing nonnumerical source sequence.
- Practical Thinking: all 12 core units plus the optional prediction unit; original sequence retained.
- Higher Worlds: all 19 units, including orientation, appendix and synthesis.
- English and Portuguese: 120 generated pages, 480 short prose paragraphs and 240 optional questions with explained answers.

Each first reading teaches through four connected paragraphs. Concrete openings lead into the particular claim or distinction, followed by an application or a limit of the comparison. Objectives guide the prose and remain in the private ledger. There are no new public scoring rubrics. The complete previous content, including sources, extended explanations, diagrams, exercises and notebook hooks, remains inside a closed optional reading. The original heading and lesson navigation remain outside it.

The companion distinguishes its two sevenfold classifications and keeps the source's argument sequence. Practical Thinking distinguishes observation, comparison, prediction, causal inquiry, voluntary attention, imaginative completion of memory and patient decision. Higher Worlds keeps preparation, initiation, organ descriptions, dreams and the Guardians distinct. Health and supersensible physiology are not presented as medical findings. The greater Guardian lesson explicitly retains and criticizes the source's racial hierarchy.

## Evidence

`remaining-clarity-ledger.json` records every unit's objective, prerequisites, essential concepts, connections, difficulty, concrete opening, explanatory sequence, questions, source status and completion flags. It supplements the existing repository-wide `COMPLETED-LESSON-AUDIT.md`; it does not relabel previous audit work as new rewriting.

`REMAINING-CLARITY-SAMPLES.md` contains complete English and Portuguese samples from each course. `content/remaining-course-clear-lessons.json` contains all 60 bilingual readings. `scripts/build-remaining-clarity.mjs` applies them after the existing owning renderers and teaching transforms.

Validation: full build; 40 JavaScript validators; 240 browser cases (120 pages at 1280px and 320px, JavaScript disabled); exact preservation of all original main-body content against `386bca2`, apart from moving the unchanged heading and navigation outside optional depth. The browser checks complete prose order and visibility, two keyboard-operable answers, closed and keyboard-operable full readings, language, one h1, visible navigation, local links and fragments, assets, duplicate IDs and overflow. Detailed results are in `remaining-clarity-checks.json` and `remaining-clarity-browser.json`.

The first check run identified missing automatic terminology links in the new Higher Worlds prose. The renderer now uses the existing reference linker for those new paragraphs, leaving retained content unchanged. The site validator excludes the explicitly named new optional controls from its legacy answer count; the new validator and browser tests check those controls independently.

## Source limits and remaining work

No new quotations or page references were introduced. The new prose was compared with all existing course explanations and source maps, not freshly checked against original books.

The companion's specific unavailable witnesses are `Teosophy new.pdf` and `Teosophy new (2).md` (Shields translation/reissue recorded in `content/theosophy-guided-source-map.json`). Higher Worlds relies on the existing records for `How to know Higher Worlds2.pdf` (Dead Authors Society, 2018; translator uncredited). The similarly named `How to know Higher Worlds.pdf` is recorded elsewhere as a mislabelled Freedom witness and must not substitute for GA 10. Practical Thinking retains the existing GA 108 Adams translation paragraph records; its online witness was not re-fetched in this pass. Fresh source-fidelity verification is therefore still incomplete, without blocking independent pedagogical rewriting.

Across the current clarity pass, 106 of 487 authored units are complete in five course/companion groups; 381 units in 19 groups remain pending. These counts exclude the 36 Waldorf support/grade routes. Original-source comparison and learner/editorial assessment remain separate from software validation. No action was denied by approval review in this batch.
