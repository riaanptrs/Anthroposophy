# Theosophy guided-course revision

Completed 2 October 2026. Scope: the existing Theosophy book course in English and Brazilian Portuguese. No other course teaching or shared design was revised within this course revision. The files are prepared for the repository’s GitHub Pages publication workflow.

**Published course:** [Theosophy in English](../docs/theosophy/index.html) · [Teosofia em português](../docs/pt/theosophy/index.html). These 28 readings use the supplied Shields translation (1910). The [1971 chapter teaching plan](theosophy-chapter-teaching-plan.md) and [September course revision](theosophy-course-review.md) are historical records of the earlier 23-lesson course, with separate edition-specific page references.

The course's source map is also available [in English](../docs/theosophy/source-notes.html) and [in Portuguese](../docs/pt/theosophy/source-notes.html).

## Source review

All 94 images in the supplied `Teosophy new.pdf` were visually reviewed alongside the corresponding Markdown blocks before lesson editing. The PDF establishes Elizabeth Douglas Shields’s translation from the third German edition, 1910, in a Delhi Open Books digital reissue with no stated reissue date. Kindle footer positions do not establish printed pagination, so the course cites one-based **PDF captures**.

The primary source has the translator’s foreword, first- and third-edition prefaces, Introduction, four chapters and nine Notes and Amplifications. Chapters I and III have formal source subsections; Chapters II and IV are continuous. The source map preserves those differences and marks the course’s reading divisions separately. The PDF also restores the opening Goethe text and two contents entries omitted by the new Markdown.

The supplied 1971 Monges/Church edition remains a distinct historical and parallel source. Its thirteen addenda, later qualifications and different printed/PDF locators are not silently attributed to the 1910 translation. Selected comparisons retain edition-specific citations in optional notes.

See [the complete source ledger](theosophy-guided-source-map.json), [front matter and Chapter I](theosophy-guided-map-front-chapter-1.md), [Chapter II](theosophy-guided-map-chapter-2.md), [Chapter III](theosophy-guided-map-chapter-3.md), and [Chapter IV and notes](theosophy-guided-map-chapter-4-notes.md). These authored maps record the analysis performed before the course revision. Full books and transcriptions remain private and are not copied into the repository.

## Course structure

The canonical index is `docs/theosophy/index.html`, with the matching Portuguese index under `docs/pt/theosophy/`. The course now contains 28 reading pairs:

| Book division | Course readings | Stable lesson IDs |
| --- | --- | --- |
| Prefaces and Introduction | Introduction | 0 |
| I. The Constitution Of The Human Being | 1.1–1.8 | 1, 2, 3, 23, 4, 5, 24, 6 |
| II. Re-Embodiment Of The Spirit And Destiny | 2.1–2.4 | 7, 8, 27, 9 |
| III. The Three Worlds | 3.1–3.10 | 10, 25, 11, 26, 12, 13, 14, 15, 16, 17 |
| IV. The Path Of Knowledge | 4.1–4.4 | 18, 19, 20, 21 |
| Whole-book synthesis | Final synthesis | 22 |

The original 23 lesson URLs survive. Five added readings separate substantial intellectual units: life from sentience, the I from spiritual transformation, biography from inherited/acquired capacities, soul-world relationships from their regional account, and postmortem attachment from the regional purification account. Paragraph anchors make overlapping capture assignments precise.

The Introduction and Chapter I were implemented and corrected as a pilot before Chapters II–IV were rewritten. The pilot passed 44 responsive route checks plus answer, keyboard, storage and no-JavaScript checks. Source review corrected an apparent sequence of three transformations into parallel relationships; later relation diagrams use the same distinction.

## Teaching and study controls

Each of the 27 standard readings begins with one central question and a short preparation, then identifies its primary source assignment before reconstructing the argument in two to five paragraphs. It defines a key concept, supplies a faithful relationship diagram where useful, offers one labelled course example, clarifies a likely misconception, asks two brief unscored comprehension questions, and explains the connection forward.

Five short source selections—the Introduction and four Chapter II readings—were independently checked against PDF images. A content filter blocked some other excerpt-reproduction attempts; the permitted alternative is a precise section assignment with original explanation. No blocked passage was retried, and paraphrases are never presented as quotations. Portuguese selections are identified as course study translations.

Each chapter landing ends with a concept map, five to eight central concepts, distinctions, a reconstruction of the argument, and one optional deeper task with a closed model response. The final synthesis shows how constitution, individuality, repeated lives, worlds and spiritual knowledge fit together. It adds questions for continued study and two relevant book-course links.

The main route removes repeated rubrics, required written answers and automatic terminology/supplement links. Source notes and edition comparisons are secondary. Begin/Continue, chapter-based position labels and titled next-reading links make the reading sequence visible. Optional progress reuses the existing local notebook namespace, preserves bilingual notes and completion records, and gives newly split readings independent identities. No points, scores, badges or network tracking are added.

## Validation

- The complete build succeeded, including a repeat build with the additional reading routes already present.
- All 23 repository validators pass. The site inventory checks 803 HTML pages and their local links, anchors and language partners.
- Theosophy checks verify all 94 source-review records, 28 routes, full chapter capture coverage, source headings/locators, verified selections, 108 bilingual comprehension questions, four chapter syntheses and the final synthesis.
- Browser checks passed 136 route/viewport combinations: all readings, index, four chapter landings and source notes in both languages at 320 and 1280 pixels.
- All 108 quiz flows passed wrong-answer, retry, correct-answer and explanation checks. There are no scores.
- Browser checks also passed 112 previous/next checks, 82 distinct local links/anchors, eight keyboard flows, eleven storage/note/resume cases and twelve no-JavaScript route checks. There were no script errors, failed requests or HTTP errors.
- Screenshots were inspected. The scoped source/body/helper text color combinations exceed WCAG AA’s 4.5:1 contrast requirement.
- Generated-page scope audit: 58 existing files changed (Theosophy pages and the two book-library reading-count cards), 14 added, none removed. Other course pages and catalogue entries are unchanged.
- Historical 177-record passage and 185-record comprehension banks remain byte-identical. Unrelated private draft illustrations and notes were preserved.

## Editing and publication

Edit `theosophy-guided-introduction.json`, `theosophy-guided-chapter-1.json` through `theosophy-guided-chapter-4.json`, and `theosophy-guided-synthesis.json`. The loader is `theosophy-guided.mjs`; `scripts/build-theosophy-guided.mjs` runs late in the complete build so historical modules can remain intact. Always run `node scripts/build-all.mjs` for final output, then the validators.

Publication uses the repository’s GitHub Pages deployment workflow. Confirm a successful deployment before treating the generated revision as available on the live website.
