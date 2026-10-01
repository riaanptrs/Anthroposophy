# Teaching-method audit for the learning-system revision

Reviewed 1 October 2026 against the user's instructions in `Pasted text.txt`. This is a read-only audit of the current teaching implementation. No active lesson data, builder, generated page, source selection or notebook controller was changed for this audit.

The source work is already the strongest foundation for the requested learning system. All 185 readings or sessions have an attributed source passage. All 176 nonmeditation readings place that passage before an initially open explanation and then an everyday example. The necessary change is to give this material a clearer learning question, intellectual boundaries, chapter location and useful retrieval feedback while retaining its substantial source guides.

## Scope and evidence

Every rendered English and Portuguese lesson or session was parsed: 370 HTML pages, comprising 176 nonmeditation pairs and nine meditation pairs. The audit records headings, source/explanation/example order, default-open explanation state, word counts, answer reveals, notebook fields, scored rubrics and previous/next navigation. English and Portuguese comprehension-check counts agree for every pair. The accompanying private report contains a row for every page: `.sites-runtime/learning-system-2026-review/teaching-audit.json`.

The shared builders, passage overlay, guided prompt metadata, notebook controller, studio/dialogue labs and meditation builder were also read. Representative full sequences were examined in Theosophy 00/01/21, Freedom 12/18, Luke 01, the combined temperament course 01 and meditation 00/06. This teaching audit does not claim that every external source link was checked online; no external network was used.

| Existing course | Paired readings | Current answered checks per reading | Median English article words | Longest English article |
| --- | ---: | --- | ---: | ---: |
| Theosophy | 23 | 1 | 1,559 | 2,015 |
| How to Know Higher Worlds | 19 | 3 | 1,519 | 1,801 |
| The Philosophy of Freedom | 22 | 3 | 1,886 | 2,206 |
| According to Luke | 12 | 3 | 1,070 | 2,215 |
| Colour | 14 | 3 | 1,820 | 2,071 |
| The Four Temperaments | 11 | 3 | 1,534 | 1,645 |
| Understand Your Temperament! | 13 | 3 | 1,572 | 1,809 |
| The Mystery of Temperaments | 15 | 3 | 1,509 | 1,602 |
| Encountering the Self | 17 | 3 | 1,591 | 1,894 |
| Practical Thinking | 10 | 1 in seven readings; 4 in three | 1,325 | 2,054 |
| Understanding Temperaments: combined practice course | 12 | 3 in eleven readings; 2 in one | 1,622 | 2,036 |
| Ancient Myths | 8 | 2 | 866 | 933 |
| Meditation and Inner Life | 9 | 1 | 590 | 1,108 |

Article word counts include source credits, expandable text, notebook directions and interface explanations. They identify places to inspect; they do not determine which content to cut. “Answered checks” counts existing question/answer reveals and excludes rubrics, hints, notebook reflection and unscored studio observations.

## What to preserve

The passage overlay already meets the requested source-first order. Preserve its exact quoted text, original-language comparisons, author/speaker distinctions, translator and edition credits, printed-page versus PDF-capture references, honest source limitations and short passage-specific notes. A later lecture or another author's companion explanation must retain its separate attribution.

Keep chapter source guides, core explanations, concrete examples, distinction tables, diagrams, fictional cases and explicitly identified course adaptations. These supply much of the teaching the user wants. In meditation, preserve both the short teaching passage and the complete selected verse or attributed instructions; a summary must not replace the text.

Keep stable lesson routes and `data-study-id` values. The existing first/source/after notebook fields, local-save consent, bilingual identity, study mark, export, deletion and storage-failure handling support sustained study. Marking a reading studied records activity; it must continue to avoid a claim of mastery or spiritual achievement. The nine meditation sessions have their own temporary reflection/download flow, which must also remain usable.

## Shared weaknesses to correct

