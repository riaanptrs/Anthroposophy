# Whole-project pedagogical review

Historical baseline report for `b933e03`. The subsequent local [Philosophy of Freedom clarity review](FREEDOM-CLARITY-REVIEW.md) supersedes this report’s Freedom revision count. Current aggregate coverage is in [COURSE-CHECKLIST.md](COURSE-CHECKLIST.md).

Review branch: `review/pedagogical-redevelopment` in `riaanptrs/Anthroposophy`. No merge, deployment, new quotation, changed credential, paid service or publication of original source files. Generated teaching pages are included for review.

The current catalogue contains **24 course/companion groups, 487 authored teaching units, 523 English lesson/support routes and 523 Portuguese counterparts**. Every authored unit now has an individual scoped teaching audit: **241 revised and 246 deliberately retained**. The **36 additional Waldorf routes** are inherited grade views or navigation/support pages, checked separately rather than counted as newly taught chapters. These counts are not unique chapters in Steiner's books: orientations, syntheses, optional practice and parallel reading/concept courses have separate identities.

This completes the available-content teaching pass, not a certification of every source book, specialist subject or classroom outcome. The earlier 108 primary-goal passes focus on explanation, worked application and feedback; subsequent passes additionally record conceptual reasoning and dependencies. The exact scope is visible in each ledger. All 88 registered source filenames remain absent from this executor. Existing attributions and source-verification labels are inherited, not fresh verification in this continuation.

## Review the first complete course

[Theosophy course](../../docs/theosophy/index.html) / [Português](../../docs/pt/theosophy/index.html) contains 23 conceptual lessons and a synthesis. Start with [Body, soul and spirit](../../docs/theosophy/lessons/body-soul-spirit.html) / [Português](../../docs/pt/theosophy/lessons/body-soul-spirit.html), then [Karma and action](../../docs/theosophy/lessons/karma-and-action.html), [Living archetypes](../../docs/theosophy/lessons/living-archetypes.html), and [Whole picture](../../docs/theosophy/lessons/whole-picture.html). Every case includes explained reasoning and an optional changed-situation question; ordinary experience illustrates relationships without being offered as proof of reincarnation or spiritual perception.

The separate source-ordered Theosophy reading companion has now also been audited, all 28 units. It is not counted as rewritten merely because the conceptual course changed. Three examples needed stronger reasoning; 25 existing explanations were retained with reasons.

## Final 127-unit batch

| Course | Units audited | Conceptual revisions | Retained EN lessons | Additional work |
| --- | ---: | ---: | ---: | --- |
| Agriculture | 18 | 6 | 12 | Bilingual farm dependencies, substance relationships and completed synthesis |
| Biodynamic Agriculture | 24 | 0 | 24 | Individual rationale for retaining existing detailed explanations, comparisons and evidence limits |
| Foodwise | 39 | 7 | 32 | Concrete processing, fourfold experience, plant-part interpretation, timing and shared-meal examples |
| Nutrition | 18 | 0 | 18 | 18 new condensed Portuguese teaching counterparts; English source data unchanged |
| Theosophy reading | 28 | 3 | 25 | Individuality, experience-to-capacity loop and corrected logical inference |
| **Total** | **127** | **16** | **111** | Translation is tracked separately from rewriting the English explanation |

[Final chapter-level ledger](final-course-revision-ledger.json) records each criterion, prerequisite, concepts, connection, misconception, teaching method, retained strengths, decision and source limit. It contains actual old/new bilingual passages for the 16 revisions. [Completed lesson audit](COMPLETED-LESSON-AUDIT.md) combines the individual findings across the whole project. [Per-course checklist](COURSE-CHECKLIST.md) and [route coverage](COVERAGE.md) distinguish audit, rewriting, validation, language counterpart and source blocks.

## Concrete before/after samples

- **Agriculture 3:** an instruction to map the farm becomes a worked hay → cattle → manure relationship. Increasing animals also increases feed and manure requirements; imported feed exposes the limits of self-containment. [English](../../docs/agriculture/lessons/03.html) / [Português](../../docs/pt/agriculture/lessons/03.html).
- **Agriculture 9:** a mapping assignment becomes the actual proposed chain from potash/lime through alleged nitrogen transformation to soil capacity. The spiritual/chemical assertion remains attributed, not quietly replaced by ordinary nutrient cycling. [English](../../docs/agriculture/lessons/09.html) / [Português](../../docs/pt/agriculture/lessons/09.html).
- **Foodwise 12:** a general connection becomes one bread-eating event considered through physical, etheric, astral and I aspects, without claiming those aspects were measured. [English](../../docs/foodwise/lessons/12.html) / [Português](../../docs/pt/foodwise/lessons/12.html).
- **Foodwise 37:** a planning prompt becomes a scheduling explanation: start the longest task, fit shorter work around it, and change the menu if available time is insufficient. [English](../../docs/foodwise/lessons/37.html) / [Português](../../docs/pt/foodwise/lessons/37.html).
- **Theosophy reading 20:** ordered thinking is illustrated with the invalid inference that all plants are roses. A tree supplies a counterexample; acknowledging the error links thought correction to educated will. [English](../../docs/lessons/20.html) / [Português](../../docs/pt/lessons/20.html).
- **Nutrition:** the Portuguese landing page previously sent learners to English lessons. It now opens 18 Portuguese teaching units, 54 questions with explanations, 37 optional written responses, five comparison tables, a glossary and a print version. [Course](../../docs/pt/nutrition/index.html), [first chapter lesson](../../docs/pt/nutrition/01.html), [comparison of mappings](../../docs/pt/nutrition/13.html), [synthesis](../../docs/pt/nutrition/17.html).

