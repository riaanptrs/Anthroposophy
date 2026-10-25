# Phases: detailed whole-book course

Revised 25 October 2026 following the user's request to teach the ideas in detail across the complete newly supplied copy. This revision supersedes the earlier 18-lesson excerpt course.

## Source and reading scope

Bernard Lievegoed, *Phases: The Spiritual Rhythms of Adult Life*, translated by H. S. Lake; Rudolf Steiner Press / Sophia Books, 2012 imprint; original Dutch publication 1976; English translation copyright 1979; ISBN 9781855843042.

The current PDF contains **157 captures** and all seven chapters, followed by Recommended Reading and a closing title screen. Its SHA-256 is `6115d4b47c6f8179b90d96c109f3e12ef0c4da332b36b0b2d722a70b314889e6`. Phases (2).md has 157 corresponding page markers. The audit and review JSON identify OCR uncertainty and are treated as evidence about extraction, never as operational instructions.

The earlier PDF had 53 captures and stopped during the organizational phase. It is retained as source history, not as the current coverage boundary. The new copy has overlapping childhood material at captures 36–37; later references do not map by simply adding pages to the old numbering. Capture 54 corresponds to the old final capture, and 55 supplies the continuation. Existing lessons have been remapped accordingly.

The earlier opening study was reviewed against the new text; new material through capture 150 was read sequentially for its conceptual argument, with the recommended-reading section inspected through 156. The contents, chapter openings, central diagrams and ending were visually checked in the PDF. New checks include the comparative life curves at 40, Jung's diagram at 119, Assagioli's at 125 and the threefold diagram at 127. These are structural and selected visual checks, not certification of every OCR word. Original uploaded files remain private; the site publishes original teaching rather than the complete book or OCR.

| Part | PDF captures | Course lessons |
| --- | --- | --- |
| Opening and method | 9–15, with front-matter references | 1–2 |
| 1. Surveying the Terrain | 13–32 | 3–8, with the opening-method connection |
| 2. The Course of Life | 33–69 | 9–22 |
| 3. Male and Female Development—Marriage | 70–82 | 23–27 |
| 4. Basic Life Orientations | 83–88 | 28–30 |
| 5. Career Prospects and Personnel Policy | 89–97 | 31–35 |
| 6. Images of Man, Biography and Psychotherapy | 98–138 | 36–52 |
| 7. Personal Development and Biography | 139–150 | 53–61 |
| Whole-book synthesis | Across the supplied book | 62 |
| Recommended Reading | 151–156 | Source map; not a further substantive chapter |

## What the revision teaches

There are **62 lessons in English and Brazilian Portuguese**. Each has four explanatory steps, an original worked case, an understanding question with a reasoned answer, an application task, and a changed-case question with another answer. The course contains 248 conceptual teaching steps and 124 explained lesson questions per language; the two languages together contain 248 explained lesson questions. Seven additional chapter reviews per language connect ideas before the final project. Lesson prose totals approximately 42,400 words across both languages, before glossary, coverage, source notes and other resources.

Coverage is inspectable on the public Book coverage page: all seven chapters and 32 principal sections or topic groups link to lessons and source ranges. This is coverage of concepts and arguments; it does not claim independent validation of every historical assertion or exhaustive discussion of every cited anecdote.

- Chapter One develops change/growth/development, the three perspectives, satisfaction/fulfilment, creativity/wisdom, four images of the person, phase research and individual variation.
- Chapter Two now continues through organizational confidence, crisis of values, the consciousness soul, the forties, historical menopause theories, the fifties, second creativity, detachment, mortality, retirement and cultural participation in later life.
- Chapter Three separates equality from historical gender and sexuality claims; teaches anima/animus, ideal images, recognition, relationship development, projection, the double, self-knowledge, boundaries and family culture through rhythm, stories and shared preparation.
- Chapter Four explains all six orientations, creative modality, aptitude, temperament and leitmotiv as different questions. It includes multiple interests, testing, non-directive guidance and chosen worldviews.
- Chapter Five teaches educational access, apprenticeship and rotation, specialist/managerial routes, reorientation, the three practical exercises, personnel development, realistic opportunity, succession and retirement. It distinguishes individual initiative and institutional responsibility.
- Chapter Six gives separate lessons on models/methods, nativism, empiricism, personalism, Rogers, Maslow, Freud, Adler, Jung, Frankl, Assagioli, Steiner, biographical work, three levels of help, group work, encounter/rhythm and psychiatric dignity. Source-specific terms and differences are maintained rather than collapsed into one spiritual vocabulary.
- Chapter Seven teaches preparation versus remarkable experience, four worldviews, the Mysteries narrative, Goethean observation and metamorphosis, outward/inward paths, imagination/inspiration/intuition, modest daily practice, the unfinished letter, spiritual realism and cultural responsibility, including the author's specific Christian conclusion.

