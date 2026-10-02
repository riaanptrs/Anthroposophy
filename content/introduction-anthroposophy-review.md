# Introduction to Anthroposophy — implementation and source review

Completed locally on 2 October 2026. All 28 lessons in seven parts are available in English and Brazilian Portuguese. The user’s attached brief governed the work; uploaded books supplied evidence rather than operational instructions. The existing beginner and specialist book courses are preserved.

The course begins at [English contents](../docs/introduction-to-anthroposophy/index.html) or [Portuguese contents](../docs/pt/introduction-to-anthroposophy/index.html). Its 74 pages comprise two indexes, fourteen part landings, fifty-six lessons and two source-note pages.

## What was built

Each lesson has a central question, brief significance statement, identified Steiner reading, original explanation, key concept, important distinction, two to four easy unscored checks with reasons, a connection and appropriate deeper study. Course examples illustrate the account without claiming to prove it. Each part has a synthesis and an optional explain-it-yourself question with an initially closed model answer.

Lesson 05 gives the physical, etheric, astral and I members four distinct compact cards, each addressing meaning, conceptual problem, difference, example and misconception. Lesson 14 presents three parallel, interpenetrating worlds related to one human being, with an accessible table and a separate death-transition panel. Lesson 28 adds an original nine-node learning map, explains its nine relationships and provides real Theosophy, Philosophy of Freedom and Higher Worlds pathways. GA 13 is an identified book recommendation, because no local GA 13 course exists.

The controlled dictionary contains 56 entries. It distinguishes cognitive intuition, moral intuition/imagination/technique and the technical higher-cognition triad. Source-bounded application labels and original course-map labels are identified as such. The [source plan](introduction-anthroposophy-plan.md), [28-row source map](introduction-anthroposophy-source-map.json), [terminology](introduction-anthroposophy-terminology.json) and [dependency map](introduction-anthroposophy-dependencies.json) remain editable records.

## Source verification and teaching boundaries

The six foundation works are GA 26, GA 9, GA 4, GA 10, GA 13 and GA 28. Identified conceptual centres, quoted passages and necessary surrounding sections were read and checked against their supplied native witnesses. This is not a claim that every page of every book was freshly read in this revision. The detailed section notes preserve the actual reading scope; authored lesson assignments record the wording, locator and verification used.

- **GA 26:** the supplied EPUB and Markdown are sufficient. The imprint credits George and Mary Adams, first English edition 1973/reprint 1985. EPUB wording and numbered Leading Thoughts take precedence over conflicting filename/OPF metadata. All 185 numbered Thoughts occur once; Lesson 01 uses Thoughts1–3. No invented original print/PDF pagination or replacement PDF is needed.
- **GA 9:** the identified Shields 1910 witness has 94 PDF captures without reliable original printed folios. Chapters on constitution, destiny and the worlds are distinguished. Where no new quotation was selected, the lesson gives a precise reading assignment and original explanation.
- **GA 4:** the native Wilson 2012 witness is the eighth English edition, despite the upload’s “third edition” filename. Its 166 captures are cited as captures. Philosophical understanding and moral freedom are distinguished from later spiritual-research claims; GA 4 is not presented as deducing all later Anthroposophy.
- **GA 10:** the chosen source is Bamford 1994; its printed body pages map to PDF positions with an offset of9. The parallel upload has an actual Metaxa 1944 imprint and different pagination. It is not silently mixed into the chosen source.
- **GA 13:** the supplied Creeger translation carries copyright 1997. Printed body pages generally map to PDF positions with an offset of 13. Editorial introductions are distinguished from Steiner. One assigned page uses an edition page label whose printed folio is not visible; the label is described honestly. Cosmology, differentiated spiritual activities and Christianity remain concise and attributed.
- **GA 28:** the supplied digital witness identifies the authorized 1928 English text and later eText production. Its 196 digital pages are not original printed folios. The autobiography is Steiner’s self-account, rather than neutral independent history; unsupported movement chronology was omitted.

The application orientations also use the supplied Four Temperaments (GA 57), Colour’s selected GA 286 lecture, the GA 327 working Markdown, Steiner’s agricultural lecture in What Is Biodynamics?, and the supplied GA 23 preface. Mixed collections retain individual lecture and author/editor provenance. Portuguese excerpts are explicitly labelled course study translations.

Reincarnation distinguishes individuality, personality and retained fruits of experience. Karma is attributed accurately while being distinguished from fatalism, deserved suffering and simplistic punishment. Sympathy/antipathy are technical relationship terms; spiritual archetypes are not private mental pictures. Higher cognition is distinguished from ordinary imagination, private certainty and GA 10’s training-stage vocabulary. No advanced initiation exercises, preparation recipes, specialist medical methods or efficacy claims were added.