**The central question has disappeared.** Every nonmeditation reading displays the same “What is the author saying in this passage?” question. The source overlay replaces the authored question from `guided-prompts.mjs` or the practice-course data. It appears after the example, so it cannot orient a beginner at the start. Restore a specific question near the title; retain source paraphrase as a notebook instruction. Many existing prompts are suitable starting points, but an everyday-case question sometimes needs an explicit concept question alongside it. Meditation has a goal and a later check but also needs a visible central question.

**A definition and a distinction are often embedded in prose.** There are recognizable terminology headings on 124 of the 185 English readings, but only three have a heading explicitly naming a distinction or misconception. This does not mean the other explanations lack distinctions: many contain excellent qualifications inside paragraphs. Make the essential existing definition and immediate misconception visible with consistent labels. Do not invent a second competing definition. Use an author-aware heading: “What Steiner means” where Steiner is the author, “What the author means” for Koepke, Childs, Sease, Smit or Holtzapfel, with quoted voices identified separately.

**The page hierarchy is incomplete.** A course/lesson eyebrow and previous/next links exist, but they do not consistently show the actual book part, chapter and reading position. Show `Course → real part/chapter → reading`, and a position such as “Reading 2 of 5 in this chapter.” Chapter landings should give a question, what the reader will learn and the reading list. Retain lecture titles for lecture collections; identify course-created divisions as teaching units rather than inventing book chapters.

**Feedback still mostly means revealing an answer.** No existing source-check radio inputs were found. The arithmetic, dialogue and studio labs provide some interactive feedback, but they do not cover the source-reading checks. Most newer books already have three source-focused questions and useful answers. Theosophy, nine meditations and seven Practical Thinking readings have only one answered check: 39 pairs need another meaningful source-reading check. Ancient Myths repeats “What must your revision distinguish?” across eight readings; revise or supplement it with a reading-specific distinction.

**Scoring is arbitrary.** Theosophy's 23 readings ask for 0–2 points on four criteria, with a possible total of eight. The same pattern remains in 19 Higher Worlds readings: 84 bilingual pages altogether. Replace these point instructions with an unscored checklist. “Can I explain the claim, distinguish the terms, point to the source, and name what I still need to revisit?” preserves the useful intent without grades or a threshold for proceeding. Understanding an author's account and agreeing with it remain separate.

**The complete-explanation action is misleading.** All 352 nonmeditation explanations already begin open. “Open complete explanation” mainly changes `study-full` styling and leaves source-backed explanations open. Rename it to describe the actual view change or remove that redundant action, preserving the notebook actions. A reading should never have to be unlocked by an attempt.

## A concrete shared reading structure

Use this sequence as a consistent framework, while allowing studio, philosophical and reflective readings their appropriate forms:

1. **Location and purpose:** course, part/chapter, reading position, title, one central question and a two- or three-sentence introduction.
2. **Read:** the existing short attributed passage or identified source section, with its exact credit and locator.
3. **What the author means:** the essential existing explanation, ordinarily two to five focused paragraphs, followed by a highlighted definition and an important distinction. Keep the qualification next to the claim it constrains.
4. **Example:** one existing concrete scene or visual comparison, explicitly described as illustration rather than proof of a metaphysical claim.
5. **Check understanding:** two to four meaningful questions, mixing source retrieval, a distinction and an occasional one-sentence reflection. Explanations stay available.
6. **Continue:** the next reading's title and a sentence explaining why the next question follows. A chapter reading list and local study state make what remains visible.

Keep the before/source/after notebook and existing activities available within this flow. They should not create three additional compulsory tests. Advanced expansions and cross-course links can follow in a deeper-study area without taking over the main question.

## Accessible retrieval checks

Author a small data record for each determinate check: stable course/reading ID, English and Portuguese question, three plausible options or an unambiguous true/false proposition, correct source-reading option, specific feedback for each option and the relevant existing source reference. Distractors should represent an actual nearby misconception. Do not derive distractors by randomly borrowing unrelated terms, truncating answer paragraphs or negating every statement.