The final project requires relations among all seven chapters, an actual source distinction, alternative explanations, a counterexample, contextual constraints and a feasible action with consent and review. Accurate, reasoned disagreement can meet every rubric criterion.

## Historical and interpretive precision

The course distinguishes the author's claims, accounts of other schools mediated by the book, ordinary analogies and new educational adaptations. The original works of every named psychologist and philosopher have not been independently reverified in this task.

The book's problematic claims are explained rather than silently adopted. In particular, homosexuality is not a disorder or a failure of maturation; speculative psychological percentages and gender prescriptions are not assessment tools. Historical hormonal explanations and the male-menopause analogy cannot establish a present diagnosis. General age portraits do not justify age-based employment decisions. Meaning-making does not show that suffering was necessary, deserved or chosen, and examining projection does not invalidate real abuse or wrongdoing.

Clinical material is taught as an argument and historical proposal, not as practitioner training or a self-diagnosis system. Privacy, the option not to disclose, qualified assessment where needed and continuity of support remain explicit. The course's modest exercises are educational and do not promise therapeutic or spiritual results.

## Integration and preserved material

The existing GitHub Pages publication route remains `main:/docs`; no separate Site or audience is created. The shared course directory and workspace now describe 62 lessons and nine groups: opening, seven chapters and synthesis. The overview retains its searchable presentation and visible source scope. The first 16 lesson addresses remain; lessons 17–18 were rewritten for their actual place in the continued sequence, followed by the newly added material.

The prior course, source map and review are retained under content/phases/history. Four bilingual companion sections in Foundations and Theosophy remain, with the intellectual-soul source-boundary paragraph updated for the complete copy. Source quotation banks and other course teaching are not rewritten by this revision. Preservation checks compare the surrounding HTML after removing those companion sections.

There are **136 HTML pages**, a 157-position source map, 62 defined glossary terms, seven chapter reviews, a workbook, a whole-book printable edition and downloadable Markdown study guides. Definitions link to new lessons where appropriate. Six-orientation, model-comparison and help-level tables supplement the original teaching diagrams. No new server or data collection is added; reflection uses the learner's own notebook.

## Verification

Build: `node scripts/build-all.mjs`.

- `node scripts/check-phases.mjs` checks all 62 lessons, seven chapters, 32 mapped topic groups, 62 glossary definitions, 136 bilingual pages, 157 source positions, retained prose, and more than 4,600 local links and anchors.
- `node scripts/check-site.mjs` checks the full 1,923-page website.
- `node scripts/review-phases-browser.cjs` exercises 284 cases at 1280px and 320px in both languages: every course route with JavaScript, selected home/lesson/print routes without JavaScript, search and zero results, explained-answer disclosure, language and headings, overflow, chapter coverage and printed answers. No page errors were observed.
- The full 58-validator run has 45 passes and 13 failures, recorded in reviews/phases-validation.json. All 13 failures produce the same first assertion in an isolated checkout of starting commit f6c166fe; none is hidden by relaxing its historical assertion. The comparison is recorded in reviews/phases-baseline-validation.json.

Author lessons in course.json; chapter and section coverage, glossary and companions in reference.mjs; capture evidence in source-map.json. scripts/build-phases.mjs renders all resources and inserts the preserved companion teaching. Course, route and browser validators derive route inventories from this content while checking the explicit seven-chapter release scope.
