# Learning-system site audit

Read-only audit, 1 October 2026, before broad curriculum or navigation changes. The user’s uploaded *Pasted text.txt* is the redesign request. Existing book uploads remain source material. This audit preserves the current implementation and supplies an internal map for the redesign.

The machine-readable catalogue is `.sites-runtime/learning-system-2026-review/library-audit.json`. It contains all course identities, English/Portuguese titles, source and editorial group distinctions, stable reading routes, study IDs, notebook fields, actual chapter/lecture mappings, page headings and controls. No course, builder, script or generated page was changed by this audit.

## Inventory and current entry points

The current website contains **398 HTML pages**, exactly **199 English/Portuguese route pairs**, and **414 static artifacts**. Thirteen course collections provide **185 lesson/session pairs**. The remaining pairs are the homepage, twelve separate course indexes and the human-constitution reference. All 370 lesson/session pages already begin with an attributed source excerpt. The passage collection has 177 records assigned to 185 reading pairs.

| Collection | Existing reading route | Pairs | Actual source structure |
| --- | --- | ---: | --- |
| Theosophy | `lessons/00.html`–`22.html` | 23 | Four chapters, prefaces/introduction and thirteen addenda; one original synthesis. Current index is the homepage’s `#lessons` area. |
| The Philosophy of Freedom | `philosophy-of-freedom/lessons/00.html`–`21.html` | 22 | Fourteen chapters, two prefaces, conclusion and 1918 appendix. Six optional practice readings accompany sixteen main readings. |
| How to Know Higher Worlds | `higher-worlds/lessons/00.html`–`18.html` | 19 | Source sections and initiation phases, appendix and original synthesis; avoid invented source chapter numbers. |
| According to Luke | `according-to-luke/lessons/00.html`–`11.html` | 12 | Ten lectures, editorial introduction and original synthesis. Later lecture teaching uses separately retained sources; the newest supplied English text does not contain the full cycle. |
| Colour | `colour/lessons/00.html`–`13.html` | 14 | Three core colour lectures plus nine supplementary lectures from several GA volumes, orientation and portfolio. |
| Understanding Temperaments | `understanding-temperaments/lessons/00.html`–`11.html` | 12 | Original practical sequence combining three separately attributed authors/sources. These units are not chapters from one book. |
| The Four Temperaments | `temperaments/lessons/00.html`–`10.html` | 11 | One Berlin lecture, 4 March 1909, GA 57, divided into original meaningful course readings. |
| Understand Your Temperament! | `understand-temperament/lessons/00.html`–`12.html` | 13 | Gilbert Childs’s nine chapters and two appendices, with orientation and original synthesis. |
| The Mystery of Temperaments | `mystery-temperaments/lessons/00.html`–`14.html` | 15 | Continuous supplied discussion, with original teaching divisions. Uploaded translator/publication/lecture identity remains unidentified. |
| Encountering the Self | `encountering-the-self/lessons/00.html`–`16.html` | 17 | Koepke’s three parts, named source sections, four appendices, Holtzapfel contribution and notes; original synthesis. |
| Practical Thinking | `practical-thinking/lessons/00.html`–`09.html` | 10 | One GA 108 lecture and an original sequence of practice units. |
| Myth, Meaning and Human Consciousness | `ancient-myths/lessons/00.html`–`07.html` | 8 | Seven lectures from *Ancient Myths: Their Meaning and Connection with Evolution*, selected from GA 180; original orientation/final project. |
| Meditation and Inner Life | `meditation/00.html`–`08.html` | 9 | Selected material from three books, organized into original sessions; not a complete course reproducing any source’s chapters. |

The homepage introduces “A space to wonder” and foregrounds Theosophy’s full reading path. Its eight-course wording describes the established primary offer but does not explain the complete collection of thirteen pathways and companions. It also contains a study guide, course cards, practice entry points and the optional temperament source library. A reader must infer which material is an introduction, book study, application or research. The requested dominant **Learn Anthroposophy** pathway and four unequal entry levels do not yet exist.