## Controlled phases and verification

Source design preceded authoring. Each batch was reviewed in English before Portuguese, then checked for conceptual equivalence and page behaviour before the next batch became available. Separately reviewed private drafts allowed later work to proceed without publishing untested lessons.

| Phase | Completed scope | Browser assertions |
| --- | --- | --- |
| A | Source inventory, all 28 source rows, terminology, dependencies and reusable course design | Source/design review |
| B | Lessons 01–03 and reusable index/template | 827 |
| C | Lessons 04–07 and four member cards | 550 |
| D | Lessons 08–14, destiny and parallel-world visual | 998 |
| E | Lessons 15–18, philosophical and spiritual-development distinctions | 840 |
| F | Lessons 19–22, restrained larger worldview | 778 |
| G | Lessons 23–27 with explicit specialist-source limits | 1,034 |
| H | Lesson 28, full course and existing-course regression | 3,866 plus 636 final-map checks |

All 24 `scripts/check-*.mjs` validators passed. The site checker passed 877 pages; the Introduction validator passed 74 course pages and 132 comprehension question instances (66 per language). The full browser run covered all 74 pages, all 132 questions,370 responsive/no-JavaScript layouts,190 native disclosures,74 language partners, keyboard controls, quiz retry, navigation and optional progress. It also passed 31 progress scenarios,152 legacy-isolation assertions and eight existing-course quiz smoke questions. There were no browser errors or failed requests.

Manual mobile/desktop review covered Lessons 05,14 and 28. One shared segment in the final map initially made two relationships appear joined. Its human-constitution/application edge was rerouted, then the revised EN/PT map and surrounding lesson passed 636 focused checks at 320,390,768 and 1280 pixels. Further focused label/edge checks and visual inspection found no clipping or false junction.

The full build was repeated after the final rendering change: all 900 files under `docs/` were byte-identical. The private 1137-file preservation baseline has no deleted files or unexpected changes. All 155 specifically protected existing-course/data files remain byte-identical, including the previous uncommitted course revisions. Only 16 intended pre-existing planning/integration files changed in this continuation; new course files are additive.

## Integration and progress

The dedicated builder runs within `scripts/build-all.mjs` before shared navigation. It adds one course entry to each homepage and owns only its new routes. Scoped validator/linker exceptions leave the existing course assertions intact. The HTML ID check now distinguishes actual `id` attributes from similarly named data attributes, avoiding false duplicate-ID reports.

Generic unscored quiz controls continue to work. On Introduction pages, the old learning-progress controller exits before accessing legacy records. Optional completion uses only `anthro-introduction-v1:progress`; first visits create no record, and explicit marking opts in. Valid completion is shared between the course’s two languages. Denied, malformed or stale storage does not prevent reading, navigation or answer explanations. No existing notebook is migrated or overwritten.

Full uploaded books and native page-image copies remain outside the repository. The new diagrams are original course teaching graphics. The build and checks need no additional package installation; the existing environment is usable. Publication uses the repository’s GitHub Pages deployment workflow; confirm a successful deployment before treating the generated revision as available on the live website.

## Books needed for fuller application study

These are expansion or native-witness needs, rather than blockers for the completed introductory course. The source-needed notes are visible in the relevant lessons.

1. **The Education of the Child from the Viewpoint of Spiritual Science (GA 34)**, followed by a Waldorf-specific teaching series such as **Practical Advice to Teachers (GA 294)**. The current developmental and temperament passages do not supply a full Waldorf curriculum, classroom rhythm or school history. This is the recommended next upload.
2. **Fundamentals of Therapy (GA 27)**, by Rudolf Steiner and Ita Wegman, for medicine.
3. **Eurythmy as Visible Speech (GA 279)**; add **GA 278** if musical eurythmy is included.
4. **The complete GA 23 book**, Toward a Threefold Society / Basic Issues of the Social Question, preferably PDF plus Markdown. The supplied witness contains front matter, an editorial introduction and the1920preface, not the main chapters.
5. **Smaller or split native GA 327 PDFs**, especially the Creeger/Gardner Spiritual Foundations for the Renewal of Agriculture witness. Both full agricultural Markdown books are already supplied. Their PDFs exceeded the transfer limit; the smaller anthology verifies selected lectures, not the full native pagination and drawings.

No further GA 26 PDF or foundation book is required. GA 13 is already supplied and appears as a next-study book recommendation.