Convert one or two existing determinate checks instead of stacking a new quiz above the three current questions. Preserve each original full question and explained answer in a reveal fallback. Readings with only one current check can receive two short authored retrieval checks and retain their existing explanation/reflection, giving three meaningful checks overall. Reflective questions remain open; they do not become disguised single-correct-answer tests.

The minimum interface is a `fieldset` and `legend`, labelled native radio inputs, a “Check answer” button and short feedback in `role="status"` or an appropriate polite live region. “Try again” clears the current selection without points, rankings or penalty. A separate `<details>` explanation works without JavaScript. Controls need unique IDs, ordinary keyboard operation and feedback that does not rely on colour. Answer choices and their feedback must retain language parity.

A correct result should explain the relationship, not merely say “Correct.” An incorrect result should name the confusion and point back to the source. Do not grade free text, classify a person's temperament, infer the cause of distress, demand a prescribed artistic feeling, verify metaphysical reality or assess spiritual attainment.

| Reading | Example retrieval question | Feedback purpose |
| --- | --- | --- |
| Theosophy 01 | According to the opening account, which relation can be recognized in new flowers a year later: unchanged individual flowers, a correctly understood species relationship, or every observer's identical feeling? | Distinguish passing sensory objects, retained personal experience and a relationship understood through spirit. Point to the current meadow explanation and selected p. 4 / PDF p. 32 passage. |
| Encountering the Self 02 | True or false: the teacher says his explanation of Monica is the scientific explanation people ask for. | The selected sentence expressly declines that kind of explanation. The following dream analogy admits interpretive possibilities. Credit Koepke's constructed teacher and capture 21, middle column. |
| Colour 02 | Which belongs in a comparison record: the emotion everyone must feel, your response with the arrangement and viewing conditions, or proof of the entire spiritual classification? | Support observation without prescribing experience or treating an illustration as proof. Keep the open studio response ungraded. |

## Selective deeper study, without mechanical shortening

The largest explanation blocks belong to Freedom 18 (1,411 words), Freedom 12 (1,370), Luke 01 (1,317), Freedom 20 (1,312), Freedom 16 (1,289) and Freedom 10 (1,257). Their contents need different decisions. Freedom's dense argument may require genuinely separate readings at a conceptual boundary. Luke 01's recovered source guide carries the lecture's essential argument; it must not be collapsed merely to make the page shorter.

Theosophy 00 mixes orientation, method, two broad questions, diagrams and a whole-course map. Theosophy 01 combines its primary explanation with Freedom and later-lecture connections. Theosophy 21 and the combined temperament course 01 similarly gather several supplementary sources. These are good pilots for individually titled deeper-study details around companion lectures or specialist comparisons, while keeping the primary book explanation open. A generic “More” panel hiding the whole explanation would reverse the current source-first gain.

For a long chapter, create a short landing and divide at actual intellectual transitions: for example, distinguish motive/driving force from moral intuition, or the three cognition levels from interpreting Luke's preface. Preserve the original page as a stable reference or retain its identity while adding child readings; migrate neither saved notes nor old source references by silently renumbering. The hierarchy should explain what is essential now and what can be studied later.

Repeated guidance can be consolidated into concise labels or a reusable study-help area. Keep explicit source-versus-adaptation qualifications wherever their absence would misrepresent the author. The goal is a manageable progression through the original argument, with the researched depth still available.

## Implementation priorities and preservation checks

First add authored questions, chapter/readings location and unscored rubrics; then add retrieval feedback by adapting existing checks. Apply deeper-study boundaries selectively and give the next step a title and reason. The shared passage and guided-study layers are the appropriate integration points; individual source data should remain the content authority.

Verify all 177 current passage records and their 185 assignments unchanged; all chapter guides, original examples and source locators retained; all 185 English/Portuguese pairs still available; source-before-explanation order preserved; primary explanation visible; no compulsory scoring; two to four checks without duplicate quiz stacks; accurate author-aware labels; and unchanged notebook keys, saving, export and deletion. Accessible keyboard/retry/no-JavaScript checks should exercise the new retrieval interface. Existing source validators remain required.
