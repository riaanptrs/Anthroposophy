# Theosophy: complete conceptual-course clarity batch

Local branch: `review/remaining-course-clarity`, based on the approved and deployed Freedom commit `8bae0c249b044d0713d0a828507cce5e0a81601d`. These Theosophy changes have not been pushed, merged or deployed. The earlier Freedom publication is documented separately in [FREEDOM-PUBLICATION.md](FREEDOM-PUBLICATION.md).

All **23 conceptual lessons and the synthesis** now have new first readings in **English and Brazilian Portuguese**, with **two optional explained questions per lesson**. The original complete explanations, comparison tables, concept links, practices, questions, takeaways and source references remain intact. A closed disclosure presents the full teaching as optional depth. Existing course identity, lesson order, navigation, study controls and source metadata are preserved.

This is a substantive clarity layer, not a finding that the earlier explanations were empty. They already contain important distinctions and worked applications. The problem is the simultaneous presentation of terminology, several connected concepts, tables and multiple activities. Each new reading establishes a concrete question first, explains a small sequence of relationships and states the limits of its example. It can be studied independently before opening the original teaching.

## First-batch scope and inventory

The broader repository has 24 course/companion groups. Freedom's 22 units are published; this batch completes the new clarity pass for the 24-unit Theosophy conceptual course. The separate **28-unit Theosophy source-reading companion is pending** in this new pass. Prior pedagogical audits remain evidence of their own scope, not automatic completion of the requested clarity review.

[Current clarity checklist](REMAINING-COURSE-CLARITY.md) / [machine-readable inventory](remaining-course-clarity-coverage.json) tracks every group, current pass and publication status. The remaining groups include Practical Thinking and Higher Worlds; Foundations and Introduction; five temperament/self-development companions; Meditation, Luke, Esoteric Christianity, Myths and Colour; Threefold Society; agriculture/biodynamics companions, Nutrition and Foodwise; and Waldorf's existing 62-topic implementation. Waldorf has 36 additional support/grade routes, separately counted. No later course is represented as revised merely because this shared renderer changed: the generated diff is limited to 48 Theosophy lesson pages.

## Editorial changes by example

**Body, soul and spirit:** the existing explanation develops bodily contact, inward experience, validity and their interactions across four substantial paragraphs. The new first reading follows a delayed-train announcement: hearing, disappointment and a correctable timetable judgment. The learner can see why changing a mistaken judgment does not erase a real feeling. The original melody example and fuller account remain in deeper reading.

**Life and etheric body:** the earlier reading moves from quartz and oak to life-force, a real independent member, spiritual perception and the relation to modern biology. The new reading begins with a seedling's unfolding leaves, identifies exactly what is observed, then introduces Steiner's proposed formative reality. It explicitly states that the proposal is neither merely a metaphor nor a measured electromagnetic field, and that seeing growth does not establish etheric perception.

**Karma and action:** the earlier text explains inward/outward histories, continuity across sleep, the spiritual extension beyond death and present responsibility. The new reading starts with a repaired borrowed chair: the person gains practice and the owner receives a usable object. This makes the two histories clear before the spiritual law is introduced. It retains the strong claim while explicitly rejecting the inference that hardship reveals someone's prior spiritual history or justifies blame.

**Living archetypes:** a potter makes varied bowls, introducing the difference between a finished form, a human plan and creative activity. The reading then explains where the analogy stops: Steiner's archetype is an independently active spiritual being. Regional distinctions remain present in outline and fully available in the retained teaching; unsupported separate mechanisms for the initially grouped upper regions are not invented.

**Synthesis:** repairing a garden bench connects embodiment, inward response, understanding, acquired capacity and effects in a shared world. It explains how those relations prepare the book's wider spiritual account without treating the ordinary event as proof of reincarnation, supersensible members or initiation. The original five-cluster concept map, ten questions, glossary and continuing-study links remain optional.

[Complete bilingual samples](THEOSOPHY-CLARITY-SAMPLES.md) reproduce the first three examples, including all prose and feedback. [Individual ledger](theosophy-clarity-ledger.json) records all 24 objectives, prerequisites, concepts, connections, specific clarity gaps, methods, misconception feedback and before/after teaching. The full project audit has been refreshed with these findings.

## Validation and preservation

- Full build: 1,585 HTML pages.
- All 39 repository `check-*.mjs` validators pass. [Captured results](theosophy-clarity-validation.json).
- 48 bilingual lesson pages tested at 1280 and 320 pixels: 96 browser cases with JavaScript disabled. [Browser evidence](theosophy-clarity-browser.json).
- Browser checks cover the complete main prose in authored order, visible questions, keyboard-opened answers, closed/openable deeper reading, correct language, a single heading, duplicate IDs, horizontal overflow, local links/fragments and assets.
- The preservation validator compares the deployed baseline directly. The original conceptual-course JSON files and the guided source map remain byte-for-byte unchanged. Existing concept-platform validation continues checking that their detailed teaching, distinctions, maps, practices, questions and sources appear in the generated output.
- English and Portuguese have corresponding explanation steps, examples and feedback. Terminology follows the existing glossary, including alma senciente, corpo senciente, alma intelectual, si-mesmo espiritual, espírito vital and homem-espírito.

Reproduce the focused checks:

```sh
node scripts/build-all.mjs
node scripts/check-theosophy-clarity.mjs
node scripts/check-concept-platform.mjs
node scripts/check-theosophy.mjs
node scripts/check-site.mjs
node scripts/check-portuguese.mjs
node scripts/review-theosophy-clarity-browser.cjs
python scripts/audit-course-coverage.py
```

## Limits and next work

This is an editorial clarity review, not a learner study, independent translation certification or fresh verification of the original book. The intended witnesses `Teosophy new (2).md` and `Teosophy new.pdf` remain absent locally; existing source-verification records are inherited. No new quotation, page number or claim of original-source access was added. Missing source fidelity evidence does not block improving explanations based on the available course records.

The next coherent batch is the 28-unit Theosophy source-reading companion, then Practical Thinking and Higher Worlds. These and all other remaining groups stay marked pending for the new clarity pass. Publication of additional course changes awaits user review; the existing Freedom deployment is unaffected.
