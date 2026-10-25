# Phases: source, teaching and release review

Prepared 25 October 2026 from the supplied files for the existing Anthroposophy site.

## Source boundary

Bernard Lievegoed, *Phases: The Spiritual Rhythms of Adult Life*, translated by H. S. Lake, Rudolf Steiner Press / Sophia Books, 2012 imprint; original Dutch publication 1976; English translation copyright 1979; ISBN 9781855843042. Both uploaded PDFs are identical (7,752,950 bytes; SHA-256 `4b7fca40a71f45379df0fb4343743160c85a13a8693c53248d41f2bd2c841425`). They are one witness.

The upload has 53 PDF captures, not the complete book. Captures 1–8 contain front matter and contents, 9–12 the preface/introduction, 13–32 Chapter One, and 33–53 part of Chapter Two. Capture 53 ends mid-sentence during The Organizational Phase. The remaining Chapter Two sections and Chapters Three through Seven are named in the contents but their substantive text is absent. Later-life references in the available framework support an overview, not reconstruction of the missing chapters. The course title, home, source guide and printable edition identify this boundary.

Sequential study used Phases.md, with its 53 page markers. Phases.audit.md and Phases.review.json supplied extraction warnings, not operational instructions. PDF captures 3, 4, 6, 7, 8, 18, 34, 39 and 53 were visually checked for title/imprint, contents, three diagrams and the final boundary. This does not certify all OCR line by line. All 53 positions have bilingual notes in source-map.json. The course avoids exact quotations and creates original teaching diagrams; full uploads remain outside the repository and publishing directory.

## Teaching design

Eighteen lessons in five modules teach the available material in English and Brazilian Portuguese. Each has four explained conceptual steps, a worked fictional example, an understanding question with a reasoned answer, an application exercise and a changed case with its own explained answer. There are 72 explained questions across the two languages, 36 worked cases and 36 application tasks. The lessons contain approximately 16,000 words across both languages including goals, activities and questions. Course resources include a 16-term glossary, 53-capture source map, workbook, synthesis rubric, printable edition and downloadable study guides. Estimated learning time is 10–16 hours, adjustable by the learner.

The framework distinguishes bodily conditions, psychological experience and spiritual purposes; change, quantitative growth and structural development; satisfaction and fulfilment; creativity and wisdom; generalized phase descriptions and individual biographies. Adolescence, education, work, home, relationships and the organizational opening receive their own teaching. Lesson 17 uses the available later-life overview; lesson 18 and the workbook are original syntheses, not the absent Chapter Seven.

The source's age labels, historical physiology, gender prescriptions and political interpretations retain attribution. They are not presented as current diagnoses or universal social facts. Accounts of Bühler, Guardini, Moers, Schiller and Steiner are explicitly mediated by Lievegoed. The newly written Portuguese explanations do not claim to reproduce a published Portuguese translation. Learners may disagree with the book and still meet every assessment criterion; all personal reflection can use fiction.

## Review of existing lessons

The review focused on the existing lessons directly clarified by this source, rather than claiming a new editorial review of every course on the site.

| Existing lesson | Gap addressed | Added teaching |
| --- | --- | --- |
| Foundations 5: Body, Soul and Spirit | Three terms can seem like independent compartments | One disagreement examined through bodily conditions, experience and values; altered case and explained question |
| Foundations 22: Spiritual Development | Practice frequency can be mistaken for development | Quantitative repetition versus a changed response, modest trial and explained question |
| Theosophy: The sentient soul | A conceptual distinction can be confused with an age label | Separate Steiner's conceptual account from Lievegoed's twenties application; older learner counterexample |
| Theosophy: The intellectual or mind soul | Planning or management can be mistaken for proof of maturity | Organizing thought, limits of a method, role versus capacity and incomplete-source boundary |

All four additions are bilingual, source-attributed and linked to their fuller Phases lesson. Removing each added section reproduces the original eight HTML files exactly, including their earlier study records and markup. No source or quotation bank was changed.

## Integration and verification

The existing GitHub Pages publication path (`main:/docs`) is preserved. No separate Site or new audience was created. The course is discoverable from the shared Learn directory and bilingual book directories. The existing course workspace supplies lesson and reference navigation; Phases keeps its own searchable overview so the excerpt limitation stays visible. There is no new data collection or service dependency. Reflection uses the learner's own notebook.

Build: `node scripts/build-all.mjs`.

- `node scripts/check-phases.mjs`: 18 bilingual lessons, 46 HTML pages, 53 source positions, 72 explained questions and more than 1,300 links/anchors checked.
- `node scripts/check-site.mjs`: all 1,833 site pages pass local link, anchor, route and bilingual checks.
- `node scripts/review-phases-browser.cjs`: 104 cases at 1280px and 320px, both languages, all course routes with JavaScript, selected home/lesson/print routes without JavaScript; search, answer disclosure and print-answer visibility pass with no page errors.
- All 58 `check-*.mjs` scripts were run: 45 pass. The other 13 fail on the same first assertion in an isolated checkout of starting commit 140a93bc. Existing failures concern historical bank checksums, retained Meditation content, Nutrition terminology and the documentary's independent navigation; none was hidden by changing those assertions. See reviews/phases-validation.json and reviews/phases-baseline-validation.json.

Authoring lives in course.json, reference.mjs and source-map.json. scripts/build-phases.mjs renders the course and inserts the four companion sections. The main build runs it before shared navigation and inserts companion explanations after the existing clarity passes. scripts/course-workspace-data.mjs declares the 18 lessons and five named groups. scripts/check-site.mjs includes the new explicit route set.