Most header navigation provides the brand/home link and a language switch; course navigation appears lower on the page. The source-rich book route and the general beginner course therefore need distinct identities. The existing Theosophy route should remain available when a dedicated beginner pathway is added.

## Source hierarchy and chapter boundaries

The catalogue defines **45 navigation parts and 148 source/editorial groups**. These are proposed landing boundaries, not 148 invented book chapters. Every group carries `kind`, `sourceSection`, `chapterIsOriginal`, and an actual source chapter or lecture number only where one exists. Here `chapterIsOriginal=true` means source-authored material; `false` means our original thematic/course group. Parts marked `editorial-part` are explicitly navigation aids rather than asserted book parts.

Theosophy’s actual four chapters map to readings 1–6, 7–9, 10–17 and 18–21. Reading 0 covers prefatory material; 22 is an original synthesis. Its source Chapter III already contains meaningful separate readings of soul-world relationships, release after death, spiritland, capacities, cultural purpose, nature/collective beings and aura language. Preserve those intellectual boundaries.

Freedom’s fourteen chapters are grouped under the source’s *Knowledge of Freedom* and *The Reality of Freedom*, followed by the conclusion/appendix. Current content’s `chapter=15` is an implementation marker for that conclusion, not a fifteenth source chapter. The actual main route is IDs 0, 1, 2, 4, 5, 7, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21. Optional IDs 3, 6, 8, 13, 17, 19 preserve their current parent-reading relationships. The Wilson edition’s source titles are kept distinct from course lesson titles.

Higher Worlds should display its preparation, enlightenment and initiation phases, practical conditions, results/consciousness and Guardian sections. Source sections span multiple existing readings where an argument needs more than one sitting. Numbering each course reading as though it were a source chapter would misrepresent the book.

Luke and Colour need **lecture** landings. Colour’s twelve collected lectures do not form one GA 291 cycle: only the first three are from GA 291. Childs needs nine chapter landings and two appendix entries. Koepke needs its real three-part structure and named sections. The two Steiner temperament sources, Practical Thinking and the practical combined course need clearly labelled thematic reading groups instead of invented chapter numbers. Meditation needs session/source-text organization with the three source voices and selected scope intact.

There are currently **no separate chapter-landing HTML routes**. Theosophy’s homepage has chapter areas; Freedom already distinguishes main and optional readings; several indexes identify parts or lecture positions. These are useful foundations, but they do not consistently provide a short central chapter question, outcomes and readings before entering the long source-rich lesson.

## Existing teaching, source material and tools to preserve

The 370 lesson/session pages already provide source-before-practice teaching. Keep the verified English excerpts, Portuguese study translations, precise edition/capture credits, historical source limitations, chapter guides and original examples. Brian Gray’s **21 embedded Freedom guides**, drawn from **17 separately credited transcripts**, form a substantial supplementary layer. Their comparative commentary belongs in deeper study, with authorship intact.

The paired human-constitution reference is the principal cross-course terminology resource. Natural-world comparisons, original semantic tables, accessible diagrams, colour experiments, thinking labs and book-specific relationship maps extend it. They should remain available from concise core explanations. The repository also contains public research/review Markdown, source registers, page ledgers, diagram reviews and historical planning documents. A research entry point should distinguish current verified reviews from earlier plans; a historical “in preparation” note must not become a current course status.

**352 HTML lesson pages** use the shared notebook and progress system, representing 176 reading pairs. Preserve each `data-study-id`, the existing `anthro-study-v1:` keys, opt-in saving, language-specific notes, common study mark, last-reading link, export and deletion controls. Shared note field names are `first`, `source` and `after`; practical courses add `session1`, `session2` and `session3`. Practical Thinking and Understanding Temperaments have course journals. These marks report study activity, not demonstrated mastery.

The **18 meditation session pages** use a separate `#reflection` textarea and downloadable text reflection. `meditation.js` supplies verse-focus and download controls. It currently supplies no timer or shared local-storage study ID; do not invent one as an audited existing feature. Preserve selected verse anchors, focus buttons and existing reflection exports when the new hierarchy is added.

