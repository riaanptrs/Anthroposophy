# One Philosophy of Freedom course

13 September 2026 · Consolidated implementation

## Source roles

The user’s fuller Wilson/Basis transcription and Frederick Amrine’s *The Essential Philosophy of Freedom: Third Expanded Edition* (2022) present the same underlying work. Essential deliberately abridges and adds editorial material; it is not a second independent philosophical system. The earlier Wilson capture is another incomplete transcription, useful for surviving front matter. See the [edition comparison](philosophy-of-freedom-edition-comparison.md).

The fuller text supplies the continuity of the argument, objections and 1918 additions. Amrine supports concise exposition and terminology, especially Vorstellung / representation / mental picture. The supplied Brian lecture reviews inform pauses, reconstruction, ordinary examples, questions and corrections. Wannamaker’s commentary and later Steiner excerpts within Essential’s appendices remain separately attributed optional context. The Chapter 12 recording’s speaker remains independently unidentified.

This revision used the existing chapter-by-chapter book and lecture comparisons, checked the material from each pair of overlapping lessons, and directly read the concluding discussion and additions in Basis 129–135. The [online Wilson contents](https://rsarchive.org/Books/GA004/English/RSP1964/index.html) confirms the fourteen chapters, conclusion and appendix. The [parallel conclusion](https://rsarchive.org/Books/GA004/English/RSP1964/GA004_conmon.html) provides a public reading link. Source books and transcripts are not reproduced in the website.

## One main path

Sixteen core lessons: orientation, one per chapter, and conclusion/synthesis. Six former split-chapter exercises remain optional at their original URLs. They are not six additional required steps. Main navigation follows the core sequence; optional pages return to their parent. Existing note identities remain unchanged.

| Core step | Book section | Existing page ID | Consolidation decision |
|---|---|---|---|
| 1 | Prefaces and method | 00 | One orientation explains knowing and acting, then the common study rhythm. |
| 2 | Chapter 1 | 01 | Keep choice, execution and the source of motive distinct. |
| 3 | Chapter 2 | 02 | Preserve the problem of self/world and one-sided explanations. |
| 4 | Chapter 3 | 04 | Merge conceptual explanation from 03 with doing and reviewing thinking in 04. Page 03 remains optional. |
| 5 | Chapter 4 | 05 | Merge percept/representation with the objection to the “only representations” proof in 06. Page 06 remains optional. |
| 6 | Chapter 5 | 07 | Merge the flower sequence with shared concepts and the 1918 addition from 08. Page 08 remains optional. |
| 7 | Chapter 6 | 09 | Preserve individualized concept, recognition and feeling. |
| 8 | Chapter 7 | 10 | Preserve the distinction between an unanswered question and a principled knowledge limit. |
| 9 | Chapter 8 | 11 | Preserve the criticism of one-sided accounts and the positive relation of thinking, feeling and willing. |
| 10 | Chapter 9 | 12 | Merge motive/driving force with ethical individualism from 13, using one participation case. Page 13 remains optional. |
| 11 | Chapter 10 | 14 | Preserve monism, authority and shared ideas with individual action, including both additions. |
| 12 | Chapter 11 | 15 | Keep present purpose versus future result and the 1918 qualification. |
| 13 | Chapter 12 | 16 | Merge intuition, imagination and technique from 16–17, including the evolution argument and addition. Page 17 remains optional. |
| 14 | Chapter 13 | 18 | Merge striving/pleasure with satisfaction of a particular aim from 19. Page 19 remains optional. |
| 15 | Chapter 14 | 20 | Preserve individual understanding and explicit treatment of historical generalizations and the 1918 note. |
| 16 | Consequences of Monism | 21 (new) | Explain why the freedom argument depends on the thinking argument; retain both concluding additions and one final assignment. |

The earlier broad curriculum proposal suggested connecting old 02 and 03. Source mapping shows they belong to different chapters, so the implemented route retains Chapter 2 and combines 03 with 04 within Chapter 3 instead. Stable file IDs are not the displayed step numbers.

## What the concise course still teaches

- Observation, explanation and subsequent reflection on thinking are related but distinct.
- Percept, concept and representation are not interchangeable; representation need not be a vivid visual image.
- A consistency objection to a proof does not automatically refute the proof’s conclusion.
- Shared conceptual content differs from uniform opinion or identical individual experience.
- Motive, driving force and practical feasibility must be distinguished before assessing Steiner’s freedom criterion.
- Moral intuition, imagination and technique contribute different aspects of a deed. A changing request can alter the proposed form and practical means without necessarily changing the ethical reason.
- The Chapter 12 recording’s omissions do not become omissions from the course. Evolution versus logical deduction and the stronger 1918 claim remain attributed to Steiner.
- The full Chapter 13 account governs the comparison with Hartmann; a conflicting lecture summary does not replace it.
- The conclusion does not make a good result evidence of a free motive. Its second addition identifies a philosophical foundation for later spiritual work while denying deduction of the later books’ particular contents.

Each revised core explanation is approximately 180–550 English words, excluding source reading, activities and optional support. Concision is not a promise that difficult philosophical passages can be mastered in a fixed time. The beginner route can be split into sittings; full chapter assignments remain accessible.

## Teaching and assessment

Retain one first attempt, a worked explanation, a return to a cited passage, targeted questions and a revised answer. Add a staged three-question example to the moral imagination lesson. Keep the arithmetic feedback in the thinking lesson. Do not assess agreement or spiritual attainment as proof of comprehension.

The final assignment uses one case to connect both halves: observed situation, conceptual relation, ethical aim, possible driving forces, imagined response and practical means. It requires references from both halves and the conclusion, plus an objection and a revised claim. One supported disagreement can demonstrate understanding.

## Maintenance

Edit `philosophy-of-freedom-consolidated.mjs` for the core material, sequence and optional-page mapping. Original lesson data remains the source for unchanged lessons and optional practice. `scripts/build-freedom-route.mjs` runs after course generation and before guided-study processing. Use `node scripts/build-all.mjs` for the complete build.

Validation: `check-site.mjs` checks all 310 pages; `check-guided-study.mjs` checks 146 language pairs; `check-freedom-route.mjs` verifies all sixteen steps, chapter coverage, next links, conclusion references and optional-return links in both languages. This change does not implement the separately proposed temperament merger.
