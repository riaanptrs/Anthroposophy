# Theosophy: course revision against the supplied 1971 book

Revised 30 September 2026. The course now follows the supplied *Theosophy* PDF and its matching Markdown page by page. It retains the existing 23-lesson route: orientation, 21 book lessons, and final synthesis, with matching English and Brazilian Portuguese pages.

## Source and reading record

Rudolf Steiner, *Theosophy: An Introduction to the Supersensible Knowledge of the World and the Destination of Man*, GA 9, Anthroposophic Press, 1971. The copyright page credits Henry B. Monges as translator and Gilbert Church as reviser. The name George E. Maycock on the title page is an ownership stamp.

All 228 PDF pages are accounted for in five reading ledgers. Each substantive page has original notes identifying the essential concept, its place in the argument and the lesson that teaches it. Covers, blank pages and backmatter are recorded separately from teaching content. PDF extraction and the corresponding Markdown blocks were read and compared; selected quotations, damaged passages, bibliographic details and uncertain blank pages were additionally checked in rendered PDF images. This is not a claim that the complete OCR was corrected.

| Source section | Printed pages | PDF pages | Teaching route and notes |
|---|---|---|---|
| Prefaces and Introduction, with frontmatter | vii–xv, xvii–xxiii | 1–28 | Lesson 0; [frontmatter notes](theosophy-page-notes-front-and-addenda.md) |
| I. The Essential Nature of Man | 1–39 | 29–67 | Lessons 1–6; [Chapter I notes](theosophy-page-notes-chapter-1.md) |
| II. Re-embodiment of the Spirit and Destiny | 40–69 | 68–97 | Lessons 7–9; [Chapter II notes](theosophy-page-notes-chapter-2.md) |
| III. The Three Worlds | 70–153 | 98–181 | Lessons 10–17; [Chapter III notes](theosophy-page-notes-chapter-3.md) |
| IV. The Path of Knowledge | 154–178 | 182–206 | Lessons 18–21; [Chapter IV notes](theosophy-page-notes-chapter-4.md) |
| Thirteen addenda, with endmatter | 181–195 | 207–228 | Revisited in the relevant lessons; [addendum notes and mapping](theosophy-page-notes-front-and-addenda.md) |

The PDF and Markdown are identified by filename, size and SHA-256 in [source-register.json](source-register.json). Full books and extracted page text remain private under the ignored `.sources/` directory. Only selected attributed excerpts and original teaching material are published in `docs/`.

## What changed

**Orientation:** Lesson 0 now teaches this book's own purpose and reading method: active work with individual passages, flowing rather than rigid conceptions, and the distinction between discovering spiritual facts, understanding an account and independently verifying it. Its opening excerpt comes from the preface on printed p. viii / PDF p. 10. The later lecture connections remain labelled supplements.

**Chapter I:** The flower example now develops perception, personal response, memory and knowledge in sequence. The lessons explain physical, life and soul bodies; three aspects of soul; the I and its relation to spiritual content; and spirit self, life spirit and spirit man. The ninefold, regrouped sevenfold, fourfold and transformation-based classifications are distinguished. PDF images resolve the previous OCR gaps on pp. 36–37; another translation is no longer needed to supply that teaching.

**Chapter II:** The course explains memory as a new present representation, the difference between remembered episodes and acquired capacities, the author's spiritual-biography argument, inherited tendencies versus individuality, and the inner and outer effects of deeds. Re-embodiment and karma have separate roles. The strong conclusions are read with the qualifications on pp. 60 and 65 and Addendum 7, rather than treating an ordinary learning example as proof of a previous life.

**Chapter III:** The lessons follow the forces and seven regions of the soul world, the soul's purification, the creative regions of Spiritland, assimilation between lives, return to embodiment, and the relationship of these worlds to earthly nature and collective beings. They explain thought forms and aura language in the author's intended mode of perception. Region names follow the supplied translation; the explanatory analogies are distinguished from physical geography and from evidence.

**Chapter IV and synthesis:** The course teaches living thought, the role of a researcher and the learner's judgment, receptivity, education of feeling, coherent thought and will, patience, spiritual perception and practical participation in life. The final lesson connects the four chapters through cited passages, an addendum, an analogy and a remaining question. Supplementary material no longer replaces the book-based exercises in Lessons 18 and 21.

## Passage and lesson design

Every lesson has its own passage assignment, printed and PDF page locator, edition credit, English source wording, Portuguese study translation, and original close-reading explanation. Concise existing excerpts were retained where their wording and location were verified; their explanations now connect the actual words to the expanded chapter teaching. Lesson 0 has a separate preface passage instead of reusing Lesson 1's excerpt.

The learner reads the passage and open explanation before answering or applying it. Activities and suggested answers now check the author's distinctions and argument, alongside source use and thoughtful questions. The course accurately attributes spiritual claims to Steiner; understanding them is assessed without requiring belief or reports of spiritual experience. Existing lesson URLs, bilingual partners, notes, export controls and supplementary course links are retained.

Build corrections preserve that teaching when the site is regenerated: course-count substitutions now affect course labels rather than altering “ninefold” in a lesson objective, and repeated builds retain one passage stylesheet link per page.

## Validation

Rebuild with `node scripts/build-all.mjs`, then run `node scripts/check-theosophy.mjs` and all existing `scripts/check-*.mjs` validators. The Theosophy check covers all 228 reading records, the four-chapter route, all thirteen addenda, 23 individual source passages, 46 bilingual lesson pages and preservation of the main book's exercises. The site-wide checks cover links, anchors, guided study, passage order and the other courses.

Verified on 30 September 2026: the complete build and all ten validators passed, including the 398-page site check. A second build from the generated tree produced byte-identical site files. The refreshed preview passed ten smoke requests, and all 46 Theosophy lesson responses matched the revised files with their source teaching and notebook controls intact. Browser interaction with note saving and export was not manually tested.

This revision changes the repository and generated course locally. It does not record a website deployment.