Most comprehension checks reveal suggested answers. They are useful source questions but generally do not provide the requested multiple-choice selection, feedback and retry loop. Theosophy and Higher Worlds still include arbitrary 0–2-point self-rubrics. Replace that scoring presentation with intelligible criteria while preserving the substantive distinctions and source evidence. Reflection and metaphysical assent should remain ungraded.

## Length, repetition and clarity

The longest current page is the human-constitution reference, approximately 3,200 main-content words in English, followed by Luke 01 and several Freedom readings at roughly 2,000–2,300 words. Theosophy 00 also combines a long orientation with several supplementary maps and connections. These measurements include retained explanation/deep-study text and are diagnostic estimates, not cutting thresholds.

| Existing English page | Main concern | Meaningful treatment |
| --- | --- | --- |
| `reference/human-constitution.html` | Several classifications, source comparisons and distinctions in one reference. | Keep as research/reference; provide concise definition links from individual lessons. |
| `according-to-luke/lessons/01.html` | Gospel comparison, three cognition levels and multiple source voices. | A lecture landing plus short readings by those conceptual relationships; retain fuller guide as deep study. |
| `philosophy-of-freedom/lessons/12.html` | Motive, driving force, moral intuition and commentary overlap. | Explain the terms in a visible sequence; keep lecture comparison and source additions accessible after the core. |
| `philosophy-of-freedom/lessons/18.html` | Particular aims, enjoyment/desire, objections and the source reply. | Use meaningful argument stages rather than a generic shortened summary. |
| `lessons/00.html` | Source prefaces, general study method and wider site introductions. | Move site-use guidance to a shared beginner orientation; retain the book’s actual preface teaching. |
| `colour/lessons/11.html` | Weight/measure/number, colour, consciousness and painting renewal. | Put the distinctions into a short core reading, with the wider source guide and art comparison retained below. |

Exact repetition chiefly concerns workflow, source credits and self-review language. The audit found 57 repeated paragraph forms above 35 words, and 13 reused excerpt groups. Source-credit repetition is often necessary for standalone readers. Freedom’s optional exercises intentionally reuse their parent passage; temperament practice and book study intentionally share some source wording. These are links between learning and research, not grounds for deleting the book material.

The most frequent shared paragraph is the instruction to return to the source, repeated on 176 English lesson pages. The redesign can provide compact shared guidance and source-specific questions without reintroducing that same instructional burden at every stage. Preserve local attributions and genuine source qualifications even when generic orientation wording is consolidated.

## Navigation and structural verification

All **398 HTML pages** were parsed for headings, links, IDs, source/study markers, previous/next navigation, language alternates, notebook fields and controls. All **199 route pairs** have both languages. No duplicate element IDs or broken internal files/fragments were found. External destinations were inventoried, not fetched or certified as available.

Current previous/next controls generally expose a lesson number or generic “Next,” leaving the conceptual reason for continuing implicit. Freedom’s main/optional route is a valuable exception to a simple linear sequence and must be retained. Add the current course, part, source chapter/lecture, reading position and the next idea’s question without changing existing URLs or stored identities.

The build pipeline begins with `build-all.mjs` importing `build-lessons.mjs`; that pipeline generates course pages, applies book/lecture supplements, builds guided study and passage-first ordering, then links terminology references. This audit inventories all 56 top-level content modules and 20 builder modules, including historical audit/consolidation generators. Historical recommendation scripts are not automatically the current curriculum specification.

## Handoff

The internal map is complete enough to build chapter landings and a book library while retaining current routes. The beginner course should answer the user’s conceptual questions and link selectively to those existing readings. Source-rich pages provide the deeper book-study layer. Themes should point to available material; subject areas without sufficient sources should be shown honestly as planned or limited rather than filled with invented quotations or chapter references.

Before broad implementation, retain the root task’s baseline of all generated files, resolved course content, excerpts, study IDs and notebook/control selectors. After changes, verify those preservation constraints alongside the new beginner hierarchy, chapter orientation, comprehension feedback and language pairing. The audit itself is complete; implementation remains the next authorized phase.