Retention is an editorial decision, not a shortcut from passing software checks. For example, Biodynamics 22 already explains units, sampling depth, time and comparison conditions; 23 already distinguishes a whole-system outcome from preparation-specific causation. Nutrition 13 already compares two different nutrient mappings without hiding their tension. These explanations were preserved because they teach the named relationship directly.

## Portuguese Nutrition: exact scope

`content/nutrition/course-pt.json` is a **condensed pedagogical translation/adaptation of the existing English course**, not a line-by-line translation or a translation of the original book. All 18 learning stages, all 54 question answer positions, all 37 response prompts/models, five comparison tables and the sixteen chapter/capture ranges are represented. The eleven-term glossary is translated. English chapter summaries are integrated into the condensed explanations rather than separately duplicated as introductory sections.

The sixteen short source excerpts remain unchanged in English and are explicitly labelled `lang="en"`. The 118 inherited capture notes, modern-reference titles/descriptions and full documentary apparatus remain English, visibly labelled or linked. The archived English teacher supplement and downloadable English Markdown guide were not translated. The Portuguese print edition contains the complete Portuguese teaching version and all answers.

This closes the missing Portuguese **teaching-route** gap; it does not claim full linguistic equivalence of every support document. Historical health assertions remain attributed. No new medical prescription, clinical efficacy claim, quotation or locator was introduced. Existing contemporary comparisons were translated, not independently medically re-reviewed. The current source book was unavailable for fidelity checking.

## Waldorf support pages

[Separate 36-route review](waldorf-support-review.json) covers 27 grade-focused views and nine support/index pages. Each has a recorded function and finding. The grade views inherit the primary grade lesson's revised explanation and example; they do not constitute 27 additional independent syllabuses. The indices preserve entry points to the 62 authored topics. Developmental ages remain qualified, and unresolved historical attributions remain visible.

All 72 EN/PT support pages were checked in browsers at two widths, including navigation, linked fragments, language, visible prose and keyboard disclosure. Broader specialist curriculum and source-fidelity limits remain; passing a route check does not validate a developmental theory.

## Validation

- `node scripts/build-all.mjs`: passed; **1,585 generated HTML pages**. Nutrition adds 20 routes beyond its former Portuguese landing page.
- All **37** `scripts/check-*.mjs` validators: passed. The site-wide check verifies routes, local links/anchors, headings and shared navigation. The route manifest now includes the new Portuguese Nutrition pages.
- `node scripts/review-final-course-browser.cjs`: **326 pages / 652 viewport cases**, widths 1280 and 320, JavaScript disabled. Covers 254 pages from the final authored units plus 72 Waldorf support pages. Visible teaching, language, keyboard disclosure, overflow, links/fragments and loaded local assets passed.
- `node scripts/review-nutrition-portuguese-browser.cjs`: **18 additional interactive page cases**, width 390. Portuguese empty/wrong/correct/retry feedback, unsaved written responses after reload, absence of script errors and absence of external requests passed.
- `python scripts/check-final-course-preservation.py`: passed against `8069072f4b60b51db50a69178f26a9dbd674a858`. Only the sixteen named bilingual teaching fields changed in the five edited course files. All other content fields, quotations, source metadata and locators stayed unchanged. All six Biodynamic Agriculture parts and English Nutrition data are byte-identical.
- Nutrition structural checks confirm 18 counterparts, 54 aligned answers, 37 response models, table dimensions, source ranges, reciprocal language partners and a complete single-heading print edition.

Machine-readable results: [validators](validation.json), [delivery/browser](final-course-browser.json), [Portuguese interaction](nutrition-portuguese-browser.json), [preservation](final-course-preservation.json). Earlier browser and first-course reviews remain in this directory as batch-specific evidence, not claims of a second current whole-site browser run.

## Remaining limits and exact source block

The original-source block concerns **88 registered filenames**, including duplicate editions, OCR witnesses, modern publications and derived dossiers; it is not 88 missing canonical books. [Exact filename inventory](source-availability.json) and [targeted source request](SOURCE-REQUEST.md) identify what is actually needed. Fifteen files were located in Library in an earlier pass, but the executor failed before downloading bytes. This was a connection/download failure, **not a permission denial**; unchanged retries were not made.

For first-course fidelity checking the smallest useful witness remains **`Teosophy new (2).md`**, with **`Teosophy new.pdf`** needed only for scan-dependent questions. Nutrition needs the original **118-capture _Nutrition: Food, Health and Spiritual Development_, Christian von Arnim compilation, 2012, ISBN 9781855842823**; the repository does not establish a trustworthy original filename, so none is invented. The source request distinguishes these from public web witnesses and already located Library material.

The Threefold Society course covers its supplied opening, not all main GA 23 chapters. Waldorf subject pathways explain educational intentions, not a full accredited subject syllabus. No learner study or independent specialist review has been performed. These are explicit scope limits, not unreported unfinished route audits.

The review branch is the deliverable. Merge and deployment remain outside the authorization.
